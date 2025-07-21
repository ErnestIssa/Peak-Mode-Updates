import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const useReloadNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleBeforeUnload = () => {
      // Store current location before reload
      sessionStorage.setItem('lastLocation', location.pathname);
    };

    const handleLoad = () => {
      // Check if this is a page reload (not a navigation)
      const isReload = performance.navigation.type === 1;
      
      if (isReload) {
        // Check for user interactions that should preserve the page
        const hasUserInteractions = checkForUserInteractions();
        
        if (!hasUserInteractions) {
          // Navigate to homepage if no user interactions
          navigate('/', { replace: true });
        }
      }
    };

    // Check for user interactions
    const checkForUserInteractions = (): boolean => {
      // Check for cart items
      const cart = localStorage.getItem('cart');
      const hasCartItems = cart && JSON.parse(cart).length > 0;
      
      // Check for wishlist items
      const wishlist = localStorage.getItem('wishlist');
      const hasWishlistItems = wishlist && JSON.parse(wishlist).length > 0;
      
      // Check for form data (contact forms, review forms, etc.)
      const hasFormData = sessionStorage.getItem('formData') !== null;
      
      // Check for product interactions (viewed products, etc.)
      const hasProductInteractions = sessionStorage.getItem('recentlyViewed') !== null;
      
      // Check if user is on a product detail page (they might be interested)
      const isOnProductPage = location.pathname.includes('/product/');
      
      // Check if user is on cart or checkout pages
      const isOnShoppingPages = ['/cart', '/checkout'].includes(location.pathname);
      
      // Check if user is on review or contact pages (they might be filling forms)
      const isOnInteractivePages = ['/reviews', '/contact', '/faq'].includes(location.pathname);
      
      return (
        hasCartItems ||
        hasWishlistItems ||
        hasFormData ||
        hasProductInteractions ||
        isOnProductPage ||
        isOnShoppingPages ||
        isOnInteractivePages
      );
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('load', handleLoad);

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('load', handleLoad);
    };
  }, [navigate, location.pathname]);
}; 