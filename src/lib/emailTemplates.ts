// Peak Mode Email Templates
// These templates will be used by the backend email service when the site is live

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

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

// Base email styling for consistent branding
const baseEmailStyles = `
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      background-color: #ffffff;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background-color: #000000;
      color: #ffffff;
      padding: 40px 30px;
      text-align: center;
    }
    .logo {
      font-size: 28px;
      font-weight: 900;
      letter-spacing: -0.02em;
      margin-bottom: 10px;
    }
    .tagline {
      font-size: 14px;
      opacity: 0.8;
      font-weight: 300;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 20px;
    }
    .message {
      font-size: 16px;
      margin-bottom: 20px;
      color: #4a4a4a;
    }
    .highlight {
      background-color: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .product-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #e9ecef;
    }
    .product-item:last-child {
      border-bottom: none;
    }
    .product-details {
      flex: 1;
    }
    .product-name {
      font-weight: 600;
      margin-bottom: 4px;
    }
    .product-meta {
      font-size: 14px;
      color: #6c757d;
    }
    .product-price {
      font-weight: 600;
      text-align: right;
    }
    .total {
      font-size: 18px;
      font-weight: 700;
      text-align: right;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 2px solid #000000;
    }
    .cta-button {
      display: inline-block;
      background-color: #000000;
      color: #ffffff;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 10px 20px 0;
    }
    .cta-button:hover {
      background-color: #333333;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 30px;
      text-align: center;
      font-size: 14px;
      color: #6c757d;
    }
    .social-links {
      margin: 20px 0;
    }
    .social-links a {
      color: #000000;
      text-decoration: none;
      margin: 0 10px;
      font-weight: 600;
    }
    .signature {
      margin-top: 30px;
      font-weight: 600;
    }
    .brand-quote {
      font-style: italic;
      color: #6c757d;
      margin: 20px 0;
      font-size: 14px;
    }
  </style>
`;

// Helper function to generate email HTML
const generateEmailHTML = (content: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Peak Mode</title>
      ${baseEmailStyles}
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <div class="logo">PEAK | MODE</div>
          <div class="tagline">Not Just Apparel, A Mode You Enter, A Mindset You Wear</div>
        </div>
        
        <div class="content">
          ${content}
        </div>
        
        <div class="footer">
          <div class="social-links">
            <a href="https://instagram.com/peakmode">Instagram</a> |
            <a href="https://facebook.com/peakmode">Facebook</a> |
            <a href="https://tiktok.com/@peakmode">TikTok</a>
          </div>
          <div>© 2024 Peak Mode. All rights reserved.</div>
          <div>Stockholm, Sweden</div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// 1. Newsletter Subscription Confirmation
export const getNewsletterSubscriptionEmail = (data: EmailData): EmailTemplate => {
  const name = data.name || 'Athlete';
  
  const htmlContent = `
    <div class="greeting">Hi ${name},</div>
    
    <div class="message">
      Thanks for subscribing to Peak Mode!
    </div>
    
    <div class="message">
      You've just taken the first step toward leveling up your mindset and performance. Be ready for:
    </div>
    
    <div class="highlight">
      <div style="margin-bottom: 10px;">✔️ Early access to new drops</div>
      <div style="margin-bottom: 10px;">✔️ Exclusive subscriber-only offers</div>
      <div>✔️ Tips and motivation to fuel your journey</div>
    </div>
    
    <div class="brand-quote">
      Peak Mode isn't just apparel — it's a mindset you wear.<br>
      No limits. Just peaks.
    </div>
    
    <div class="signature">
      Talk soon,<br>
      <strong>Team Peak Mode</strong>
    </div>
    
    <div style="margin-top: 30px;">
      <a href="https://instagram.com/peakmode" class="cta-button">Follow us on Instagram</a>
      <a href="https://peakmode.com/shop" class="cta-button">Visit the Store</a>
    </div>
  `;

  const textContent = `
Hi ${name},

Thanks for subscribing to Peak Mode!

You've just taken the first step toward leveling up your mindset and performance. Be ready for:

✔️ Early access to new drops
✔️ Exclusive subscriber-only offers
✔️ Tips and motivation to fuel your journey

Peak Mode isn't just apparel — it's a mindset you wear.
No limits. Just peaks.

Talk soon,
Team Peak Mode

Follow us on Instagram: https://instagram.com/peakmode
Visit the Store: https://peakmode.com/shop
  `;

  return {
    subject: "Welcome to Peak Mode — You're Officially In",
    html: generateEmailHTML(htmlContent),
    text: textContent
  };
};

// 2. Order Confirmation
export const getOrderConfirmationEmail = (data: EmailData): EmailTemplate => {
  const name = data.name || 'Customer';
  const orderId = data.orderId || 'N/A';
  const total = data.total ? `${data.total} kr` : 'N/A';
  const shippingAddress = data.shippingAddress || 'N/A';
  
  // Generate products list
  let productsHTML = '';
  let productsText = '';
  
  if (data.products && data.products.length > 0) {
    productsHTML = data.products.map(product => `
      <div class="product-item">
        <div class="product-details">
          <div class="product-name">${product.name}</div>
          <div class="product-meta">Size: ${product.size} | Color: ${product.color} | Qty: ${product.quantity}</div>
        </div>
        <div class="product-price">${product.price} kr</div>
      </div>
    `).join('');
    
    productsText = data.products.map(product => 
      `${product.name} - Size: ${product.size}, Color: ${product.color}, Qty: ${product.quantity} - ${product.price} kr`
    ).join('\n');
  }

  const htmlContent = `
    <div class="greeting">Hi ${name},</div>
    
    <div class="message">
      Your order has been received and is currently being processed.<br>
      Thank you for choosing Peak Mode — where progress meets performance.
    </div>
    
    <div class="highlight">
      <div style="font-weight: 600; margin-bottom: 15px;">🛍️ Order Summary</div>
      <div style="margin-bottom: 10px;"><strong>Order ID:</strong> ${orderId}</div>
      <div style="margin-bottom: 15px;"><strong>Items:</strong></div>
      ${productsHTML}
      <div class="total">Total: ${total}</div>
      <div style="margin-top: 15px;"><strong>Shipping to:</strong> ${shippingAddress}</div>
    </div>
    
    <div class="message">
      <strong>What's next?</strong><br>
      You'll receive another email when your order is shipped, including tracking info.
    </div>
    
    <div style="margin: 30px 0;">
      <a href="https://peakmode.com/contact" class="cta-button">Need Help? Reach Out</a>
    </div>
    
    <div class="brand-quote">
      Thanks again for being part of the movement.<br>
      No limits. Just peaks.
    </div>
    
    <div class="signature">
      – Team Peak Mode
    </div>
  `;

  const textContent = `
Hi ${name},

Your order has been received and is currently being processed.
Thank you for choosing Peak Mode — where progress meets performance.

🛍️ Order Summary
Order ID: ${orderId}
Items:
${productsText}

Total: ${total}
Shipping to: ${shippingAddress}

What's next?
You'll receive another email when your order is shipped, including tracking info.

Need help? Contact us: https://peakmode.com/contact

Thanks again for being part of the movement.
No limits. Just peaks.

– Team Peak Mode
  `;

  return {
    subject: `Your Peak Mode Order #${orderId} is Confirmed ✅`,
    html: generateEmailHTML(htmlContent),
    text: textContent
  };
};

// 3. Support/Contact Message Acknowledgment
export const getSupportAcknowledgmentEmail = (data: EmailData): EmailTemplate => {
  const name = data.name || 'there';
  const message = data.message || 'Your message';
  
  const htmlContent = `
    <div class="greeting">Hi ${name},</div>
    
    <div class="message">
      Thanks for reaching out to us!
    </div>
    
    <div class="message">
      We've received your message and will get back to you within 24–48 hours.<br>
      In the meantime, feel free to explore our site or check out our FAQs.
    </div>
    
    <div class="highlight">
      <div style="font-weight: 600; margin-bottom: 10px;">Your message:</div>
      <div style="font-style: italic; color: #6c757d;">"${message}"</div>
    </div>
    
    <div class="message">
      We appreciate your patience and support.
    </div>
    
    <div style="margin: 30px 0;">
      <a href="https://peakmode.com/faq" class="cta-button">Check Our FAQs</a>
      <a href="https://peakmode.com/shop" class="cta-button">Visit the Store</a>
    </div>
    
    <div class="signature">
      – Team Peak Mode<br>
      <a href="https://peakmode.com" style="color: #000000;">peakmode.com</a>
    </div>
  `;

  const textContent = `
Hi ${name},

Thanks for reaching out to us!

We've received your message and will get back to you within 24–48 hours.
In the meantime, feel free to explore our site or check out our FAQs.

Your message:
"${message}"

We appreciate your patience and support.

– Team Peak Mode
peakmode.com
  `;

  return {
    subject: "We Got Your Message — Team Peak Mode Is on It",
    html: generateEmailHTML(htmlContent),
    text: textContent
  };
};

// Email service interface for backend integration
export interface EmailService {
  sendNewsletterSubscription(data: EmailData): Promise<boolean>;
  sendOrderConfirmation(data: EmailData): Promise<boolean>;
  sendSupportAcknowledgment(data: EmailData): Promise<boolean>;
}

// Mock email service for development (replace with real implementation)
export class MockEmailService implements EmailService {
  async sendNewsletterSubscription(data: EmailData): Promise<boolean> {
    console.log('📧 Newsletter Subscription Email:', {
      to: data.email,
      template: getNewsletterSubscriptionEmail(data)
    });
    return true;
  }

  async sendOrderConfirmation(data: EmailData): Promise<boolean> {
    console.log('📧 Order Confirmation Email:', {
      to: data.email,
      template: getOrderConfirmationEmail(data)
    });
    return true;
  }

  async sendSupportAcknowledgment(data: EmailData): Promise<boolean> {
    console.log('📧 Support Acknowledgment Email:', {
      to: data.email,
      template: getSupportAcknowledgmentEmail(data)
    });
    return true;
  }
}

// Export singleton instance
export const emailService = new MockEmailService();

// Helper function to validate email data
export const validateEmailData = (data: EmailData): boolean => {
  if (!data.email) {
    console.error('Email is required');
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    console.error('Invalid email format');
    return false;
  }
  
  return true;
};

// Email template preview function (for admin panel)
export const previewEmailTemplate = (
  templateType: 'newsletter' | 'order' | 'support',
  data: EmailData
): EmailTemplate => {
  switch (templateType) {
    case 'newsletter':
      return getNewsletterSubscriptionEmail(data);
    case 'order':
      return getOrderConfirmationEmail(data);
    case 'support':
      return getSupportAcknowledgmentEmail(data);
    default:
      throw new Error(`Unknown template type: ${templateType}`);
  }
}; 