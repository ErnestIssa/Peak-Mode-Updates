// User Interactions - Local storage and tracking utilities
// This file handles user behavior tracking and form data persistence

// Track recently viewed products
export const trackRecentlyViewed = (productId: string) => {
  try {
    const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    
    // Remove if already exists
    const filtered = recentlyViewed.filter((id: string) => id !== productId);
    
    // Add to beginning
    filtered.unshift(productId);
    
    // Keep only last 10 items
    if (filtered.length > 10) {
      filtered.splice(10);
    }
    
    localStorage.setItem('recentlyViewed', JSON.stringify(filtered));
  } catch (error) {
    console.error('Error tracking recently viewed:', error);
  }
};

// Get recently viewed products
export const getRecentlyViewed = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
  } catch (error) {
    console.error('Error getting recently viewed:', error);
    return [];
  }
};

// Track form data for persistence
export const trackFormData = (formName: string, data: any) => {
  try {
    localStorage.setItem(`formData_${formName}`, JSON.stringify(data));
  } catch (error) {
    console.error('Error tracking form data:', error);
  }
};

// Get saved form data
export const getFormData = (formName: string): any => {
  try {
    const data = localStorage.getItem(`formData_${formName}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting form data:', error);
    return null;
  }
};

// Clear saved form data
export const clearFormData = (formName: string) => {
  try {
    localStorage.removeItem(`formData_${formName}`);
  } catch (error) {
    console.error('Error clearing form data:', error);
  }
};

// Track user preferences
export const trackUserPreference = (key: string, value: any) => {
  try {
    const preferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    preferences[key] = value;
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  } catch (error) {
    console.error('Error tracking user preference:', error);
  }
};

// Get user preferences
export const getUserPreference = (key: string): any => {
  try {
    const preferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    return preferences[key];
  } catch (error) {
    console.error('Error getting user preference:', error);
    return null;
  }
};

// Track cart interactions
export const trackCartInteraction = (action: string, productId?: string) => {
  try {
    const interactions = JSON.parse(localStorage.getItem('cartInteractions') || '[]');
    interactions.push({
      action,
      productId,
      timestamp: new Date().toISOString()
    });
    
    // Keep only last 100 interactions
    if (interactions.length > 100) {
      interactions.splice(0, interactions.length - 100);
    }
    
    localStorage.setItem('cartInteractions', JSON.stringify(interactions));
  } catch (error) {
    console.error('Error tracking cart interaction:', error);
  }
};

// Track page views
export const trackPageView = (page: string) => {
  try {
    const pageViews = JSON.parse(localStorage.getItem('pageViews') || '{}');
    pageViews[page] = (pageViews[page] || 0) + 1;
    localStorage.setItem('pageViews', JSON.stringify(pageViews));
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
}; 