
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus } from 'lucide-react';
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
          <div className="bg-secondary/30 rounded-lg p-8 flex flex-col items-center justify-center text-center">
            <div className="bg-white p-6 rounded-full mb-4">
              <svg className="w-16 h-16 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-xl md:text-2xl font-medium mb-3">
              Your cart is empty
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Looks like you haven't added anything to your cart yet. Browse our collection and find something you'll love.
            </p>
            <Button asChild size="lg" className="px-8">
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="peak-container py-20 min-h-screen">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="border border-border rounded-md">
              <div className="p-4 border-b border-border bg-secondary/30 flex justify-between items-center">
                <h2 className="font-medium">
                  Cart Items ({cartItems.length})
                </h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={clearCart}
                  className="text-xs"
                >
                  Clear Cart
                </Button>
              </div>
              
              <div className="divide-y divide-border">
                {cartItems.map((item, index) => (
                  <div key={`${item.id}-${item.size}-${item.color}-${item.source}`} className="p-4 md:p-6 flex flex-col md:flex-row gap-4">
                    <Link to={getProductDetailPath(item)} className="w-full md:w-24 h-24 bg-secondary/50 relative flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                      {item.source && (
                        <div className="absolute top-0 right-0 bg-white/80 text-black text-xs p-1">
                          {item.source === 'cjdropshipping' ? 'CJ' : 'Test'}
                        </div>
                      )}
                    </Link>
                    
                    <div className="flex-grow flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        {item.size && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Size: {item.size}
                          </p>
                        )}
                        {item.color && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Color: {item.color}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="flex items-center border border-border">
                          <button 
                            className="px-3 py-2 border-r border-border"
                            onClick={() => updateQuantity(index, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-10 text-center py-2">
                            {item.quantity}
                          </span>
                          <button 
                            className="px-3 py-2 border-l border-border"
                            onClick={() => updateQuantity(index, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        
                        <div className="font-medium ml-auto md:ml-0">
                          {(item.price * item.quantity).toFixed(2)} {item.currency}
                        </div>
                        
                        <button 
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          onClick={() => removeItem(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <div className="border border-border rounded-md sticky top-24">
              <div className="p-4 border-b border-border bg-secondary/30">
                <h2 className="font-medium">
                  Order Summary
                </h2>
              </div>
              
              <div className="p-4 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{cartTotal.toFixed(2)} SEK</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>Calculated at checkout</span>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>{cartTotal.toFixed(2)} SEK</span>
                  </div>
                </div>
                
                <Button className="w-full mt-6">
                  Checkout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
