
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Store, User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import CartDropdown from '@/components/shop/CartDropdown';

const AuthNavItems = () => {
  const { isLoggedIn, user, logout } = useAuth();
  
  if (!isLoggedIn) {
    return (
      <div className="flex items-center gap-4">
        <Link to="/login" className="text-haluna-text hover:text-haluna-primary transition">
          Log In
        </Link>
        <Button href="/signup" size="sm">
          Sign Up
        </Button>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-4">
      {user?.role === 'business' ? (
        <Button href="/dashboard" size="sm" variant="outline" className="flex items-center gap-2">
          <Store className="h-4 w-4" />
          <span className="hidden md:inline">Dashboard</span>
        </Button>
      ) : (
        <div className="flex items-center gap-4">
          <Button href="/shop" size="sm" variant="outline" className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden md:inline">Shop</span>
          </Button>
          
          <CartDropdown />
        </div>
      )}
      
      <div className="relative group">
        <button className="flex items-center gap-2 text-haluna-text hover:text-haluna-primary transition">
          <div className="w-8 h-8 rounded-full bg-haluna-primary text-white flex items-center justify-center">
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
            <button 
              onClick={logout}
              className="w-full text-left p-2 rounded-md flex items-center gap-2 hover:bg-haluna-primary-light text-red-500"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthNavItems;
