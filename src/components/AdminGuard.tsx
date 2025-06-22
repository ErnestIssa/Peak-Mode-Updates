import React, { useEffect, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import NotFound from '../pages/NotFound';

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const location = useLocation();
  const [adminAccess, setAdminAccess] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user has admin access
  useEffect(() => {
    const checkAdminAccess = () => {
      // Check if user is already authenticated as admin
      const token = localStorage.getItem('adminToken');
      const adminSession = sessionStorage.getItem('adminAccess');
      
      if (token || adminSession) {
        setAdminAccess(true);
        setIsLoading(false);
        return;
      }

      // Check for special admin access methods
      const urlParams = new URLSearchParams(window.location.search);
      const adminKey = urlParams.get('admin_key');
      const secretPath = location.pathname === '/admin/secret-access';
      
      // Secret admin key method
      if (adminKey === 'peak_mode_admin_2024') {
        sessionStorage.setItem('adminAccess', 'true');
        setAdminAccess(true);
        // Clean URL
        window.history.replaceState({}, '', '/admin/login');
      }
      // Secret path method
      else if (secretPath) {
        sessionStorage.setItem('adminAccess', 'true');
        setAdminAccess(true);
        // Redirect to login
        window.location.href = '/admin/login';
        return;
      }
      // Check for keyboard shortcut activation
      else if (sessionStorage.getItem('adminKeyboardAccess')) {
        setAdminAccess(true);
      }
      else {
        setAdminAccess(false);
      }
      
      setIsLoading(false);
    };

    checkAdminAccess();
  }, [location]);

  // Keyboard shortcut listener (Ctrl+Shift+A+D+M+I+N)
  useEffect(() => {
    let keySequence: string[] = [];
    const targetSequence = ['Control', 'Shift', 'KeyA', 'KeyD', 'KeyM', 'KeyI', 'KeyN'];
    let sequenceTimer: NodeJS.Timeout;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Only listen if not in admin area already
      if (adminAccess) return;

      keySequence.push(event.code);
      
      // Reset sequence after 3 seconds of inactivity
      clearTimeout(sequenceTimer);
      sequenceTimer = setTimeout(() => {
        keySequence = [];
      }, 3000);

      // Check if sequence matches
      if (keySequence.length >= targetSequence.length) {
        const lastKeys = keySequence.slice(-targetSequence.length);
        const matches = targetSequence.every((key, index) => lastKeys[index] === key);
        
        if (matches) {
          sessionStorage.setItem('adminKeyboardAccess', 'true');
          setAdminAccess(true);
          keySequence = [];
          // Redirect to admin login
          window.location.href = '/admin/login';
        }
      }
    };

    // Only add listener if not in admin area
    if (!adminAccess && !location.pathname.startsWith('/admin')) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(sequenceTimer);
    };
  }, [adminAccess, location]);

  // SEO and security measures
  useEffect(() => {
    if (location.pathname.startsWith('/admin')) {
      // Prevent indexing
      const metaRobots = document.querySelector('meta[name="robots"]') || document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      metaRobots.setAttribute('content', 'noindex, nofollow, noarchive, nosnippet');
      if (!document.querySelector('meta[name="robots"]')) {
        document.head.appendChild(metaRobots);
      }

      // Disable right-click in production
      if (process.env.NODE_ENV === 'production') {
        const disableRightClick = (e: MouseEvent) => e.preventDefault();
        document.addEventListener('contextmenu', disableRightClick);
        
        return () => {
          document.removeEventListener('contextmenu', disableRightClick);
        };
      }
    }
  }, [location]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If no admin access and trying to access admin routes, show 404
  if (!adminAccess && location.pathname.startsWith('/admin')) {
    return <NotFound />;
  }

  // Admin area indicator
  if (adminAccess && location.pathname.startsWith('/admin')) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Admin indicator bar */}
        <div className="bg-red-600 text-white text-center py-1 text-sm font-medium">
          🔒 ADMIN AREA - Peak Mode Management Panel
        </div>
        {children}
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminGuard; 