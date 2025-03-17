
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Store, User, LogOut, MapPin, Search, Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from '@/context/LocationContext';
import CartDropdown from '@/components/shop/CartDropdown';
import { useIsMobile } from '@/hooks/use-mobile';
import { DirectAdminAccess } from '@/components/admin/DirectAdminAccess';

const AuthNavItems = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const { isLocationEnabled, location, requestLocation } = useLocation();
  const isMobile = useIsMobile();
  
  if (!isLoggedIn) {
    return (
      <div className="flex items-center gap-4">
        {!isMobile && (
          <>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={requestLocation}
              className="flex items-center gap-2 text-haluna-text hover:text-haluna-primary"
            >
              <MapPin className="h-4 w-4" />
              <span className="hidden md:inline">
                {isLocationEnabled ? location?.city || 'Location enabled' : 'Enable location'}
              </span>
            </Button>

            <Link to="/search" className="text-haluna-text hover:text-haluna-primary flex items-center gap-2 transition">
              <Search className="h-4 w-4" />
              <span className="hidden md:inline">Search</span>
            </Link>
          </>
        )}

        <Link to="/login" className="text-haluna-text hover:text-haluna-primary transition">
          Log In
        </Link>
        <Button 
          href="/signup" 
          size="sm" 
          className="bg-orange-400 text-white hover:bg-orange-500"
        >
          Sign Up
        </Button>
        
        {/* Direct Admin Access Button */}
        {import.meta.env.DEV && (
          <DirectAdminAccess variant="outline" size="sm" />
        )}
      </div>
    );
  }
  
  // Different navigation for business users vs shoppers
  if (user?.role === 'business') {
    return (
      <div className="flex items-center gap-4">
        <Button 
          href="/dashboard" 
          size="sm" 
          variant="secondary" 
          className="flex items-center gap-2 bg-orange-400 text-white hover:bg-orange-500"
        >
          <Store className="h-4 w-4" />
          <span className="hidden md:inline">Dashboard</span>
        </Button>
        
        {/* Direct Admin Access Button for business users */}
        {import.meta.env.DEV && (
          <DirectAdminAccess variant="outline" size="sm" />
        )}
        
        <div className="relative group">
          <button className="flex items-center gap-2 text-haluna-text hover:text-haluna-primary transition">
            <div className="w-8 h-8 rounded-full bg-orange-400 text-white flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
            <span className="hidden md:inline">{user?.name}</span>
          </button>
          
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
            <div className="p-3 border-b">
              <p className="font-medium">{user?.name}</p>
              <p className="text-xs text-haluna-text-light">{user?.email}</p>
            </div>
            <div className="p-2">
              <Link to="/dashboard" className="block w-full text-left p-2 rounded-md flex items-center gap-2 hover:bg-haluna-primary-light">
                <Store className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              
              {/* Admin access in dropdown */}
              {import.meta.env.DEV && (
                <Link to="/admin" className="block w-full text-left p-2 rounded-md flex items-center gap-2 hover:bg-haluna-primary-light">
                  <Settings className="h-4 w-4" />
                  <span>Admin Access</span>
                </Link>
              )}
              
              <button 
                onClick={logout}
                className="w-full text-left p-2 rounded-md flex items-center gap-2 hover:bg-haluna-primary-light text-red-500"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Shopper navigation
  return (
    <div className="flex items-center gap-4">
      {!isMobile && (
        <>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={requestLocation}
            className="flex items-center gap-2 text-haluna-text hover:text-haluna-primary"
          >
            <MapPin className="h-4 w-4" />
            <span className="hidden md:inline">
              {isLocationEnabled ? location?.city || 'Location enabled' : 'Enable location'}
            </span>
          </Button>
          
          <Link to="/search" className="text-haluna-text hover:text-haluna-primary flex items-center gap-2 transition">
            <Search className="h-4 w-4" />
            <span className="hidden md:inline">Search</span>
          </Link>
        </>
      )}
      
      <div className="flex items-center gap-4">
        {!isMobile && (
          <>
            <Button 
              href="/browse" 
              size="sm" 
              variant="ghost" 
              className="flex items-center gap-2 text-haluna-text hover:text-haluna-primary"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden md:inline">Browse</span>
            </Button>
            
            <CartDropdown />
            
            {/* Direct Admin Access Button */}
            {import.meta.env.DEV && (
              <DirectAdminAccess variant="outline" size="sm" />
            )}
          </>
        )}
      </div>
      
      <div className="relative group">
        <button className="flex items-center gap-2 text-haluna-text hover:text-haluna-primary transition">
          <div className="w-8 h-8 rounded-full bg-orange-400 text-white flex items-center justify-center">
            <User className="h-4 w-4" />
          </div>
          <span className="hidden md:inline">{user?.name}</span>
        </button>
        
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
          <div className="p-3 border-b">
            <p className="font-medium">{user?.name}</p>
            <p className="text-xs text-haluna-text-light">{user?.email}</p>
          </div>
          <div className="p-2">
            <Link to="/profile" className="block w-full text-left p-2 rounded-md flex items-center gap-2 hover:bg-haluna-primary-light">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </Link>
            <Link to="/orders" className="block w-full text-left p-2 rounded-md flex items-center gap-2 hover:bg-haluna-primary-light">
              <ShoppingBag className="h-4 w-4" />
              <span>Orders</span>
            </Link>
            
            {/* Admin access in dropdown */}
            {import.meta.env.DEV && (
              <Link to="/admin" className="block w-full text-left p-2 rounded-md flex items-center gap-2 hover:bg-haluna-primary-light">
                <Settings className="h-4 w-4" />
                <span>Admin Access</span>
              </Link>
            )}
            
            <button 
              onClick={logout}
              className="w-full text-left p-2 rounded-md flex items-center gap-2 hover:bg-haluna-primary-light text-red-500"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthNavItems;
