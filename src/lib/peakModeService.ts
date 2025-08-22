// Peak Mode Service - Main Service Layer
// Integrates with backend API with fallback to local data

import { api } from './api';
import { localService } from './localService';

// Configuration
const USE_BACKEND = import.meta.env.VITE_ENABLE_MOCK_DATA !== 'true';
const API_TIMEOUT = 5000; // 5 seconds
const IS_DEVELOPMENT = import.meta.env.DEV;

// Helper function to check if backend is available
async function isBackendAvailable(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    
    await api.health.check();
    clearTimeout(timeoutId);
    return true;
  } catch (error) {
    // Only log warnings in development
    if (IS_DEVELOPMENT) {
      console.warn('Backend not available, falling back to local data:', error);
    }
    return false;
  }
}

// Helper function for safe logging
const safeLog = (level: 'warn' | 'error', message: string, error?: any) => {
  if (IS_DEVELOPMENT) {
    if (level === 'warn') {
      console.warn(message, error);
    } else {
      console.error(message, error);
    }
  }
};

// Product Service
export const productService = {
  async getAllProducts() {
    if (USE_BACKEND) {
      try {
        const backendAvailable = await isBackendAvailable();
        if (backendAvailable) {
          const result = await api.db.products.getAll();
          return result.data || [];
        }
      } catch (error) {
        safeLog('warn', 'Backend product fetch failed, using local data:', error);
      }
    }
    
    // Fallback to local data
    return localService.products.getAll();
  },
  
  async getProductById(id: string) {
    if (USE_BACKEND) {
      try {
        const backendAvailable = await isBackendAvailable();
        if (backendAvailable) {
          const result = await api.db.products.getById(id);
          return result.data?.[0] || null;
        }
      } catch (error) {
        safeLog('warn', 'Backend product fetch failed, using local data:', error);
      }
    }
    
    // Fallback to local data
    return localService.products.getById(id);
  },
  
  async createProduct(data: any) {
    if (USE_BACKEND) {
      try {
        const backendAvailable = await isBackendAvailable();
        if (backendAvailable) {
          const result = await api.db.products.create(data);
          return result.data;
        }
      } catch (error) {
        safeLog('warn', 'Backend product creation failed, using local data:', error);
      }
    }
    
    // Fallback to local data
    return localService.products.create(data);
  },
  
  async updateProduct(id: string, data: any) {
    if (USE_BACKEND) {
      try {
        const backendAvailable = await isBackendAvailable();
        if (backendAvailable) {
          const result = await api.db.products.update(id, data);
          return result.data;
        }
      } catch (error) {
        safeLog('warn', 'Backend product update failed, using local data:', error);
      }
    }
    
    // Fallback to local data
    return localService.products.update(id, data);
  },
  
  async deleteProduct(id: string) {
    if (USE_BACKEND) {
      try {
        const backendAvailable = await isBackendAvailable();
        if (backendAvailable) {
          const result = await api.db.products.delete(id);
          return result.success;
        }
      } catch (error) {
        safeLog('warn', 'Backend product deletion failed, using local data:', error);
      }
    }
    
    // Fallback to local data
    return localService.products.delete(id);
  }
};

// Cart Service
export const cartService = {
  async getCart(userId?: string) {
    if (USE_BACKEND && userId) {
      try {
        const backendAvailable = await isBackendAvailable();
        if (backendAvailable) {
          const result = await api.db.carts.getByUser(userId);
          return result.data?.[0] || { items: [] };
        }
      } catch (error) {
        safeLog('warn', 'Backend cart fetch failed, using local data:', error);
      }
    }
    
    // Fallback to local data
    return { items: localService.cart.get() };
  },
  
  async updateCartItem(userId: string, productId: string, quantity: number) {
    if (USE_BACKEND) {
      try {
        const backendAvailable = await isBackendAvailable();
        if (backendAvailable) {
          // Get current cart
          const cart = await this.getCart(userId);
          const updatedItems = cart.items.map((item: any) => 
            item.productId === productId ? { ...item, quantity } : item
          );
          
          const result = await api.db.carts.update(cart.id || userId, { items: updatedItems });
          return result.data;
        }
      } catch (error) {
        safeLog('warn', 'Backend cart update failed, using local data:', error);
      }
    }
    
    // Fallback to local data
    return localService.cart.updateItem(productId, quantity);
  },
  
  async removeCartItem(userId: string, productId: string) {
    if (USE_BACKEND) {
      try {
        const backendAvailable = await isBackendAvailable();
        if (backendAvailable) {
          const cart = await this.getCart(userId);
          const updatedItems = cart.items.filter((item: any) => item.productId !== productId);
          
          const result = await api.db.carts.update(cart.id || userId, { items: updatedItems });
          return result.data;
        }
      } catch (error) {
        safeLog('warn', 'Backend cart item removal failed, using local data:', error);
      }
    }
    
    // Fallback to local data
    return localService.cart.remove(productId);
  },
  
  async clearCart(userId: string) {
    if (USE_BACKEND) {
      try {
        const backendAvailable = await isBackendAvailable();
        if (backendAvailable) {
          const result = await api.db.carts.update(userId, { items: [] });
          return result.data;
        }
      } catch (error) {
        safeLog('warn', 'Backend cart clear failed, using local data:', error);
      }
    }
    
    // Fallback to local data
    return localService.cart.clear();
  }
};

// Order Service
export const orderService = {
  async createOrder(data: any) {
    if (USE_BACKEND) {
      try {
        const backendAvailable = await isBackendAvailable();
        if (backendAvailable) {
          const result = await api.db.orders.create(data);
          
          // Send confirmation email
          try {
            await api.email.sendOrderConfirmation(result.data);
          } catch (emailError) {
            safeLog('warn', 'Email sending failed:', emailError);
          }
          
          return result.data;
        }
      } catch (error) {
        safeLog('warn', 'Backend order creation failed, using local data:', error);
      }
    }
    
    // Fallback to local data
    return localService.createOrder(data);
  },
  
  async getOrders(filters: any = {}) {
    if (USE_BACKEND) {
      try {
        const backendAvailable = await isBackendAvailable();
        if (backendAvailable) {
          const result = await api.db.orders.getAll();
          return result.data || [];
        }
      } catch (error) {
        safeLog('warn', 'Backend orders fetch failed, using local data:', error);
      }
    }
    
    // Fallback to local data
    return localService.orders.getAll();
  },
  
  async getOrderById(id: string) {
    if (USE_BACKEND) {
      try {
        const backendAvailable = await isBackendAvailable();
        if (backendAvailable) {
          const result = await api.db.orders.getById(id);
          return result.data?.[0] || null;
        }
      } catch (error) {
        safeLog('warn', 'Backend order fetch failed, using local data:', error);
      }
    }
    
    // Fallback to local data
    return localService.orders.getById(id);
  },
  
  async updateOrderStatus(id: string, status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled') {
    if (USE_BACKEND) {
      try {
        const backendAvailable = await isBackendAvailable();
        if (backendAvailable) {
          const result = await api.db.orders.updateStatus(id, status);
          return result.data;
        }
      } catch (error) {
        safeLog('warn', 'Backend order status update failed, using local data:', error);
      }
    }
    
    // Fallback to local data
    return localService.orders.updateStatus(id, status);
  }
};

// Newsletter Service
export const newsletterService = {
  async subscribe(email: string) {
    if (USE_BACKEND) {
      try {
        const backendAvailable = await isBackendAvailable();
        if (backendAvailable) {
          const result = await api.db.newsletter.subscribe({
            email,
            subscribed: true,
            createdAt: new Date().toISOString()
          });
          
          // Send welcome email
          try {
            await api.email.sendNewsletterWelcome(email);
          } catch (emailError) {
            safeLog('warn', 'Welcome email sending failed:', emailError);
          }
          
          return result.data;
        }
      } catch (error) {
        safeLog('warn', 'Backend newsletter subscription failed, using local data:', error);
      }
    }
    
    // Fallback to local data
    return localService.newsletter.subscribe(email);
  },
  
  async getSubscribers(filters: any = {}) {
    if (USE_BACKEND) {
      try {
        const backendAvailable = await isBackendAvailable();
        if (backendAvailable) {
          const result = await api.db.newsletter.getAll();
          return result.data || [];
        }
      } catch (error) {
        safeLog('warn', 'Backend subscribers fetch failed, using local data:', error);
      }
    }
    
    // Fallback to local data
    return localService.newsletter.getAllSubscribers();
  }
};

// Contact Service
export const contactService = {
  async sendMessage(data: any) {
    if (USE_BACKEND) {
      try {
        const backendAvailable = await isBackendAvailable();
        if (backendAvailable) {
          const result = await api.db.contact.create({
            ...data,
            status: 'new',
            createdAt: new Date().toISOString()
          });
          
          // Send acknowledgment email
          try {
            await api.email.sendContactAcknowledgment(data);
          } catch (emailError) {
            safeLog('warn', 'Acknowledgment email sending failed:', emailError);
          }
          
          return result.data;
        }
      } catch (error) {
        safeLog('warn', 'Backend contact message creation failed, using local data:', error);
      }
    }
    
    // Fallback to local data
    return localService.contact.addMessage(data);
  },
  
  async getMessages(filters: any = {}) {
    if (USE_BACKEND) {
      try {
        const backendAvailable = await isBackendAvailable();
        if (backendAvailable) {
          const result = await api.db.contact.getAll();
          return result.data || [];
        }
      } catch (error) {
        safeLog('warn', 'Backend messages fetch failed, using local data:', error);
      }
    }
    
    // Fallback to local data
    return localService.contact.getAllMessages();
  },

  async updateStatus(id: string, status: 'new' | 'read' | 'replied') {
    if (USE_BACKEND) {
      try {
        const backendAvailable = await isBackendAvailable();
        if (backendAvailable) {
          const result = await api.db.contact.updateStatus(id, status);
          return result.data;
        }
      } catch (error) {
        safeLog('warn', 'Backend message status update failed, using local data:', error);
      }
    }
    
    // Fallback to local data
    return localService.contact.updateStatus(id, status);
  }
};

// Payment Service
export const paymentService = {
  async processPayment(paymentData: any) {
    if (USE_BACKEND) {
      try {
        const backendAvailable = await isBackendAvailable();
        if (backendAvailable) {
          const result = await api.pay.processPayment(paymentData);
          return result.data;
        }
      } catch (error) {
        safeLog('warn', 'Backend payment processing failed:', error);
        throw error; // Don't fallback for payments
      }
    }
    
    // No fallback for payments - must use backend
    throw new Error('Payment processing requires backend connection');
  }
};

// Export all services
export const services = {
  products: productService,
  cart: cartService,
  orders: orderService,
  newsletter: newsletterService,
  contact: contactService,
  payment: paymentService
};

export default services; 