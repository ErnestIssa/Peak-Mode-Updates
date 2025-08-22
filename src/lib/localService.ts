// Local Service - Provides mock data and local functionality
// This replaces all external API connections for local development

export interface LocalProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  tags: string[];
  sizes: string[];
  colors: string[];
  inStock: boolean;
  featured: boolean;
  new: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface LocalOrder {
  id: string;
  customer: {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  items: LocalCartItem[];
  total: number;
  shipping: number;
  tax: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  shippingMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface LocalCartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string | null;
  color: string | null;
  quantity: number;
  currency: string;
}

export interface LocalCustomer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  newsletterSubscribed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LocalNewsletterSubscriber {
  id: string;
  email: string;
  subscribed: boolean;
  createdAt: string;
}

export interface LocalContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
}

// Mock data storage (in-memory for local development)
class LocalStorage {
  private products: LocalProduct[] = [
    {
      id: '1',
      name: 'Peak Mode Performance T-Shirt',
      description: 'Premium Swedish fitness apparel designed for athletes who demand performance and style.',
      price: 29.99,
      originalPrice: 39.99,
      images: ['/placeholder.svg'],
      category: 'Clothing',
      tags: ['fitness', 'performance', 'swedish'],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'White', 'Navy'],
      inStock: true,
      featured: true,
      new: true,
      rating: 4.8,
      reviewCount: 127,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    },
    {
      id: '2',
      name: 'Fitness Shorts Pro',
      description: 'High-performance shorts designed for maximum comfort during intense workouts.',
      price: 39.99,
      images: ['/placeholder.svg'],
      category: 'Clothing',
      tags: ['fitness', 'shorts', 'workout'],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'Gray', 'Blue'],
      inStock: true,
      featured: false,
      new: false,
      rating: 4.6,
      reviewCount: 89,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-10T00:00:00Z'
    },
    {
      id: '3',
      name: 'Running Shoes Elite',
      description: 'Professional running shoes with advanced cushioning technology.',
      price: 89.99,
      originalPrice: 119.99,
      images: ['/placeholder.svg'],
      category: 'Footwear',
      tags: ['running', 'shoes', 'professional'],
      sizes: ['7', '8', '9', '10', '11', '12'],
      colors: ['Black', 'White', 'Red'],
      inStock: false,
      featured: true,
      new: false,
      rating: 4.9,
      reviewCount: 234,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-12T00:00:00Z'
    }
  ];

  private orders: LocalOrder[] = [
    {
      id: '1',
      customer: {
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Main St',
        city: 'Stockholm',
        postalCode: '11122',
        country: 'Sweden',
        phone: '+46 70 123 4567'
      },
      items: [
        {
          id: '1',
          productId: '1',
          name: 'Peak Mode Performance T-Shirt',
          price: 29.99,
          image: '/placeholder.svg',
          size: 'M',
          color: 'Black',
          quantity: 2,
          currency: 'SEK'
        }
      ],
      total: 69.98,
      shipping: 5.99,
      tax: 6.99,
      status: 'pending',
      paymentMethod: 'Credit Card',
      shippingMethod: 'Standard',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      customer: {
        email: 'jane.smith@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        address: '456 Oak Ave',
        city: 'Gothenburg',
        postalCode: '41301',
        country: 'Sweden',
        phone: '+46 70 987 6543'
      },
      items: [
        {
          id: '2',
          productId: '2',
          name: 'Fitness Shorts Pro',
          price: 39.99,
          image: '/placeholder.svg',
          size: 'S',
          color: 'Black',
          quantity: 1,
          currency: 'SEK'
        },
        {
          id: '3',
          productId: '3',
          name: 'Running Shoes Elite',
          price: 89.99,
          image: '/placeholder.svg',
          size: '8',
          color: 'Black',
          quantity: 1,
          currency: 'SEK'
        }
      ],
      total: 129.97,
      shipping: 5.99,
      tax: 12.99,
      status: 'shipped',
      paymentMethod: 'PayPal',
      shippingMethod: 'Express',
      createdAt: '2024-01-14T14:20:00Z',
      updatedAt: '2024-01-15T09:15:00Z'
    }
  ];

  private customers: LocalCustomer[] = [
    {
      id: '1',
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+46 70 123 4567',
      address: '123 Main St',
      city: 'Stockholm',
      postalCode: '11122',
      country: 'Sweden',
      newsletterSubscribed: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    },
    {
      id: '2',
      email: 'jane.smith@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '+46 70 987 6543',
      address: '456 Oak Ave',
      city: 'Gothenburg',
      postalCode: '41301',
      country: 'Sweden',
      newsletterSubscribed: false,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-14T00:00:00Z'
    }
  ];

  private subscribers: LocalNewsletterSubscriber[] = [
    {
      id: '1',
      email: 'john.doe@example.com',
      subscribed: true,
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      email: 'newsletter@example.com',
      subscribed: true,
      createdAt: '2024-01-05T00:00:00Z'
    }
  ];

  private contactMessages: LocalContactMessage[] = [
    {
      id: '1',
      name: 'Customer Support',
      email: 'support@example.com',
      subject: 'Product Inquiry',
      message: 'I would like to know more about your fitness shorts.',
      status: 'new',
      createdAt: '2024-01-15T08:00:00Z'
    }
  ];

  // Product methods
  getAllProducts(): LocalProduct[] {
    return [...this.products];
  }

  getProductById(id: string): LocalProduct | undefined {
    return this.products.find(p => p.id === id);
  }

  createProduct(data: Omit<LocalProduct, 'id' | 'createdAt' | 'updatedAt'>): LocalProduct {
    const newProduct: LocalProduct = {
      ...data,
      id: `product_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.products.push(newProduct);
    return newProduct;
  }

  updateProduct(id: string, data: Partial<LocalProduct>): LocalProduct | undefined {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products[index] = {
        ...this.products[index],
        ...data,
        updatedAt: new Date().toISOString()
      };
      return this.products[index];
    }
    return undefined;
  }

  deleteProduct(id: string): boolean {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      return true;
    }
    return false;
  }

  // Order methods
  getAllOrders(): LocalOrder[] {
    return [...this.orders];
  }

  getOrderById(id: string): LocalOrder | undefined {
    return this.orders.find(o => o.id === id);
  }

  updateOrderStatus(id: string, status: LocalOrder['status']): LocalOrder | undefined {
    const order = this.orders.find(o => o.id === id);
    if (order) {
      order.status = status;
      order.updatedAt = new Date().toISOString();
      return order;
    }
    return undefined;
  }

  // Customer methods
  getAllCustomers(): LocalCustomer[] {
    return [...this.customers];
  }

  getCustomerById(id: string): LocalCustomer | undefined {
    return this.customers.find(c => c.id === id);
  }

  // Newsletter methods
  getAllSubscribers(): LocalNewsletterSubscriber[] {
    return [...this.subscribers];
  }

  addSubscriber(email: string): LocalNewsletterSubscriber {
    const existing = this.subscribers.find(s => s.email === email);
    if (existing) {
      existing.subscribed = true;
      return existing;
    }
    
    const newSubscriber: LocalNewsletterSubscriber = {
      id: `sub_${Date.now()}`,
      email,
      subscribed: true,
      createdAt: new Date().toISOString()
    };
    this.subscribers.push(newSubscriber);
    return newSubscriber;
  }

  unsubscribe(email: string): boolean {
    const subscriber = this.subscribers.find(s => s.email === email);
    if (subscriber) {
      subscriber.subscribed = false;
      return true;
    }
    return false;
  }

  // Contact methods
  getAllContactMessages(): LocalContactMessage[] {
    return [...this.contactMessages];
  }

  addContactMessage(data: Omit<LocalContactMessage, 'id' | 'createdAt'>): LocalContactMessage {
    const newMessage: LocalContactMessage = {
      ...data,
      id: `msg_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.contactMessages.push(newMessage);
    return newMessage;
  }

  updateMessageStatus(id: string, status: LocalContactMessage['status']): LocalContactMessage | undefined {
    const message = this.contactMessages.find(m => m.id === id);
    if (message) {
      message.status = status;
      return message;
    }
    return undefined;
  }

  // Cart methods
  getCart(): LocalCartItem[] {
    const savedCart = window.localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  }

  updateCartItem(productId: string, quantity: number): LocalCartItem | undefined {
    const cart = this.getCart();
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
      existingItem.quantity = quantity;
      if (quantity <= 0) {
        return this.removeFromCart(productId);
      }
    }
    
    window.localStorage.setItem('cart', JSON.stringify(cart));
    return existingItem;
  }

  removeFromCart(productId: string): LocalCartItem | undefined {
    const cart = this.getCart();
    const itemIndex = cart.findIndex(item => item.productId === productId);
    
    if (itemIndex !== -1) {
      const removedItem = cart.splice(itemIndex, 1)[0];
      window.localStorage.setItem('cart', JSON.stringify(cart));
      return removedItem;
    }
    
    return undefined;
  }

  clearCart(): boolean {
    window.localStorage.removeItem('cart');
    return true;
  }

  // Order creation method
  createOrder(orderData: Omit<LocalOrder, 'id' | 'createdAt' | 'updatedAt'>): LocalOrder {
    const newOrder: LocalOrder = {
      ...orderData,
      id: `order_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.orders.push(newOrder);
    return newOrder;
  }
}

// Create singleton instance
const localStorage = new LocalStorage();

// Export service methods
export const localService = {
  // Products
  products: {
    getAll: () => localStorage.getAllProducts(),
    getById: (id: string) => localStorage.getProductById(id),
    create: (data: Omit<LocalProduct, 'id' | 'createdAt' | 'updatedAt'>) => localStorage.createProduct(data),
    update: (id: string, data: Partial<LocalProduct>) => localStorage.updateProduct(id, data),
    delete: (id: string) => localStorage.deleteProduct(id)
  },

  // Orders
  orders: {
    getAll: () => localStorage.getAllOrders(),
    getById: (id: string) => localStorage.getOrderById(id),
    updateStatus: (id: string, status: LocalOrder['status']) => localStorage.updateOrderStatus(id, status)
  },

  // Customers
  customers: {
    getAll: () => localStorage.getAllCustomers(),
    getById: (id: string) => localStorage.getCustomerById(id)
  },

  // Newsletter
  newsletter: {
    getAllSubscribers: () => localStorage.getAllSubscribers(),
    subscribe: (email: string) => localStorage.addSubscriber(email),
    unsubscribe: (email: string) => localStorage.unsubscribe(email)
  },

  // Contact
  contact: {
    getAllMessages: () => localStorage.getAllContactMessages(),
    addMessage: (data: Omit<LocalContactMessage, 'id' | 'createdAt'>) => localStorage.addContactMessage(data),
    updateStatus: (id: string, status: LocalContactMessage['status']) => localStorage.updateMessageStatus(id, status)
  },

  // Cart
  cart: {
    get: () => localStorage.getCart(),
    updateItem: (productId: string, quantity: number) => localStorage.updateCartItem(productId, quantity),
    remove: (productId: string) => localStorage.removeFromCart(productId),
    clear: () => localStorage.clearCart()
  },

  // Order creation
  createOrder: (orderData: Omit<LocalOrder, 'id' | 'createdAt' | 'updatedAt'>) => localStorage.createOrder(orderData)
};

export default localService; 