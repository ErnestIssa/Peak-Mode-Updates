import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Truck, Clock, Instagram, Facebook, Twitter, ArrowRight, Home, ShoppingBag, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface OrderItem {
  id: string;
  name: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  image: string;
}

interface OrderSummary {
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  estimatedDelivery: string;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

const ThankYou = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading order data
    setTimeout(() => {
      // Get cart items from localStorage
      const savedCart = localStorage.getItem('cart');
      const cartItems = savedCart ? JSON.parse(savedCart) : [];
      
      // Get checkout form data from localStorage (if available)
      const checkoutData = localStorage.getItem('checkoutFormData');
      const formData = checkoutData ? JSON.parse(checkoutData) : null;
      
      // Calculate totals
      const subtotal = cartItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
      const shipping = subtotal >= 500 ? 0 : 99; // Free shipping over 500 kr
      const total = subtotal + shipping;
      
      const mockOrderSummary: OrderSummary = {
        orderNumber: `PM-${Date.now().toString().slice(-8)}`,
        items: cartItems.map((item: any) => ({
          id: item.id,
          name: item.name,
          size: item.size || 'N/A',
          color: item.color || 'N/A',
          quantity: item.quantity,
          price: item.price,
          image: item.image
        })),
        subtotal,
        shipping,
        total,
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('sv-SE', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        shippingAddress: formData ? {
          name: `${formData.firstName} ${formData.lastName}`,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country
        } : {
          name: 'John Doe',
          address: 'Storgatan 123',
          city: 'Stockholm',
          postalCode: '111 22',
          country: 'Sweden'
        }
      };
      setOrderSummary(mockOrderSummary);
      setIsLoading(false);
    }, 1000);
  }, []);

  const socialLinks = [
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com/peakmode',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: 'https://facebook.com/peakmode',
      color: 'bg-blue-600'
    },
    {
      name: 'TikTok',
      icon: Instagram, // Using Instagram icon as placeholder for TikTok
      url: 'https://tiktok.com/@peakmode',
      color: 'bg-black'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your order details...</p>
        </div>
      </div>
    );
  }

  if (!orderSummary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No order found</p>
          <Button onClick={() => navigate('/')}>Return to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl font-black tracking-tighter">
              PEAK | MODE
            </Link>
            <Badge variant="outline" className="text-xs">
              Order Confirmed
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Thank You for Your Order!
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Your order has been successfully placed
          </p>
          <p className="text-base text-gray-500">
            Order #{orderSummary.orderNumber}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-primary" />
                  Order Summary
                </h2>
                
                <div className="space-y-3">
                  {orderSummary.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-base">{item.name}</h3>
                        <p className="text-gray-600 text-sm">
                          Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-base">{item.price} kr</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Subtotal</span>
                    <span className="font-semibold text-sm">{orderSummary.subtotal} kr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Shipping</span>
                    <span className="font-semibold text-green-600 text-sm">
                      {orderSummary.shipping === 0 ? 'FREE' : `${orderSummary.shipping} kr`}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-2">
                    <span>Total</span>
                    <span>{orderSummary.total} kr</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <Truck className="w-5 h-5 mr-2 text-primary" />
                  Shipping Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-base mb-2">Shipping Address</h3>
                    <div className="space-y-1 text-gray-600 text-sm">
                      <p>{orderSummary.shippingAddress.name}</p>
                      <p>{orderSummary.shippingAddress.address}</p>
                      <p>{orderSummary.shippingAddress.postalCode} {orderSummary.shippingAddress.city}</p>
                      <p>{orderSummary.shippingAddress.country}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-base mb-2 flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-primary" />
                      Estimated Delivery
                    </h3>
                    <p className="text-base font-semibold text-green-600">
                      {orderSummary.estimatedDelivery}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      You'll receive tracking information via email
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* What's Next */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
              <CardContent className="p-4">
                <h2 className="text-lg font-bold mb-4">What's Next?</h2>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">Order Confirmation Email</h3>
                      <p className="text-xs text-gray-600">Check your inbox for order details</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">Tracking Information</h3>
                      <p className="text-xs text-gray-600">You'll receive tracking details within 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">Your Gear Arrives</h3>
                      <p className="text-xs text-gray-600">Estimated delivery: {orderSummary.estimatedDelivery}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Continue Shopping */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4">
                <h2 className="text-lg font-bold mb-3">Continue Your Journey</h2>
                
                <div className="space-y-3">
                  <Button asChild className="w-full bg-black hover:bg-gray-800">
                    <Link to="/shop">
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Continue Shopping
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/">
                      <Home className="w-4 h-4 mr-2" />
                      Back to Home
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4">
                <h2 className="text-lg font-bold mb-3">Join the Movement</h2>
                <p className="text-gray-600 text-sm mb-3">
                  Follow us for exclusive content, behind-the-scenes, and early access to new drops.
                </p>
                
                <div className="space-y-3">
                  {socialLinks.map((social) => (
                    <Button
                      key={social.name}
                      asChild
                      variant="outline"
                      className="w-full justify-start hover:scale-105 transition-transform"
                    >
                      <a href={social.url} target="_blank" rel="noopener noreferrer">
                        <social.icon className="w-4 h-4 mr-3" />
                        Follow on {social.name}
                        <ArrowRight className="w-4 h-4 ml-auto" />
                      </a>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Review Request */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50">
              <CardContent className="p-4">
                <div className="text-center">
                  <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                  <h3 className="font-bold text-base mb-2">Love Your Gear?</h3>
                  <p className="text-xs text-gray-600 mb-3">
                    Share your experience and help others discover Peak Mode
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/reviews">
                      Write a Review
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 text-center">
          <div className="bg-black text-white p-6 rounded-2xl">
            <h2 className="text-2xl font-bold mb-3">
              Ready for Your Next Level?
            </h2>
            <p className="text-lg text-gray-300 mb-4">
              New drops coming soon. Stay tuned for exclusive releases.
            </p>
            <Button asChild size="lg" className="bg-white text-black hover:bg-gray-100">
              <Link to="/shop">
                Explore Collection
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou; 