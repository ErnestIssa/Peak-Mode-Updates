# Peak Mode Admin Frontend - Complete Codebase

## Project Structure Overview

```
Peak-Mode-Updates/
├── src/
│   ├── lib/                    # Core services and utilities
│   ├── models/                 # TypeScript interfaces
│   ├── hooks/                  # Custom React hooks
│   ├── contexts/               # React contexts
│   ├── components/             # Reusable UI components
│   ├── pages/                  # Page components
│   └── services/               # API services
├── public/                     # Static assets
├── package.json               # Dependencies
├── tailwind.config.ts         # Tailwind configuration
├── vite.config.ts             # Vite configuration
└── tsconfig.json              # TypeScript configuration
```

## 1. Core API Services (`src/lib/`)

### `src/lib/api.ts` - Main API Configuration
```typescript
// API Base URLs
export const API_BASE_URL = 'http://localhost:3010';
export const VORNIFY_DB_URL = 'https://api.vornify.com/db';
export const VORNIFY_PAY_URL = 'https://api.vornify.com/pay';
export const VORNIFY_EMAIL_URL = 'https://api.vornify.com/email';

// VornifyDB Service
export const vornifyDB = {
  async query(endpoint: string, options: any = {}) {
    const response = await fetch(`${VORNIFY_DB_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.VITE_VORNIFY_API_KEY}`,
        ...options.headers
      },
      ...options
    });
    return response.json();
  }
};

// VornifyPay Service
export const vornifyPay = {
  async createPayment(data: any) {
    const response = await fetch(`${VORNIFY_PAY_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.VITE_VORNIFY_PAY_KEY}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};
```

### `src/lib/peakModeService.ts` - Main Service Layer
```typescript
import { vornifyDB, vornifyPay } from './api';
import { emailTemplates } from './emailTemplates';

// Product Service
export const productService = {
  async getAllProducts() {
    return await vornifyDB.query('/products');
  },
  
  async getProductById(id: string) {
    return await vornifyDB.query(`/products/${id}`);
  },
  
  async createProduct(data: any) {
    return await vornifyDB.query('/products', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  async updateProduct(id: string, data: any) {
    return await vornifyDB.query(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  
  async deleteProduct(id: string) {
    return await vornifyDB.query(`/products/${id}`, {
      method: 'DELETE'
    });
  }
};

// Cart Service
export const cartService = {
  async getCart(userId: string) {
    return await vornifyDB.query(`/carts/${userId}`);
  },
  
  async updateCartItem(userId: string, productId: string, quantity: number) {
    return await vornifyDB.query(`/carts/${userId}/items`, {
      method: 'PUT',
      body: JSON.stringify({ productId, quantity })
    });
  },
  
  async removeCartItem(userId: string, productId: string) {
    return await vornifyDB.query(`/carts/${userId}/items/${productId}`, {
      method: 'DELETE'
    });
  },
  
  async clearCart(userId: string) {
    return await vornifyDB.query(`/carts/${userId}`, {
      method: 'DELETE'
    });
  }
};

// Order Service
export const orderService = {
  async createOrder(data: any) {
    const order = await vornifyDB.query('/orders', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    
    // Send confirmation email
    await this.sendOrderConfirmationEmail(order);
    
    return order;
  },
  
  async getOrders(filters: any = {}) {
    const queryString = new URLSearchParams(filters).toString();
    return await vornifyDB.query(`/orders?${queryString}`);
  },
  
  async getOrderById(id: string) {
    return await vornifyDB.query(`/orders/${id}`);
  },
  
  async updateOrderStatus(id: string, status: string) {
    return await vornifyDB.query(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },
  
  async sendOrderConfirmationEmail(order: any) {
    const emailData = {
      to: order.customer.email,
      subject: 'Order Confirmation - Peak Mode',
      html: emailTemplates.orderConfirmation(order),
      text: emailTemplates.orderConfirmationText(order)
    };
    
    return await vornifyDB.query('/email/send', {
      method: 'POST',
      body: JSON.stringify(emailData)
    });
  }
};

// Newsletter Service
export const newsletterService = {
  async subscribe(email: string) {
    const subscriber = await vornifyDB.query('/newsletter/subscribers', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
    
    // Send welcome email
    await this.sendWelcomeEmail(email);
    
    return subscriber;
  },
  
  async getSubscribers(filters: any = {}) {
    const queryString = new URLSearchParams(filters).toString();
    return await vornifyDB.query(`/newsletter/subscribers?${queryString}`);
  },
  
  async sendWelcomeEmail(email: string) {
    const emailData = {
      to: email,
      subject: 'Welcome to Peak Mode Newsletter',
      html: emailTemplates.newsletterSubscription(),
      text: emailTemplates.newsletterSubscriptionText()
    };
    
    return await vornifyDB.query('/email/send', {
      method: 'POST',
      body: JSON.stringify(emailData)
    });
  }
};

// Contact Service
export const contactService = {
  async sendMessage(data: any) {
    const message = await vornifyDB.query('/contact/messages', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    
    // Send acknowledgment email
    await this.sendAcknowledgmentEmail(data.email);
    
    return message;
  },
  
  async getMessages(filters: any = {}) {
    const queryString = new URLSearchParams(filters).toString();
    return await vornifyDB.query(`/contact/messages?${queryString}`);
  },
  
  async sendAcknowledgmentEmail(email: string) {
    const emailData = {
      to: email,
      subject: 'Message Received - Peak Mode',
      html: emailTemplates.supportAcknowledgment(),
      text: emailTemplates.supportAcknowledgmentText()
    };
    
    return await vornifyDB.query('/email/send', {
      method: 'POST',
      body: JSON.stringify(emailData)
    });
  }
};
```

## 2. TypeScript Models (`src/models/`)

### `src/models/Product.ts`
```typescript
export interface Product {
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

export interface CartItem {
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

export interface Order {
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
  items: CartItem[];
  total: number;
  shipping: number;
  tax: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  shippingMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
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

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed: boolean;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
}
```

## 3. Custom Hooks (`src/hooks/`)

### `src/hooks/useApi.ts`
```typescript
import { useState, useEffect, useCallback } from 'react';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApiState<T>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setData = useCallback((data: T) => {
    setState(prev => ({ ...prev, data, error: null }));
  }, []);

  const setError = useCallback((error: string) => {
    setState(prev => ({ ...prev, error, loading: false }));
  }, []);

  return { ...state, setLoading, setData, setError };
}

export function useApiData<T>(
  apiCall: (...args: any[]) => Promise<T>,
  dependencies: any[] = []
) {
  const { data, loading, error, setLoading, setData, setError } = useApiState<T>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await apiCall();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error };
}

export function useApiMutation<T, R>(
  apiCall: (data: T) => Promise<R>
) {
  const { loading, error, setLoading, setError } = useApiState<R>();

  const mutate = useCallback(async (data: T) => {
    try {
      setLoading(true);
      const result = await apiCall(data);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  }, [apiCall, setLoading, setError]);

  return { mutate, loading, error };
}

// Specialized hooks for common operations
export function useProducts() {
  return useApiData(() => productService.getAllProducts(), []);
}

export function useOrders(filters: any = {}) {
  return useApiData(() => orderService.getOrders(filters), [filters]);
}

export function useCustomers(filters: any = {}) {
  return useApiData(() => vornifyDB.query('/customers', { params: filters }), [filters]);
}

export function useNewsletterSubscribers(filters: any = {}) {
  return useApiData(() => newsletterService.getSubscribers(filters), [filters]);
}

export function useContactMessages(filters: any = {}) {
  return useApiData(() => contactService.getMessages(filters), [filters]);
}
```

## 4. Admin Context (`src/contexts/AdminContext.tsx`)
```typescript
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AdminContent {
  hero: {
    title: string;
    subtitle: string;
    ctaText: string;
    backgroundImage: string;
  };
  about: {
    title: string;
    description: string;
    galleryImages: string[];
  };
  newsletter: {
    title: string;
    description: string;
    placeholder: string;
  };
  footer: {
    description: string;
    socialLinks: {
      facebook: string;
      instagram: string;
      tiktok: string;
    };
  };
}

interface AdminContextType {
  content: AdminContent;
  updateContent: (section: keyof AdminContent, data: any) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
}

const defaultContent: AdminContent = {
  hero: {
    title: "Enter Peak Mode",
    subtitle: "Swedish fitness apparel designed for performance",
    ctaText: "Shop Now",
    backgroundImage: "/hero-bg.jpg"
  },
  about: {
    title: "About Peak Mode",
    description: "Premium Swedish fitness apparel designed for athletes who demand performance and style.",
    galleryImages: [
      "/about-1.jpg",
      "/about-2.jpg",
      "/about-3.jpg",
      "/about-4.jpg"
    ]
  },
  newsletter: {
    title: "Stay in the Loop",
    description: "Get exclusive updates on new products and special offers.",
    placeholder: "Enter your email"
  },
  footer: {
    description: "Peak Mode - Swedish fitness apparel for athletes who demand performance and style.",
    socialLinks: {
      facebook: "https://facebook.com/peakmode",
      instagram: "https://instagram.com/peakmode",
      tiktok: "https://tiktok.com/@peakmode"
    }
  }
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<AdminContent>(defaultContent);
  const [isEditing, setIsEditing] = useState(false);

  const updateContent = (section: keyof AdminContent, data: any) => {
    setContent(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  return (
    <AdminContext.Provider value={{
      content,
      updateContent,
      isEditing,
      setIsEditing
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
```

## 5. Email Templates (`src/lib/emailTemplates.ts`)
```typescript
export const emailTemplates = {
  newsletterSubscription: () => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a1a1a; color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; background: #f9f9f9; }
        .footer { background: #1a1a1a; color: white; padding: 20px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Peak Mode!</h1>
        </div>
        <div class="content">
          <h2>Thank you for subscribing to our newsletter</h2>
          <p>You'll now receive exclusive updates on new products, special offers, and fitness tips.</p>
          <p>Stay tuned for amazing content from the Peak Mode team!</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 Peak Mode. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  orderConfirmation: (order: any) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a1a1a; color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; background: #f9f9f9; }
        .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .footer { background: #1a1a1a; color: white; padding: 20px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmation</h1>
          <p>Order #${order.id}</p>
        </div>
        <div class="content">
          <h2>Thank you for your order!</h2>
          <div class="order-details">
            <h3>Order Summary</h3>
            <p><strong>Total:</strong> $${order.total}</p>
            <p><strong>Shipping:</strong> $${order.shipping}</p>
            <p><strong>Status:</strong> ${order.status}</p>
          </div>
          <p>We'll send you tracking information once your order ships.</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 Peak Mode. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  supportAcknowledgment: () => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a1a1a; color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; background: #f9f9f9; }
        .footer { background: #1a1a1a; color: white; padding: 20px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Message Received</h1>
        </div>
        <div class="content">
          <h2>Thank you for contacting Peak Mode</h2>
          <p>We've received your message and will get back to you within 24 hours.</p>
          <p>In the meantime, feel free to browse our latest products!</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 Peak Mode. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  // Text versions for email clients that don't support HTML
  newsletterSubscriptionText: () => `
    Welcome to Peak Mode!
    
    Thank you for subscribing to our newsletter. You'll now receive exclusive updates on new products, special offers, and fitness tips.
    
    Stay tuned for amazing content from the Peak Mode team!
    
    © 2024 Peak Mode. All rights reserved.
  `,

  orderConfirmationText: (order: any) => `
    Order Confirmation
    
    Thank you for your order!
    
    Order #${order.id}
    Total: $${order.total}
    Shipping: $${order.shipping}
    Status: ${order.status}
    
    We'll send you tracking information once your order ships.
    
    © 2024 Peak Mode. All rights reserved.
  `,

  supportAcknowledgmentText: () => `
    Message Received
    
    Thank you for contacting Peak Mode
    
    We've received your message and will get back to you within 24 hours.
    
    In the meantime, feel free to browse our latest products!
    
    © 2024 Peak Mode. All rights reserved.
  `
};
```

## 6. Configuration Files

### `package.json`
```json
{
  "name": "peak-mode-admin",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.1",
    "react-helmet-async": "^1.3.0",
    "react-hook-form": "^7.43.9",
    "zod": "^3.20.6",
    "@hookform/resolvers": "^2.9.11",
    "lucide-react": "^0.263.1",
    "sonner": "^0.6.0",
    "clsx": "^1.2.1",
    "tailwind-merge": "^1.14.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@vitejs/plugin-react": "^4.0.3",
    "autoprefixer": "^10.4.14",
    "eslint": "^8.45.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.3",
    "postcss": "^8.4.27",
    "tailwindcss": "^3.3.0",
    "typescript": "^5.0.2",
    "vite": "^4.4.5"
  }
}
```

### `tailwind.config.ts`
```typescript
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
```

### `vite.config.ts`
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
});
```

### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path mapping */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## 7. Environment Variables Template

### `.env.example`
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3010
VITE_VORNIFY_API_KEY=your_vornify_api_key_here
VITE_VORNIFY_PAY_KEY=your_vornify_pay_key_here

# Email Configuration
VITE_EMAIL_SERVICE_URL=https://api.vornify.com/email
VITE_EMAIL_API_KEY=your_email_api_key_here

# Site Configuration
VITE_SITE_NAME=Peak Mode
VITE_SITE_URL=https://peakmode.com
VITE_CONTACT_EMAIL=contact@peakmode.com

# Admin Configuration
VITE_ADMIN_EMAIL=admin@peakmode.com
VITE_ADMIN_PASSWORD=secure_admin_password
```

## 8. Key Components for Admin

### Essential UI Components Needed:
- **Dashboard Layout** with sidebar navigation
- **Data Tables** for products, orders, customers
- **Forms** for creating/editing products, customers
- **Charts** for analytics and reporting
- **Modals** for quick actions
- **Notifications** for success/error messages
- **File Upload** for product images
- **Rich Text Editor** for product descriptions
- **Date/Time Pickers** for order management
- **Status Badges** for order/customer status

### Admin Routes Structure:
```
/admin
├── /dashboard          # Main dashboard with analytics
├── /products          # Product management
│   ├── /list         # Product listing
│   ├── /create       # Create new product
│   └── /edit/:id     # Edit product
├── /orders           # Order management
│   ├── /list         # Order listing
│   └── /:id          # Order details
├── /customers        # Customer management
│   ├── /list         # Customer listing
│   └── /:id          # Customer details
├── /newsletter       # Newsletter management
├── /contact          # Contact messages
├── /analytics        # Analytics and reports
└── /settings         # Site settings
```

## 9. Database Schema (for reference)

### Products Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  originalPrice: Number,
  images: [String],
  category: String,
  tags: [String],
  sizes: [String],
  colors: [String],
  inStock: Boolean,
  featured: Boolean,
  new: Boolean,
  rating: Number,
  reviewCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Collection
```javascript
{
  _id: ObjectId,
  customer: {
    email: String,
    firstName: String,
    lastName: String,
    address: String,
    city: String,
    postalCode: String,
    country: String,
    phone: String
  },
  items: [{
    productId: ObjectId,
    name: String,
    price: Number,
    image: String,
    size: String,
    color: String,
    quantity: Number
  }],
  total: Number,
  shipping: Number,
  tax: Number,
  status: String,
  paymentMethod: String,
  shippingMethod: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Customers Collection
```javascript
{
  _id: ObjectId,
  email: String,
  firstName: String,
  lastName: String,
  phone: String,
  address: String,
  city: String,
  postalCode: String,
  country: String,
  newsletterSubscribed: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 10. Next Steps for Admin Development

1. **Set up the admin project** using Vite + React + TypeScript + Tailwind
2. **Install required dependencies** (react-router-dom, react-hook-form, etc.)
3. **Create the admin layout** with sidebar navigation
4. **Implement authentication** for admin access
5. **Build CRUD operations** for all entities (products, orders, customers)
6. **Add analytics dashboard** with charts and metrics
7. **Implement file upload** for product images
8. **Add real-time notifications** for new orders/messages
9. **Create responsive design** for mobile admin access
10. **Add export functionality** for reports and data

This codebase provides everything needed to build a comprehensive admin frontend that matches the Peak Mode brand and integrates seamlessly with the existing e-commerce platform. 