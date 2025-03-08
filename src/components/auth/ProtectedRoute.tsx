
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'shopper' | 'business' | 'any';
  businessAllowed?: boolean;
  isBusinessRoute?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  requiredRole = 'any',
  businessAllowed = true,
  isBusinessRoute = false
}: ProtectedRouteProps) => {
  const { isLoggedIn, user } = useAuth();
  const location = useLocation();
  const [isBusinessOwner, setIsBusinessOwner] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkBusinessStatus = async () => {
      if (!isLoggedIn || !user) {
        setIsLoading(false);
        return;
      }
      
      try {
        // Check profile to see if user is a business owner
        const { data, error } = await supabase
          .from('profiles')
          .select('is_business_owner')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        setIsBusinessOwner(data.is_business_owner || false);
      } catch (error) {
        console.error('Error checking business status:', error);
        setIsBusinessOwner(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkBusinessStatus();
  }, [isLoggedIn, user]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!isLoggedIn) {
    // Redirect to appropriate login page
    return <Navigate to={isBusinessRoute ? "/business/login" : "/login"} state={{ from: location }} replace />;
  }
  
  // Handle business routes
  if (isBusinessRoute && !isBusinessOwner) {
    // Redirect non-business users to business signup
    return <Navigate to="/business/signup" replace />;
  }
  
  // Handle shopper-only routes
  if (!businessAllowed && isBusinessOwner) {
    // Redirect business users to dashboard if they try to access shopper-only features
    return <Navigate to="/dashboard" replace />;
  }
  
  if (requiredRole !== 'any') {
    const userRole = isBusinessOwner ? 'business' : 'shopper';
    if (userRole !== requiredRole) {
      // Redirect to appropriate home page based on user role
      const redirectPath = isBusinessOwner ? '/dashboard' : '/';
      return <Navigate to={redirectPath} replace />;
    }
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
