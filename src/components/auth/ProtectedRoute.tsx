
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
  const { isLoggedIn, user, isInitializing } = useAuth();
  const location = useLocation();
  
  // If still initializing authentication, show a loading state
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-haluna-primary"></div>
      </div>
    );
  }
  
  // Redirect to login if not logged in
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Handle business user restrictions
  if (user?.role === 'business' && !businessAllowed) {
    // Redirect business users to dashboard if they try to access shopper-only features
    return <Navigate to="/dashboard" replace />;
  }
  
  // Check for specific role requirements
  if (requiredRole !== 'any' && user?.role !== requiredRole) {
    // Redirect if user doesn't have the required role
    const redirectPath = user?.role === 'business' ? '/dashboard' : '/shop';
    return <Navigate to={redirectPath} replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
