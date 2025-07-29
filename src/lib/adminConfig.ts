// Admin Configuration System
// This file manages all content and settings that can be controlled by the admin panel

export interface AdminConfig {
  // Site Settings
  siteSettings: SiteSettings;
  
  // Content Management
  content: ContentManagement;
  
  // Product Management
  products: ProductManagement;
  
  // Marketing & SEO
  marketing: MarketingSettings;
  
  // User Experience
  userExperience: UserExperienceSettings;
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  logo: {
    url: string;
    alt: string;
  };
  favicon: string;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  socialMedia: {
    instagram: string;
    facebook: string;
    tiktok: string;
  };
  businessHours: string;
  shippingInfo: {
    freeShippingThreshold: number;
    standardShippingCost: number;
    estimatedDeliveryDays: number;
  };
}

export interface ContentManagement {
  // Hero Section
  hero: {
    title: string;
    subtitle: string;
    backgroundImages: string[];
    ctaText: string;
    ctaLink: string;
  };
  
  // About Section
  about: {
    title: string;
    subtitle: string;
    description: string;
    rotatingTexts: string[];
    image: string;
    galleryImages: string[];
    features: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
  
  // Newsletter Section
  newsletter: {
    title: string;
    subtitle: string;
    description: string;
    privacyPolicyText: string;
  };
  
  // Footer
  footer: {
    supportLinks: Array<{
      title: string;
      url: string;
    }>;
    companyInfo: string;
  };
  
  // Legal Pages
  legal: {
    privacyPolicy: string;
    termsOfService: string;
    dataProtection: string;
    cookiePolicy: string;
  };
  
  // FAQ
  faq: Array<{
    question: string;
    answer: string;
    category: string;
  }>;
}

export interface ProductManagement {
  categories: Array<{
    id: string;
    name: string;
    description: string;
    image: string;
    slug: string;
  }>;
  
  featuredProducts: string[]; // Product IDs
  
  productSettings: {
    enableReviews: boolean;
    enableWishlist: boolean;
    enableQuickView: boolean;
    enableSizeGuide: boolean;
  };
  
  inventorySettings: {
    lowStockThreshold: number;
    outOfStockMessage: string;
  };
}

export interface MarketingSettings {
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    ogImage: string;
  };
  
  promotions: Array<{
    id: string;
    title: string;
    description: string;
    discountCode: string;
    discountPercentage: number;
    validFrom: string;
    validTo: string;
    isActive: boolean;
  }>;
  
  popupSettings: {
    enabled: boolean;
    title: string;
    message: string;
    ctaText: string;
    discountCode: string;
    image: string;
  };
}

export interface UserExperienceSettings {
  checkout: {
    enableGuestCheckout: boolean;
    requirePhone: boolean;
    enableNewsletterSignup: boolean;
    paymentMethods: string[];
  };
  
  notifications: {
    orderConfirmation: boolean;
    shippingUpdates: boolean;
    marketingEmails: boolean;
  };
  
  display: {
    currency: string;
    currencySymbol: string;
    showPrices: boolean;
    enableDarkMode: boolean;
  };
}

// Default Configuration
export const defaultAdminConfig: AdminConfig = {
  siteSettings: {
    siteName: "Peak Mode",
    siteDescription: "Not Just Apparel, A Mode You Enter, A Mindset You Wear",
    logo: {
      url: "/logo.png",
      alt: "Peak Mode Logo"
    },
    favicon: "/favicon.ico",
    contactInfo: {
      email: "info@peakmode.com",
      phone: "+46 123 456 789",
      address: "Stockholm, Sweden"
    },
    socialMedia: {
          instagram: "https://www.instagram.com/peakmode1?igsh=dWc3aTQwMncxbzJ5&utm_source=qr",
    facebook: "https://facebook.com/peakmode",
    tiktok: "https://www.tiktok.com/@peakmode.co?_t=ZN-8yK5XPNYEr8&_r=1"
    },
    businessHours: "Mon-Fri: 9AM-6PM",
    shippingInfo: {
      freeShippingThreshold: 500,
      standardShippingCost: 99,
      estimatedDeliveryDays: 3
    }
  },
  
  content: {
    hero: {
      title: "NO LIMITS.\nJUST PEAKS.",
      subtitle: "Not Just Apparel, A Mode You Enter, A Mindset You Wear",
      backgroundImages: [
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
      ],
      ctaText: "Shop Now",
      ctaLink: "/shop"
    },
    
    about: {
      title: "Peak Mode — Not Just Apparel.",
      subtitle: "You weren't made to blend in. You were made to evolve.",
      description: "At Peak Mode, we don't follow trends — we follow truth. The quiet truth of those who train in silence, grow through discomfort, and show up when no one's watching.",
      rotatingTexts: [
        "A mode You enter.",
        "A mindset You wear."
      ],
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      galleryImages: [
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ],
      features: [
        {
          title: "Designed for both the gym and the grind outside it",
          description: "Versatile performance gear that transitions seamlessly from workout to everyday life.",
          icon: "dumbbell"
        },
        {
          title: "Rooted in purpose — not perfection",
          description: "Built for progress, not perfection. Every piece serves a purpose in your journey.",
          icon: "target"
        },
        {
          title: "Created by someone who lives this journey, just like you",
          description: "Authentic gear designed by someone who understands the grind firsthand.",
          icon: "heart"
        }
      ]
    },
    
    newsletter: {
      title: "Join The Peak Mode Movement",
      subtitle: "Don't miss out! Limited-time offers and exclusive releases—straight to your inbox. Sign up now!",
      description: "Stay updated with the latest drops and exclusive content.",
      privacyPolicyText: "By subscribing, you agree to our Privacy Policy and consent to receive updates from our company."
    },
    
    footer: {
      supportLinks: [
        { title: "Contact Us", url: "/contact" },
        { title: "FAQ", url: "/faq" },
        { title: "Shipping Info", url: "/shipping" },
        { title: "Returns", url: "/returns" }
      ],
      companyInfo: "Peak Mode - Elevate Your Performance"
    },
    
    legal: {
      privacyPolicy: "Your privacy is important to us...",
      termsOfService: "By using our website, you agree to these terms...",
      dataProtection: "We are committed to protecting your data...",
      cookiePolicy: "This website uses cookies to enhance your experience..."
    },
    
    faq: [
      {
        question: "What is Peak Mode?",
        answer: "Peak Mode is a performance-driven fitness brand that creates gym-to-street apparel for ambitious individuals.",
        category: "general"
      },
      {
        question: "Where do you ship from?",
        answer: "All orders are shipped from our Swedish fulfillment center to ensure fast and reliable delivery within Sweden.",
        category: "shipping"
      }
    ]
  },
  
  products: {
    categories: [
      {
        id: "mens",
        name: "Men's Collection",
        description: "Performance gear designed for the modern athlete",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        slug: "mens-collection"
      },
      {
        id: "womens",
        name: "Women's Collection",
        description: "Empowering women to reach their peak performance",
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        slug: "womens-collection"
      },
      {
        id: "accessories",
        name: "Accessories",
        description: "Complete your look with premium accessories",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        slug: "accessories-collection"
      }
    ],
    
    featuredProducts: [],
    
    productSettings: {
      enableReviews: true,
      enableWishlist: true,
      enableQuickView: true,
      enableSizeGuide: true
    },
    
    inventorySettings: {
      lowStockThreshold: 5,
      outOfStockMessage: "Currently out of stock"
    }
  },
  
  marketing: {
    seo: {
      metaTitle: "Peak Mode - Performance Fitness Apparel",
      metaDescription: "Not Just Apparel, A Mode You Enter, A Mindset You Wear. Premium fitness gear for those who chase progress.",
      keywords: ["fitness apparel", "gym wear", "performance gear", "athletic wear"],
      ogImage: "/og-image.png"
    },
    
    promotions: [],
    
    popupSettings: {
      enabled: true,
      title: "Welcome to Peak Mode.",
      message: "Join the movement and get 10% OFF your first order—because discipline deserves rewards.",
      ctaText: "ACTIVATE DISCOUNT",
      discountCode: "WELCOME10",
      image: "/popup-image.jpg"
    }
  },
  
  userExperience: {
    checkout: {
      enableGuestCheckout: true,
      requirePhone: false,
      enableNewsletterSignup: true,
      paymentMethods: ["card", "klarna", "paypal", "swish", "apple-pay", "google-pay"]
    },
    
    notifications: {
      orderConfirmation: true,
      shippingUpdates: true,
      marketingEmails: true
    },
    
    display: {
      currency: "SEK",
      currencySymbol: "kr",
      showPrices: true,
      enableDarkMode: false
    }
  }
};

// Admin API endpoints (to be implemented with backend)
export const ADMIN_API_ENDPOINTS = {
  // Content Management
  GET_CONTENT: '/api/admin/content',
  UPDATE_CONTENT: '/api/admin/content',
  
  // Site Settings
  GET_SETTINGS: '/api/admin/settings',
  UPDATE_SETTINGS: '/api/admin/settings',
  
  // Products
  GET_PRODUCTS: '/api/admin/products',
  CREATE_PRODUCT: '/api/admin/products',
  UPDATE_PRODUCT: '/api/admin/products/:id',
  DELETE_PRODUCT: '/api/admin/products/:id',
  
  // Categories
  GET_CATEGORIES: '/api/admin/categories',
  CREATE_CATEGORY: '/api/admin/categories',
  UPDATE_CATEGORY: '/api/admin/categories/:id',
  DELETE_CATEGORY: '/api/admin/categories/:id',
  
  // Orders
  GET_ORDERS: '/api/admin/orders',
  UPDATE_ORDER: '/api/admin/orders/:id',
  
  // Analytics
  GET_ANALYTICS: '/api/admin/analytics',
  
  // Media Upload
  UPLOAD_IMAGE: '/api/admin/upload/image',
  UPLOAD_FILE: '/api/admin/upload/file',
  
  // Authentication
  LOGIN: '/api/admin/auth/login',
  LOGOUT: '/api/admin/auth/logout',
  VERIFY_TOKEN: '/api/admin/auth/verify'
};

// Content update types for admin integration
export type ContentUpdateType = 
  | 'hero'
  | 'about'
  | 'newsletter'
  | 'footer'
  | 'legal'
  | 'faq'
  | 'settings'
  | 'products'
  | 'categories'
  | 'marketing';

export interface ContentUpdate {
  type: ContentUpdateType;
  data: any;
  timestamp: string;
  adminId: string;
} 