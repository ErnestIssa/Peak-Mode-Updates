# Peak Mode Backend API

A complete Node.js/Express backend API for the Peak Mode e-commerce platform with MongoDB database.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Product Management**: Full CRUD operations for products with image uploads
- **Order Management**: Complete order lifecycle management
- **Customer Management**: Customer data and analytics
- **Review System**: Product reviews with moderation
- **FAQ Management**: Dynamic FAQ system
- **Marketing Tools**: Banners, campaigns, popups, and subscriber management
- **Message Center**: Customer support ticket system
- **Settings Management**: Site-wide configuration
- **File Uploads**: Image and document upload support
- **Security**: Rate limiting, CORS, helmet, input validation

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

## Installation

1. **Clone the repository and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `config.env` and update the values:
   ```bash
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/peak-mode
   # OR use MongoDB Atlas (cloud):
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/peak-mode

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d

   # Admin Default Credentials
   ADMIN_EMAIL=admin@peakmode.com
   ADMIN_PASSWORD=admin123

   # CORS Configuration
   FRONTEND_URL=http://localhost:8080
   ```

## Database Setup

### Option 1: Local MongoDB

1. **Install MongoDB locally**
   - Download from [MongoDB website](https://www.mongodb.com/try/download/community)
   - Or use Docker: `docker run -d -p 27017:27017 --name mongodb mongo:latest`

2. **Start MongoDB service**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

### Option 2: MongoDB Atlas (Cloud - Recommended)

1. **Create free MongoDB Atlas account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free cluster
   - Get your connection string

2. **Update MONGODB_URI in config.env**
   ```bash
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/peak-mode
   ```

## Running the Application

1. **Seed the database with initial data**
   ```bash
   npm run seed
   # or
   node seeder.js
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

3. **Start the production server**
   ```bash
   npm start
   ```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Products
- `GET /api/products` - Get all products (admin)
- `GET /api/products/public` - Get public products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order

### Reviews
- `GET /api/reviews` - Get all reviews (admin)
- `GET /api/reviews/public` - Get public reviews
- `POST /api/reviews` - Create review (public)
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review
- `PATCH /api/reviews/:id/moderate` - Moderate review

### Messages
- `GET /api/messages` - Get all messages
- `GET /api/messages/:id` - Get single message
- `POST /api/messages` - Create message (public)
- `POST /api/messages/:id/reply` - Reply to message
- `PATCH /api/messages/:id/status` - Update message status
- `DELETE /api/messages/:id` - Delete message

### FAQs
- `GET /api/faqs` - Get all FAQs (admin)
- `GET /api/faqs/public` - Get public FAQs
- `POST /api/faqs` - Create FAQ
- `PUT /api/faqs/:id` - Update FAQ
- `DELETE /api/faqs/:id` - Delete FAQ
- `PUT /api/faqs/reorder` - Reorder FAQs

### Marketing
- `GET /api/marketing` - Get all marketing content
- `GET /api/marketing/public` - Get public marketing content
- `POST /api/marketing` - Create marketing content
- `PUT /api/marketing/:id` - Update marketing content
- `DELETE /api/marketing/:id` - Delete marketing content

### Settings
- `GET /api/settings` - Get settings (admin)
- `GET /api/settings/public` - Get public settings
- `PUT /api/settings` - Update settings
- `PATCH /api/settings/:section` - Update specific section
- `POST /api/settings/reset` - Reset to defaults

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/:email` - Get customer details
- `GET /api/customers/stats/overview` - Get customer statistics

## Default Admin Credentials

After running the seeder, you can login with:
- **Email**: admin@peakmode.com
- **Password**: admin123

## File Uploads

The API supports file uploads for:
- Product images
- Marketing banners
- User avatars
- Message attachments

Files are stored in the `uploads/` directory and served statically.

## Security Features

- JWT authentication
- Role-based access control
- Rate limiting
- CORS protection
- Input validation
- Password hashing
- Secure headers (helmet)

## Development

### Project Structure
```
backend/
├── models/          # Database models
├── routes/          # API routes
├── middleware/      # Custom middleware
├── uploads/         # File uploads
├── server.js        # Main server file
├── seeder.js        # Database seeder
└── config.env       # Environment variables
```

### Adding New Features

1. **Create a model** in `models/`
2. **Create routes** in `routes/`
3. **Add middleware** if needed in `middleware/`
4. **Update server.js** to include new routes

## Production Deployment

1. **Set NODE_ENV=production**
2. **Use a production MongoDB instance**
3. **Set secure JWT_SECRET**
4. **Configure proper CORS origins**
5. **Set up file storage (AWS S3, Cloudinary, etc.)**
6. **Use PM2 or similar process manager**

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string format
- Verify network access for cloud MongoDB

### Authentication Issues
- Check JWT_SECRET is set
- Verify token expiration
- Clear browser localStorage

### File Upload Issues
- Ensure uploads directory exists
- Check file size limits
- Verify file types

## Support

For issues and questions:
1. Check the logs for error messages
2. Verify environment variables
3. Test API endpoints with Postman
4. Check MongoDB connection

## License

This project is part of the Peak Mode e-commerce platform. 