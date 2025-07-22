import React, { useState, useEffect } from 'react';
import WishlistModal from './WishlistModal';
import { toast } from 'sonner';

interface WishlistItem {
  id: string;
  name: string;
  price: string;
  image: string;
  currency: string;
  size?: string;
  color?: string;
  variant?: string;
}

const GlobalWishlistModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpenWishlist = () => {
      setIsOpen(true);
    };

    // Listen for custom event to open wishlist
    window.addEventListener('openWishlist', handleOpenWishlist);

    return () => {
      window.removeEventListener('openWishlist', handleOpenWishlist);
    };
  }, []);

  const handleAddToCart = (item: WishlistItem) => {
    // Add to cart logic
    const cartItem = {
      id: item.id,
      name: item.name,
      price: parseFloat(item.price.replace(/[^0-9.]/g, '')),
      image: item.image,
      size: item.size || null,
      color: item.color || null,
      quantity: 1,
      currency: item.currency,
      source: 'test'
    };
    
    const existingCart = localStorage.getItem('cart');
    let cartItems = existingCart ? JSON.parse(existingCart) : [];
    
    const existingItemIndex = cartItems.findIndex((cartItem: any) => 
      cartItem.id === item.id && 
      cartItem.size === item.size && 
      cartItem.color === item.color &&
      cartItem.source === 'test'
    );
    
    if (existingItemIndex >= 0) {
      cartItems[existingItemIndex].quantity += 1;
    } else {
      cartItems.push(cartItem);
    }
    
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    // Dispatch custom event to update cart count
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    
    toast.success("Added to cart successfully!");
  };

  return (
    <WishlistModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onAddToCart={handleAddToCart}
    />
  );
};

export default GlobalWishlistModal; 