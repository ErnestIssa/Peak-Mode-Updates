// API Service - Backend Integration Layer
// Connects to Peak Mode backend at http://localhost:3001

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.PROD ? 'https://your-production-api.com' : 'http://localhost:3001');

// Generic API call function
async function apiCall(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`API call failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    // Only log in development
    if (import.meta.env.DEV) {
      console.error(`API call error for ${endpoint}:`, error);
    }
    throw error;
  }
}

// Health check endpoints
export const healthAPI = {
  check: () => apiCall('/health'),
  checkDB: () => apiCall('/health/db'),
};

// Database operations (VornifyDB)
export const vornifyDB = {
  // Generic database operation
  async query(collection: string, command: string, data?: any) {
    return apiCall('/api/vornifydb', {
      method: 'POST',
      body: JSON.stringify({
        database_name: 'peakmode',
        collection_name: collection,
        command,
        data: data || {}
      })
    });
  },

  // Product operations
  products: {
    getAll: () => vornifyDB.query('products', '--read'),
    getById: (id: string) => vornifyDB.query('products', '--read', { query: { id } }),
    create: (data: any) => vornifyDB.query('products', '--create', data),
    update: (id: string, data: any) => vornifyDB.query('products', '--update', {
      query: { id },
      updateData: data
    }),
    delete: (id: string) => vornifyDB.query('products', '--delete', { query: { id } })
  },

  // User operations
  users: {
    getAll: () => vornifyDB.query('users', '--read'),
    getById: (id: string) => vornifyDB.query('users', '--read', { query: { id } }),
    getByEmail: (email: string) => vornifyDB.query('users', '--read', { query: { email } }),
    create: (data: any) => vornifyDB.query('users', '--create', data),
    update: (id: string, data: any) => vornifyDB.query('users', '--update', {
      query: { id },
      updateData: data
    }),
    delete: (id: string) => vornifyDB.query('users', '--delete', { query: { id } })
  },

  // Order operations
  orders: {
    getAll: () => vornifyDB.query('orders', '--read'),
    getById: (id: string) => vornifyDB.query('orders', '--read', { query: { id } }),
    getByUser: (userId: string) => vornifyDB.query('orders', '--read', { query: { userId } }),
    create: (data: any) => vornifyDB.query('orders', '--create', data),
    update: (id: string, data: any) => vornifyDB.query('orders', '--update', {
      query: { id },
      updateData: data
    }),
    updateStatus: (id: string, status: string) => vornifyDB.query('orders', '--update', {
      query: { id },
      updateData: { status }
    }),
    delete: (id: string) => vornifyDB.query('orders', '--delete', { query: { id } })
  },

  // Cart operations
  carts: {
    getByUser: (userId: string) => vornifyDB.query('carts', '--read', { query: { userId } }),
    create: (data: any) => vornifyDB.query('carts', '--create', data),
    update: (id: string, data: any) => vornifyDB.query('carts', '--update', {
      query: { id },
      updateData: data
    }),
    delete: (id: string) => vornifyDB.query('carts', '--delete', { query: { id } })
  },

  // Newsletter operations
  newsletter: {
    getAll: () => vornifyDB.query('newsletter_subscribers', '--read'),
    getByEmail: (email: string) => vornifyDB.query('newsletter_subscribers', '--read', { query: { email } }),
    subscribe: (data: any) => vornifyDB.query('newsletter_subscribers', '--create', data),
    unsubscribe: (email: string) => vornifyDB.query('newsletter_subscribers', '--update', {
      query: { email },
      updateData: { subscribed: false }
    })
  },

  // Contact operations
  contact: {
    getAll: () => vornifyDB.query('contact_messages', '--read'),
    getById: (id: string) => vornifyDB.query('contact_messages', '--read', { query: { id } }),
    create: (data: any) => vornifyDB.query('contact_messages', '--create', data),
    update: (id: string, data: any) => vornifyDB.query('contact_messages', '--update', {
      query: { id },
      updateData: data
    }),
    updateStatus: (id: string, status: string) => vornifyDB.query('contact_messages', '--update', {
      query: { id },
      updateData: { status }
    })
  }
};

// Payment operations (VornifyPay)
export const vornifyPay = {
  createPayment: (data: any) => apiCall('/api/vornifypay', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  processPayment: (data: any) => apiCall('/api/vornifypay/process', {
    method: 'POST',
    body: JSON.stringify(data)
  })
};

// Email operations
export const emailAPI = {
  sendEmail: (data: any) => apiCall('/api/email', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  sendOrderConfirmation: (orderData: any) => emailAPI.sendEmail({
    type: 'order_confirmation',
    to: orderData.customer.email,
    data: orderData
  }),
  
  sendNewsletterWelcome: (email: string) => emailAPI.sendEmail({
    type: 'newsletter_welcome',
    to: email
  }),
  
  sendContactAcknowledgment: (contactData: any) => emailAPI.sendEmail({
    type: 'contact_acknowledgment',
    to: contactData.email,
    data: contactData
  })
};

// Storage operations
export const storageAPI = {
  uploadFile: (file: File, folder: string = 'products') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    
    return apiCall('/api/storage/upload', {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData
    });
  },
  
  deleteFile: (fileId: string) => apiCall('/api/storage/delete', {
    method: 'POST',
    body: JSON.stringify({ fileId })
  }),
  
  getFileUrl: (fileId: string) => apiCall('/api/storage/url', {
    method: 'POST',
    body: JSON.stringify({ fileId })
  })
};

// Export the main API object
export const api = {
  health: healthAPI,
  db: vornifyDB,
  pay: vornifyPay,
  email: emailAPI,
  storage: storageAPI
};

export default api; 