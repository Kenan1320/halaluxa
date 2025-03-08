
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import SplashScreen from '@/components/SplashScreen';
import { supabase } from '@/integrations/supabase/client';

export interface AuthMiddlewareProps {
  children: React.ReactNode;
}

const AuthMiddleware = ({ children }: AuthMiddlewareProps) => {
  const { isInitializing, isLoggedIn, user } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [isBusinessOwner, setIsBusinessOwner] = useState(false);
  const [needsShopSetup, setNeedsShopSetup] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Show splash screen for at least 1.2 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // Check if user is a business owner and has a shop
  useEffect(() => {
    const checkBusinessStatus = async () => {
      if (!isInitializing && isLoggedIn && user) {
        try {
          // Check if user is a business owner
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('is_business_owner')
            .eq('id', user.id)
            .single();
          
          if (profileError) throw profileError;
          
          const isBusinessUser = profileData.is_business_owner || false;
          setIsBusinessOwner(isBusinessUser);
          
          if (isBusinessUser) {
            // Check if business owner has a shop
            const { data: shopData, error: shopError } = await supabase
              .from('shops')
              .select('id')
              .eq('owner_id', user.id)
              .maybeSingle();
            
            if (shopError && shopError.code !== 'PGRST116') throw shopError;
            
            // If no shop found, they need to set one up
            setNeedsShopSetup(!shopData);
          }
        } catch (error) {
          console.error('Error checking business status:', error);
        }
      }
    };
    
    checkBusinessStatus();
  }, [isInitializing, isLoggedIn, user]);

  // Redirect business users to shop setup if needed
  useEffect(() => {
    if (needsShopSetup && isBusinessOwner && isLoggedIn) {
      const isCreateShopPage = location.pathname === '/business/create-shop';
      const isBusinessAuthPage = 
        location.pathname === '/business/login' || 
        location.pathname === '/business/signup' ||
        location.pathname === '/business/google-auth-callback';
      
      if (!isCreateShopPage && !isBusinessAuthPage) {
        navigate('/business/create-shop');
      }
    }
  }, [needsShopSetup, isBusinessOwner, isLoggedIn, location.pathname, navigate]);

  if (isInitializing || showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return <>{children}</>;
};

export default AuthMiddleware;
