import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Truck, CreditCard, Lock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ProductSource } from '@/models/Product';

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
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  billingSameAsShipping: boolean;
}

const Checkout = () => {
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
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    billingSameAsShipping: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);

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
    
    // Simulate checkout process
    setTimeout(() => {
      toast.success('Order placed successfully! Your peak is waiting.');
      setIsSubmitting(false);
      // Redirect to success page or clear cart
    }, 2000);
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

            {/* Payment Information */}
            <div className="bg-white rounded-lg md:rounded-2xl shadow-sm border border-gray-100 p-3 md:p-6">
              <h2 className="text-base md:text-xl font-bold text-black mb-3 md:mb-6">Payment Information</h2>
              <div className="space-y-3 md:space-y-4">
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
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
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
                      required
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
                      required
                    />
                  </div>
                </div>
                
                {/* Payment Method Logos */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                    <span className="text-xs text-gray-500 font-medium">VISA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                    <span className="text-xs text-gray-500 font-medium">MASTERCARD</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                    <span className="text-xs text-gray-500 font-medium">STRIPE</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                    <span className="text-xs text-gray-500 font-medium">KLARNA</span>
                  </div>
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