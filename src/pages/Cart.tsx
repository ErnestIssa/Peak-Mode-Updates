
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus, ArrowLeft, Shield, Truck, CreditCard } from 'lucide-react';
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

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [discountCode, setDiscountCode] = useState('');
  
  useEffect(() => {
    window.scrollTo(0, 0);
    loadCartItems();
    

  }, []);
  
  const loadCartItems = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const items = JSON.parse(savedCart);
      setCartItems(items);
      
      // Calculate total
      const total = items.reduce((sum: number, item: CartItem) => {
        return sum + (item.price * item.quantity);
      }, 0);
      
      setCartTotal(total);
    }
  };
  
  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedItems = [...cartItems];
    updatedItems[index].quantity = newQuantity;
    
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
    
    // Recalculate total
    const total = updatedItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    
    setCartTotal(total);
  };
  
  const removeItem = (index: number) => {
    const updatedItems = [...cartItems];
    updatedItems.splice(index, 1);
    
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
    
    // Recalculate total
    const total = updatedItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    
    setCartTotal(total);
    
    toast.success("Item removed from cart");
  };
  
  const clearCart = () => {
    setCartItems([]);
    setCartTotal(0);
    localStorage.removeItem('cart');
    toast.success("Cart cleared");
  };

  const applyDiscountCode = () => {
    // Placeholder for discount logic
    toast.info("Discount code feature coming soon!");
  };

  // Get product detail URL based on source
  const getProductDetailPath = (item: CartItem) => {
    if (item.source === 'cjdropshipping') {
      return `/cj-product/${item.id}`;
    }
    return `/product/${item.id}`;
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
              Ready to elevate your mindset? Browse our collection and find the gear that matches your ambition.
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
      <div className="peak-container py-8 md:py-20 min-h-screen max-w-7xl mx-auto">

        {/* Cart Header */}
        <div className="text-center mb-8 md:mb-16 mt-16 md:mt-24">
          <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-black mb-2 md:mb-4">
            Your Cart — Ready to Elevate?
          </h1>
          <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            You're one step away from wearing the mindset. Let's finish strong.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg md:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-3 md:p-6 border-b border-gray-100 bg-gray-50">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-black">
                    Cart Items ({cartItems.length})
                  </h2>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={clearCart}
                    className="text-sm border-gray-300 hover:bg-gray-50"
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>
              
              <div className="divide-y divide-gray-100">
                {cartItems.map((item, index) => (
                  <div key={`${item.id}-${item.size}-${item.color}-${item.source}`} className="p-3 md:p-6 flex flex-col md:flex-row gap-3 md:gap-6">
                    <Link to={getProductDetailPath(item)} className="w-full md:w-24 lg:w-32 h-20 md:h-32 bg-gray-50 rounded-lg relative flex-shrink-0 overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      {item.source && (
                        <div className="absolute top-2 right-2 bg-white/90 text-black text-xs px-2 py-1 rounded-full font-medium">
                          {item.source === 'cjdropshipping' ? 'CJ' : 'Test'}
                        </div>
                      )}
                    </Link>
                    
                    <div className="flex-grow flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-grow">
                        <h3 className="font-bold text-lg text-black mb-2">{item.name}</h3>
                        <div className="space-y-1">
                          {item.size && (
                            <p className="text-xs md:text-sm text-gray-600">
                              Size: <span className="font-medium">{item.size}</span>
                            </p>
                          )}
                          {item.color && (
                            <p className="text-xs md:text-sm text-gray-600">
                              Color: <span className="font-medium">{item.color}</span>
                            </p>
                          )}
                        </div>
                        <p className="text-base md:text-lg font-bold text-black mt-1 md:mt-2">
                          {(item.price * item.quantity).toFixed(2)} {item.currency}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 md:gap-4">
                        <div className="flex items-center border border-gray-200 rounded-lg">
                          <button 
                            className="px-2 md:px-3 py-1 md:py-2 hover:bg-gray-50 transition-colors"
                            onClick={() => updateQuantity(index, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3 md:h-4 md:w-4" />
                          </button>
                          <span className="w-8 md:w-12 text-center py-1 md:py-2 font-medium text-sm md:text-base">
                            {item.quantity}
                          </span>
                          <button 
                            className="px-2 md:px-3 py-1 md:py-2 hover:bg-gray-50 transition-colors"
                            onClick={() => updateQuantity(index, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3 md:h-4 md:w-4" />
                          </button>
                        </div>
                        
                        <button 
                          className="text-gray-400 hover:text-red-500 transition-colors p-1 md:p-2"
                          onClick={() => removeItem(index)}
                        >
                          <Trash2 className="h-4 w-4 md:h-5 md:w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Motivational Message */}
            <div className="mt-6 md:mt-8 bg-gradient-to-r from-black to-gray-800 text-white rounded-lg md:rounded-2xl p-4 md:p-8 text-center">
              <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-3">
                You're one step away from wearing the mindset.
              </h3>
              <p className="text-sm md:text-lg text-gray-200">
                Let's finish strong.
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="mt-6 md:mt-8 bg-white rounded-lg md:rounded-2xl p-4 md:p-6 border border-gray-100">
              <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
                <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                  <Shield className="h-3 w-3 md:h-4 md:w-4" />
                  <span>Secure checkout, encrypted and trusted.</span>
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                  <div className="flex items-center gap-1 md:gap-2">
                    <CreditCard className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                    <span className="text-xs text-gray-500 font-medium">VISA</span>
                  </div>
                  <div className="flex items-center gap-1 md:gap-2">
                    <CreditCard className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                    <span className="text-xs text-gray-500 font-medium">MASTERCARD</span>
                  </div>
                  <div className="flex items-center gap-1 md:gap-2">
                    <CreditCard className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                    <span className="text-xs text-gray-500 font-medium">STRIPE</span>
                  </div>
                  <div className="flex items-center gap-1 md:gap-2">
                    <CreditCard className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                    <span className="text-xs text-gray-500 font-medium">KLARNA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg md:rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <div className="p-3 md:p-6 border-b border-gray-100 bg-gray-50">
                <h2 className="text-lg md:text-xl font-bold text-black">
                  Order Summary
                </h2>
              </div>
              
              <div className="p-3 md:p-6 space-y-3 md:space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{cartTotal.toFixed(2)} SEK</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-500">Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-500">Calculated at checkout</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{cartTotal.toFixed(2)} SEK</span>
                  </div>
                </div>

                {/* Discount Code */}
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Discount code"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                    <Button 
                      onClick={applyDiscountCode}
                      variant="outline"
                      size="sm"
                      className="text-sm border-gray-300 hover:bg-gray-50"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button asChild className="w-full py-3 bg-black hover:bg-gray-800 text-white font-semibold">
                    <Link to="/checkout">
                      Proceed to Checkout
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" className="w-full py-3 border-gray-300 hover:bg-gray-50">
                    <Link to="/shop" className="flex items-center justify-center gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      Continue Shopping
                    </Link>
                  </Button>
                </div>

                {/* Trust Badge */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <Shield className="h-3 w-3" />
                    <span>SSL Encrypted · Secure Checkout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
