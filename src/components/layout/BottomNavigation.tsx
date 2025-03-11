
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, ShoppingCart, User } from 'lucide-react';

const BottomNavigation = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 z-40">
      <div className="grid grid-cols-5 h-16">
        <Link 
          to="/" 
          className={`flex flex-col items-center justify-center ${isActive('/') ? 'text-[#2A866A]' : 'text-gray-500'}`}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link 
          to="/search" 
          className={`flex flex-col items-center justify-center ${isActive('/search') ? 'text-[#2A866A]' : 'text-gray-500'}`}
        >
          <Search className="h-6 w-6" />
          <span className="text-xs mt-1">Search</span>
        </Link>
        
        <Link 
          to="/wishlist" 
          className={`flex flex-col items-center justify-center ${isActive('/wishlist') ? 'text-[#2A866A]' : 'text-gray-500'}`}
        >
          <Heart className="h-6 w-6" />
          <span className="text-xs mt-1">Wishlist</span>
        </Link>
        
        <Link 
          to="/cart" 
          className={`flex flex-col items-center justify-center ${isActive('/cart') ? 'text-[#2A866A]' : 'text-gray-500'}`}
        >
          <ShoppingCart className="h-6 w-6" />
          <span className="text-xs mt-1">Cart</span>
        </Link>
        
        <Link 
          to="/profile/user" 
          className={`flex flex-col items-center justify-center ${isActive('/profile/user') ? 'text-[#2A866A]' : 'text-gray-500'}`}
        >
          <User className="h-6 w-6" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNavigation;
