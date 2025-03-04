
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { cn } from '@/lib/utils';
import { Minus, Plus, X, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

// Sample cart data - in a real app, this would come from a state management solution
const initialCartItems = [
  {
    id: 1,
    name: "Performance Tech Tee",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    size: "M",
    color: "Black",
    quantity: 1
  },
  {
    id: 2,
    name: "Compression Leggings",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    size: "L",
    color: "Navy",
    quantity: 2
  }
];

const Cart = () => {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState(initialCartItems);
  
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  
  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
    toast({
      title: "Item Removed",
      description: "Item has been removed from your cart.",
    });
  };
  
  const clearCart = () => {
    setCartItems([]);
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart.",
    });
  };
  
  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-32 pb-16">
        <div className="peak-container">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Your Cart</h1>
          
          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="h-16 w-16 mx-auto text-foreground/50" />
              <h2 className="text-2xl font-medium mt-4">Your cart is empty</h2>
              <p className="text-foreground/60 mt-2">Looks like you haven't added any items to your cart yet.</p>
              <Link
                to="/shop"
                className="inline-block mt-8 px-8 py-3 bg-black text-white font-medium hover:bg-black/90 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white border border-border">
                  <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-border bg-secondary/50 font-medium">
                    <div className="col-span-6">Product</div>
                    <div className="col-span-2 text-center">Price</div>
                    <div className="col-span-2 text-center">Quantity</div>
                    <div className="col-span-2 text-center">Total</div>
                  </div>
                  
                  {cartItems.map((item) => (
                    <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b border-border items-center">
                      {/* Product Info */}
                      <div className="col-span-6 flex items-center">
                        <div className="w-20 h-20 flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="ml-4">
                          <h3 className="font-medium">{item.name}</h3>
                          <div className="text-sm text-foreground/70 mt-1">
                            <span>Size: {item.size}</span>
                            <span className="mx-2">|</span>
                            <span>Color: {item.color}</span>
                          </div>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-sm text-foreground/70 hover:text-red-600 transition-colors mt-2 flex items-center md:hidden"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Remove
                          </button>
                        </div>
                      </div>
                      
                      {/* Price - Mobile & Desktop */}
                      <div className="md:col-span-2 md:text-center flex justify-between md:block">
                        <span className="md:hidden">Price:</span>
                        <span>${item.price.toFixed(2)}</span>
                      </div>
                      
                      {/* Quantity - Mobile & Desktop */}
                      <div className="md:col-span-2 md:text-center flex justify-between md:block">
                        <span className="md:hidden">Quantity:</span>
                        <div className="flex items-center border border-border md:justify-center">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-1 hover:bg-secondary transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-10 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1 hover:bg-secondary transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Total - Mobile & Desktop */}
                      <div className="md:col-span-2 md:text-center flex justify-between md:block items-center">
                        <span className="md:hidden">Total:</span>
                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-foreground/70 hover:text-red-600 transition-colors hidden md:inline-block ml-2"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="p-4 flex justify-between">
                    <button
                      onClick={clearCart}
                      className="text-sm text-foreground/70 hover:text-foreground transition-colors"
                    >
                      Clear Cart
                    </button>
                    <Link
                      to="/shop"
                      className="text-sm text-foreground/70 hover:text-foreground transition-colors"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white border border-border p-6">
                  <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (8%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="h-px bg-border my-4"></div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <button
                    className="w-full mt-6 py-3 bg-black text-white font-medium hover:bg-black/90 transition-colors"
                  >
                    Proceed to Checkout
                  </button>
                  
                  <div className="mt-6">
                    <h3 className="font-medium mb-2">We Accept</h3>
                    <div className="flex space-x-2">
                      <div className="w-10 h-6 bg-secondary"></div>
                      <div className="w-10 h-6 bg-secondary"></div>
                      <div className="w-10 h-6 bg-secondary"></div>
                      <div className="w-10 h-6 bg-secondary"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Cart;
