
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import BusinessOnboarding from './BusinessOnboarding';

export interface AuthMiddlewareProps {
  children: React.ReactNode;
}

const AuthMiddleware = ({ children }: AuthMiddlewareProps) => {
  const { isInitializing, isLoggedIn, user } = useAuth();
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Determine if business user needs onboarding
  useEffect(() => {
    if (!isInitializing && isLoggedIn && user?.role === 'business' && !user?.shopName) {
      // If they don't have a shop name set, they need onboarding
      setNeedsOnboarding(true);
    } else {
      setNeedsOnboarding(false);
    }
  }, [isInitializing, isLoggedIn, user]);

  // Don't show the business onboarding if they're already in the onboarding flow
  // or dashboard settings page where they can set up their shop
  const isOnboardingOrSettings = 
    location.pathname === '/business-onboarding' || 
    location.pathname === '/dashboard/settings';

  // Show a minimal loader only while auth is initializing
  if (isInitializing) {
    return null; // Return nothing while initializing to avoid any flash
  }

  if (needsOnboarding && !isOnboardingOrSettings) {
    return <BusinessOnboarding />;
  }

  return <>{children}</>;
};

export default AuthMiddleware;
