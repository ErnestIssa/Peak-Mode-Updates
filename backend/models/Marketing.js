import mongoose from 'mongoose';

const marketingSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['banner', 'campaign', 'countdown', 'popup', 'subscriber'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  content: {
    text: String,
    images: [{
      url: String,
      alt: String,
      isPrimary: {
        type: Boolean,
        default: false
      }
    }],
    videos: [{
      url: String,
      type: String
    }],
    links: [{
      text: String,
      url: String,
      isPrimary: {
        type: Boolean,
        default: false
      }
    }]
  },
  settings: {
    position: {
      type: String,
      enum: ['top', 'bottom', 'left', 'right', 'center'],
      default: 'top'
    },
    backgroundColor: String,
    textColor: String,
    buttonColor: String,
    buttonTextColor: String,
    fontSize: String,
    width: String,
    height: String,
    borderRadius: String,
    shadow: String,
    animation: {
      type: String,
      enum: ['fade', 'slide', 'bounce', 'none'],
      default: 'fade'
    },
    delay: {
      type: Number,
      default: 0
    },
    duration: {
      type: Number,
      default: 5000
    }
  },
  targeting: {
    pages: [String],
    devices: [{
      type: String,
      enum: ['desktop', 'mobile', 'tablet'],
      default: ['desktop', 'mobile', 'tablet']
    }],
    countries: [String],
    userTypes: [{
      type: String,
      enum: ['new', 'returning', 'all'],
      default: ['all']
    }],
    conditions: {
      minOrderValue: Number,
      maxOrderValue: Number,
      productCategories: [String],
      userSegments: [String]
    }
  },
  scheduling: {
    isActive: {
      type: Boolean,
      default: true
    },
    startDate: Date,
    endDate: Date,
    daysOfWeek: [{
      type: Number,
      min: 0,
      max: 6
    }],
    timeSlots: [{
      start: String, // HH:MM format
      end: String    // HH:MM format
    }],
    maxImpressions: Number,
    maxClicks: Number,
    frequency: {
      type: String,
      enum: ['once', 'daily', 'weekly', 'monthly'],
      default: 'once'
    }
  },
  analytics: {
    impressions: {
      type: Number,
      default: 0
    },
    clicks: {
      type: Number,
      default: 0
    },
    conversions: {
      type: Number,
      default: 0
    },
    revenue: {
      type: Number,
      default: 0
    },
    ctr: {
      type: Number,
      default: 0
    },
    conversionRate: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for efficient queries
marketingSchema.index({ type: 1, isActive: 1, order: 1 });
marketingSchema.index({ 'scheduling.startDate': 1, 'scheduling.endDate': 1 });

// Virtual for click-through rate
marketingSchema.virtual('ctr').get(function() {
  if (this.analytics.impressions === 0) return 0;
  return Math.round((this.analytics.clicks / this.analytics.impressions) * 100 * 100) / 100;
});

// Virtual for conversion rate
marketingSchema.virtual('conversionRate').get(function() {
  if (this.analytics.clicks === 0) return 0;
  return Math.round((this.analytics.conversions / this.analytics.clicks) * 100 * 100) / 100;
});

// Virtual for status
marketingSchema.virtual('status').get(function() {
  if (!this.isActive) return 'inactive';
  if (!this.scheduling.isActive) return 'scheduled';
  
  const now = new Date();
  if (this.scheduling.startDate && now < this.scheduling.startDate) return 'scheduled';
  if (this.scheduling.endDate && now > this.scheduling.endDate) return 'expired';
  
  return 'active';
});

// Ensure virtuals are included in JSON output
marketingSchema.set('toJSON', { virtuals: true });
marketingSchema.set('toObject', { virtuals: true });

const Marketing = mongoose.model('Marketing', marketingSchema);

export default Marketing; 