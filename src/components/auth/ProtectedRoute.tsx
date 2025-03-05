
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'shopper' | 'business' | 'any';
}

const ProtectedRoute = ({ 
  children, 
  requiredRole = 'any' 
}: ProtectedRouteProps) => {
  const { isLoggedIn, user } = useAuth();
  const location = useLocation();
  
  if (!isLoggedIn) {
    // Redirect to login if not logged in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (requiredRole !== 'any' && user?.role !== requiredRole) {
    // Redirect if user doesn't have the required role
    const redirectPath = user?.role === 'business' ? '/dashboard' : '/shop';
    return <Navigate to={redirectPath} replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
