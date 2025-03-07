
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
  
  // Ensure business owner has a shop
  useEffect(() => {
    const ensureBusinessShop = async () => {
      if (isLoggedIn && user?.role === 'business') {
        try {
          // Check if the business owner already has a shop
          const { data: existingShop, error: shopError } = await supabase
            .from('shops')
            .select('id')
            .eq('owner_id', user.id)
            .maybeSingle();
            
          if (shopError) {
            console.error('Error checking for existing shop:', shopError);
          }
          
          // If no shop exists, create one using profile data
          if (!existingShop) {
            console.log('Creating shop for business owner:', user.id);
            const { error: createError } = await supabase
              .from('shops')
              .insert({
                id: user.id,
                name: user.shopName || 'My Business',
                description: user.shopDescription || 'New business on Haluna',
                owner_id: user.id,
                location: user.shopLocation || 'Online',
                logo_url: user.shopLogo || null,
                is_verified: true, // All business accounts are verified by default
                category: user.shopCategory || 'Other',
                cover_image: null
              });
              
            if (createError) {
              console.error('Error creating shop:', createError);
            } else {
              toast({
                title: "Business Shop Created",
                description: "Your business shop has been set up successfully",
              });
            }
          }
        } catch (err) {
          console.error('Error in shop verification:', err);
        }
      }
    };
    
    ensureBusinessShop();
  }, [isLoggedIn, user, toast]);
  
  // Set up auth state listener and persist authentication
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event);
        
        if (event === 'SIGNED_IN' && session) {
          // Force refresh the session to get the latest user data
          await refreshSession();
          
          // Check if the user is a business user and redirect appropriately
          const { data } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
            
          if (data?.role === 'business') {
            console.log('Business owner signed in, redirecting to dashboard');
            navigate('/dashboard');
            
            toast({
              title: "Business Dashboard",
              description: "Welcome to your business dashboard",
            });
          } else {
            toast({
              title: "Logged in",
              description: "You have been successfully logged in",
            });
          }
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
  }, [toast, refreshSession, navigate]);
  
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
          
          // Check if the user is a business user after refresh
          const { data: profileData } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.session.user.id)
            .single();
            
          if (profileData?.role === 'business' && !location.pathname.startsWith('/dashboard')) {
            console.log('Business owner detected after session refresh, redirecting to dashboard');
            navigate('/dashboard');
          }
        }
      } catch (err) {
        console.error('Error verifying auth:', err);
      }
    };
    
    verifyAuth();
  }, [location.pathname, isLoggedIn, refreshSession, navigate]);
  
  // Direct business owners to dashboard if they try to access shopper pages
  useEffect(() => {
    if (isLoggedIn && user?.role === 'business') {
      // Check if the user is on the homepage or other consumer pages
      const isOnConsumerPage = !location.pathname.startsWith('/dashboard') && 
                               !['/login', '/signup'].includes(location.pathname);
      
      if (isOnConsumerPage) {
        console.log('Business owner detected on consumer page, redirecting to dashboard');
        navigate('/dashboard');
      }
    }
  }, [location.pathname, isLoggedIn, user, navigate]);
  
  return null; // This is a middleware component, it doesn't render anything
};

export default AuthMiddleware;
