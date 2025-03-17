
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ShoppingCart, User, Menu, MapPin } from 'lucide-react';
import { Shop } from '@/types/shop';

const Navbar = () => {
  const { user, logout, isLoading } = useAuth();
  const isAuthenticated = user !== null && !isLoading;
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <nav className="bg-haluna-primary text-white shadow">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left side - Logo and menu */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="text-white hover:text-white/80 focus:outline-none"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <Link to="/" className="text-xl font-bold text-white">
            Halvi
          </Link>
        </div>
        
        {/* Center - Location */}
        <div className="hidden md:flex items-center">
          <button className="flex items-center text-white hover:text-white/80">
            <MapPin className="h-5 w-5 mr-1" />
            <span className="text-sm">New York</span>
          </button>
        </div>

        {/* Right side - Cart and Auth */}
        <div className="flex items-center space-x-4">
          {/* Cart icon with orange background */}
          <Link 
            to="/cart" 
            className="relative flex items-center justify-center w-8 h-8 bg-orange-500 rounded-full text-white hover:bg-orange-600 transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">3</span>
          </Link>
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              {user && user.avatar_url ? (
                <Avatar className="h-8 w-8 border border-white/20">
                  <AvatarImage src={user.avatar_url} alt={user.name || 'Avatar'} />
                  <AvatarFallback>{user.name?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
                </Avatar>
              ) : (
                <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
              
              <div className="hidden md:block">
                <Link 
                  to="/dashboard" 
                  className="text-white hover:text-white/80"
                >
                  Dashboard
                </Link>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={logout}
                className="hidden md:inline-flex text-white hover:bg-white/20 hover:text-white"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login" className="text-white hover:text-white/80">
                Login
              </Link>
              <Link to="/register" className="text-white hover:text-white/80">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="bg-haluna-primary/90 py-3 border-t border-white/10">
          <div className="container mx-auto px-4 flex flex-col items-center space-y-3">
            <button className="flex items-center text-white hover:text-white/80 w-full justify-center py-2">
              <MapPin className="h-5 w-5 mr-2" />
              <span>New York</span>
            </button>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-white hover:text-white/80 w-full text-center py-2"
                >
                  Dashboard
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={logout}
                  className="text-white hover:bg-white/20 hover:text-white w-full"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-white hover:text-white/80 w-full text-center py-2"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="text-white hover:text-white/80 w-full text-center py-2"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
