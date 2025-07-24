# Peak Mode Email System Integration

## Overview

This document provides complete implementation guidelines for the Peak Mode email system. The frontend includes all email templates and service interfaces ready for backend integration.

## 📧 Email Templates Implemented

### 1. Newsletter Subscription Confirmation
- **Trigger**: User signs up for newsletter
- **Subject**: "Welcome to Peak Mode — You're Officially In"
- **Content**: Welcome message with benefits and brand messaging

### 2. Order Confirmation
- **Trigger**: After successful checkout
- **Subject**: "Your Peak Mode Order #[orderId] is Confirmed ✅"
- **Content**: Order summary, shipping info, next steps

### 3. Support/Contact Acknowledgment
- **Trigger**: User submits contact/support form
- **Subject**: "We Got Your Message — Team Peak Mode Is on It"
- **Content**: Confirmation with response timeline

## 🏗️ Frontend Implementation

### Email Service Interface
```typescript
// src/lib/emailTemplates.ts
export interface EmailService {
  sendNewsletterSubscription(data: EmailData): Promise<boolean>;
  sendOrderConfirmation(data: EmailData): Promise<boolean>;
  sendSupportAcknowledgment(data: EmailData): Promise<boolean>;
}
```

### Email Data Structure
```typescript
export interface EmailData {
  name?: string;
  email: string;
  orderId?: string;
  products?: Array<{
    name: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
  }>;
  total?: number;
  shippingAddress?: string;
  message?: string;
  subject?: string;
}
```

### Template Functions
```typescript
// Get email templates with data
getNewsletterSubscriptionEmail(data: EmailData): EmailTemplate
getOrderConfirmationEmail(data: EmailData): EmailTemplate
getSupportAcknowledgmentEmail(data: EmailData): EmailTemplate
```

## 🔧 Backend Implementation Guide

### 1. Email Service Setup

#### Choose Email Provider
**Recommended Options:**
- **Resend** (Modern, developer-friendly)
- **Brevo** (Formerly Sendinblue, feature-rich)
- **Nodemailer** (Traditional, flexible)
- **SendGrid** (Enterprise-grade)

#### Environment Variables
```env
# Email Configuration
EMAIL_PROVIDER=resend
EMAIL_API_KEY=your_api_key_here
EMAIL_FROM=support@peakmode.com
EMAIL_FROM_NAME=Peak Mode
EMAIL_REPLY_TO=support@peakmode.com

# Domain Configuration
SITE_URL=https://peakmode.com
ADMIN_EMAIL=admin@peakmode.com
```

### 2. Backend Email Service Implementation

#### Node.js/Express Example
```javascript
// emailService.js
const { Resend } = require('resend');
const resend = new Resend(process.env.EMAIL_API_KEY);

class EmailService {
  async sendNewsletterSubscription(data) {
    try {
      const { subject, html, text } = getNewsletterSubscriptionEmail(data);
      
      const result = await resend.emails.send({
        from: process.env.EMAIL_FROM,
        to: data.email,
        subject: subject,
        html: html,
        text: text,
      });
      
      console.log('Newsletter subscription email sent:', result);
      return true;
    } catch (error) {
      console.error('Failed to send newsletter email:', error);
      return false;
    }
  }

  async sendOrderConfirmation(data) {
    try {
      const { subject, html, text } = getOrderConfirmationEmail(data);
      
      const result = await resend.emails.send({
        from: process.env.EMAIL_FROM,
        to: data.email,
        subject: subject,
        html: html,
        text: text,
      });
      
      console.log('Order confirmation email sent:', result);
      return true;
    } catch (error) {
      console.error('Failed to send order confirmation email:', error);
      return false;
    }
  }

  async sendSupportAcknowledgment(data) {
    try {
      const { subject, html, text } = getSupportAcknowledgmentEmail(data);
      
      const result = await resend.emails.send({
        from: process.env.EMAIL_FROM,
        to: data.email,
        subject: subject,
        html: html,
        text: text,
      });
      
      console.log('Support acknowledgment email sent:', result);
      return true;
    } catch (error) {
      console.error('Failed to send support email:', error);
      return false;
    }
  }
}

module.exports = new EmailService();
```

#### API Endpoints
```javascript
// emailRoutes.js
const express = require('express');
const router = express.Router();
const emailService = require('./emailService');
const { validateEmailData } = require('./validation');

// Newsletter subscription
router.post('/newsletter-subscription', async (req, res) => {
  try {
    const { email, name } = req.body;
    
    if (!validateEmailData({ email })) {
      return res.status(400).json({ error: 'Invalid email data' });
    }
    
    const success = await emailService.sendNewsletterSubscription({
      email,
      name
    });
    
    if (success) {
      res.json({ success: true, message: 'Newsletter subscription email sent' });
    } else {
      res.status(500).json({ error: 'Failed to send email' });
    }
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Order confirmation
router.post('/order-confirmation', async (req, res) => {
  try {
    const { email, name, orderId, products, total, shippingAddress } = req.body;
    
    if (!validateEmailData({ email })) {
      return res.status(400).json({ error: 'Invalid email data' });
    }
    
    const success = await emailService.sendOrderConfirmation({
      email,
      name,
      orderId,
      products,
      total,
      shippingAddress
    });
    
    if (success) {
      res.json({ success: true, message: 'Order confirmation email sent' });
    } else {
      res.status(500).json({ error: 'Failed to send email' });
    }
  } catch (error) {
    console.error('Order confirmation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Support acknowledgment
router.post('/support-acknowledgment', async (req, res) => {
  try {
    const { email, name, message } = req.body;
    
    if (!validateEmailData({ email })) {
      return res.status(400).json({ error: 'Invalid email data' });
    }
    
    const success = await emailService.sendSupportAcknowledgment({
      email,
      name,
      message
    });
    
    if (success) {
      res.json({ success: true, message: 'Support acknowledgment email sent' });
    } else {
      res.status(500).json({ error: 'Failed to send email' });
    }
  } catch (error) {
    console.error('Support acknowledgment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
```

### 3. Frontend Integration

#### Update Email Service
```typescript
// src/lib/emailService.ts
export class RealEmailService implements EmailService {
  private baseUrl: string = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  async sendNewsletterSubscription(data: EmailData): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/email/newsletter-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to send newsletter email:', error);
      return false;
    }
  }

  async sendOrderConfirmation(data: EmailData): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/email/order-confirmation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to send order confirmation email:', error);
      return false;
    }
  }

  async sendSupportAcknowledgment(data: EmailData): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/email/support-acknowledgment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to send support email:', error);
      return false;
    }
  }
}
```

## 📧 Email Template Features

### Brand Consistency
- **Logo**: Peak Mode branding in header
- **Colors**: Black and white theme
- **Typography**: Inter font family
- **Tone**: Motivational, professional, bold

### Responsive Design
- **Mobile-friendly**: Optimized for all devices
- **Fallback fonts**: System font stack
- **Flexible layout**: Adapts to different screen sizes

### Content Features
- **Dynamic variables**: {{name}}, {{orderId}}, {{products}}, etc.
- **HTML and text versions**: Both formats provided
- **Call-to-action buttons**: Styled links for engagement
- **Social media links**: Instagram, Facebook, TikTok

## 🔐 Security Considerations

### Email Validation
```javascript
function validateEmailData(data) {
  if (!data.email) {
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return false;
  }
  
  return true;
}
```

### Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const emailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many email requests from this IP'
});

app.use('/api/email', emailLimiter);
```

### Spam Protection
- **DKIM signing**: Authenticate email domain
- **SPF records**: Prevent email spoofing
- **DMARC policy**: Email authentication policy
- **Content filtering**: Check for spam indicators

## 📊 Email Analytics

### Tracking Setup
```javascript
// Add tracking parameters to email links
function addTrackingToLinks(html, emailType, userId) {
  return html.replace(
    /href="(https:\/\/peakmode\.com[^"]*)"/g,
    `href="$1?utm_source=email&utm_medium=${emailType}&utm_campaign=peakmode&user_id=${userId}"`
  );
}
```

### Metrics to Track
- **Open rates**: Email open tracking
- **Click rates**: Link click tracking
- **Bounce rates**: Failed delivery tracking
- **Unsubscribe rates**: Opt-out tracking

## 🧪 Testing

### Email Testing
```javascript
// Test email templates
async function testEmailTemplates() {
  const testData = {
    email: 'test@example.com',
    name: 'Test User',
    orderId: 'PM-12345678',
    products: [
      {
        name: 'Peak Mode Performance Shorts',
        size: 'M',
        color: 'Black',
        quantity: 1,
        price: 299
      }
    ],
    total: 299,
    shippingAddress: 'Test Address, Stockholm, Sweden',
    message: 'This is a test message'
  };

  // Test all templates
  await emailService.sendNewsletterSubscription(testData);
  await emailService.sendOrderConfirmation(testData);
  await emailService.sendSupportAcknowledgment(testData);
}
```

### Development Environment
```javascript
// Use test email service for development
if (process.env.NODE_ENV === 'development') {
  // Log emails instead of sending
  console.log('📧 Email would be sent:', emailData);
  return true;
}
```

## 🚀 Deployment Checklist

### Email Provider Setup
- [ ] Create email provider account
- [ ] Verify sender domain
- [ ] Set up API keys
- [ ] Configure webhooks (if needed)

### Domain Configuration
- [ ] Set up SPF records
- [ ] Configure DKIM signing
- [ ] Add DMARC policy
- [ ] Verify domain ownership

### Environment Variables
- [ ] Set production API keys
- [ ] Configure sender email
- [ ] Set up tracking domains
- [ ] Add monitoring alerts

### Testing
- [ ] Send test emails
- [ ] Verify template rendering
- [ ] Check mobile responsiveness
- [ ] Test all email triggers

## 📞 Support

### Common Issues
1. **Email not sending**: Check API keys and domain verification
2. **Template not rendering**: Verify HTML structure and CSS
3. **Spam filtering**: Check email authentication setup
4. **Rate limiting**: Implement proper request throttling

### Monitoring
- Set up email delivery monitoring
- Configure bounce handling
- Monitor unsubscribe rates
- Track email engagement metrics

---

**Note**: This email system is fully integrated with the Peak Mode frontend and ready for backend implementation. All templates follow the brand guidelines and include proper error handling and validation. 