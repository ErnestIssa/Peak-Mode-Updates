// Admin Service for Content Management
// This service handles all admin-related operations and content management

import { defaultAdminConfig, AdminConfig, ContentUpdate, ADMIN_API_ENDPOINTS } from './adminConfig';

// Cache for admin configuration
let adminConfigCache: AdminConfig | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export class AdminService {
  private static instance: AdminService;
  private baseUrl: string = import.meta.env.VITE_API_BASE_URL || 'https://peakmode-backend.onrender.com';

  private constructor() {}

  public static getInstance(): AdminService {
    if (!AdminService.instance) {
      AdminService.instance = new AdminService();
    }
    return AdminService.instance;
  }

  // Get admin configuration (with caching)
  async getAdminConfig(): Promise<AdminConfig> {
    const now = Date.now();
    
    // Return cached config if still valid
    if (adminConfigCache && (now - lastFetchTime) < CACHE_DURATION) {
      return adminConfigCache;
    }

    try {
      // In production, this would fetch from the backend
      // For now, return default config
      const response = await this.fetchWithAuth(`${this.baseUrl}${ADMIN_API_ENDPOINTS.GET_SETTINGS}`);
      
      if (response.ok) {
        const config = await response.json();
        adminConfigCache = config;
        lastFetchTime = now;
        return config;
      } else {
        // Fallback to default config
        console.warn('Failed to fetch admin config, using default');
        return defaultAdminConfig;
      }
    } catch (error) {
      console.error('Error fetching admin config:', error);
      return defaultAdminConfig;
    }
  }

  // Update admin configuration
  async updateAdminConfig(updates: Partial<AdminConfig>): Promise<boolean> {
    try {
      const response = await this.fetchWithAuth(`${this.baseUrl}${ADMIN_API_ENDPOINTS.UPDATE_SETTINGS}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        // Invalidate cache
        adminConfigCache = null;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating admin config:', error);
      return false;
    }
  }

  // Get specific content section
  async getContent(section: string): Promise<any> {
    try {
      const response = await this.fetchWithAuth(`${this.baseUrl}${ADMIN_API_ENDPOINTS.GET_CONTENT}/${section}`);
      
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error(`Error fetching content for ${section}:`, error);
      return null;
    }
  }

  // Update specific content section
  async updateContent(section: string, data: any): Promise<boolean> {
    try {
      const response = await this.fetchWithAuth(`${this.baseUrl}${ADMIN_API_ENDPOINTS.UPDATE_CONTENT}/${section}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Invalidate cache
        adminConfigCache = null;
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error updating content for ${section}:`, error);
      return false;
    }
  }

  // Get products (for admin management)
  async getProducts(): Promise<any[]> {
    try {
      const response = await this.fetchWithAuth(`${this.baseUrl}${ADMIN_API_ENDPOINTS.GET_PRODUCTS}`);
      
      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  // Create new product
  async createProduct(productData: any): Promise<boolean> {
    try {
      const response = await this.fetchWithAuth(`${this.baseUrl}${ADMIN_API_ENDPOINTS.CREATE_PRODUCT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      return response.ok;
    } catch (error) {
      console.error('Error creating product:', error);
      return false;
    }
  }

  // Update product
  async updateProduct(productId: string, productData: any): Promise<boolean> {
    try {
      const response = await this.fetchWithAuth(`${this.baseUrl}${ADMIN_API_ENDPOINTS.UPDATE_PRODUCT.replace(':id', productId)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      return response.ok;
    } catch (error) {
      console.error('Error updating product:', error);
      return false;
    }
  }

  // Delete product
  async deleteProduct(productId: string): Promise<boolean> {
    try {
      const response = await this.fetchWithAuth(`${this.baseUrl}${ADMIN_API_ENDPOINTS.DELETE_PRODUCT.replace(':id', productId)}`, {
        method: 'DELETE',
      });

      return response.ok;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  }

  // Get categories
  async getCategories(): Promise<any[]> {
    try {
      const response = await this.fetchWithAuth(`${this.baseUrl}${ADMIN_API_ENDPOINTS.GET_CATEGORIES}`);
      
      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  // Upload image
  async uploadImage(file: File): Promise<string | null> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await this.fetchWithAuth(`${this.baseUrl}${ADMIN_API_ENDPOINTS.UPLOAD_IMAGE}`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        return result.url;
      }
      return null;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  }

  // Get orders
  async getOrders(): Promise<any[]> {
    try {
      const response = await this.fetchWithAuth(`${this.baseUrl}${ADMIN_API_ENDPOINTS.GET_ORDERS}`);
      
      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  }

  // Update order status
  async updateOrder(orderId: string, orderData: any): Promise<boolean> {
    try {
      const response = await this.fetchWithAuth(`${this.baseUrl}${ADMIN_API_ENDPOINTS.UPDATE_ORDER.replace(':id', orderId)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      return response.ok;
    } catch (error) {
      console.error('Error updating order:', error);
      return false;
    }
  }

  // Get analytics data
  async getAnalytics(): Promise<any> {
    try {
      const response = await this.fetchWithAuth(`${this.baseUrl}${ADMIN_API_ENDPOINTS.GET_ANALYTICS}`);
      
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return null;
    }
  }

  // Clear cache
  clearCache(): void {
    adminConfigCache = null;
    lastFetchTime = 0;
  }

  // Helper method for authenticated requests
  private async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const token = this.getAuthToken();
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    return fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });
  }

  // Get authentication token
  private getAuthToken(): string | null {
    return localStorage.getItem('adminToken');
  }

  // Set authentication token
  setAuthToken(token: string): void {
    localStorage.setItem('adminToken', token);
  }

  // Remove authentication token
  removeAuthToken(): void {
    localStorage.removeItem('adminToken');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

// Export singleton instance
export const adminService = AdminService.getInstance();

// Content management hooks for React components
export const useAdminContent = () => {
  const getContent = async (section: string) => {
    return await adminService.getContent(section);
  };

  const updateContent = async (section: string, data: any) => {
    return await adminService.updateContent(section, data);
  };

  return { getContent, updateContent };
};

// Site settings hooks
export const useSiteSettings = () => {
  const getSettings = async () => {
    const config = await adminService.getAdminConfig();
    return config.siteSettings;
  };

  const updateSettings = async (settings: any) => {
    return await adminService.updateAdminConfig({ siteSettings: settings });
  };

  return { getSettings, updateSettings };
};

// Product management hooks
export const useProductManagement = () => {
  const getProducts = async () => {
    return await adminService.getProducts();
  };

  const createProduct = async (productData: any) => {
    return await adminService.createProduct(productData);
  };

  const updateProduct = async (productId: string, productData: any) => {
    return await adminService.updateProduct(productId, productData);
  };

  const deleteProduct = async (productId: string) => {
    return await adminService.deleteProduct(productId);
  };

  return { getProducts, createProduct, updateProduct, deleteProduct };
}; 