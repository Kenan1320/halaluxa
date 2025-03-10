
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import SplashScreen from '@/components/SplashScreen';
import BusinessOnboarding from './BusinessOnboarding';

export interface AuthMiddlewareProps {
  children: React.ReactNode;
}

const AuthMiddleware = ({ children }: AuthMiddlewareProps) => {
  const { isInitializing, isLoggedIn, user } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Show splash screen for at least 1.2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // Determine if business user needs onboarding
  useEffect(() => {
    if (!isInitializing && isLoggedIn && user?.role === 'business') {
      // If they don't have a shop name set, they need onboarding
      setNeedsOnboarding(!user.shopName);
    } else {
      setNeedsOnboarding(false);
    }
  }, [isInitializing, isLoggedIn, user]);

  // Don't show the business onboarding if they're already in the onboarding flow
  // or dashboard settings page where they can set up their shop
  const isOnboardingOrSettings = 
    location.pathname === '/business-onboarding' || 
    location.pathname === '/dashboard/settings';

  if (isInitializing || showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (needsOnboarding && !isOnboardingOrSettings) {
    return <BusinessOnboarding />;
  }

  return <>{children}</>;
};

export default AuthMiddleware;
