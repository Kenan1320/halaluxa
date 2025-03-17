
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useShop } from '@/context/ShopContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ShoppingCart, User, Menu, MapPin } from 'lucide-react';
import { Shop } from '@/types/shop';
import { getShopById } from '@/services/shopService';

const Navbar = () => {
  const { user, logout, isLoading } = useAuth();
  const { mainShop, setMainShop } = useShop();
  const isAuthenticated = user !== null && !isLoading;
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [currentShop, setCurrentShop] = useState<Shop | null>(null);
  
  useEffect(() => {
    // Load the main shop from localStorage if available
    const loadMainShop = async () => {
      const mainShopId = localStorage.getItem('mainShopId');
      if (mainShopId) {
        try {
          const shop = await getShopById(mainShopId);
          if (shop) {
            setCurrentShop(shop);
            if (setMainShop) setMainShop(shop);
          }
        } catch (error) {
          console.error('Error loading main shop:', error);
        }
      }
    };
    
    if (!currentShop && !mainShop) {
      loadMainShop();
    } else if (mainShop && !currentShop) {
      setCurrentShop(mainShop);
    }
  }, [mainShop, setMainShop, currentShop]);

  return (
    <nav className="bg-[#1A1F2C] text-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left side - Logo and menu */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="text-white hover:text-white/80 focus:outline-none"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <Link to="/" className="text-xl font-bold text-white italic">
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

        {/* Right side - Main Shop, Cart and Auth */}
        <div className="flex items-center space-x-4">
          {/* Main Shop */}
          {currentShop && (
            <Link 
              to={`/shop/${currentShop.id}`}
              className="relative flex items-center justify-center"
            >
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
                {currentShop.logo || currentShop.cover_image ? (
                  <img 
                    src={currentShop.logo || currentShop.cover_image} 
                    alt={currentShop.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold">
                    {currentShop.name.charAt(0)}
                  </div>
                )}
              </div>
            </Link>
          )}
          
          {/* Cart icon with orange background */}
          <Link 
            to="/cart" 
            className="relative flex items-center justify-center w-10 h-10 bg-orange-500 rounded-full text-white hover:bg-orange-600 transition-colors"
          >
            <ShoppingCart className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">3</span>
          </Link>
          
          {isAuthenticated ? (
            <Link to="/profile" className="flex items-center justify-center">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                {user && user.avatar_url ? (
                  <Avatar className="h-10 w-10 border border-white/20">
                    <AvatarImage src={user.avatar_url} alt={user.name || 'Avatar'} />
                    <AvatarFallback>{user.name?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
                  </Avatar>
                ) : (
                  <User className="h-6 w-6 text-white" />
                )}
              </div>
            </Link>
          ) : (
            <Link 
              to="/login"
              className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white"
            >
              <User className="h-6 w-6" />
            </Link>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="bg-[#1A1F2C]/90 py-3 border-t border-white/10">
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
