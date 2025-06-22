# 🔒 Peak Mode Admin Access Guide

## Overview
The admin area is completely hidden from regular users and can only be accessed through secure methods. Regular users will see a 404 error if they try to access any admin routes.

## Admin Access Methods

### Method 1: Secret URL Parameter
Add `?admin_key=peak_mode_admin_2024` to any URL:
```
https://yoursite.com/?admin_key=peak_mode_admin_2024
```
This will automatically redirect you to the admin login page.

### Method 2: Secret Path
Navigate directly to:
```
https://yoursite.com/admin/secret-access
```

### Method 3: Keyboard Shortcut
On any public page, press and hold in sequence:
```
Ctrl + Shift + A + D + M + I + N
```
This will unlock admin access and redirect to the login page.

## Admin Login Credentials
- **Email**: `admin@peakmode.com`
- **Password**: `admin123`

## Security Features

### For Regular Users:
- ❌ Cannot see or access any admin routes
- ❌ All admin URLs return 404 error
- ❌ No admin links or references in public site
- ❌ Search engines cannot index admin pages

### For Admins:
- ✅ Full access to admin panel after authentication
- ✅ Visual admin indicator (red bar at top)
- ✅ SEO protection (noindex, nofollow)
- ✅ Right-click disabled in production
- ✅ Session-based access control

## Access Session
Once you access the admin area using any method above:
- Your access is stored in the browser session
- You can navigate freely between admin pages
- Access expires when you close the browser
- You can manually logout to clear access

## Production Security
In production environment, additional security measures are active:
- Right-click context menu disabled
- Developer tools access restricted
- All admin activity logged
- Enhanced SEO blocking

## Important Notes
- Keep the admin access methods confidential
- Change the admin password regularly
- Use HTTPS in production
- Consider IP whitelisting for extra security
- Monitor admin access logs regularly

## Emergency Access
If you lose access, you can:
1. Clear browser storage and use any access method above
2. Access the database directly to reset admin credentials
3. Use the backend API directly with proper authentication

---
**Keep this guide secure and do not share access methods publicly!** 