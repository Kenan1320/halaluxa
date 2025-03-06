
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

/**
 * Middleware component to handle authentication persistence
 * and refresh auth state on route changes
 */
const AuthMiddleware = () => {
  const location = useLocation();
  const { isLoggedIn, user } = useAuth();
  const { toast } = useToast();
  
  // Check authentication tokens on route change and validate session
  useEffect(() => {
    // This prevents the redirect loop for login/signup pages
    if (location.pathname === '/login' || location.pathname === '/signup') {
      return;
    }
    
    // Verify the authentication token on route change
    const verifyAuth = () => {
      const authToken = localStorage.getItem('haluna_auth_token');
      const userData = localStorage.getItem('haluna_user_data');
      
      // If we have auth data but the app state doesn't reflect it,
      // this can happen on refreshes or in certain browser conditions
      if (authToken && userData && !isLoggedIn) {
        const refreshEvent = new Event('auth-refresh-needed');
        window.dispatchEvent(refreshEvent);
        
        // We don't need to show a toast here, the auth provider will handle this
        console.log('Auth refresh triggered due to route change');
      }
    };
    
    verifyAuth();
  }, [location.pathname, isLoggedIn]);
  
  // Log dashboard access
  useEffect(() => {
    if (location.pathname.startsWith('/dashboard') && isLoggedIn && user) {
      console.log(`Business user ${user.name} accessed dashboard at ${new Date().toISOString()}`);
    }
  }, [location.pathname, isLoggedIn, user]);
  
  return null; // This is a middleware component, it doesn't render anything
};

export default AuthMiddleware;
