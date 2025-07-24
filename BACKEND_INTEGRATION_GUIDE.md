# Peak Mode Backend Integration Guide

## 🎯 Overview

This guide will help you integrate the Peak Mode frontend with the backend server. The frontend is now fully prepared with API services, hooks, and error handling ready for backend connection.

## 📋 Prerequisites

### What You Need:
1. **Backend Repository**: `git@github.com:USBAI/vornify_server.git`
2. **Backend Branch**: `oldupdate` or `oldupdates`
3. **Node.js**: Version 16+ (for both frontend and backend)
4. **Environment Setup**: API endpoints and configuration

### What's Already Prepared:
- ✅ Complete API service layer (`src/lib/api.ts`)
- ✅ Custom hooks for state management (`src/hooks/useApi.ts`)
- ✅ Email system integration
- ✅ Admin system integration
- ✅ Error handling and loading states
- ✅ Environment configuration

## 🚀 Step-by-Step Integration

### Step 1: Clone and Setup Backend

```bash
# Clone the backend repository
git clone git@github.com:USBAI/vornify_server.git
cd vornify_server

# Switch to the correct branch
git checkout oldupdate
# OR
git checkout oldupdates

# Install dependencies
npm install
# OR
yarn install
```

### Step 2: Configure Environment Variables

Create a `.env.local` file in the frontend root:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000

# Development Configuration
VITE_DEV_MODE=true
VITE_ENABLE_MOCK_DATA=false

# Site Configuration
VITE_SITE_URL=http://localhost:5173
VITE_SITE_NAME=Peak Mode
```

### Step 3: Start Backend Server

```bash
# In the backend directory
npm run dev
# OR
yarn dev
```

**Expected Output**: Server should start on `http://localhost:3000`

### Step 4: Test API Connection

The frontend includes a health check system. You can test the connection by:

1. Starting the frontend: `npm run dev`
2. Opening browser console
3. The app will automatically check API health on load

## 🔧 API Endpoints Expected

The frontend expects these backend endpoints:

### Products
```
GET /api/products - Get all products
GET /api/products/:id - Get single product
GET /api/products/category/:category - Get products by category
GET /api/products/search?q=query - Search products
GET /api/products/featured - Get featured products
GET /api/categories - Get all categories
```

### Cart
```
GET /api/cart - Get user's cart
POST /api/cart/add - Add item to cart
PUT /api/cart/items/:id - Update cart item
DELETE /api/cart/items/:id - Remove item from cart
DELETE /api/cart/clear - Clear cart
```

### Orders
```
POST /api/orders - Create new order
GET /api/orders - Get user's orders
GET /api/orders/:id - Get single order
PUT /api/orders/:id/status - Update order status
```

### Newsletter
```
POST /api/newsletter/subscribe - Subscribe to newsletter
POST /api/newsletter/unsubscribe - Unsubscribe from newsletter
GET /api/newsletter/status?email=email - Check subscription status
```

### Contact
```
POST /api/contact - Send contact message
GET /api/contact/messages - Get contact messages (admin)
```

### Authentication (if available)
```
POST /api/auth/login - User login
POST /api/auth/register - User registration
POST /api/auth/logout - User logout
GET /api/auth/me - Get current user
```

### Admin (for admin panel)
```
GET /api/admin/config - Get admin configuration
PUT /api/admin/config - Update admin configuration
GET /api/admin/content/:section - Get content by section
PUT /api/admin/content/:section - Update content
POST /api/admin/upload/image - Upload image
```

### Health Check
```
GET /api/health - API health check
```

## 📊 Data Structures

### Product
```typescript
{
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  subcategory?: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
  stockQuantity?: number;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Cart Item
```typescript
{
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
}
```

### Order
```typescript
{
  id: string;
  userId?: string;
  items: OrderItem[];
  total: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  orderNumber: string;
  createdAt: string;
  updatedAt: string;
}
```

## 🔄 Integration Process

### Phase 1: Basic Connection
1. **Start backend server**
2. **Test health check** - Frontend will automatically check connection
3. **Verify API endpoints** - Check if all expected endpoints exist

### Phase 2: Core Features
1. **Products integration** - Replace mock data with real API calls
2. **Cart functionality** - Connect cart operations to backend
3. **Order creation** - Test order submission flow

### Phase 3: Advanced Features
1. **Email system** - Connect newsletter and order confirmation emails
2. **Admin panel** - Test admin configuration endpoints
3. **Authentication** - If available, test user login/logout

### Phase 4: Testing & Optimization
1. **Error handling** - Test various error scenarios
2. **Performance** - Optimize API calls and caching
3. **User experience** - Ensure smooth loading states

## 🛠️ Troubleshooting

### Common Issues

#### 1. CORS Errors
**Problem**: Frontend can't connect to backend due to CORS
**Solution**: Ensure backend has CORS configured for `http://localhost:5173`

#### 2. API Endpoint Mismatch
**Problem**: Frontend expects different endpoints than backend provides
**Solution**: 
- Check backend routes against expected endpoints
- Update frontend API service if needed
- Use browser dev tools to see actual API responses

#### 3. Data Structure Mismatch
**Problem**: Backend returns different data structure than expected
**Solution**:
- Check API responses in browser dev tools
- Update TypeScript interfaces in `src/lib/api.ts`
- Add data transformation if needed

#### 4. Authentication Issues
**Problem**: API calls fail due to missing authentication
**Solution**:
- Check if endpoints require authentication
- Implement token handling in API service
- Update request headers with auth tokens

### Debug Tools

#### Frontend Debugging
```javascript
// Check API health
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);

// Test API connection
fetch('http://localhost:3000/api/health')
  .then(response => response.json())
  .then(data => console.log('API Health:', data))
  .catch(error => console.error('API Error:', error));
```

#### Backend Debugging
```javascript
// Add logging to backend routes
app.get('/api/health', (req, res) => {
  console.log('Health check requested');
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
```

## 📝 Testing Checklist

### API Connection
- [ ] Backend server starts without errors
- [ ] Health check endpoint responds
- [ ] Frontend can connect to backend
- [ ] No CORS errors in browser console

### Core Features
- [ ] Products load from backend
- [ ] Cart operations work
- [ ] Order creation succeeds
- [ ] Newsletter subscription works
- [ ] Contact form submission works

### Advanced Features
- [ ] Email sending works
- [ ] Admin panel loads configuration
- [ ] Authentication works (if available)
- [ ] Error handling works properly

### Performance
- [ ] Loading states display correctly
- [ ] API calls are optimized
- [ ] No unnecessary re-renders
- [ ] Error messages are user-friendly

## 🔧 Customization

### Adding New API Endpoints
1. Add endpoint to `src/lib/api.ts`
2. Create corresponding hook in `src/hooks/useApi.ts`
3. Update TypeScript interfaces
4. Test the new functionality

### Modifying Data Structures
1. Update interfaces in `src/lib/api.ts`
2. Update components that use the data
3. Test with backend to ensure compatibility

### Environment Configuration
1. Add new variables to `env.example`
2. Update API service to use new variables
3. Document the new configuration

## 📞 Support

### When You Need Help
1. **Check browser console** for error messages
2. **Verify API endpoints** match between frontend and backend
3. **Test individual endpoints** using tools like Postman
4. **Check network tab** in browser dev tools for failed requests

### Common Questions
- **Q**: How do I change the API base URL?
- **A**: Update `VITE_API_BASE_URL` in `.env.local`

- **Q**: How do I add new API endpoints?
- **A**: Add them to the appropriate section in `src/lib/api.ts`

- **Q**: How do I handle authentication?
- **A**: Update the `authApi` section in `src/lib/api.ts` and implement token handling

---

**Ready to proceed?** Once you have the backend cloned and running, we can test the integration step by step. Let me know when you're ready to start testing! 