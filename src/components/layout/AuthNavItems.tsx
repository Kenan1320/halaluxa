
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Store, User, LogOut, MapPin, Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from '@/context/LocationContext';
import CartDropdown from '@/components/shop/CartDropdown';
import { useIsMobile } from '@/hooks/use-mobile';

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
              className="flex items-center gap-2 text-white hover:text-white/80"
            >
              <MapPin className="h-4 w-4" />
              <span className="hidden md:inline">
                {isLocationEnabled ? location?.city || 'Location enabled' : 'Enable location'}
              </span>
            </Button>

            <Link to="/search" className="text-white hover:text-white/80 flex items-center gap-2 transition">
              <Search className="h-4 w-4" />
              <span className="hidden md:inline">Search</span>
            </Link>
          </>
        )}

        <Link to="/login" className="text-white hover:text-white/80 transition">
          Log In
        </Link>
        <Button 
          href="/signup" 
          size="sm" 
          className="bg-white text-haluna-primary hover:bg-white/90 hover:text-haluna-primary-dark"
        >
          Sign Up
        </Button>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-4">
      {!isMobile && (
        <>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={requestLocation}
            className="flex items-center gap-2 text-white hover:text-white/80"
          >
            <MapPin className="h-4 w-4" />
            <span className="hidden md:inline">
              {isLocationEnabled ? location?.city || 'Location enabled' : 'Enable location'}
            </span>
          </Button>
          
          <Link to="/search" className="text-white hover:text-white/80 flex items-center gap-2 transition">
            <Search className="h-4 w-4" />
            <span className="hidden md:inline">Search</span>
          </Link>
        </>
      )}
      
      {user?.role === 'business' ? (
        <Button 
          href="/dashboard" 
          size="sm" 
          variant="secondary" 
          className="flex items-center gap-2 bg-white text-haluna-primary hover:bg-white/90"
        >
          <Store className="h-4 w-4" />
          <span className="hidden md:inline">Dashboard</span>
        </Button>
      ) : (
        <div className="flex items-center gap-4">
          {!isMobile && (
            <Button 
              href="/browse" 
              size="sm" 
              variant="ghost" 
              className="flex items-center gap-2 text-white hover:text-white/80"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden md:inline">Browse</span>
            </Button>
          )}
          
          {!isMobile && <CartDropdown />}
        </div>
      )}
      
      <div className="relative group">
        <button className="flex items-center gap-2 text-white hover:text-white/80 transition">
          <div className="w-8 h-8 rounded-full bg-white text-haluna-primary flex items-center justify-center">
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
            {user?.role === 'shopper' && (
              <>
                <Link to="/profile" className="block w-full text-left p-2 rounded-md flex items-center gap-2 hover:bg-haluna-primary-light">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
                <Link to="/orders" className="block w-full text-left p-2 rounded-md flex items-center gap-2 hover:bg-haluna-primary-light">
                  <ShoppingBag className="h-4 w-4" />
                  <span>Orders</span>
                </Link>
              </>
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
