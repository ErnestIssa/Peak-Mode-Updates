// Peak Mode API Service
// Centralized API communication layer for backend integration

// Environment-based API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://peakmode-backend.onrender.com';
const VORNIFY_DB_URL = 'https://api.vornify.se/api/vornifydb';
const VORNIFY_PAY_URL = 'https://api.vornify.se/api/vornifypay';
const VORNIFY_EMAIL_URL = 'https://api.vornify.se/api/vornifyemail';

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  subcategory?: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
  stockQuantity?: number;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
}

export interface Cart {
  id: string;
  userId?: string;
  items: CartItem[];
  total: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
}

export interface Order {
  id: string;
  userId?: string;
  items: OrderItem[];
  total: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  orderNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterSubscription {
  id: string;
  email: string;
  name?: string;
  subscribed: boolean;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'pending' | 'replied' | 'closed';
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  children?: Category[];
}

// API Error handling
class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Request helper with error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      0
    );
  }
}

// Products API
export const productsApi = {
  // Get all products
  async getAllProducts(): Promise<Product[]> {
    return apiRequest<Product[]>('/api/products');
  },

  // Get products by category
  async getProductsByCategory(category: string): Promise<Product[]> {
    return apiRequest<Product[]>(`/api/products/category/${category}`);
  },

  // Get single product
  async getProduct(id: string): Promise<Product> {
    return apiRequest<Product>(`/api/products/${id}`);
  },

  // Search products
  async searchProducts(query: string): Promise<Product[]> {
    return apiRequest<Product[]>(`/api/products/search?q=${encodeURIComponent(query)}`);
  },

  // Get featured products
  async getFeaturedProducts(): Promise<Product[]> {
    return apiRequest<Product[]>('/api/products/featured');
  },

  // Get categories
  async getCategories(): Promise<Category[]> {
    return apiRequest<Category[]>('/api/categories');
  },
};

// Cart API
export const cartApi = {
  // Get user's cart
  async getCart(): Promise<Cart> {
    return apiRequest<Cart>('/api/cart');
  },

  // Add item to cart
  async addToCart(item: Omit<CartItem, 'id'>): Promise<Cart> {
    return apiRequest<Cart>('/api/cart/add', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  },

  // Update cart item quantity
  async updateCartItem(itemId: string, quantity: number): Promise<Cart> {
    return apiRequest<Cart>(`/api/cart/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  },

  // Remove item from cart
  async removeFromCart(itemId: string): Promise<Cart> {
    return apiRequest<Cart>(`/api/cart/items/${itemId}`, {
      method: 'DELETE',
    });
  },

  // Clear cart
  async clearCart(): Promise<Cart> {
    return apiRequest<Cart>('/api/cart/clear', {
      method: 'DELETE',
    });
  },
};

// Orders API
export const ordersApi = {
  // Create new order
  async createOrder(orderData: {
    items: OrderItem[];
    shippingAddress: Order['shippingAddress'];
    paymentMethod: string;
    total: number;
  }): Promise<Order> {
    return apiRequest<Order>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  // Get user's orders
  async getUserOrders(): Promise<Order[]> {
    return apiRequest<Order[]>('/api/orders');
  },

  // Get single order
  async getOrder(orderId: string): Promise<Order> {
    return apiRequest<Order>(`/api/orders/${orderId}`);
  },

  // Update order status
  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
    return apiRequest<Order>(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};

// Newsletter API
export const newsletterApi = {
  // Subscribe to newsletter
  async subscribe(email: string, name?: string): Promise<NewsletterSubscription> {
    return apiRequest<NewsletterSubscription>('/api/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email, name }),
    });
  },

  // Unsubscribe from newsletter
  async unsubscribe(email: string): Promise<{ success: boolean }> {
    return apiRequest<{ success: boolean }>('/api/newsletter/unsubscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Check subscription status
  async checkSubscription(email: string): Promise<{ subscribed: boolean }> {
    return apiRequest<{ subscribed: boolean }>(`/api/newsletter/status?email=${encodeURIComponent(email)}`);
  },
};

// Contact API
export const contactApi = {
  // Send contact message
  async sendMessage(messageData: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<ContactMessage> {
    return apiRequest<ContactMessage>('/api/contact', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },

  // Get contact messages (admin only)
  async getMessages(): Promise<ContactMessage[]> {
    return apiRequest<ContactMessage[]>('/api/contact/messages');
  },
};

// User Authentication API (if available)
export const authApi = {
  // Login user
  async login(credentials: { email: string; password: string }): Promise<{ token: string; user: any }> {
    return apiRequest<{ token: string; user: any }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Register user
  async register(userData: { email: string; password: string; name: string }): Promise<{ token: string; user: any }> {
    return apiRequest<{ token: string; user: any }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Logout user
  async logout(): Promise<{ success: boolean }> {
    return apiRequest<{ success: boolean }>('/api/auth/logout', {
      method: 'POST',
    });
  },

  // Get current user
  async getCurrentUser(): Promise<any> {
    return apiRequest<any>('/api/auth/me');
  },
};

// Admin API (for admin panel integration)
export const adminApi = {
  // Get admin configuration
  async getAdminConfig(): Promise<any> {
    return apiRequest<any>('/api/admin/config');
  },

  // Update admin configuration
  async updateAdminConfig(config: any): Promise<any> {
    return apiRequest<any>('/api/admin/config', {
      method: 'PUT',
      body: JSON.stringify(config),
    });
  },

  // Get content by section
  async getContent(section: string): Promise<any> {
    return apiRequest<any>(`/api/admin/content/${section}`);
  },

  // Update content
  async updateContent(section: string, data: any): Promise<any> {
    return apiRequest<any>(`/api/admin/content/${section}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Upload image
  async uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('image', file);
    
    return apiRequest<{ url: string }>('/api/admin/upload/image', {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    });
  },
};

// VornifyDB Integration
export const vornifyDB = {
  // Generic VornifyDB operation
  async operation(collectionName: string, command: string, data: any = {}): Promise<any> {
    try {
      const response = await fetch(VORNIFY_DB_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          database_name: 'VornifyDB',
          collection_name: collectionName,
          command: command,
          data: data
        })
      });

      const result = await response.json();
      
      if (!result.status && !result.success) {
        throw new Error(result.error || 'VornifyDB operation failed');
      }
      
      return result;
    } catch (error) {
      console.error('VornifyDB operation error:', error);
      throw error;
    }
  },

  // Create record
  async create(collectionName: string, data: any): Promise<any> {
    return this.operation(collectionName, '--create', data);
  },

  // Read records
  async read(collectionName: string, filter: any = {}): Promise<any> {
    return this.operation(collectionName, '--read', filter);
  },

  // Update record
  async update(collectionName: string, filter: any, update: any): Promise<any> {
    return this.operation(collectionName, '--update', { filter, update });
  },

  // Delete record
  async delete(collectionName: string, filter: any): Promise<any> {
    return this.operation(collectionName, '--delete', filter);
  },

  // Verify record
  async verify(collectionName: string, data: any): Promise<any> {
    return this.operation(collectionName, '--verify', data);
  },

  // Append data to record
  async append(collectionName: string, existing: any, append: any): Promise<any> {
    return this.operation(collectionName, '--append', { existing, append });
  },

  // Update specific field
  async updateField(collectionName: string, existing: any, field: string, value: any): Promise<any> {
    return this.operation(collectionName, '--update-field', { existing, field, value });
  },

  // Delete specific field
  async deleteField(collectionName: string, existing: any, field: string): Promise<any> {
    return this.operation(collectionName, '--delete-field', { existing, field });
  }
};

// VornifyPay Integration
export const vornifyPay = {
  // Create one-time payment
  async createPayment(paymentData: {
    amount: number;
    currency: string;
    product_data: {
      name: string;
      product_id: string;
      description: string;
      customer_name: string;
      email: string;
      phone?: string;
    };
  }): Promise<any> {
    try {
      const response = await fetch(VORNIFY_PAY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: 'payment',
          data: {
            amount: paymentData.amount,
            currency: paymentData.currency,
            payment_type: 'onetime',
            product_data: paymentData.product_data
          }
        })
      });

      const result = await response.json();
      
      if (!result.status) {
        throw new Error(result.error || 'Payment creation failed');
      }
      
      return result;
    } catch (error) {
      console.error('VornifyPay payment error:', error);
      throw error;
    }
  },

  // Create subscription
  async createSubscription(subscriptionData: {
    customer_email: string;
    amount: string;
    currency: string;
    trial_days?: number;
    billing_interval: 'month' | 'year';
    product_data: {
      name: string;
      description: string;
      customer_name: string;
      features?: string[];
      metadata?: any;
    };
  }): Promise<any> {
    try {
      const response = await fetch(VORNIFY_PAY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: 'create_subscription',
          data: subscriptionData
        })
      });

      const result = await response.json();
      
      if (!result.status) {
        throw new Error(result.error || 'Subscription creation failed');
      }
      
      return result;
    } catch (error) {
      console.error('VornifyPay subscription error:', error);
      throw error;
    }
  },

  // Verify payment
  async verifyPayment(paymentIntentId: string): Promise<any> {
    try {
      const response = await fetch(VORNIFY_PAY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: 'verify',
          data: {
            payment_intent_id: paymentIntentId
          }
        })
      });

      const result = await response.json();
      
      if (!result.status) {
        throw new Error(result.error || 'Payment verification failed');
      }
      
      return result;
    } catch (error) {
      console.error('VornifyPay verification error:', error);
      throw error;
    }
  }
};

// Utility functions
export const apiUtils = {
  // Get API base URL
  getBaseUrl(): string {
    return API_BASE_URL;
  },

  // Check if API is available
  async healthCheck(): Promise<boolean> {
    try {
      await apiRequest('/api/health');
      return true;
    } catch {
      return false;
    }
  },

  // Handle API errors gracefully
  handleError(error: unknown): string {
    if (error instanceof ApiError) {
      return error.message;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return 'An unexpected error occurred';
  },
};

// Export everything
export default {
  products: productsApi,
  cart: cartApi,
  orders: ordersApi,
  newsletter: newsletterApi,
  contact: contactApi,
  auth: authApi,
  admin: adminApi,
  vornifyDB,
  vornifyPay,
  utils: apiUtils,
}; 