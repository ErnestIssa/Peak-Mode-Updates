import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  business: {
    name: {
      type: String,
      default: 'Peak Mode'
    },
    email: {
      type: String,
      default: 'info@peakmode.com'
    },
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: {
        type: String,
        default: 'US'
      }
    },
    logo: {
      url: String,
      alt: String
    },
    favicon: {
      url: String
    },
    socialMedia: {
      facebook: String,
      twitter: String,
      instagram: String,
      linkedin: String,
      youtube: String
    }
  },
  email: {
    provider: {
      type: String,
      enum: ['smtp', 'sendgrid', 'mailgun', 'aws-ses'],
      default: 'smtp'
    },
    smtp: {
      host: String,
      port: Number,
      secure: {
        type: Boolean,
        default: true
      },
      username: String,
      password: String
    },
    fromName: {
      type: String,
      default: 'Peak Mode'
    },
    fromEmail: {
      type: String,
      default: 'noreply@peakmode.com'
    },
    templates: {
      orderConfirmation: String,
      shippingNotification: String,
      passwordReset: String,
      welcome: String
    }
  },
  shipping: {
    methods: [{
      name: String,
      price: Number,
      freeThreshold: Number,
      estimatedDays: String,
      isActive: {
        type: Boolean,
        default: true
      }
    }],
    zones: [{
      name: String,
      countries: [String],
      methods: [String]
    }],
    packaging: {
      weight: Number,
      dimensions: {
        length: Number,
        width: Number,
        height: Number
      }
    }
  },
  payment: {
    currency: {
      type: String,
      default: 'USD'
    },
    stripe: {
      publishableKey: String,
      secretKey: String,
      webhookSecret: String,
      isActive: {
        type: Boolean,
        default: false
      }
    },
    paypal: {
      clientId: String,
      clientSecret: String,
      isActive: {
        type: Boolean,
        default: false
      }
    },
    cashOnDelivery: {
      isActive: {
        type: Boolean,
        default: true
      },
      maxAmount: Number
    }
  },
  website: {
    title: {
      type: String,
      default: 'Peak Mode - Premium Fashion & Lifestyle'
    },
    description: String,
    keywords: [String],
    maintenance: {
      isActive: {
        type: Boolean,
        default: false
      },
      message: String
    },
    analytics: {
      googleAnalytics: String,
      facebookPixel: String
    },
    seo: {
      robotsTxt: String,
      sitemapUrl: String,
      canonicalUrl: String
    }
  },
  notifications: {
    email: {
      newOrder: {
        type: Boolean,
        default: true
      },
      lowStock: {
        type: Boolean,
        default: true
      },
      newReview: {
        type: Boolean,
        default: true
      },
      newMessage: {
        type: Boolean,
        default: true
      }
    },
    sms: {
      orderUpdates: {
        type: Boolean,
        default: false
      },
      marketing: {
        type: Boolean,
        default: false
      }
    }
  },
  integrations: {
    googleShopping: {
      isActive: {
        type: Boolean,
        default: false
      },
      merchantId: String,
      apiKey: String
    },
    facebookShop: {
      isActive: {
        type: Boolean,
        default: false
      },
      pageId: String,
      accessToken: String
    },
    instagramShop: {
      isActive: {
        type: Boolean,
        default: false
      },
      accountId: String,
      accessToken: String
    }
  },
  security: {
    sessionTimeout: {
      type: Number,
      default: 24 // hours
    },
    maxLoginAttempts: {
      type: Number,
      default: 5
    },
    lockoutDuration: {
      type: Number,
      default: 15 // minutes
    },
    requireTwoFactor: {
      type: Boolean,
      default: false
    }
  },
  backup: {
    autoBackup: {
      type: Boolean,
      default: true
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'daily'
    },
    retention: {
      type: Number,
      default: 30 // days
    },
    lastBackup: Date
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
settingsSchema.statics.getInstance = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = new this();
    await settings.save();
  }
  return settings;
};

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings; 