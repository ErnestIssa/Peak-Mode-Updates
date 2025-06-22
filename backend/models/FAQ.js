import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['general', 'products', 'orders', 'shipping', 'returns', 'account', 'technical'],
    default: 'general'
  },
  tags: [String],
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
  viewCount: {
    type: Number,
    default: 0
  },
  helpful: {
    yes: {
      type: Number,
      default: 0
    },
    no: {
      type: Number,
      default: 0
    }
  },
  seo: {
    title: String,
    description: String,
    keywords: [String]
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
faqSchema.index({ category: 1, isActive: 1, order: 1 });
faqSchema.index({ question: 'text', answer: 'text', tags: 'text' });

// Virtual for helpful percentage
faqSchema.virtual('helpfulPercentage').get(function() {
  const total = this.helpful.yes + this.helpful.no;
  if (total === 0) return 0;
  return Math.round((this.helpful.yes / total) * 100);
});

// Virtual for category icon
faqSchema.virtual('categoryIcon').get(function() {
  const icons = {
    general: 'help-circle',
    products: 'package',
    orders: 'shopping-cart',
    shipping: 'truck',
    returns: 'refresh-cw',
    account: 'user',
    technical: 'settings'
  };
  return icons[this.category] || 'help-circle';
});

// Ensure virtuals are included in JSON output
faqSchema.set('toJSON', { virtuals: true });
faqSchema.set('toObject', { virtuals: true });

const FAQ = mongoose.model('FAQ', faqSchema);

export default FAQ; 