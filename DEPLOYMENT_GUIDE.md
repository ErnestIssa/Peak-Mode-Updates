# 🚀 Peak Mode Deployment Guide

## Overview
This guide will help you deploy your Peak Mode e-commerce platform to production with:
- **Backend** → Render (Free tier)
- **Frontend** → Vercel (Free tier)
- **Database** → MongoDB Atlas (Already configured)

## 📋 Prerequisites
- GitHub account
- Render account (free)
- Vercel account (free)
- MongoDB Atlas cluster (already set up)

---

## 🔧 Step 1: Deploy Backend to Render

### 1.1 Push Backend to GitHub
```bash
# Navigate to your project
cd C:\Users\Ernest\OneDrive\Peak-Mode-Updates

# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit - Peak Mode backend ready for deployment"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/peak-mode-backend.git
git branch -M main
git push -u origin main
```

### 1.2 Deploy on Render
1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `peak-mode-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 1.3 Set Environment Variables
In Render dashboard, add these environment variables:
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://peakmodecluster:Itangishaka76701463!!@cluster0.bm3zcvt.mongodb.net/peak-mode?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=peak_mode_super_secret_jwt_key_2024_production_change_this
JWT_EXPIRE=7d
ADMIN_EMAIL=admin@peakmode.com
ADMIN_PASSWORD=admin123
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

### 1.4 Deploy
- Click "Create Web Service"
- Wait for deployment to complete
- Note your backend URL: `https://peak-mode-backend.onrender.com`

---

## 🌐 Step 2: Deploy Frontend to Vercel

### 2.1 Push Frontend to GitHub (if separate repo)
```bash
# If you want separate repositories
cd C:\Users\Ernest\OneDrive\Peak-Mode-Updates
git add .
git commit -m "Frontend ready for deployment"
git push
```

### 2.2 Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `.` (if monorepo) or leave empty
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 2.3 Set Environment Variables
In Vercel dashboard → Settings → Environment Variables, add:
```
VITE_API_URL=https://peak-mode-backend.onrender.com/api
```

### 2.4 Deploy
- Click "Deploy"
- Wait for deployment
- Note your frontend URL: `https://peak-mode.vercel.app`

---

## 🔗 Step 3: Connect Frontend and Backend

### 3.1 Update Backend CORS
Once you have your Vercel URL, update the backend environment variables on Render:
```
FRONTEND_URL=https://peak-mode.vercel.app
```

### 3.2 Redeploy Backend
- Go to Render dashboard
- Click "Manual Deploy" → "Deploy latest commit"

---

## ✅ Step 4: Verify Deployment

### 4.1 Test Backend
Visit: `https://peak-mode-backend.onrender.com/api/health`
Should return:
```json
{
  "status": "success",
  "message": "Peak Mode API is running",
  "environment": "production"
}
```

### 4.2 Test Frontend
1. Visit: `https://peak-mode.vercel.app`
2. Main site should load with data from backend
3. Test admin access:
   - URL: `https://peak-mode.vercel.app/?admin_key=peak_mode_admin_2024`
   - Login: `admin@peakmode.com` / `admin123`

### 4.3 Test Admin Functionality
1. Login to admin panel
2. Create a test banner
3. Check if it appears on main site
4. Test product creation
5. Verify all data syncs between admin and public site

---

## 🔧 Step 5: Custom Domain (Optional)

### 5.1 For Frontend (Vercel)
1. Go to Vercel dashboard → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### 5.2 For Backend (Render)
1. Go to Render dashboard → Settings → Custom Domains
2. Add your API subdomain (e.g., `api.yoursite.com`)
3. Update environment variables accordingly

---

## 🛠️ Troubleshooting

### Common Issues:

**1. CORS Errors**
- Ensure `FRONTEND_URL` is set correctly on Render
- Check that Vercel URL is in CORS allowed origins

**2. API Not Found**
- Verify `VITE_API_URL` is set correctly on Vercel
- Check backend is running on Render

**3. Database Connection**
- Verify MongoDB Atlas whitelist includes `0.0.0.0/0`
- Check connection string is correct

**4. Admin Access Not Working**
- Clear browser storage
- Try the keyboard shortcut: `Ctrl+Shift+A+D+M+I+N`
- Use secret URL: `/?admin_key=peak_mode_admin_2024`

### Logs:
- **Backend logs**: Render dashboard → Logs
- **Frontend logs**: Vercel dashboard → Functions → View logs

---

## 🔒 Security Checklist

- [ ] Change default admin password
- [ ] Update JWT secret
- [ ] Enable MongoDB Atlas IP whitelist
- [ ] Set up SSL certificates
- [ ] Configure rate limiting
- [ ] Monitor error logs
- [ ] Set up backup strategy

---

## 📱 Mobile Testing

Test your deployed site on:
- Mobile browsers
- Different screen sizes
- Slow network connections

---

## 🚀 Go Live!

Your Peak Mode e-commerce platform is now live:
- **Main Site**: `https://peak-mode.vercel.app`
- **Admin Panel**: `https://peak-mode.vercel.app/?admin_key=peak_mode_admin_2024`
- **API**: `https://peak-mode-backend.onrender.com/api`

All admin changes will now automatically appear on the live website! 🎉 