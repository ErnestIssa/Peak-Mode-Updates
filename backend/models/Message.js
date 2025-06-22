import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  ticketNumber: {
    type: String,
    unique: true
  },
  customer: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: String
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['general', 'product', 'order', 'technical', 'billing', 'complaint', 'suggestion'],
    default: 'general'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'resolved', 'closed', 'archived'],
    default: 'new'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  replies: [{
    from: {
      type: String,
      enum: ['customer', 'admin'],
      required: true
    },
    message: {
      type: String,
      required: true
    },
    attachments: [{
      filename: String,
      url: String,
      size: Number
    }],
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    sentAt: {
      type: Date,
      default: Date.now
    }
  }],
  attachments: [{
    filename: String,
    url: String,
    size: Number
  }],
  tags: [String],
  source: {
    type: String,
    enum: ['contact_form', 'email', 'phone', 'chat', 'admin'],
    default: 'contact_form'
  },
  ipAddress: String,
  userAgent: String,
  readAt: Date,
  resolvedAt: Date,
  closedAt: Date,
  notes: String
}, {
  timestamps: true
});

// Generate ticket number before saving
messageSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Get count of messages today
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const messageCount = await this.constructor.countDocuments({
      createdAt: { $gte: today }
    });
    
    const sequence = (messageCount + 1).toString().padStart(4, '0');
    this.ticketNumber = `MSG${year}${month}${day}${sequence}`;
  }
  next();
});

// Virtual for priority color
messageSchema.virtual('priorityColor').get(function() {
  const colors = {
    low: 'green',
    medium: 'yellow',
    high: 'orange',
    urgent: 'red'
  };
  return colors[this.priority] || 'gray';
});

// Virtual for status color
messageSchema.virtual('statusColor').get(function() {
  const colors = {
    new: 'blue',
    read: 'purple',
    replied: 'orange',
    resolved: 'green',
    closed: 'gray',
    archived: 'gray'
  };
  return colors[this.status] || 'gray';
});

// Virtual for category icon
messageSchema.virtual('categoryIcon').get(function() {
  const icons = {
    general: 'message-circle',
    product: 'package',
    order: 'shopping-cart',
    technical: 'settings',
    billing: 'credit-card',
    complaint: 'alert-triangle',
    suggestion: 'lightbulb'
  };
  return icons[this.category] || 'message-circle';
});

// Ensure virtuals are included in JSON output
messageSchema.set('toJSON', { virtuals: true });
messageSchema.set('toObject', { virtuals: true });

const Message = mongoose.model('Message', messageSchema);

export default Message; 