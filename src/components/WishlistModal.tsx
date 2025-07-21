import React, { useState, useEffect } from 'react';
import { X, Heart, ShoppingCart, ArrowRight, Plus, Edit3, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

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

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: WishlistItem) => void;
}

const WishlistModal: React.FC<WishlistModalProps> = ({ isOpen, onClose, onAddToCart }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [wishlistName, setWishlistName] = useState('My Wishlist');

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      loadWishlist();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const loadWishlist = () => {
    const wishlist = localStorage.getItem('wishlist');
    const savedName = localStorage.getItem('wishlistName');
    
    if (wishlist) {
      setWishlistItems(JSON.parse(wishlist));
    }
    
    if (savedName) {
      setWishlistName(savedName);
    }
  };

  const handleRemoveFromWishlist = (itemId: string) => {
    const updatedWishlist = wishlistItems.filter(item => item.id !== itemId);
    setWishlistItems(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    toast.success('Removed from wishlist');
  };

  const handleAddToCartFromWishlist = (item: WishlistItem) => {
    onAddToCart(item);
    toast.success('Added to cart from wishlist');
  };

  const handleSaveWishlistName = () => {
    localStorage.setItem('wishlistName', wishlistName);
    setIsEditing(false);
    toast.success('Wishlist name updated');
  };

  const handleBrowseProducts = () => {
    onClose();
    // Navigate to shop page
    window.location.href = '/shop';
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-2 md:p-4"
      onClick={handleOverlayClick}
    >
      <div 
        className="bg-white w-[280px] md:w-[500px] h-auto min-h-[200px] md:h-72 transform transition-all duration-700 ease-out rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 md:p-5 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-2 md:space-x-3">
            <Heart className="w-5 h-5 md:w-6 md:h-6 text-red-500" />
            <div>
              {isEditing ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={wishlistName}
                    onChange={(e) => setWishlistName(e.target.value)}
                    className="text-lg md:text-xl font-bold border-b border-gray-300 focus:outline-none focus:border-black"
                    autoFocus
                  />
                  <Button
                    size="sm"
                    onClick={handleSaveWishlistName}
                    className="bg-black text-white hover:bg-gray-800 text-xs md:text-sm"
                  >
                    Save
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg md:text-xl font-bold">{wishlistName}</h2>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-gray-500 hover:text-black transition-colors"
                  >
                    <Edit3 className="w-3 h-3 md:w-4 md:h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black transition-colors"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 md:p-5 space-y-3 md:space-y-4 flex-1 overflow-y-auto scrollbar-hide">
          {wishlistItems.length === 0 ? (
            /* Empty Wishlist State */
            <div className="text-center py-4 md:py-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                <Heart className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
              </div>
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1 md:mb-2">
                No Favorites Yet
              </h3>
              <p className="text-xs text-gray-600 mb-3 md:mb-4 max-w-xs mx-auto px-2">
                Tap the heart icon on any product to save it here.
              </p>
              <Button 
                onClick={handleBrowseProducts}
                className="bg-black text-white hover:bg-gray-800 px-3 py-1.5 text-xs"
              >
                Browse Products
                <ArrowRight className="ml-1 w-3 h-3" />
              </Button>
            </div>
          ) : (
            /* Wishlist Items */
            <div>
              {/* Main Heading */}
              <div className="text-center mb-3 md:mb-4">
                <h1 className="text-base md:text-lg font-bold text-gray-900 mb-1">
                  Your Saved Picks
                </h1>
                <p className="text-xs text-gray-600 max-w-sm mx-auto px-2">
                  These are the pieces that spoke to you — ready when you are.
                </p>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 gap-2 md:gap-3">
                {wishlistItems.map((item, index) => (
                  <div 
                    key={item.id} 
                    className="border border-gray-200 rounded-lg p-2 md:p-3 hover:shadow-md transition-shadow"
                  >
                    {/* Product Image */}
                    <div className="relative mb-2 md:mb-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-24 md:h-32 object-cover rounded-lg"
                      />
                      {/* Low Stock Tag (random for demo) */}
                      {Math.random() > 0.7 && (
                        <div className="absolute top-1 left-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                          Low Stock
                        </div>
                      )}
                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveFromWishlist(item.id)}
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
                      >
                        <Trash2 className="w-3 h-3 text-gray-600" />
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-1">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 text-xs md:text-sm">
                        {item.name}
                      </h3>
                      <p className="text-sm md:text-base font-bold text-gray-900">
                        {item.price} {item.currency}
                      </p>
                      
                      {/* Variant Info */}
                      {(item.size || item.color) && (
                        <div className="text-xs text-gray-600">
                          {item.size && <span>Size: {item.size}</span>}
                          {item.size && item.color && <span> • </span>}
                          {item.color && <span>Color: {item.color}</span>}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex space-x-2 pt-1 md:pt-2">
                        <Button
                          onClick={() => handleAddToCartFromWishlist(item)}
                          className="flex-1 bg-black text-white hover:bg-gray-800 text-xs py-1 md:py-1.5"
                        >
                          <ShoppingCart className="w-3 h-3 mr-1" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-600">
                      {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} in your wishlist
                    </p>
                  </div>
                  <Button
                    onClick={handleBrowseProducts}
                    variant="outline"
                    className="border-black text-black hover:bg-black hover:text-white text-xs py-1"
                  >
                    Continue Shopping
                    <ArrowRight className="ml-1 w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishlistModal; 