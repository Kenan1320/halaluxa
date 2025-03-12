
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

  useEffect(() => {
    if (!isInitializing && isLoggedIn && user?.role === 'business' && !user?.shop_name) {
      setNeedsOnboarding(true);
    } else {
      setNeedsOnboarding(false);
    }
  }, [isInitializing, isLoggedIn, user]);

  const isOnboardingOrSettings = 
    location.pathname === '/business-onboarding' || 
    location.pathname === '/dashboard/settings';

  if (isInitializing) {
    return null;
  }

  if (needsOnboarding && !isOnboardingOrSettings) {
    return <BusinessOnboarding />;
  }

  return <>{children}</>;
};

export default AuthMiddleware;
