
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import BusinessOnboarding from './BusinessOnboarding';

export interface AuthMiddlewareProps {
  children: React.ReactNode;
}

const AuthMiddleware = ({ children }: AuthMiddlewareProps) => {
  const { isLoggedIn, user, isInitializing } = useAuth();
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Determine if business user needs onboarding
  useEffect(() => {
    if (isLoggedIn && user?.role === 'business') {
      // If they don't have a shop name set, they need onboarding
      setNeedsOnboarding(!user.shopName);
    } else {
      setNeedsOnboarding(false);
    }
  }, [isLoggedIn, user]);

  // Handle routing for different user types
  useEffect(() => {
    // Wait until auth is initialized
    if (isInitializing) return;
    
    // Handle routing for authenticated users
    if (isLoggedIn && user) {
      const isAuthRoute = location.pathname === '/login' || location.pathname === '/signup';
      
      // If user is already on auth routes, redirect them
      if (isAuthRoute) {
        if (user.role === 'business') {
          navigate('/dashboard');
        } else {
          navigate('/shop');
        }
      }
      
      // Redirect business users trying to access shopper-only routes
      const shopperOnlyRoutes = ['/cart', '/checkout', '/order-confirmation', '/orders'];
      if (user.role === 'business' && shopperOnlyRoutes.includes(location.pathname)) {
        navigate('/dashboard');
      }
      
      // Redirect shoppers trying to access business-only routes
      if (user.role === 'shopper' && location.pathname.startsWith('/dashboard')) {
        navigate('/shop');
      }
    }
  }, [isLoggedIn, user, location.pathname, navigate, isInitializing]);

  // Don't show the business onboarding if they're already in the onboarding flow
  // or dashboard settings page where they can set up their shop
  const isOnboardingOrSettings = 
    location.pathname === '/business-onboarding' || 
    location.pathname === '/dashboard/settings';

  if (needsOnboarding && !isOnboardingOrSettings) {
    return <BusinessOnboarding />;
  }

  return <>{children}</>;
};

export default AuthMiddleware;
