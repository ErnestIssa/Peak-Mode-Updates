// Utility functions to track user interactions

export const trackFormData = (formData: any) => {
  sessionStorage.setItem('formData', JSON.stringify(formData));
};

export const clearFormData = () => {
  sessionStorage.removeItem('formData');
};

export const trackRecentlyViewed = (productId: string) => {
  const recentlyViewed = sessionStorage.getItem('recentlyViewed');
  let viewedProducts = recentlyViewed ? JSON.parse(recentlyViewed) : [];
  
  // Add product if not already in list
  if (!viewedProducts.includes(productId)) {
    viewedProducts.unshift(productId);
    // Keep only last 10 products
    viewedProducts = viewedProducts.slice(0, 10);
    sessionStorage.setItem('recentlyViewed', JSON.stringify(viewedProducts));
  }
};

export const hasUserInteractions = (): boolean => {
  // Check for cart items
  const cart = localStorage.getItem('cart');
  const hasCartItems = cart && JSON.parse(cart).length > 0;
  
  // Check for wishlist items
  const wishlist = localStorage.getItem('wishlist');
  const hasWishlistItems = wishlist && JSON.parse(wishlist).length > 0;
  
  // Check for form data
  const hasFormData = sessionStorage.getItem('formData') !== null;
  
  // Check for recently viewed products
  const hasRecentlyViewed = sessionStorage.getItem('recentlyViewed') !== null;
  
  return hasCartItems || hasWishlistItems || hasFormData || hasRecentlyViewed;
};

export const clearUserInteractions = () => {
  sessionStorage.removeItem('formData');
  sessionStorage.removeItem('recentlyViewed');
  // Note: We don't clear cart/wishlist as those are persistent user data
}; 