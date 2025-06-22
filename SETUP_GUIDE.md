# Peak Mode - Complete Setup Guide

This guide will help you set up the complete Peak Mode e-commerce platform with a React frontend and Node.js backend.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or cloud)

### 1. Frontend Setup

The frontend is already set up and running. If you need to restart it:

```bash
# In the root directory
npm run dev
```

Frontend will be available at: http://localhost:8080

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Run setup script (optional)
node setup.js

# Start the backend server
npm run dev
```

Backend will be available at: http://localhost:5000

## 📊 Database Setup

### Option A: MongoDB Atlas (Recommended - Free Cloud Database)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account
   - Create a new cluster (free tier)

2. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

3. **Update Configuration**
   - Edit `backend/config.env`
   - Replace the MONGODB_URI with your Atlas connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/peak-mode
   ```

### Option B: Local MongoDB

1. **Install MongoDB**
   - Download from [MongoDB website](https://www.mongodb.com/try/download/community)
   - Or use Docker: `docker run -d -p 27017:27017 --name mongodb mongo:latest`

2. **Start MongoDB**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

## 🗄️ Database Seeding

After setting up MongoDB, seed the database with initial data:

```bash
# In the backend directory
npm run seed
```

This will create:
- Admin user (admin@peakmode.com / admin123)
- Sample products
- Sample FAQs
- Default settings

## 🔐 Admin Access

### Login Credentials
- **URL**: http://localhost:8080/admin/login
- **Email**: admin@peakmode.com
- **Password**: admin123

### Admin Panel Features
- **Dashboard**: Overview and analytics
- **Products**: Add, edit, delete products
- **Orders**: Manage customer orders
- **Customers**: View customer data
- **Reviews**: Moderate product reviews
- **Messages**: Handle customer inquiries
- **Marketing**: Manage banners and campaigns
- **FAQs**: Manage frequently asked questions
- **Settings**: Site-wide configuration

## 🔗 API Endpoints

The backend provides RESTful APIs for all admin functions:

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (admin)
- `GET /api/products/public` - Get public products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order

### Reviews
- `GET /api/reviews` - Get all reviews (admin)
- `GET /api/reviews/public` - Get public reviews
- `POST /api/reviews` - Create review (public)

### Messages
- `GET /api/messages` - Get all messages
- `POST /api/messages` - Create message (public)
- `POST /api/messages/:id/reply` - Reply to message

### FAQs
- `GET /api/faqs` - Get all FAQs (admin)
- `GET /api/faqs/public` - Get public FAQs
- `POST /api/faqs` - Create FAQ

### Marketing
- `GET /api/marketing` - Get all marketing content
- `GET /api/marketing/public` - Get public marketing content

### Settings
- `GET /api/settings` - Get settings (admin)
- `GET /api/settings/public` - Get public settings
- `PUT /api/settings` - Update settings

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Admin, manager, and staff roles
- **Permission System**: Granular permissions for different features
- **Rate Limiting**: Protection against abuse
- **CORS Protection**: Secure cross-origin requests
- **Input Validation**: Server-side validation
- **Password Hashing**: Secure password storage

## 📁 Project Structure

```
peak-mode/
├── src/                    # Frontend React code
│   ├── pages/             # Page components
│   ├── components/        # Reusable components
│   ├── services/          # API services
│   └── ...
├── backend/               # Backend Node.js code
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── uploads/          # File uploads
│   ├── server.js         # Main server file
│   └── seeder.js         # Database seeder
├── public/               # Static files
└── package.json          # Frontend dependencies
```

## 🛠️ Development

### Frontend Development
```bash
# Start development server
npm run dev

# Build for production
npm run build
```

### Backend Development
```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start
```

### Database Management
```bash
# Seed database
npm run seed

# Reset database (if needed)
# Delete the database and run seeder again
```

## 🔧 Configuration

### Environment Variables (backend/config.env)
```bash
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/peak-mode

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d

# Admin
ADMIN_EMAIL=admin@peakmode.com
ADMIN_PASSWORD=admin123

# CORS
FRONTEND_URL=http://localhost:8080
```

### Frontend Configuration
- API base URL: `src/services/api.js`
- Update `API_BASE_URL` if backend runs on different port

## 📸 File Uploads

The system supports file uploads for:
- Product images
- Marketing banners
- User avatars
- Message attachments

Files are stored in `backend/uploads/` and served statically.

## 🚀 Production Deployment

### Frontend
1. Build the project: `npm run build`
2. Deploy the `dist/` folder to your hosting service

### Backend
1. Set `NODE_ENV=production`
2. Use a production MongoDB instance
3. Set secure `JWT_SECRET`
4. Configure proper CORS origins
5. Set up file storage (AWS S3, Cloudinary)
6. Use PM2 or similar process manager

### Environment Variables for Production
```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/peak-mode
JWT_SECRET=your-super-secure-production-secret
FRONTEND_URL=https://yourdomain.com
```

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Failed**
- Check if MongoDB is running
- Verify connection string format
- Ensure network access for cloud MongoDB

**Authentication Issues**
- Clear browser localStorage
- Check JWT_SECRET is set
- Verify token expiration

**File Upload Issues**
- Ensure uploads directory exists
- Check file size limits
- Verify file types

**CORS Errors**
- Update FRONTEND_URL in config.env
- Check CORS configuration in server.js

### Debug Mode
```bash
# Backend with detailed logging
NODE_ENV=development npm run dev

# Check logs for errors
# Backend logs will show in terminal
# Frontend errors in browser console
```

## 📞 Support

If you encounter issues:

1. **Check the logs** for error messages
2. **Verify environment variables** are set correctly
3. **Test API endpoints** with Postman or similar tool
4. **Check MongoDB connection** and database state
5. **Clear browser cache** and localStorage

## 🎯 Next Steps

After successful setup:

1. **Customize the admin panel** to match your brand
2. **Add your products** through the admin interface
3. **Configure settings** for your business
4. **Set up email notifications** (optional)
5. **Configure payment gateways** (Stripe, PayPal)
6. **Set up analytics** (Google Analytics)
7. **Deploy to production** when ready

## 📚 Additional Resources

- **Backend Documentation**: `backend/README.md`
- **API Documentation**: Check individual route files
- **Database Models**: Check `backend/models/` directory
- **Frontend Components**: Check `src/components/` directory

---

**🎉 Congratulations!** Your Peak Mode e-commerce platform is now fully set up with a complete backend API and admin dashboard. 