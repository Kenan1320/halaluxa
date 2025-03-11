
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

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
  const { isLoggedIn, user } = useAuth();
  const location = useLocation();
  
  if (!isLoggedIn) {
    // Redirect to login if not logged in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Handle business user restrictions
  if (user?.role === 'business' && !businessAllowed) {
    // Redirect business users to dashboard if they try to access shopper-only features
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
