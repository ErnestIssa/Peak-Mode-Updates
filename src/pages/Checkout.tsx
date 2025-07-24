import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Truck, CreditCard, Lock, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ProductSource } from '@/models/Product';
import { emailService } from '@/lib/emailTemplates';
import { orderService, paymentService } from '@/lib/peakModeService';
import { useApiMutation } from '@/hooks/useApi';

interface CartItem {
  id: number | string;
  name: string;
  price: number;
  image: string;
  size: string | null;
  color: string | null;
  quantity: number;
  currency: string;
  source?: ProductSource;
}

interface CheckoutForm {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  shippingMethod: string;
  paymentMethod: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  billingSameAsShipping: boolean;
  billingAddress: string;
  billingCity: string;
  billingPostalCode: string;
  billingCountry: string;
  newsletterSubscription: boolean;
  marketingEmails: boolean;
}

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [tax, setTax] = useState(0);
  const [formData, setFormData] = useState<CheckoutForm>({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Sweden',
    phone: '',
    shippingMethod: 'standard',
    paymentMethod: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    billingSameAsShipping: true,
    billingAddress: '',
    billingCity: '',
    billingPostalCode: '',
    billingCountry: 'Sweden',
    newsletterSubscription: false,
    marketingEmails: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const { mutate: createOrder, loading } = useApiMutation();

  useEffect(() => {
    window.scrollTo(0, 0);
    loadCartItems();
    calculateCosts();
    

  }, []);

  const loadCartItems = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const items = JSON.parse(savedCart);
      setCartItems(items);
      
      const total = items.reduce((sum: number, item: CartItem) => {
        return sum + (item.price * item.quantity);
      }, 0);
      
      setCartTotal(total);
    }
  };

  const calculateCosts = () => {
    // Calculate shipping based on cart total
    if (cartTotal >= 500) {
      setShippingCost(0); // Free shipping over 500 SEK
    } else {
      setShippingCost(49); // Standard shipping
    }
    
    // Calculate tax (25% VAT for Sweden)
    setTax(cartTotal * 0.25);
  };

  const handleInputChange = (field: keyof CheckoutForm, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBillingSameAsShipping = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      billingSameAsShipping: checked,
      billingAddress: checked ? prev.address : prev.billingAddress,
      billingCity: checked ? prev.city : prev.billingCity,
      billingPostalCode: checked ? prev.postalCode : prev.billingPostalCode,
      billingCountry: checked ? prev.country : prev.billingCountry
    }));
  };

  const applyDiscountCode = () => {
    if (discountCode.toLowerCase() === 'peakmode10') {
      setDiscountApplied(true);
      toast.success('10% discount applied!');
    } else {
      toast.error('Invalid discount code');
    }
  };

  const getProductDetailPath = (item: CartItem) => {
    if (item.source === 'cjdropshipping') {
      return `/cj-product/${item.id}`;
    }
    return `/product/${item.id}`;
  };

  const calculateFinalTotal = () => {
    let total = cartTotal + shippingCost + tax;
    if (discountApplied) {
      total = total * 0.9; // 10% discount
    }
    return total;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.firstName || !formData.lastName || 
        !formData.address || !formData.city || !formData.postalCode) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create order in VornifyDB
      const orderData = {
        id: `order_${Date.now()}`,
        items: cartItems.map(item => ({
          productId: item.id.toString(),
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size || 'N/A',
          color: item.color || 'N/A',
          image: item.image
        })),
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country
        },
        paymentMethod: formData.paymentMethod,
        total: calculateFinalTotal(),
        status: 'pending',
        orderNumber: `PM-${Date.now().toString().slice(-8)}`,
        created_at: new Date().toISOString(),
        isPrivate: false
      };

      await createOrder(orderService.createOrder, orderData);
      
      // Save form data to localStorage for thank you page
      localStorage.setItem('checkoutFormData', JSON.stringify(formData));
      
      // Send order confirmation email
      await emailService.sendOrderConfirmation({
        email: formData.email,
        name: `${formData.firstName} ${formData.lastName}`,
        orderId: `PM-${Date.now().toString().slice(-8)}`,
        products: cartItems.map(item => ({
          name: item.name,
          size: item.size || 'N/A',
          color: item.color || 'N/A',
          quantity: item.quantity,
          price: item.price
        })),
        total: calculateFinalTotal(),
        shippingAddress: `${formData.address}, ${formData.city} ${formData.postalCode}, ${formData.country}`
      });
      
      // Clear cart after successful order
      localStorage.removeItem('cart');
      
      // Show success message
      toast.success('Order placed successfully! Your peak is waiting.');
      setIsSubmitting(false);
      
      // Redirect to thank you page
      navigate('/thank-you');
    } catch (error) {
      console.error('Order creation error:', error);
      toast.error('Failed to create order. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="peak-container py-20 min-h-screen">
          <div className="bg-white rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm border border-gray-100">
            <div className="bg-gray-50 p-6 rounded-full mb-6">
              <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-black">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8 max-w-md text-lg">
              Add some items to your cart to proceed to checkout.
            </p>
            <Button asChild size="lg" className="px-8 py-3 bg-black hover:bg-gray-800 text-white font-semibold">
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full px-2 md:px-8 py-4 md:py-20 min-h-screen overflow-x-hidden" style={{ maxWidth: '100vw' }}>

        {/* Checkout Header */}
        <div className="text-center mb-6 md:mb-16 mt-32 md:mt-16">
          <h1 className="text-base md:text-3xl lg:text-4xl font-bold text-black mb-2 md:mb-4 px-2">
            Final Step — Time to Wear the Mindset.
          </h1>
          <p className="text-xs md:text-lg text-gray-600 px-2">
            Your peak is waiting. Complete your order and start your journey.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-3 md:gap-6 lg:gap-8 w-full" style={{ maxWidth: '100%' }}>
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-4 md:space-y-8">
            {/* Customer Information */}
            <div className="bg-white rounded-lg md:rounded-2xl shadow-sm border border-gray-100 p-3 md:p-6">
              <h2 className="text-base md:text-xl font-bold text-black mb-3 md:mb-6">Customer Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg md:rounded-2xl shadow-sm border border-gray-100 p-3 md:p-6">
              <h2 className="text-base md:text-xl font-bold text-black mb-3 md:mb-6">Shipping Address</h2>
              <div className="space-y-3 md:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country *
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      required
                    >
                      <option value="Sweden">Sweden</option>
                      <option value="Norway">Norway</option>
                      <option value="Denmark">Denmark</option>
                      <option value="Finland">Finland</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Billing Address */}
            <div className="bg-white rounded-lg md:rounded-2xl shadow-sm border border-gray-100 p-3 md:p-6">
              <h2 className="text-base md:text-xl font-bold text-black mb-3 md:mb-6">Billing Address</h2>
              
              {/* Same as Shipping Checkbox */}
              <div className="mb-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.billingSameAsShipping}
                    onChange={(e) => handleBillingSameAsShipping(e.target.checked)}
                    className="mr-3 h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Same as shipping address</span>
                </label>
              </div>

              {!formData.billingSameAsShipping && (
                <div className="space-y-3 md:space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Billing Address *
                    </label>
                    <input
                      type="text"
                      value={formData.billingAddress}
                      onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      required={!formData.billingSameAsShipping}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Billing City *
                      </label>
                      <input
                        type="text"
                        value={formData.billingCity}
                        onChange={(e) => handleInputChange('billingCity', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        required={!formData.billingSameAsShipping}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Billing Postal Code *
                      </label>
                      <input
                        type="text"
                        value={formData.billingPostalCode}
                        onChange={(e) => handleInputChange('billingPostalCode', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        required={!formData.billingSameAsShipping}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Billing Country *
                      </label>
                      <select
                        value={formData.billingCountry}
                        onChange={(e) => handleInputChange('billingCountry', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        required={!formData.billingSameAsShipping}
                      >
                        <option value="Sweden">Sweden</option>
                        <option value="Norway">Norway</option>
                        <option value="Denmark">Denmark</option>
                        <option value="Finland">Finland</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Shipping Method */}
            <div className="bg-white rounded-lg md:rounded-2xl shadow-sm border border-gray-100 p-3 md:p-6">
              <h2 className="text-base md:text-xl font-bold text-black mb-3 md:mb-6">Shipping Method</h2>
              <div className="space-y-2 md:space-y-3">
                <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="shipping"
                    value="standard"
                    checked={formData.shippingMethod === 'standard'}
                    onChange={(e) => handleInputChange('shippingMethod', e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Standard Shipping</p>
                        <p className="text-sm text-gray-600">3-5 business days</p>
                      </div>
                      <span className="font-medium">{shippingCost === 0 ? 'Free' : `${shippingCost} SEK`}</span>
                    </div>
                  </div>
                </label>
                <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="shipping"
                    value="express"
                    checked={formData.shippingMethod === 'express'}
                    onChange={(e) => handleInputChange('shippingMethod', e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Express Shipping</p>
                        <p className="text-sm text-gray-600">1-2 business days</p>
                      </div>
                      <span className="font-medium">99 SEK</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg md:rounded-2xl shadow-sm border border-gray-100 p-3 md:p-6">
              <h2 className="text-base md:text-xl font-bold text-black mb-3 md:mb-6">Payment Method</h2>
              <div className="space-y-4">
                {/* Credit/Debit Cards (Default) */}
                <label className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                    className="mr-3 mt-1"
                  />
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-5 bg-white border border-gray-200 rounded flex items-center justify-center p-1">
                          <svg width="24" height="16" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.854 11.329l-2.003 9.367h-2.424l2.006-9.367zM26.051 17.377l1.275-3.518 0.735 3.518zM28.754 20.696h2.242l-1.956-9.367h-2.069c-0.003-0-0.007-0-0.010-0-0.459 0-0.853 0.281-1.019 0.68l-0.003 0.007-3.635 8.68h2.544l0.506-1.4h3.109zM22.429 17.638c0.010-2.473-3.419-2.609-3.395-3.714 0.008-0.336 0.327-0.694 1.027-0.785 0.13-0.013 0.28-0.021 0.432-0.021 0.711 0 1.385 0.162 1.985 0.452l-0.027-0.012 0.425-1.987c-0.673-0.261-1.452-0.413-2.266-0.416h-0.001c-2.396 0-4.081 1.275-4.096 3.098-0.015 1.348 1.203 2.099 2.122 2.549 0.945 0.459 1.262 0.754 1.257 1.163-0.006 0.63-0.752 0.906-1.45 0.917-0.032 0.001-0.071 0.001-0.109 0.001-0.871 0-1.691-0.219-2.407-0.606l0.027 0.013-0.439 2.052c0.786 0.315 1.697 0.497 2.651 0.497 0.015 0 0.030-0 0.045-0h-0.002c2.546 0 4.211-1.257 4.22-3.204zM12.391 11.329l-3.926 9.367h-2.562l-1.932-7.477c-0.037-0.364-0.26-0.668-0.57-0.82l-0.006-0.003c-0.688-0.338-1.488-0.613-2.325-0.786l-0.066-0.011 0.058-0.271h4.124c0 0 0.001 0 0.001 0 0.562 0 1.028 0.411 1.115 0.948l0.001 0.006 1.021 5.421 2.522-6.376z" fill="#1A1F71"/>
                          </svg>
                        </div>
                        <div className="w-8 h-5 bg-white border border-gray-200 rounded flex items-center justify-center p-1">
                          <svg width="24" height="16" viewBox="0 0 58 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0.5" y="0.5" width="57" height="39" rx="3.5" fill="white" stroke="#F3F3F3"/>
                            <path d="M34.3102 28.9765H23.9591V10.5122H34.3102V28.9765Z" fill="#FF5F00"/>
                            <path d="M24.6223 19.7429C24.6223 15.9973 26.3891 12.6608 29.1406 10.5107C27.1285 8.93843 24.5892 7.99998 21.8294 7.99998C15.2961 7.99998 10 13.2574 10 19.7429C10 26.2283 15.2961 31.4857 21.8294 31.4857C24.5892 31.4857 27.1285 30.5473 29.1406 28.975C26.3891 26.8249 24.6223 23.4884 24.6223 19.7429" fill="#EB001B"/>
                            <path d="M48.2706 19.7429C48.2706 26.2283 42.9745 31.4857 36.4412 31.4857C33.6814 31.4857 31.1421 30.5473 29.1293 28.975C31.8815 26.8249 33.6483 23.4884 33.6483 19.7429C33.6483 15.9973 31.8815 12.6608 29.1293 10.5107C31.1421 8.93843 33.6814 7.99998 36.4412 7.99998C42.9745 7.99998 48.2706 13.2574 48.2706 19.7429" fill="#F79E1B"/>
                          </svg>
                        </div>
                      </div>
                      <span className="font-medium text-sm">Credit/Debit Card</span>
                    </div>
                    <p className="text-sm text-gray-600">Pay securely with Visa or Mastercard</p>
                  </div>
                </label>

                {/* Klarna Options */}
                <div className="space-y-2">
                  <label className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="klarna-direct"
                      checked={formData.paymentMethod === 'klarna-direct'}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                      className="mr-3 mt-1"
                    />
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-5 bg-white border border-gray-200 rounded flex items-center justify-center p-1">
                            <svg width="24" height="16" viewBox="0 0 58 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect x="0.5" y="0.5" width="57" height="39" rx="3.5" fill="#F4B6C7" stroke="#F3F3F3"/>
                              <path fillRule="evenodd" clipRule="evenodd" d="M7.41299 25.7963H5V15H7.41299V25.7963ZM13.4398 15H11.0784C11.0784 16.9868 10.1885 18.8104 8.63709 20.0034L7.70155 20.7226L11.3264 25.7967H14.3068L10.9714 21.1277C12.5525 19.5116 13.4398 17.3373 13.4398 15ZM17.289 25.7933H15.0102V15.0021H17.289V25.7933ZM24.1766 18.3286V18.8061C23.5616 18.3754 22.8192 18.1223 22.0185 18.1223C19.8993 18.1223 18.1815 19.8857 18.1815 22.0611C18.1815 24.2365 19.8993 26 22.0185 26C22.8192 26 23.5616 25.7469 24.1766 25.3163V25.7933H26.3539V18.3286H24.1766ZM24.1694 22.0611C24.1694 23.1218 23.2861 23.9818 22.1966 23.9818C21.1071 23.9818 20.2238 23.1218 20.2238 22.0611C20.2238 21.0004 21.1071 20.1407 22.1966 20.1407C23.2861 20.1407 24.1694 21.0004 24.1694 22.0611ZM47.1454 18.8061V18.3286H49.3226V25.7933H47.1454V25.3163C46.5304 25.7469 45.788 26 44.9872 26C42.868 26 41.1502 24.2365 41.1502 22.0611C41.1502 19.8857 42.868 18.1223 44.9872 18.1223C45.788 18.1223 46.5304 18.3754 47.1454 18.8061ZM45.1654 23.9818C46.255 23.9818 47.1381 23.1218 47.1381 22.0611C47.1381 21.0004 46.255 20.1407 45.1654 20.1407C44.0758 20.1407 43.1926 21.0004 43.1926 22.0611C43.1926 23.1218 44.0758 23.9818 45.1654 23.9818ZM50.2675 24.5482C50.2675 23.7736 50.8792 23.1457 51.6337 23.1457C52.3882 23.1457 53 23.7736 53 24.5482C53 25.3227 52.3882 25.9507 51.6337 25.9507C50.8792 25.9507 50.2675 25.3227 50.2675 24.5482ZM37.2814 18.1278C36.4117 18.1278 35.5887 18.405 35.0384 19.1697V18.329H32.8706V25.7933H35.065V21.8706C35.065 20.7354 35.8065 20.1796 36.6993 20.1796C37.6562 20.1796 38.2063 20.7663 38.2063 21.8551V25.7933H40.3809V21.0463C40.3809 19.3092 39.0354 18.1278 37.2814 18.1278ZM29.7219 18.3287V19.3009C30.1583 18.7177 30.9715 18.3291 31.8557 18.3291V20.5013L31.8487 20.501L31.8435 20.5008L31.8379 20.5005L31.8298 20.5003C30.9684 20.5003 29.7269 21.1323 29.7269 22.3082V25.7933H27.4928V18.3287H29.7219Z" fill="#17120F"/>
                            </svg>
                          </div>
                        </div>
                        <span className="font-medium text-sm">Pay Direct with Klarna</span>
                      </div>
                      <p className="text-sm text-gray-600">Pay now with your preferred payment method</p>
                    </div>
                  </label>

                  <label className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="klarna-pay-later"
                      checked={formData.paymentMethod === 'klarna-pay-later'}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                      className="mr-3 mt-1"
                    />
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-5 bg-white border border-gray-200 rounded flex items-center justify-center p-1">
                            <svg width="24" height="16" viewBox="0 0 58 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect x="0.5" y="0.5" width="57" height="39" rx="3.5" fill="#F4B6C7" stroke="#F3F3F3"/>
                              <path fillRule="evenodd" clipRule="evenodd" d="M7.41299 25.7963H5V15H7.41299V25.7963ZM13.4398 15H11.0784C11.0784 16.9868 10.1885 18.8104 8.63709 20.0034L7.70155 20.7226L11.3264 25.7967H14.3068L10.9714 21.1277C12.5525 19.5116 13.4398 17.3373 13.4398 15ZM17.289 25.7933H15.0102V15.0021H17.289V25.7933ZM24.1766 18.3286V18.8061C23.5616 18.3754 22.8192 18.1223 22.0185 18.1223C19.8993 18.1223 18.1815 19.8857 18.1815 22.0611C18.1815 24.2365 19.8993 26 22.0185 26C22.8192 26 23.5616 25.7469 24.1766 25.3163V25.7933H26.3539V18.3286H24.1766ZM24.1694 22.0611C24.1694 23.1218 23.2861 23.9818 22.1966 23.9818C21.1071 23.9818 20.2238 23.1218 20.2238 22.0611C20.2238 21.0004 21.1071 20.1407 22.1966 20.1407C23.2861 20.1407 24.1694 21.0004 24.1694 22.0611ZM47.1454 18.8061V18.3286H49.3226V25.7933H47.1454V25.3163C46.5304 25.7469 45.788 26 44.9872 26C42.868 26 41.1502 24.2365 41.1502 22.0611C41.1502 19.8857 42.868 18.1223 44.9872 18.1223C45.788 18.1223 46.5304 18.3754 47.1454 18.8061ZM45.1654 23.9818C46.255 23.9818 47.1381 23.1218 47.1381 22.0611C47.1381 21.0004 46.255 20.1407 45.1654 20.1407C44.0758 20.1407 43.1926 21.0004 43.1926 22.0611C43.1926 23.1218 44.0758 23.9818 45.1654 23.9818ZM50.2675 24.5482C50.2675 23.7736 50.8792 23.1457 51.6337 23.1457C52.3882 23.1457 53 23.7736 53 24.5482C53 25.3227 52.3882 25.9507 51.6337 25.9507C50.8792 25.9507 50.2675 25.3227 50.2675 24.5482ZM37.2814 18.1278C36.4117 18.1278 35.5887 18.405 35.0384 19.1697V18.329H32.8706V25.7933H35.065V21.8706C35.065 20.7354 35.8065 20.1796 36.6993 20.1796C37.6562 20.1796 38.2063 20.7663 38.2063 21.8551V25.7933H40.3809V21.0463C40.3809 19.3092 39.0354 18.1278 37.2814 18.1278ZM29.7219 18.3287V19.3009C30.1583 18.7177 30.9715 18.3291 31.8557 18.3291V20.5013L31.8487 20.501L31.8435 20.5008L31.8379 20.5005L31.8298 20.5003C30.9684 20.5003 29.7269 21.1323 29.7269 22.3082V25.7933H27.4928V18.3287H29.7219Z" fill="#17120F"/>
                            </svg>
                          </div>
                        </div>
                        <span className="font-medium text-sm">Pay Later with Klarna</span>
                      </div>
                      <p className="text-sm text-gray-600">Pay in 30 days - no interest, no fees</p>
                    </div>
                  </label>

                  <label className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="klarna-flexible"
                      checked={formData.paymentMethod === 'klarna-flexible'}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                      className="mr-3 mt-1"
                    />
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-5 bg-white border border-gray-200 rounded flex items-center justify-center p-1">
                            <svg width="24" height="16" viewBox="0 0 58 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect x="0.5" y="0.5" width="57" height="39" rx="3.5" fill="#F4B6C7" stroke="#F3F3F3"/>
                              <path fillRule="evenodd" clipRule="evenodd" d="M7.41299 25.7963H5V15H7.41299V25.7963ZM13.4398 15H11.0784C11.0784 16.9868 10.1885 18.8104 8.63709 20.0034L7.70155 20.7226L11.3264 25.7967H14.3068L10.9714 21.1277C12.5525 19.5116 13.4398 17.3373 13.4398 15ZM17.289 25.7933H15.0102V15.0021H17.289V25.7933ZM24.1766 18.3286V18.8061C23.5616 18.3754 22.8192 18.1223 22.0185 18.1223C19.8993 18.1223 18.1815 19.8857 18.1815 22.0611C18.1815 24.2365 19.8993 26 22.0185 26C22.8192 26 23.5616 25.7469 24.1766 25.3163V25.7933H26.3539V18.3286H24.1766ZM24.1694 22.0611C24.1694 23.1218 23.2861 23.9818 22.1966 23.9818C21.1071 23.9818 20.2238 23.1218 20.2238 22.0611C20.2238 21.0004 21.1071 20.1407 22.1966 20.1407C23.2861 20.1407 24.1694 21.0004 24.1694 22.0611ZM47.1454 18.8061V18.3286H49.3226V25.7933H47.1454V25.3163C46.5304 25.7469 45.788 26 44.9872 26C42.868 26 41.1502 24.2365 41.1502 22.0611C41.1502 19.8857 42.868 18.1223 44.9872 18.1223C45.788 18.1223 46.5304 18.3754 47.1454 18.8061ZM45.1654 23.9818C46.255 23.9818 47.1381 23.1218 47.1381 22.0611C47.1381 21.0004 46.255 20.1407 45.1654 20.1407C44.0758 20.1407 43.1926 21.0004 43.1926 22.0611C43.1926 23.1218 44.0758 23.9818 45.1654 23.9818ZM50.2675 24.5482C50.2675 23.7736 50.8792 23.1457 51.6337 23.1457C52.3882 23.1457 53 23.7736 53 24.5482C53 25.3227 52.3882 25.9507 51.6337 25.9507C50.8792 25.9507 50.2675 25.3227 50.2675 24.5482ZM37.2814 18.1278C36.4117 18.1278 35.5887 18.405 35.0384 19.1697V18.329H32.8706V25.7933H35.065V21.8706C35.065 20.7354 35.8065 20.1796 36.6993 20.1796C37.6562 20.1796 38.2063 20.7663 38.2063 21.8551V25.7933H40.3809V21.0463C40.3809 19.3092 39.0354 18.1278 37.2814 18.1278ZM29.7219 18.3287V19.3009C30.1583 18.7177 30.9715 18.3291 31.8557 18.3291V20.5013L31.8487 20.501L31.8435 20.5008L31.8379 20.5005L31.8298 20.5003C30.9684 20.5003 29.7269 21.1323 29.7269 22.3082V25.7933H27.4928V18.3287H29.7219Z" fill="#17120F"/>
                            </svg>
                          </div>
                        </div>
                        <span className="font-medium text-sm">Klarna Flexible Payments</span>
                      </div>
                      <p className="text-sm text-gray-600">Split your payment into installments</p>
                    </div>
                  </label>
                </div>

                {/* Express Checkout Options */}
                <div className="space-y-2">
                  <label className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="apple-pay"
                      checked={formData.paymentMethod === 'apple-pay'}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                      className="mr-3 mt-1"
                    />
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-5 bg-white border border-gray-200 rounded flex items-center justify-center p-1">
                            <svg width="24" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M2.15 4.318a42.16 42.16 0 0 0-.454.003c-.15.005-.303.013-.452.04a1.44 1.44 0 0 0-1.06.772c-.07.138-.114.278-.14.43-.028.148-.037.3-.04.45A10.2 10.2 0 0 0 0 6.222v11.557c0 .07.002.138.003.207.004.15.013.303.04.452.027.15.072.291.142.429a1.436 1.436 0 0 0 .63.63c.138.07.278.115.43.142.148.027.3.036.45.04l.208.003h20.194l.207-.003c.15-.004.303-.013.452-.04.15-.027.291-.071.428-.141a1.432 1.432 0 0 0 .631-.631c.07-.138.115-.278.141-.43.027-.148.036-.3.04-.45.002-.07.003-.138.003-.208l.001-.246V6.221c0-.07-.002-.138-.004-.207a2.995 2.995 0 0 0-.04-.452 1.446 1.446 0 0 0-1.2-1.201 3.022 3.022 0 0 0-.452-.04 10.448 10.448 0 0 0-.453-.003zm0 .512h19.942c.066 0 .131.002.197.003.115.004.25.01.375.032.109.02.2.05.287.094a.927.927 0 0 1 .407.407.997.997 0 0 1 .094.288c.022.123.028.258.031.374.002.065.003.13.003.197v11.552c0 .065 0 .13-.003.196-.003.115-.009.25-.032.375a.927.927 0 0 1-.5.693 1.002 1.002 0 0 1-.286.094 2.598 2.598 0 0 1-.373.032l-.2.003H1.906c-.066 0-.133-.002-.196-.003a2.61 2.61 0 0 1-.375-.032c-.109-.02-.2-.05-.288-.094a.918.918 0 0 1-.406-.407 1.006 1.006 0 0 1-.094-.288 2.531 2.531 0 0 1-.032-.373 9.588 9.588 0 0 1-.002-.197V6.224c0-.065 0-.131.002-.197.004-.114.01-.248.032-.375.02-.108.05-.199.094-.287a.925.925 0 0 1 .407-.406 1.03 1.03 0 0 1 .287-.094c.125-.022.26-.029.375-.032.065-.002.131-.002.196-.003zm4.71 3.7c-.3.016-.668.199-.88.456-.191.22-.36.58-.316.918.338.03.675-.169.888-.418.205-.258.345-.603.308-.955zm2.207.42v5.493h.852v-1.877h1.18c1.078 0 1.835-.739 1.835-1.812 0-1.07-.742-1.805-1.808-1.805zm.852.719h.982c.739 0 1.161.396 1.161 1.089 0 .692-.422 1.092-1.164 1.092h-.979zm-3.154.3c-.45.01-.83.28-1.05.28-.235 0-.593-.264-.981-.257a1.446 1.446 0 0 0-1.23.747c-.527.908-.139 2.255.374 2.995.249.366.549.769.944.754.373-.014.52-.242.973-.242.454 0 .586.242.98.235.41-.007.667-.366.915-.733.286-.417.403-.82.41-.841-.007-.008-.79-.308-.797-1.209-.008-.754.615-1.113.644-1.135-.352-.52-.9-.578-1.09-.593a1.123 1.123 0 0 0-.092-.002zm8.204.397c-.99 0-1.606.533-1.652 1.256h.777c.072-.358.369-.586.845-.586.502 0 .803.266.803.711v.309l-1.097.064c-.951.054-1.488.484-1.488 1.184 0 .72.548 1.207 1.332 1.207.526 0 1.032-.281 1.264-.727h.019v.659h.788v-2.76c0-.803-.62-1.317-1.591-1.317zm1.94.072 1.446 4.009c0 .003-.073.24-.073.247-.125.41-.33.571-.711.571-.069 0-.206 0-.267-.015v.666c.06.011.267.019.335.019.83 0 1.226-.312 1.568-1.283l1.5-4.214h-.868l-1.012 3.259h-.015l-1.013-3.26zm-1.167 2.189v.316c0 .521-.45.917-1.024.917-.442 0-.731-.228-.731-.579 0-.342.278-.56.769-.593z" fill="#000000"/>
                            </svg>
                          </div>
                        </div>
                        <span className="font-medium text-sm">Apple Pay</span>
                      </div>
                      <p className="text-sm text-gray-600">Express checkout with Apple Pay</p>
                    </div>
                  </label>

                  <label className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="google-pay"
                      checked={formData.paymentMethod === 'google-pay'}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                      className="mr-3 mt-1"
                    />
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-5 bg-white border border-gray-200 rounded flex items-center justify-center p-1">
                            <svg width="24" height="16" viewBox="0 -11 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect x="0.5" y="0.5" width="69" height="47" rx="5.5" fill="white" stroke="#D9D9D9"/>
                              <path fillRule="evenodd" clipRule="evenodd" d="M33.0603 31.5161V25.4741H36.1786C37.4564 25.4741 38.535 25.046 39.4142 24.2015L39.6252 23.9875C41.2313 22.2391 41.1258 19.5155 39.4142 17.898C38.5584 17.0416 37.3861 16.5778 36.1786 16.6016H31.1729V31.5161H33.0603ZM33.0605 23.6425V18.4332H36.2262C36.9063 18.4332 37.5512 18.6948 38.0319 19.1706C39.052 20.1696 39.0754 21.8347 38.0905 22.8694C37.6098 23.3809 36.9297 23.6663 36.2262 23.6425H33.0605ZM48.4293 22.1083C47.6204 21.359 46.5185 20.9784 45.1234 20.9784C43.3298 20.9784 41.9816 21.6444 41.0906 22.9646L42.7553 24.0231C43.3649 23.1192 44.1973 22.6673 45.2524 22.6673C45.9206 22.6673 46.5653 22.9171 47.0694 23.369C47.5618 23.7972 47.8432 24.4156 47.8432 25.0698V25.5098C47.1163 25.1055 46.2019 24.8914 45.0765 24.8914C43.7635 24.8914 42.7084 25.2006 41.923 25.831C41.1375 26.4613 40.739 27.2939 40.739 28.3524C40.7155 29.3158 41.1258 30.2316 41.8527 30.85C42.5912 31.5161 43.5291 31.8491 44.631 31.8491C45.9323 31.8491 46.9639 31.2663 47.7494 30.1007H47.8314V31.5161H49.6368V25.2244C49.6368 23.9042 49.2382 22.8576 48.4293 22.1083ZM43.3066 29.6369C42.9197 29.3514 42.6852 28.8876 42.6852 28.3881C42.6852 27.8291 42.9432 27.3652 43.4473 26.9965C43.9632 26.6278 44.6081 26.4375 45.3702 26.4375C46.4255 26.4256 47.2462 26.6635 47.8325 27.1392C47.8325 27.948 47.5159 28.6497 46.8945 29.2444C46.3317 29.8153 45.5696 30.1364 44.7723 30.1364C44.2446 30.1483 43.7287 29.9699 43.3066 29.6369ZM53.693 35.9999L60.0001 21.3114H57.9485L55.0295 28.6378H54.9943L52.0049 21.3114H49.9534L54.0916 30.8619L51.747 35.9999H53.693Z" fill="#3C4043"/>
                              <path d="M26.544 24.1659C26.544 23.5831 26.4971 23.0003 26.4034 22.4294H18.4434V25.7239H23.0037C22.8161 26.7825 22.2065 27.734 21.3155 28.3286V30.4695H24.0353C25.6296 28.9828 26.544 26.7825 26.544 24.1659Z" fill="#4285F4"/>
                              <path d="M18.4442 32.539C20.7185 32.539 22.6411 31.7778 24.0361 30.4695L21.3164 28.3287C20.5544 28.852 19.5814 29.1493 18.4442 29.1493C16.2403 29.1493 14.3763 27.6388 13.7081 25.6169H10.9062V27.8291C12.3365 30.7193 15.2555 32.539 18.4442 32.539Z" fill="#34A853"/>
                              <path d="M13.708 25.6169C13.3563 24.5584 13.3563 23.4048 13.708 22.3343V20.134H10.9058C9.69808 22.5484 9.69808 25.4029 10.9058 27.8172L13.708 25.6169Z" fill="#FBBC04"/>
                              <path d="M18.4442 18.8019C19.6517 18.7781 20.8123 19.242 21.6798 20.0864L24.0948 17.6363C22.559 16.1853 20.5427 15.3885 18.4442 15.4123C15.2555 15.4123 12.3365 17.2439 10.9062 20.134L13.7081 22.3462C14.3763 20.3124 16.2403 18.8019 18.4442 18.8019Z" fill="#EA4335"/>
                            </svg>
                          </div>
                        </div>
                        <span className="font-medium text-sm">Google Pay</span>
                      </div>
                      <p className="text-sm text-gray-600">Express checkout with Google Pay</p>
                    </div>
                  </label>
                </div>

                {/* Other Payment Methods */}
                <div className="space-y-2">
                  <label className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="swish"
                      checked={formData.paymentMethod === 'swish'}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                      className="mr-3 mt-1"
                    />
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-5 bg-white border border-gray-200 rounded flex items-center justify-center p-1">
                            <img 
                              src="https://assets.icanet.se/f_auto,q_auto,dpr_auto/w_771,h_708,x_217,y_0,c_crop/cumulus/Banken/425/swich_3.png" 
                              alt="Swish" 
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                        <span className="font-medium text-sm">Swish</span>
                      </div>
                      <p className="text-sm text-gray-600">Pay instantly with your mobile number</p>
                    </div>
                  </label>

                  <label className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={formData.paymentMethod === 'paypal'}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                      className="mr-3 mt-1"
                    />
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-5 bg-white border border-gray-200 rounded flex items-center justify-center p-1">
                            <svg width="24" height="16" viewBox="-23 0 302 302" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M217.168476,23.5070146 C203.234077,7.62479651 178.045612,0.815753338 145.823355,0.815753338 L52.3030619,0.815753338 C45.7104431,0.815753338 40.1083819,5.6103852 39.0762042,12.1114399 L0.136468302,259.076601 C-0.637664968,263.946149 3.13311322,268.357876 8.06925331,268.357876 L65.804612,268.357876 L80.3050438,176.385849 L79.8555471,179.265958 C80.8877248,172.764903 86.4481659,167.970272 93.0324607,167.970272 L120.46841,167.970272 C174.366398,167.970272 216.569147,146.078116 228.897012,82.7490197 C229.263268,80.8761167 229.579581,79.0531577 229.854273,77.2718188 C228.297683,76.4477414 228.297683,76.4477414 229.854273,77.2718188 C233.525163,53.8646924 229.829301,37.9325302 217.168476,23.5070146" fill="#27346A"/>
                              <path d="M102.396976,68.8395929 C103.936919,68.1070797 105.651665,67.699203 107.449652,67.699203 L180.767565,67.699203 C189.449511,67.699203 197.548776,68.265236 204.948824,69.4555699 C207.071448,69.7968545 209.127479,70.1880831 211.125242,70.6375799 C213.123006,71.0787526 215.062501,71.5781934 216.943728,72.1275783 C217.884341,72.4022708 218.808307,72.6852872 219.715624,72.9849517 C223.353218,74.2002577 226.741092,75.61534 229.854273,77.2718188 C233.525163,53.8563683 229.829301,37.9325302 217.168476,23.5070146 C203.225753,7.62479651 178.045612,0.815753338 145.823355,0.815753338 L52.2947379,0.815753338 C45.7104431,0.815753338 40.1083819,5.6103852 39.0762042,12.1114399 L0.136468302,259.068277 C-0.637664968,263.946149 3.13311322,268.349552 8.0609293,268.349552 L65.804612,268.349552 L95.8875974,77.5798073 C96.5035744,73.6675208 99.0174265,70.4627756 102.396976,68.8395929 Z" fill="#27346A"/>
                              <path d="M228.897012,82.7490197 C216.569147,146.069792 174.366398,167.970272 120.46841,167.970272 L93.0241367,167.970272 C86.4398419,167.970272 80.8794007,172.764903 79.8555471,179.265958 L61.8174095,293.621258 C61.1431644,297.883153 64.4394738,301.745495 68.7513129,301.745495 L117.421821,301.745495 C123.182038,301.745495 128.084882,297.550192 128.983876,291.864891 L129.458344,289.384335 L138.631407,231.249423 L139.222412,228.036354 C140.121406,222.351053 145.02425,218.15575 150.784467,218.15575 L158.067979,218.15575 C205.215193,218.15575 242.132193,199.002194 252.920115,143.605884 C257.423406,120.456802 255.092683,101.128442 243.181019,87.5519756 C239.568397,83.4399129 235.081754,80.0437153 229.854273,77.2718188 C229.571257,79.0614817 229.263268,80.8761167 228.897012,82.7490197 L228.897012,82.7490197 Z" fill="#2790C3"/>
                              <path d="M216.952052,72.1275783 C215.070825,71.5781934 213.13133,71.0787526 211.133566,70.6375799 C209.135803,70.1964071 207.071448,69.8051785 204.957148,69.4638939 C197.548776,68.265236 189.457835,67.699203 180.767565,67.699203 L107.457976,67.699203 C105.651665,67.699203 103.936919,68.1070797 102.4053,68.8479169 C99.0174265,70.4710996 96.5118984,73.6675208 95.8959214,77.5881313 L80.3133678,176.385849 L79.8638711,179.265958 C80.8877248,172.764903 86.4481659,167.970272 93.0324607,167.970272 L120.476734,167.970272 C174.374722,167.970272 216.577471,146.078116 228.905336,82.7490197 C229.271592,80.8761167 229.579581,79.0614817 229.862597,77.2718188 C226.741092,75.623664 223.361542,74.2002577 219.723948,72.9932757 C218.816631,72.6936112 217.892665,72.4022708 216.952052,72.1275783" fill="#1F264F"/>
                            </svg>
                          </div>
                        </div>
                        <span className="font-medium text-sm">PayPal</span>
                      </div>
                      <p className="text-sm text-gray-600">Pay with your PayPal account</p>
                    </div>
                  </label>
                </div>

                {/* Credit Card Form (shown only when card is selected) */}
                {formData.paymentMethod === 'card' && (
                  <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Card Details</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number *
                        </label>
                        <input
                          type="text"
                          value={formData.cardNumber}
                          onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                          required={formData.paymentMethod === 'card'}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry Date *
                          </label>
                          <input
                            type="text"
                            value={formData.cardExpiry}
                            onChange={(e) => handleInputChange('cardExpiry', e.target.value)}
                            placeholder="MM/YY"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            required={formData.paymentMethod === 'card'}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVC *
                          </label>
                          <input
                            type="text"
                            value={formData.cardCvc}
                            onChange={(e) => handleInputChange('cardCvc', e.target.value)}
                            placeholder="123"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            required={formData.paymentMethod === 'card'}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Payment Method Logos */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-8 h-5 bg-white border border-gray-200 rounded flex items-center justify-center p-1">
                    <svg width="24" height="16" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.854 11.329l-2.003 9.367h-2.424l2.006-9.367zM26.051 17.377l1.275-3.518 0.735 3.518zM28.754 20.696h2.242l-1.956-9.367h-2.069c-0.003-0-0.007-0-0.010-0-0.459 0-0.853 0.281-1.019 0.68l-0.003 0.007-3.635 8.68h2.544l0.506-1.4h3.109zM22.429 17.638c0.010-2.473-3.419-2.609-3.395-3.714 0.008-0.336 0.327-0.694 1.027-0.785 0.13-0.013 0.28-0.021 0.432-0.021 0.711 0 1.385 0.162 1.985 0.452l-0.027-0.012 0.425-1.987c-0.673-0.261-1.452-0.413-2.266-0.416h-0.001c-2.396 0-4.081 1.275-4.096 3.098-0.015 1.348 1.203 2.099 2.122 2.549 0.945 0.459 1.262 0.754 1.257 1.163-0.006 0.63-0.752 0.906-1.45 0.917-0.032 0.001-0.071 0.001-0.109 0.001-0.871 0-1.691-0.219-2.407-0.606l0.027 0.013-0.439 2.052c0.786 0.315 1.697 0.497 2.651 0.497 0.015 0 0.030-0 0.045-0h-0.002c2.546 0 4.211-1.257 4.22-3.204zM12.391 11.329l-3.926 9.367h-2.562l-1.932-7.477c-0.037-0.364-0.26-0.668-0.57-0.82l-0.006-0.003c-0.688-0.338-1.488-0.613-2.325-0.786l-0.066-0.011 0.058-0.271h4.124c0 0 0.001 0 0.001 0 0.562 0 1.028 0.411 1.115 0.948l0.001 0.006 1.021 5.421 2.522-6.376z" fill="#1A1F71"/>
                    </svg>
                  </div>
                  <div className="w-8 h-5 bg-white border border-gray-200 rounded flex items-center justify-center p-1">
                    <svg width="24" height="16" viewBox="0 0 58 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="0.5" y="0.5" width="57" height="39" rx="3.5" fill="white" stroke="#F3F3F3"/>
                      <path d="M34.3102 28.9765H23.9591V10.5122H34.3102V28.9765Z" fill="#FF5F00"/>
                      <path d="M24.6223 19.7429C24.6223 15.9973 26.3891 12.6608 29.1406 10.5107C27.1285 8.93843 24.5892 7.99998 21.8294 7.99998C15.2961 7.99998 10 13.2574 10 19.7429C10 26.2283 15.2961 31.4857 21.8294 31.4857C24.5892 31.4857 27.1285 30.5473 29.1406 28.975C26.3891 26.8249 24.6223 23.4884 24.6223 19.7429" fill="#EB001B"/>
                      <path d="M48.2706 19.7429C48.2706 26.2283 42.9745 31.4857 36.4412 31.4857C33.6814 31.4857 31.1421 30.5473 29.1293 28.975C31.8815 26.8249 33.6483 23.4884 33.6483 19.7429C33.6483 15.9973 31.8815 12.6608 29.1293 10.5107C31.1421 8.93843 33.6814 7.99998 36.4412 7.99998C42.9745 7.99998 48.2706 13.2574 48.2706 19.7429" fill="#F79E1B"/>
                    </svg>
                  </div>
                  <div className="w-8 h-5 bg-white border border-gray-200 rounded flex items-center justify-center p-1">
                    <svg width="24" height="16" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.25 10.435l-2.165 0.46-0.010 7.12c0 1.315 0.99 2.165 2.305 2.165 0.73 0 1.265-0.135 1.56-0.295v-1.69c-0.285 0.115-1.685 0.525-1.685-0.785v-3.16h1.685v-1.89h-1.685zM12.705 13.015l-0.135-0.655h-1.92v7.66h2.215v-5.155c0.525-0.69 1.41-0.555 1.695-0.465v-2.040c-0.3-0.105-1.335-0.3-1.855 0.655zM17.32 9.4l-2.23 0.475v1.81l2.23-0.475zM2.245 14.615c0-0.345 0.29-0.48 0.755-0.485 0.675 0 1.535 0.205 2.21 0.57v-2.090c-0.735-0.29-1.47-0.405-2.205-0.405-1.8 0-3 0.94-3 2.51 0 2.46 3.375 2.060 3.375 3.12 0 0.41-0.355 0.545-0.85 0.545-0.735 0-1.685-0.305-2.43-0.71v2c0.825 0.355 1.66 0.505 2.425 0.505 1.845 0 3.115-0.79 3.115-2.39 0-2.645-3.395-2.17-3.395-3.17zM32 16.28c0-2.275-1.1-4.070-3.21-4.070s-3.395 1.795-3.395 4.055c0 2.675 1.515 3.91 3.675 3.91 1.060 0 1.855-0.24 2.46-0.575v-1.67c-0.605 0.305-1.3 0.49-2.18 0.49-0.865 0-1.625-0.305-1.725-1.345h4.345c0.010-0.115 0.030-0.58 0.030-0.795zM27.605 15.44c0-1 0.615-1.42 1.17-1.42 0.545 0 1.125 0.42 1.125 1.42zM21.96 12.21c-0.87 0-1.43 0.41-1.74 0.695l-0.115-0.55h-1.955v10.24l2.22-0.47 0.005-2.51c0.32 0.235 0.795 0.56 1.57 0.56 1.59 0 3.040-1.16 3.040-3.98 0.005-2.58-1.465-3.985-3.025-3.985zM21.43 18.335c-0.52 0-0.83-0.19-1.045-0.42l-0.015-3.3c0.23-0.255 0.55-0.44 1.060-0.44 0.81 0 1.37 0.91 1.37 2.070 0.005 1.195-0.545 2.090-1.37 2.090zM15.095 20.020h2.23v-7.66h-2.23z" fill="#6772E5"/>
                    </svg>
                  </div>
                  <div className="w-8 h-5 bg-white border border-gray-200 rounded flex items-center justify-center p-1">
                    <svg width="24" height="16" viewBox="0 0 58 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="0.5" y="0.5" width="57" height="39" rx="3.5" fill="#F4B6C7" stroke="#F3F3F3"/>
                      <path fillRule="evenodd" clipRule="evenodd" d="M7.41299 25.7963H5V15H7.41299V25.7963ZM13.4398 15H11.0784C11.0784 16.9868 10.1885 18.8104 8.63709 20.0034L7.70155 20.7226L11.3264 25.7967H14.3068L10.9714 21.1277C12.5525 19.5116 13.4398 17.3373 13.4398 15ZM17.289 25.7933H15.0102V15.0021H17.289V25.7933ZM24.1766 18.3286V18.8061C23.5616 18.3754 22.8192 18.1223 22.0185 18.1223C19.8993 18.1223 18.1815 19.8857 18.1815 22.0611C18.1815 24.2365 19.8993 26 22.0185 26C22.8192 26 23.5616 25.7469 24.1766 25.3163V25.7933H26.3539V18.3286H24.1766ZM24.1694 22.0611C24.1694 23.1218 23.2861 23.9818 22.1966 23.9818C21.1071 23.9818 20.2238 23.1218 20.2238 22.0611C20.2238 21.0004 21.1071 20.1407 22.1966 20.1407C23.2861 20.1407 24.1694 21.0004 24.1694 22.0611ZM47.1454 18.8061V18.3286H49.3226V25.7933H47.1454V25.3163C46.5304 25.7469 45.788 26 44.9872 26C42.868 26 41.1502 24.2365 41.1502 22.0611C41.1502 19.8857 42.868 18.1223 44.9872 18.1223C45.788 18.1223 46.5304 18.3754 47.1454 18.8061ZM45.1654 23.9818C46.255 23.9818 47.1381 23.1218 47.1381 22.0611C47.1381 21.0004 46.255 20.1407 45.1654 20.1407C44.0758 20.1407 43.1926 21.0004 43.1926 22.0611C43.1926 23.1218 44.0758 23.9818 45.1654 23.9818ZM50.2675 24.5482C50.2675 23.7736 50.8792 23.1457 51.6337 23.1457C52.3882 23.1457 53 23.7736 53 24.5482C53 25.3227 52.3882 25.9507 51.6337 25.9507C50.8792 25.9507 50.2675 25.3227 50.2675 24.5482ZM37.2814 18.1278C36.4117 18.1278 35.5887 18.405 35.0384 19.1697V18.329H32.8706V25.7933H35.065V21.8706C35.065 20.7354 35.8065 20.1796 36.6993 20.1796C37.6562 20.1796 38.2063 20.7663 38.2063 21.8551V25.7933H40.3809V21.0463C40.3809 19.3092 39.0354 18.1278 37.2814 18.1278ZM29.7219 18.3287V19.3009C30.1583 18.7177 30.9715 18.3291 31.8557 18.3291V20.5013L31.8487 20.501L31.8435 20.5008L31.8379 20.5005L31.8298 20.5003C30.9684 20.5003 29.7269 21.1323 29.7269 22.3082V25.7933H27.4928V18.3287H29.7219Z" fill="#17120F"/>
                    </svg>
                  </div>
                  <div className="w-8 h-5 bg-white border border-gray-200 rounded flex items-center justify-center p-1">
                    <svg width="24" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.15 4.318a42.16 42.16 0 0 0-.454.003c-.15.005-.303.013-.452.04a1.44 1.44 0 0 0-1.06.772c-.07.138-.114.278-.14.43-.028.148-.037.3-.04.45A10.2 10.2 0 0 0 0 6.222v11.557c0 .07.002.138.003.207.004.15.013.303.04.452.027.15.072.291.142.429a1.436 1.436 0 0 0 .63.63c.138.07.278.115.43.142.148.027.3.036.45.04l.208.003h20.194l.207-.003c.15-.004.303-.013.452-.04.15-.027.291-.071.428-.141a1.432 1.432 0 0 0 .631-.631c.07-.138.115-.278.141-.43.027-.148.036-.3.04-.45.002-.07.003-.138.003-.208l.001-.246V6.221c0-.07-.002-.138-.004-.207a2.995 2.995 0 0 0-.04-.452 1.446 1.446 0 0 0-1.2-1.201 3.022 3.022 0 0 0-.452-.04 10.448 10.448 0 0 0-.453-.003zm0 .512h19.942c.066 0 .131.002.197.003.115.004.25.01.375.032.109.02.2.05.287.094a.927.927 0 0 1 .407.407.997.997 0 0 1 .094.288c.022.123.028.258.031.374.002.065.003.13.003.197v11.552c0 .065 0 .13-.003.196-.003.115-.009.25-.032.375a.927.927 0 0 1-.5.693 1.002 1.002 0 0 1-.286.094 2.598 2.598 0 0 1-.373.032l-.2.003H1.906c-.066 0-.133-.002-.196-.003a2.61 2.61 0 0 1-.375-.032c-.109-.02-.2-.05-.288-.094a.918.918 0 0 1-.406-.407 1.006 1.006 0 0 1-.094-.288 2.531 2.531 0 0 1-.032-.373 9.588 9.588 0 0 1-.002-.197V6.224c0-.065 0-.131.002-.197.004-.114.01-.248.032-.375.02-.108.05-.199.094-.287a.925.925 0 0 1 .407-.406 1.03 1.03 0 0 1 .287-.094c.125-.022.26-.029.375-.032.065-.002.131-.002.196-.003zm4.71 3.7c-.3.016-.668.199-.88.456-.191.22-.36.58-.316.918.338.03.675-.169.888-.418.205-.258.345-.603.308-.955zm2.207.42v5.493h.852v-1.877h1.18c1.078 0 1.835-.739 1.835-1.812 0-1.07-.742-1.805-1.808-1.805zm.852.719h.982c.739 0 1.161.396 1.161 1.089 0 .692-.422 1.092-1.164 1.092h-.979zm-3.154.3c-.45.01-.83.28-1.05.28-.235 0-.593-.264-.981-.257a1.446 1.446 0 0 0-1.23.747c-.527.908-.139 2.255.374 2.995.249.366.549.769.944.754.373-.014.52-.242.973-.242.454 0 .586.242.98.235.41-.007.667-.366.915-.733.286-.417.403-.82.41-.841-.007-.008-.79-.308-.797-1.209-.008-.754.615-1.113.644-1.135-.352-.52-.9-.578-1.09-.593a1.123 1.123 0 0 0-.092-.002zm8.204.397c-.99 0-1.606.533-1.652 1.256h.777c.072-.358.369-.586.845-.586.502 0 .803.266.803.711v.309l-1.097.064c-.951.054-1.488.484-1.488 1.184 0 .72.548 1.207 1.332 1.207.526 0 1.032-.281 1.264-.727h.019v.659h.788v-2.76c0-.803-.62-1.317-1.591-1.317zm1.94.072 1.446 4.009c0 .003-.073.24-.073.247-.125.41-.33.571-.711.571-.069 0-.206 0-.267-.015v.666c.06.011.267.019.335.019.83 0 1.226-.312 1.568-1.283l1.5-4.214h-.868l-1.012 3.259h-.015l-1.013-3.26zm-1.167 2.189v.316c0 .521-.45.917-1.024.917-.442 0-.731-.228-.731-.579 0-.342.278-.56.769-.593z" fill="#000000"/>
                    </svg>
                  </div>
                  <div className="w-8 h-5 bg-white border border-gray-200 rounded flex items-center justify-center p-1">
                    <svg width="24" height="16" viewBox="-23 0 302 302" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M217.168476,23.5070146 C203.234077,7.62479651 178.045612,0.815753338 145.823355,0.815753338 L52.3030619,0.815753338 C45.7104431,0.815753338 40.1083819,5.6103852 39.0762042,12.1114399 L0.136468302,259.076601 C-0.637664968,263.946149 3.13311322,268.357876 8.06925331,268.357876 L65.804612,268.357876 L80.3050438,176.385849 L79.8555471,179.265958 C80.8877248,172.764903 86.4481659,167.970272 93.0324607,167.970272 L120.46841,167.970272 C174.366398,167.970272 216.569147,146.078116 228.897012,82.7490197 C229.263268,80.8761167 229.579581,79.0531577 229.854273,77.2718188 C228.297683,76.4477414 228.297683,76.4477414 229.854273,77.2718188 C233.525163,53.8646924 229.829301,37.9325302 217.168476,23.5070146" fill="#27346A"/>
                      <path d="M102.396976,68.8395929 C103.936919,68.1070797 105.651665,67.699203 107.449652,67.699203 L180.767565,67.699203 C189.449511,67.699203 197.548776,68.265236 204.948824,69.4555699 C207.071448,69.7968545 209.127479,70.1880831 211.125242,70.6375799 C213.123006,71.0787526 215.062501,71.5781934 216.943728,72.1275783 C217.884341,72.4022708 218.808307,72.6852872 219.715624,72.9849517 C223.353218,74.2002577 226.741092,75.61534 229.854273,77.2718188 C233.525163,53.8563683 229.829301,37.9325302 217.168476,23.5070146 C203.225753,7.62479651 178.045612,0.815753338 145.823355,0.815753338 L52.2947379,0.815753338 C45.7104431,0.815753338 40.1083819,5.6103852 39.0762042,12.1114399 L0.136468302,259.068277 C-0.637664968,263.946149 3.13311322,268.349552 8.0609293,268.349552 L65.804612,268.349552 L95.8875974,77.5798073 C96.5035744,73.6675208 99.0174265,70.4627756 102.396976,68.8395929 Z" fill="#27346A"/>
                      <path d="M228.897012,82.7490197 C216.569147,146.069792 174.366398,167.970272 120.46841,167.970272 L93.0241367,167.970272 C86.4398419,167.970272 80.8794007,172.764903 79.8555471,179.265958 L61.8174095,293.621258 C61.1431644,297.883153 64.4394738,301.745495 68.7513129,301.745495 L117.421821,301.745495 C123.182038,301.745495 128.084882,297.550192 128.983876,291.864891 L129.458344,289.384335 L138.631407,231.249423 L139.222412,228.036354 C140.121406,222.351053 145.02425,218.15575 150.784467,218.15575 L158.067979,218.15575 C205.215193,218.15575 242.132193,199.002194 252.920115,143.605884 C257.423406,120.456802 255.092683,101.128442 243.181019,87.5519756 C239.568397,83.4399129 235.081754,80.0437153 229.854273,77.2718188 C229.571257,79.0614817 229.263268,80.8761167 228.897012,82.7490197 L228.897012,82.7490197 Z" fill="#2790C3"/>
                      <path d="M216.952052,72.1275783 C215.070825,71.5781934 213.13133,71.0787526 211.133566,70.6375799 C209.135803,70.1964071 207.071448,69.8051785 204.957148,69.4638939 C197.548776,68.265236 189.457835,67.699203 180.767565,67.699203 L107.457976,67.699203 C105.651665,67.699203 103.936919,68.1070797 102.4053,68.8479169 C99.0174265,70.4710996 96.5118984,73.6675208 95.8959214,77.5881313 L80.3133678,176.385849 L79.8638711,179.265958 C80.8877248,172.764903 86.4481659,167.970272 93.0324607,167.970272 L120.476734,167.970272 C174.374722,167.970272 216.577471,146.078116 228.905336,82.7490197 C229.271592,80.8761167 229.579581,79.0614817 229.862597,77.2718188 C226.741092,75.623664 223.361542,74.2002577 219.723948,72.9932757 C218.816631,72.6936112 217.892665,72.4022708 216.952052,72.1275783" fill="#1F264F"/>
                    </svg>
                  </div>
                  <div className="w-8 h-5 bg-white border border-gray-200 rounded flex items-center justify-center p-1">
                    <img 
                      src="https://assets.icanet.se/f_auto,q_auto,dpr_auto/w_771,h_708,x_217,y_0,c_crop/cumulus/Banken/425/swich_3.png" 
                      alt="Swish" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="w-8 h-5 bg-white border border-gray-200 rounded flex items-center justify-center p-1">
                    <svg width="24" height="16" viewBox="0 -11 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="0.5" y="0.5" width="69" height="47" rx="5.5" fill="white" stroke="#D9D9D9"/>
                      <path fillRule="evenodd" clipRule="evenodd" d="M33.0603 31.5161V25.4741H36.1786C37.4564 25.4741 38.535 25.046 39.4142 24.2015L39.6252 23.9875C41.2313 22.2391 41.1258 19.5155 39.4142 17.898C38.5584 17.0416 37.3861 16.5778 36.1786 16.6016H31.1729V31.5161H33.0603ZM33.0605 23.6425V18.4332H36.2262C36.9063 18.4332 37.5512 18.6948 38.0319 19.1706C39.052 20.1696 39.0754 21.8347 38.0905 22.8694C37.6098 23.3809 36.9297 23.6663 36.2262 23.6425H33.0605ZM48.4293 22.1083C47.6204 21.359 46.5185 20.9784 45.1234 20.9784C43.3298 20.9784 41.9816 21.6444 41.0906 22.9646L42.7553 24.0231C43.3649 23.1192 44.1973 22.6673 45.2524 22.6673C45.9206 22.6673 46.5653 22.9171 47.0694 23.369C47.5618 23.7972 47.8432 24.4156 47.8432 25.0698V25.5098C47.1163 25.1055 46.2019 24.8914 45.0765 24.8914C43.7635 24.8914 42.7084 25.2006 41.923 25.831C41.1375 26.4613 40.739 27.2939 40.739 28.3524C40.7155 29.3158 41.1258 30.2316 41.8527 30.85C42.5912 31.5161 43.5291 31.8491 44.631 31.8491C45.9323 31.8491 46.9639 31.2663 47.7494 30.1007H47.8314V31.5161H49.6368V25.2244C49.6368 23.9042 49.2382 22.8576 48.4293 22.1083ZM43.3066 29.6369C42.9197 29.3514 42.6852 28.8876 42.6852 28.3881C42.6852 27.8291 42.9432 27.3652 43.4473 26.9965C43.9632 26.6278 44.6081 26.4375 45.3702 26.4375C46.4255 26.4256 47.2462 26.6635 47.8325 27.1392C47.8325 27.948 47.5159 28.6497 46.8945 29.2444C46.3317 29.8153 45.5696 30.1364 44.7723 30.1364C44.2446 30.1483 43.7287 29.9699 43.3066 29.6369ZM53.693 35.9999L60.0001 21.3114H57.9485L55.0295 28.6378H54.9943L52.0049 21.3114H49.9534L54.0916 30.8619L51.747 35.9999H53.693Z" fill="#3C4043"/>
                      <path d="M26.544 24.1659C26.544 23.5831 26.4971 23.0003 26.4034 22.4294H18.4434V25.7239H23.0037C22.8161 26.7825 22.2065 27.734 21.3155 28.3286V30.4695H24.0353C25.6296 28.9828 26.544 26.7825 26.544 24.1659Z" fill="#4285F4"/>
                      <path d="M18.4442 32.539C20.7185 32.539 22.6411 31.7778 24.0361 30.4695L21.3164 28.3287C20.5544 28.852 19.5814 29.1493 18.4442 29.1493C16.2403 29.1493 14.3763 27.6388 13.7081 25.6169H10.9062V27.8291C12.3365 30.7193 15.2555 32.539 18.4442 32.539Z" fill="#34A853"/>
                      <path d="M13.708 25.6169C13.3563 24.5584 13.3563 23.4048 13.708 22.3343V20.134H10.9058C9.69808 22.5484 9.69808 25.4029 10.9058 27.8172L13.708 25.6169Z" fill="#FBBC04"/>
                      <path d="M18.4442 18.8019C19.6517 18.7781 20.8123 19.242 21.6798 20.0864L24.0948 17.6363C22.559 16.1853 20.5427 15.3885 18.4442 15.4123C15.2555 15.4123 12.3365 17.2439 10.9062 20.134L13.7081 22.3462C14.3763 20.3124 16.2403 18.8019 18.4442 18.8019Z" fill="#EA4335"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Newsletter and Marketing Preferences */}
            <div className="bg-white rounded-lg md:rounded-2xl shadow-sm border border-gray-100 p-3 md:p-6">
              <h2 className="text-base md:text-xl font-bold text-black mb-3 md:mb-6">Stay Connected</h2>
              <div className="space-y-3 md:space-y-4">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.newsletterSubscription}
                    onChange={(e) => handleInputChange('newsletterSubscription', e.target.checked)}
                    className="mr-3 mt-1 h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                  />
                  <div className="flex-grow">
                    <span className="text-sm font-medium text-gray-700">Subscribe to Newsletter</span>
                    <p className="text-xs text-gray-600 mt-1">
                      Get exclusive offers, new product launches, and fitness tips delivered to your inbox
                    </p>
                  </div>
                </label>
                
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.marketingEmails}
                    onChange={(e) => handleInputChange('marketingEmails', e.target.checked)}
                    className="mr-3 mt-1 h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                  />
                  <div className="flex-grow">
                    <span className="text-sm font-medium text-gray-700">Receive Marketing Communications</span>
                    <p className="text-xs text-gray-600 mt-1">
                      Stay updated with personalized offers, promotions, and product recommendations
                    </p>
                  </div>
                </label>
                
                <div className="text-xs text-gray-500 pt-2">
                  <p>You can unsubscribe at any time. We respect your privacy and will never share your information with third parties.</p>
                </div>
              </div>
            </div>

            {/* Trust Marks */}
            <div className="bg-gray-50 rounded-lg md:rounded-2xl p-3 md:p-6 text-center">
              <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 text-xs md:text-sm text-gray-600 mb-2 md:mb-4">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  <span>SSL Encrypted</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  <span>Fast Delivery</span>
                </div>
              </div>
              <p className="text-xs md:text-sm text-gray-500">
                Easy Returns · 14-day return policy · Free exchanges
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg md:rounded-2xl shadow-sm border border-gray-100 sticky top-32 md:top-24">
              <div className="p-3 md:p-6 border-b border-gray-100 bg-gray-50">
                <h2 className="text-lg md:text-xl font-bold text-black">Order Summary</h2>
              </div>
              
              <div className="p-3 md:p-6 space-y-3 md:space-y-6">
                {/* Cart Items */}
                <div className="space-y-3 md:space-y-4">
                  <h3 className="font-semibold text-black text-sm md:text-base">Items ({cartItems.length})</h3>
                  <div className="space-y-2 md:space-y-3 max-h-48 md:max-h-64 overflow-y-auto">
                    {cartItems.map((item, index) => (
                      <div key={index} className="flex gap-2 md:gap-3">
                        <Link to={getProductDetailPath(item)} className="w-12 h-12 md:w-16 md:h-16 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                          />
                        </Link>
                        <div className="flex-grow min-w-0">
                          <h4 className="font-medium text-xs md:text-sm text-black truncate">{item.name}</h4>
                          <p className="text-xs text-gray-600">
                            {item.size && `Size: ${item.size}`} {item.color && `• Color: ${item.color}`}
                          </p>
                          <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-xs md:text-sm font-medium text-black">
                          {(item.price * item.quantity).toFixed(2)} SEK
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Discount Code */}
                <div className="space-y-2 md:space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Discount code"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="flex-1 px-2 md:px-3 py-2 border border-gray-200 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                    <Button 
                      onClick={applyDiscountCode}
                      variant="outline"
                      size="sm"
                      className="text-xs md:text-sm border-gray-300 hover:bg-gray-50 px-2 md:px-3"
                    >
                      Apply
                    </Button>
                  </div>
                  {discountApplied && (
                    <div className="flex items-center gap-2 text-xs md:text-sm text-green-600">
                      <CheckCircle className="h-3 w-3 md:h-4 md:w-4" />
                      <span>10% discount applied</span>
                    </div>
                  )}
                </div>

                {/* Cost Breakdown */}
                <div className="space-y-2 md:space-y-3">
                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{cartTotal.toFixed(2)} SEK</span>
                  </div>
                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">{shippingCost === 0 ? 'Free' : `${shippingCost} SEK`}</span>
                  </div>
                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="text-gray-600">Tax (25% VAT)</span>
                    <span className="font-medium">{tax.toFixed(2)} SEK</span>
                  </div>
                  {discountApplied && (
                    <div className="flex justify-between text-xs md:text-sm text-green-600">
                      <span>Discount (10%)</span>
                      <span>-{(calculateFinalTotal() * 0.1).toFixed(2)} SEK</span>
                    </div>
                  )}
                </div>
                
                <div className="pt-3 md:pt-4 border-t border-gray-100">
                  <div className="flex justify-between font-bold text-base md:text-lg">
                    <span>Total</span>
                    <span>{calculateFinalTotal().toFixed(2)} SEK</span>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="text-xs text-gray-600 leading-relaxed">
                  <p>
                    By clicking "Complete My Order" I agree to PEAK MODE's{' '}
                    <a href="/terms-of-service" className="underline hover:text-black transition-colors">
                      Terms of Service
                    </a>{' '}
                    and confirm PEAK MODE's{' '}
                    <a href="/privacy-policy" className="underline hover:text-black transition-colors">
                      Privacy Policy
                    </a>
                    . I confirm all third party's{' '}
                    <a href="/data-protection" className="underline hover:text-black transition-colors">
                      data protection information
                    </a>
                    . I also confirm that I have read the{' '}
                    <a href="/cookie-policy" className="underline hover:text-black transition-colors">
                      Cookie Policy
                    </a>
                    .
                  </p>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 md:py-4 bg-black hover:bg-gray-800 text-white font-semibold text-base md:text-lg"
                >
                  {isSubmitting ? 'Processing...' : 'Complete My Order'}
                </Button>
                <p className="text-center text-xs md:text-sm text-gray-500">
                  Your peak is waiting.
                </p>

                {/* Back to Cart */}
                <Button asChild variant="outline" className="w-full py-2 md:py-3 border-gray-300 hover:bg-gray-50">
                  <Link to="/cart" className="flex items-center justify-center gap-2 text-sm md:text-base">
                    <ArrowLeft className="h-3 w-3 md:h-4 md:w-4" />
                    Back to Cart
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Checkout; 