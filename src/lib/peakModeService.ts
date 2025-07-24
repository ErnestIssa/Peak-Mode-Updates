// Peak Mode Service - Complete Integration
// This service handles all Peak Mode operations with VornifyDB, VornifyPay, and Email

import { vornifyDB, vornifyPay } from './api';
import { emailService } from './emailTemplates';

// Product Management
export const productService = {
  // Get all products
  async getAllProducts() {
    try {
      const result = await vornifyDB.read('products', {});
      return result.data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  // Get product by ID
  async getProduct(id: string) {
    try {
      const result = await vornifyDB.read('products', { id });
      return result.data?.[0] || null;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },

  // Get products by category
  async getProductsByCategory(category: string) {
    try {
      const result = await vornifyDB.read('products', { category });
      return result.data || [];
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  },

  // Get featured products
  async getFeaturedProducts() {
    try {
      const result = await vornifyDB.read('products', { featured: true });
      return result.data || [];
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  },

  // Search products
  async searchProducts(query: string) {
    try {
      const allProducts = await this.getAllProducts();
      return allProducts.filter((product: any) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }
};

// Cart Management
export const cartService = {
  // Get user's cart
  async getCart(userId?: string) {
    try {
      const filter = userId ? { userId } : {};
      const result = await vornifyDB.read('carts', filter);
      return result.data?.[0] || { items: [], total: 0, itemCount: 0 };
    } catch (error) {
      console.error('Error fetching cart:', error);
      return { items: [], total: 0, itemCount: 0 };
    }
  },

  // Add item to cart
  async addToCart(item: any, userId?: string) {
    try {
      const currentCart = await this.getCart(userId);
      const existingItemIndex = currentCart.items.findIndex(
        (cartItem: any) => 
          cartItem.productId === item.productId && 
          cartItem.size === item.size && 
          cartItem.color === item.color
      );

      if (existingItemIndex >= 0) {
        currentCart.items[existingItemIndex].quantity += item.quantity;
      } else {
        currentCart.items.push(item);
      }

      currentCart.total = currentCart.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
      currentCart.itemCount = currentCart.items.reduce((sum: number, item: any) => sum + item.quantity, 0);

      const cartData = {
        id: currentCart.id || `cart_${Date.now()}`,
        userId,
        items: currentCart.items,
        total: currentCart.total,
        itemCount: currentCart.itemCount,
        updated_at: new Date().toISOString(),
        isPrivate: false
      };

      const result = await vornifyDB.create('carts', cartData);
      return result.data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  // Update cart item quantity
  async updateCartItem(itemId: string, quantity: number, userId?: string) {
    try {
      const currentCart = await this.getCart(userId);
      const itemIndex = currentCart.items.findIndex((item: any) => item.id === itemId);
      
      if (itemIndex >= 0) {
        if (quantity <= 0) {
          currentCart.items.splice(itemIndex, 1);
        } else {
          currentCart.items[itemIndex].quantity = quantity;
        }
        
        currentCart.total = currentCart.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
        currentCart.itemCount = currentCart.items.reduce((sum: number, item: any) => sum + item.quantity, 0);

        const cartData = {
          id: currentCart.id,
          userId,
          items: currentCart.items,
          total: currentCart.total,
          itemCount: currentCart.itemCount,
          updated_at: new Date().toISOString(),
          isPrivate: false
        };

        const result = await vornifyDB.create('carts', cartData);
        return result.data;
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  },

  // Remove item from cart
  async removeFromCart(itemId: string, userId?: string) {
    return this.updateCartItem(itemId, 0, userId);
  },

  // Clear cart
  async clearCart(userId?: string) {
    try {
      const currentCart = await this.getCart(userId);
      const cartData = {
        id: currentCart.id,
        userId,
        items: [],
        total: 0,
        itemCount: 0,
        updated_at: new Date().toISOString(),
        isPrivate: false
      };

      const result = await vornifyDB.create('carts', cartData);
      return result.data;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }
};

// Order Management
export const orderService = {
  // Create new order
  async createOrder(orderData: any) {
    try {
      const order = {
        id: `order_${Date.now()}`,
        ...orderData,
        status: 'pending',
        orderNumber: `PM-${Date.now().toString().slice(-8)}`,
        created_at: new Date().toISOString(),
        isPrivate: false
      };

      const result = await vornifyDB.create('orders', order);
      
      // Send order confirmation email
      await emailService.sendOrderConfirmation({
        email: orderData.shippingAddress.email,
        name: `${orderData.shippingAddress.firstName} ${orderData.shippingAddress.lastName}`,
        orderId: order.orderNumber,
        products: orderData.items,
        total: orderData.total,
        shippingAddress: `${orderData.shippingAddress.address}, ${orderData.shippingAddress.city} ${orderData.shippingAddress.postalCode}, ${orderData.shippingAddress.country}`
      });

      return result.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Get user's orders
  async getUserOrders(userId?: string) {
    try {
      const filter = userId ? { userId } : {};
      const result = await vornifyDB.read('orders', filter);
      return result.data || [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  },

  // Get single order
  async getOrder(orderId: string) {
    try {
      const result = await vornifyDB.read('orders', { id: orderId });
      return result.data?.[0] || null;
    } catch (error) {
      console.error('Error fetching order:', error);
      return null;
    }
  },

  // Update order status
  async updateOrderStatus(orderId: string, status: string) {
    try {
      const order = await this.getOrder(orderId);
      if (order) {
        const result = await vornifyDB.update('orders', { id: orderId }, { status, updated_at: new Date().toISOString() });
        return result.data;
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }
};

// Newsletter Management
export const newsletterService = {
  // Subscribe to newsletter
  async subscribe(email: string, name?: string) {
    try {
      const subscription = {
        id: `sub_${Date.now()}`,
        email,
        name: name || email.split('@')[0],
        subscribed: true,
        created_at: new Date().toISOString(),
        isPrivate: false
      };

      const result = await vornifyDB.create('newsletter_subscriptions', subscription);
      
      // Send confirmation email
      await emailService.sendNewsletterSubscription({
        email,
        name: name || email.split('@')[0]
      });

      return result.data;
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      throw error;
    }
  },

  // Unsubscribe from newsletter
  async unsubscribe(email: string) {
    try {
      const result = await vornifyDB.update('newsletter_subscriptions', { email }, { subscribed: false, updated_at: new Date().toISOString() });
      return result.data;
    } catch (error) {
      console.error('Error unsubscribing from newsletter:', error);
      throw error;
    }
  },

  // Check subscription status
  async checkSubscription(email: string) {
    try {
      const result = await vornifyDB.read('newsletter_subscriptions', { email });
      const subscription = result.data?.[0];
      return { subscribed: subscription?.subscribed || false };
    } catch (error) {
      console.error('Error checking subscription:', error);
      return { subscribed: false };
    }
  }
};

// Contact Management
export const contactService = {
  // Send contact message
  async sendMessage(messageData: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) {
    try {
      const message = {
        id: `contact_${Date.now()}`,
        ...messageData,
        status: 'pending',
        created_at: new Date().toISOString(),
        isPrivate: false
      };

      const result = await vornifyDB.create('contact_messages', message);
      
      // Send acknowledgment email
      await emailService.sendSupportAcknowledgment({
        email: messageData.email,
        name: messageData.name,
        message: messageData.message
      });

      return result.data;
    } catch (error) {
      console.error('Error sending contact message:', error);
      throw error;
    }
  },

  // Get contact messages (admin only)
  async getMessages() {
    try {
      const result = await vornifyDB.read('contact_messages', {});
      return result.data || [];
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      return [];
    }
  }
};

// Payment Management
export const paymentService = {
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
  }) {
    try {
      const result = await vornifyPay.createPayment(paymentData);
      return result;
    } catch (error) {
      console.error('Error creating payment:', error);
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
  }) {
    try {
      const result = await vornifyPay.createSubscription(subscriptionData);
      return result;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  },

  // Verify payment
  async verifyPayment(paymentIntentId: string) {
    try {
      const result = await vornifyPay.verifyPayment(paymentIntentId);
      return result;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  }
};

// Admin Management
export const adminService = {
  // Get admin configuration
  async getAdminConfig() {
    try {
      const result = await vornifyDB.read('admin_config', {});
      return result.data?.[0] || {};
    } catch (error) {
      console.error('Error fetching admin config:', error);
      return {};
    }
  },

  // Update admin configuration
  async updateAdminConfig(config: any) {
    try {
      const existingConfig = await this.getAdminConfig();
      if (existingConfig.id) {
        const result = await vornifyDB.update('admin_config', { id: existingConfig.id }, config);
        return result.data;
      } else {
        const result = await vornifyDB.create('admin_config', {
          id: `config_${Date.now()}`,
          ...config,
          created_at: new Date().toISOString(),
          isPrivate: false
        });
        return result.data;
      }
    } catch (error) {
      console.error('Error updating admin config:', error);
      throw error;
    }
  },

  // Get content by section
  async getContent(section: string) {
    try {
      const result = await vornifyDB.read('content', { section });
      return result.data?.[0] || {};
    } catch (error) {
      console.error('Error fetching content:', error);
      return {};
    }
  },

  // Update content
  async updateContent(section: string, data: any) {
    try {
      const existingContent = await this.getContent(section);
      if (existingContent.id) {
        const result = await vornifyDB.update('content', { id: existingContent.id }, data);
        return result.data;
      } else {
        const result = await vornifyDB.create('content', {
          id: `content_${Date.now()}`,
          section,
          ...data,
          created_at: new Date().toISOString(),
          isPrivate: false
        });
        return result.data;
      }
    } catch (error) {
      console.error('Error updating content:', error);
      throw error;
    }
  }
};

// Export all services
export default {
  products: productService,
  cart: cartService,
  orders: orderService,
  newsletter: newsletterService,
  contact: contactService,
  payments: paymentService,
  admin: adminService
}; 