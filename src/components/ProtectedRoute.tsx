import React from 'react';
import { Navigate } from 'react-router-dom';
import apiService from '@/services/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = apiService.getAuthToken();
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  // Check if user has valid token and admin status
  if (!token || !isAdmin) {
    // Clear any invalid auth data
    apiService.removeAuthToken();
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('user');
    
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 