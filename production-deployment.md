# Peak Mode - Production Deployment Guide

## 🔐 Admin Security Configuration

### 1. Environment Variables for Production

Create a `.env.production` file:

```env
# Production Security
NODE_ENV=production
VITE_ADMIN_ENABLED=false
VITE_API_URL=https://your-domain.com/api

# Admin Access Control
ADMIN_IP_WHITELIST=192.168.1.1,203.0.113.1
ADMIN_ACCESS_TOKEN=your-super-secret-admin-token-here

# SSL Configuration
FORCE_HTTPS=true
SECURE_COOKIES=true
```

### 2. Server-Side Admin Protection (Backend)

Add to your backend middleware:

```javascript
// middleware/adminAccess.js
export const protectAdminInProduction = (req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    // IP Whitelist Check
    const allowedIPs = process.env.ADMIN_IP_WHITELIST?.split(',') || [];
    const clientIP = req.ip || req.connection.remoteAddress;
    
    if (!allowedIPs.includes(clientIP)) {
      return res.status(404).json({ message: 'Not Found' });
    }
    
    // Additional Token Check
    const adminToken = req.headers['x-admin-token'];
    if (!adminToken || adminToken !== process.env.ADMIN_ACCESS_TOKEN) {
      return res.status(404).json({ message: 'Not Found' });
    }
  }
  next();
};
```

### 3. Frontend Build Configuration

Update `vite.config.ts`:

```typescript
export default defineConfig({
  // ... existing config
  define: {
    __ADMIN_ENABLED__: process.env.NODE_ENV !== 'production'
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        // Exclude admin files in production build
        ...(process.env.NODE_ENV !== 'production' && {
          admin: resolve(__dirname, 'admin.html')
        })
      }
    }
  }
});
```

### 4. Nginx Configuration

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    # SSL configuration
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Hide admin routes from public
    location /admin {
        # IP whitelist
        allow 192.168.1.1;
        allow 203.0.113.1;
        deny all;
        
        # Additional security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Referrer-Policy strict-origin-when-cross-origin;
        
        try_files $uri $uri/ /index.html;
    }
    
    # Public routes
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API routes
    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 5. Additional Security Measures

#### A. Database Security
- Use separate admin user with limited permissions
- Enable MongoDB authentication
- Use SSL/TLS for database connections
- Regular backups with encryption

#### B. Environment Security
```bash
# Set restrictive file permissions
chmod 600 .env.production
chmod 600 config/production.json

# Use process manager with restricted user
pm2 start ecosystem.config.js --env production
```

#### C. Monitoring & Alerts
```javascript
// Add to your backend
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/admin-access.log' })
  ]
});

// Log all admin access attempts
app.use('/admin', (req, res, next) => {
  logger.info('Admin access attempt', {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    path: req.path,
    timestamp: new Date().toISOString()
  });
  next();
});
```

### 6. Content Security Policy

Add to your HTML head:

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://your-api-domain.com;
  frame-ancestors 'none';
  base-uri 'self';
">
```

### 7. Deployment Checklist

- [ ] Environment variables configured
- [ ] IP whitelist updated
- [ ] SSL certificates installed
- [ ] Database security enabled
- [ ] Admin access tokens generated
- [ ] Monitoring/logging configured
- [ ] Backup strategy implemented
- [ ] Security headers configured
- [ ] Admin routes protected
- [ ] Content Security Policy enabled

### 8. Alternative Admin Access Methods

#### Option 1: Subdomain
- Host admin on `admin.your-domain.com`
- Separate SSL certificate
- Different server/port

#### Option 2: VPN Access
- Require VPN connection for admin access
- Corporate network only

#### Option 3: Two-Factor Authentication
- SMS or app-based 2FA
- Hardware security keys

### 9. Emergency Access

In case of lockout:

```bash
# Backend emergency override
NODE_ENV=development npm start

# Or create emergency access route
curl -X POST https://your-domain.com/api/admin/emergency-access \
  -H "X-Emergency-Token: your-emergency-token"
```

### 10. Regular Security Maintenance

- Update dependencies monthly
- Review access logs weekly
- Rotate admin tokens quarterly
- Security audit annually
- Backup verification monthly

---

**⚠️ Important:** Never commit production secrets to version control. Use environment variables and secure secret management services. 