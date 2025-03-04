
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Minus, Plus, X, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from "sonner";

// Type for cart items
interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  currency: string;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // Load cart items from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error("Failed to parse cart data:", error);
        toast({
          title: "Error",
          description: "Failed to load your cart. It may be corrupted.",
        });
      }
    }
  }, []);
  
  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);
  
  const updateQuantity = (id: number, size: string, color: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(items => 
      items.map(item => 
        (item.id === id && item.size === size && item.color === color) 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };
  
  const removeItem = (id: number, size: string, color: string) => {
    setCartItems(items => items.filter(item => 
      !(item.id === id && item.size === size && item.color === color)
    ));
    
    toast({
      title: "Item Removed",
      description: "Item has been removed from your cart.",
    });
  };
  
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
    
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
                  
                  {cartItems.map((item, index) => (
                    <div key={`${item.id}-${item.size}-${item.color}-${index}`} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b border-border items-center">
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
                            onClick={() => removeItem(item.id, item.size, item.color)}
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
                        <span>{item.price.toFixed(2)} {item.currency}</span>
                      </div>
                      
                      {/* Quantity - Mobile & Desktop */}
                      <div className="md:col-span-2 md:text-center flex justify-between md:block">
                        <span className="md:hidden">Quantity:</span>
                        <div className="flex items-center border border-border md:justify-center">
                          <button
                            onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                            className="px-3 py-1 hover:bg-secondary transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-10 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                            className="px-3 py-1 hover:bg-secondary transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Total - Mobile & Desktop */}
                      <div className="md:col-span-2 md:text-center flex justify-between md:block items-center">
                        <span className="md:hidden">Total:</span>
                        <span className="font-medium">{(item.price * item.quantity).toFixed(2)} {item.currency}</span>
                        <button
                          onClick={() => removeItem(item.id, item.size, item.color)}
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
