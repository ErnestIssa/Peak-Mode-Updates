import React, { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { ProductSource } from '@/models/Product';
import { toast } from 'sonner';

interface ProductCardProps {
  id: string;
  originalId: string;
  name: string;
  price: string;
  currency: string;
  category: string;
  image: string;
  isNew?: boolean;
  source: ProductSource;
}

const ProductCard = memo(({ 
  id, 
  originalId, 
  name, 
  price, 
  currency, 
  category, 
  image, 
  isNew = false, 
  source 
}: ProductCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Get existing cart items
    const existingCart = localStorage.getItem('cart');
    const cartItems = existingCart ? JSON.parse(existingCart) : [];
    
    // Check if item already exists in cart
    const existingItemIndex = cartItems.findIndex((item: any) => 
      item.id === id && item.source === source
    );
    
    if (existingItemIndex >= 0) {
      // Update quantity
      cartItems[existingItemIndex].quantity += 1;
    } else {
      // Add new item
      cartItems.push({
        id,
        originalId,
        name,
        price: parseFloat(price.replace(/[^\d.]/g, '')),
        image,
        size: null,
        color: null,
        quantity: 1,
        currency,
        source
      });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    // Dispatch custom event to notify cart updates
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cartItems }));
    
    toast.success(`${name} added to cart`);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const getProductDetailPath = () => {
    if (source === 'cjdropshipping') {
      return `/cj-product/${id}`;
    }
    return `/product/${id}`;
  };

  return (
    <Link 
      to={getProductDetailPath()}
      className="group block"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 rounded-lg">
        {/* Loading skeleton */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        
        {/* Error fallback */}
        {imageError && (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
            <div className="text-gray-400 text-sm">Image unavailable</div>
          </div>
        )}
        
        {/* Product image */}
        <img
          src={image}
          alt={name}
          className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        
        {/* New tag */}
        {isNew && (
          <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded-full font-bold">
            NEW
          </div>
        )}
        
        {/* Action buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleWishlistToggle}
            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
            title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart 
              className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
            />
          </button>
          
          <button
            onClick={handleAddToCart}
            className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors shadow-lg"
            title="Add to cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
          
          <Link
            to={getProductDetailPath()}
            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
            title="Quick view"
          >
            <Eye className="w-4 h-4 text-gray-600" />
          </Link>
        </div>
      </div>
      
      {/* Product info */}
      <div className="p-2 sm:p-3">
        <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1 line-clamp-2 group-hover:text-black transition-colors">
          {name}
        </h3>
        <p className="text-sm text-gray-600 mb-1">{category}</p>
        <p className="font-bold text-sm sm:text-base text-black">{price}</p>
      </div>
    </Link>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
