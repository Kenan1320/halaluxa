
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export interface AuthMiddlewareProps {
  children: React.ReactNode;
}

const AuthMiddleware = ({ children }: AuthMiddlewareProps) => {
  const { isInitializing, isLoggedIn, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Check if user is a business owner and redirect to dashboard
  useEffect(() => {
    // Skip redirection for admin routes in development mode
    if (import.meta.env.DEV && location.pathname.startsWith('/admin')) {
      return;
    }
    
    if (!isInitializing && isLoggedIn && user?.role === 'business') {
      // If they are on login/signup pages or at root, redirect to dashboard
      if (location.pathname === '/' || 
          location.pathname === '/login' || 
          location.pathname === '/signup') {
        navigate('/dashboard');
      }
    }
  }, [isInitializing, isLoggedIn, user, location.pathname, navigate]);

  // Show a minimal loader only while auth is initializing
  if (isInitializing) {
    return null; // Return nothing while initializing to avoid any flash
  }

  return <>{children}</>;
};

export default AuthMiddleware;
