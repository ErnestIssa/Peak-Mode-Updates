import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ShoppingCart, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ProductSource } from '@/models/Product';

interface ProductCardProps {
  id: string | number;
  image: string;
  name: string;
  price: string;
  currency?: string;
  category: string;
  isNew?: boolean;
  source?: ProductSource;
  originalId?: string | number;
  onWishlistClick?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  image,
  name,
  price,
  currency = 'SEK',
  category,
  isNew = false,
  source = 'printful',
  originalId,
  onWishlistClick,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Check if product is already in wishlist on component mount
  useEffect(() => {
    const wishlist = localStorage.getItem('wishlist');
    if (wishlist) {
      const wishlistItems = JSON.parse(wishlist);
      const existingItem = wishlistItems.find((item: any) => item.id === (originalId || id));
      setIsWishlisted(!!existingItem);
    }
  }, [id, originalId]);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const wishlist = localStorage.getItem('wishlist');
    let wishlistItems = wishlist ? JSON.parse(wishlist) : [];
    
    const existingItem = wishlistItems.find((item: any) => item.id === (originalId || id));
    
    if (existingItem) {
      // Remove from wishlist
      wishlistItems = wishlistItems.filter((item: any) => item.id !== (originalId || id));
      setIsWishlisted(false);
      toast.success("Removed from wishlist");
    } else {
      // Add to wishlist
      wishlistItems.push({
        id: originalId || id,
        name: name,
        price: price,
        image: image,
        currency: currency,
        category: category,
        source: source
      });
      setIsWishlisted(true);
      toast.success("Added to wishlist");
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    
    // Dispatch custom event to update wishlist count
    window.dispatchEvent(new CustomEvent('wishlistUpdated'));
    
    // Call the parent's onWishlistClick if provided
    onWishlistClick?.();
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product detail page
    
    const cartItem = {
      id: originalId || id,
      name: name,
      price: parseFloat(price.replace(/[^0-9.]/g, '')),
      image: image,
      size: null, // Default values since quick add doesn't specify size/color
      color: null,
      quantity: 1,
      currency: currency,
      source: source
    };
    
    const existingCart = localStorage.getItem('cart');
    let cartItems = existingCart ? JSON.parse(existingCart) : [];
    
    const existingItemIndex = cartItems.findIndex((item: any) => 
      item.id === cartItem.id && 
      item.size === cartItem.size && 
      item.color === cartItem.color &&
      item.source === cartItem.source
    );
    
    if (existingItemIndex >= 0) {
      cartItems[existingItemIndex].quantity += 1;
    } else {
      cartItems.push(cartItem);
    }
    
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    toast.success("Added to cart successfully!");
  };

  const getProductDetailPath = () => {
    if (source === 'cjdropshipping') {
      return `/cj-product/${originalId || id}`;
    } else if (source === 'test') {
      return `/product/${originalId || id}`;
    }
    return `/product/${originalId || id}`;
  };

  const displayPrice = price.includes(currency) ? price : `${price} ${currency}`;

  return (
    <div 
      className="product-card flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={getProductDetailPath()} className="relative block w-full aspect-[3/4]">
        {/* Product Image */}
        <div className="w-full h-full bg-secondary/50"></div>
        <img
          src={image}
          alt={name}
          className={cn(
            "absolute inset-0 w-full h-full object-contain transition-all duration-700",
            imageLoaded ? "opacity-100 blur-0" : "opacity-0 blur-sm",
            isHovered ? "scale-105" : "scale-100"
          )}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* New Tag */}
        {isNew && (
          <div className="absolute top-1 md:top-2 left-1 md:left-2 bg-black text-white text-xs uppercase tracking-wider py-0.5 md:py-1 px-1.5 md:px-2">
            New
          </div>
        )}
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={cn(
            "absolute top-1 md:top-2 right-1 md:right-2 rounded-full p-1.5 md:p-2 shadow-md transition-colors z-10",
            isWishlisted 
              ? "bg-red-500 hover:bg-red-600" 
              : "bg-white hover:bg-gray-100"
          )}
        >
          <Heart 
            className={cn(
              "w-3 h-3 md:w-4 md:h-4 transition-colors",
              isWishlisted ? "text-white fill-white" : "text-gray-600"
            )} 
          />
        </button>
        
        {/* Quick Add */}
        <button 
          onClick={handleQuickAdd}
          className={cn(
            "absolute bottom-0 left-0 right-0 bg-black text-white py-2 flex justify-center items-center space-x-2 transition-all duration-300",
            isHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
          )}
        >
          <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="text-xs sm:text-sm font-medium">Quick Add</span>
        </button>
      </Link>
      
      <div className="p-2 md:p-3 flex flex-col flex-grow">
        <span className="text-xs text-foreground/60 uppercase tracking-wider truncate">{category}</span>
        <h3 className="mt-0.5 font-medium text-xs md:text-sm lg:text-base line-clamp-2">{name}</h3>
        <div className="mt-auto pt-1 md:pt-2 flex justify-between items-center">
          <span className="font-medium text-xs md:text-sm lg:text-base">{displayPrice}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
