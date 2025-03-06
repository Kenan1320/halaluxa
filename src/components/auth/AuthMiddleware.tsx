
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

/**
 * Middleware component to handle authentication persistence
 * and refresh auth state on route changes
 */
const AuthMiddleware = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, user, refreshSession } = useAuth();
  const { toast } = useToast();
  
  // Set up auth state listener
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event);
        
        if (event === 'SIGNED_IN' && session) {
          await refreshSession();
          toast({
            title: "Logged in",
            description: "You have been successfully logged in",
          });
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "Logged out",
            description: "You have been logged out",
          });
        }
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [toast, refreshSession]);
  
  // Check authentication tokens on route change and validate session
  useEffect(() => {
    // This prevents the redirect loop for login/signup pages
    if (location.pathname === '/login' || location.pathname === '/signup') {
      return;
    }
    
    // Verify the authentication token on route change
    const verifyAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth error:', error);
          return;
        }
        
        // If we have a session but the app state doesn't reflect it,
        // this can happen on refreshes or in certain browser conditions
        if (data.session && !isLoggedIn) {
          await refreshSession();
          console.log('Auth refresh triggered due to route change');
        }
      } catch (err) {
        console.error('Error verifying auth:', err);
      }
    };
    
    verifyAuth();
  }, [location.pathname, isLoggedIn, refreshSession]);
  
  // Ensure business users can access dashboard
  useEffect(() => {
    if (isLoggedIn && user?.role === 'business' && location.pathname.startsWith('/dashboard')) {
      console.log('Business user accessing dashboard:', user.name);
      // This is intentionally left empty as we're making sure business users can stay on dashboard pages
    }
  }, [location.pathname, isLoggedIn, user, navigate]);
  
  return null; // This is a middleware component, it doesn't render anything
};

export default AuthMiddleware;
