
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'shopper' | 'business' | 'any';
  businessAllowed?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  requiredRole = 'any',
  businessAllowed = true
}: ProtectedRouteProps) => {
  const { isLoggedIn, user, refreshSession } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  
  useEffect(() => {
    const checkSession = async () => {
      if (isLoggedIn && user) {
        // Check if the user's role matches the required role
        if (requiredRole !== 'any' && user.role !== requiredRole) {
          toast({
            title: "Access Restricted",
            description: `This page is only accessible to ${requiredRole === 'business' ? 'business owners' : 'shoppers'}.`,
            variant: "destructive",
          });
        }
        
        // Check if business users are allowed on this page
        if (!businessAllowed && user.role === 'business') {
          toast({
            title: "Access Restricted",
            description: "This page is only accessible to shoppers.",
            variant: "destructive",
          });
        }
      } else {
        // Force refresh the session to ensure we have the latest user data
        await refreshSession();
      }
    };
    
    checkSession();
  }, [isLoggedIn, user, requiredRole, businessAllowed, refreshSession, toast]);
  
  if (!isLoggedIn) {
    // Redirect to login if not logged in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Handle business owner restrictions
  if (user?.role === 'business' && !businessAllowed) {
    // Redirect business owners to dashboard if they try to access shopper-only features
    return <Navigate to="/dashboard" replace />;
  }
  
  if (requiredRole !== 'any' && user?.role !== requiredRole) {
    // Redirect if user doesn't have the required role
    const redirectPath = user?.role === 'business' ? '/dashboard' : '/shop';
    return <Navigate to={redirectPath} replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
