
import { useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const cartIsEmpty = true;
  
  if (cartIsEmpty) {
    return (
      <Layout>
        <div className="peak-container py-20 min-h-screen">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Your Cart</h1>
          
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
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Your Cart</h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="border border-border rounded-md">
              <div className="p-4 border-b border-border bg-secondary/30">
                <h2 className="font-medium">
                  Cart Items (3)
                </h2>
              </div>
              
              <div className="divide-y divide-border">
                {/* Cart items would go here */}
                <div className="p-4">
                  <p>Your cart items will be displayed here.</p>
                </div>
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
                  <span>$0.00</span>
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
                    <span>$0.00</span>
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
