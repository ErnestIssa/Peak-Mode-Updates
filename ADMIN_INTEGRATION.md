# Admin Integration System

## Overview

The Peak Mode frontend has been completely prepared for admin panel integration. This system allows administrators to control all aspects of the website through a separate admin frontend that will connect to the same backend.

## 🏗️ Architecture

### Frontend Structure
```
src/
├── lib/
│   ├── adminConfig.ts      # Admin configuration system
│   └── adminService.ts     # Admin service for API calls
├── contexts/
│   └── AdminContext.tsx    # React context for admin data
└── components/             # Admin-ready components
```

### Backend Integration Points
- **API Endpoints**: Predefined in `adminConfig.ts`
- **Authentication**: Token-based system
- **Content Management**: Dynamic content updates
- **Media Upload**: Image and file management

## 🎯 Admin-Ready Features

### 1. Content Management System

#### Hero Section
- **Background Images**: Dynamic image rotation
- **Title & Subtitle**: Editable text content
- **CTA Buttons**: Configurable call-to-action
- **Admin Control**: All hero content manageable

#### About Section
- **Rotating Text**: "A mode You enter" / "A mindset You wear"
- **Main Content**: Title, subtitle, description
- **Features**: Dynamic feature list
- **Images**: Configurable section images

#### Newsletter Section
- **Title & Subtitle**: Editable newsletter content
- **Privacy Policy Text**: Customizable legal text
- **Form Settings**: Newsletter signup configuration

### 2. Site Settings Management

#### Basic Settings
- **Site Name**: Configurable site title
- **Logo**: Upload and manage site logo
- **Favicon**: Custom favicon support
- **Contact Information**: Email, phone, address

#### Social Media
- **Instagram**: Social media links
- **Facebook**: Platform integration
- **TikTok**: Social presence management

#### Business Settings
- **Shipping Info**: Free shipping threshold, costs
- **Business Hours**: Operating hours display
- **Currency**: SEK with configurable symbol

### 3. Product Management

#### Categories
- **Dynamic Categories**: Create/edit/delete categories
- **Category Images**: Upload category images
- **Category Descriptions**: Rich text descriptions
- **Slug Management**: SEO-friendly URLs

#### Products
- **Product CRUD**: Full product management
- **Inventory Control**: Stock management
- **Pricing**: Dynamic pricing system
- **Images**: Multiple product images

#### Product Features
- **Reviews System**: Enable/disable reviews
- **Wishlist**: Wishlist functionality toggle
- **Quick View**: Product quick view settings
- **Size Guide**: Size guide integration

### 4. Marketing & SEO

#### SEO Settings
- **Meta Titles**: Page-specific meta titles
- **Meta Descriptions**: SEO descriptions
- **Keywords**: SEO keyword management
- **OG Images**: Social media images

#### Promotions
- **Discount Codes**: Create and manage promotions
- **Valid Periods**: Start/end dates for promotions
- **Percentage Discounts**: Configurable discount amounts
- **Active Status**: Enable/disable promotions

#### Popup Settings
- **Welcome Popup**: Configurable welcome message
- **Discount Offers**: Popup discount codes
- **Images**: Popup background images
- **Timing**: Popup display settings

### 5. User Experience Settings

#### Checkout Configuration
- **Guest Checkout**: Enable/disable guest checkout
- **Phone Requirement**: Optional phone field
- **Newsletter Signup**: Checkout newsletter opt-in
- **Payment Methods**: Configurable payment options

#### Notifications
- **Order Confirmation**: Email notifications
- **Shipping Updates**: Delivery notifications
- **Marketing Emails**: Newsletter settings

#### Display Settings
- **Currency Display**: SEK with kr symbol
- **Price Visibility**: Show/hide prices
- **Dark Mode**: Future dark mode support

## 🔧 Technical Implementation

### Admin Service (`adminService.ts`)

```typescript
// Singleton pattern for admin service
export class AdminService {
  // Configuration management
  async getAdminConfig(): Promise<AdminConfig>
  async updateAdminConfig(updates: Partial<AdminConfig>): Promise<boolean>
  
  // Content management
  async getContent(section: string): Promise<any>
  async updateContent(section: string, data: any): Promise<boolean>
  
  // Product management
  async getProducts(): Promise<any[]>
  async createProduct(productData: any): Promise<boolean>
  async updateProduct(productId: string, data: any): Promise<boolean>
  async deleteProduct(productId: string): Promise<boolean>
  
  // Media upload
  async uploadImage(file: File): Promise<string | null>
  
  // Authentication
  setAuthToken(token: string): void
  isAuthenticated(): boolean
}
```

### React Context (`AdminContext.tsx`)

```typescript
// Admin context provides data throughout the app
export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  // Loads admin configuration on mount
  // Provides update methods
  // Handles caching and error states
}

// Custom hooks for different sections
export const useAdminContent = (section: string) => {
  // Access specific content sections
  // Update content dynamically
}

export const useSiteSettings = () => {
  // Access site settings
  // Update site configuration
}
```

### API Endpoints

```typescript
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
  
  // Media Upload
  UPLOAD_IMAGE: '/api/admin/upload/image',
  
  // Authentication
  LOGIN: '/api/admin/auth/login',
  VERIFY_TOKEN: '/api/admin/auth/verify'
}
```

## 🚀 Integration Steps

### 1. Backend Setup
- Implement all API endpoints defined in `ADMIN_API_ENDPOINTS`
- Set up authentication system (JWT tokens)
- Create database schema for admin configuration
- Implement media upload functionality

### 2. Admin Frontend Development
- Create admin login system
- Build content management interface
- Implement product management dashboard
- Create settings management panel

### 3. Frontend Connection
- Update `REACT_APP_API_URL` environment variable
- Test admin service connections
- Verify content updates work correctly
- Test authentication flow

### 4. Content Migration
- Migrate existing hardcoded content to admin system
- Set up default configurations
- Test all admin-controlled features

## 📋 Admin Panel Features Checklist

### Content Management
- [x] Hero section content
- [x] About section content
- [x] Newsletter content
- [x] Footer links
- [x] Legal page content
- [x] FAQ management

### Site Settings
- [x] Site name and description
- [x] Logo and favicon
- [x] Contact information
- [x] Social media links
- [x] Shipping settings
- [x] Business hours

### Product Management
- [x] Category CRUD operations
- [x] Product CRUD operations
- [x] Inventory management
- [x] Product images
- [x] Pricing management

### Marketing & SEO
- [x] SEO meta data
- [x] Promotion management
- [x] Popup settings
- [x] Discount codes

### User Experience
- [x] Checkout settings
- [x] Payment method configuration
- [x] Notification settings
- [x] Display preferences

## 🔐 Security Considerations

### Authentication
- JWT token-based authentication
- Token expiration handling
- Secure API endpoints
- Admin role verification

### Data Validation
- Input sanitization
- File upload validation
- Content type verification
- SQL injection prevention

### Access Control
- Admin-only endpoints
- Role-based permissions
- Session management
- Audit logging

## 📊 Analytics Integration

### Admin Analytics
- Order tracking
- Sales analytics
- User behavior
- Content performance
- Product popularity

### Reporting
- Sales reports
- Inventory reports
- User activity reports
- Content engagement reports

## 🛠️ Development Guidelines

### Code Structure
- Use TypeScript for type safety
- Follow React best practices
- Implement proper error handling
- Use consistent naming conventions

### Performance
- Implement caching strategies
- Optimize image loading
- Use lazy loading for components
- Minimize API calls

### Testing
- Unit tests for admin service
- Integration tests for API endpoints
- E2E tests for admin workflows
- Content update testing

## 🚀 Deployment

### Environment Variables
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ADMIN_URL=http://localhost:3002
REACT_APP_UPLOAD_URL=http://localhost:3001/api/admin/upload
```

### Production Setup
- Configure production API endpoints
- Set up CDN for media files
- Implement proper caching
- Configure monitoring and logging

## 📞 Support

For questions about the admin integration system:
- Check the API documentation
- Review the admin service implementation
- Test with the provided endpoints
- Contact the development team

---

**Note**: This frontend is now fully prepared for admin panel integration. All content is dynamic and can be controlled through the admin system. The backend implementation will complete the full admin functionality. 