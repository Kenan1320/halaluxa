
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, ShoppingCart, User, MapPin, Store, AlertCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { useLocation as useLocationContext } from '@/context/LocationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { getShopById, getMainShop } from '@/services/shopService';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Shop } from '@/types/database';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mainShop, setMainShop] = useState<Shop | null>(null);
  const { translate } = useLanguage();
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const { cart } = useCart();
  const { isLocationEnabled, requestLocation, location: userLocation } = useLocationContext();
  const { toast } = useToast();
  const { mode } = useTheme();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);
  
  // Handle scroll for navbar styles
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Load main shop from localStorage
  useEffect(() => {
    const loadMainShop = async () => {
      try {
        const shop = await getMainShop();
        setMainShop(shop);
      } catch (error) {
        console.error('Error loading main shop:', error);
      }
    };
    
    loadMainShop();
    
    // Listen for shop selection changes
    const handleShopSelectionChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.mainShopId) {
        getShopById(customEvent.detail.mainShopId).then(shop => {
          setMainShop(shop);
        });
      } else {
        setMainShop(null);
      }
    };
    
    window.addEventListener('shopsSelectionChanged', handleShopSelectionChange);
    
    return () => {
      window.removeEventListener('shopsSelectionChanged', handleShopSelectionChange);
    };
  }, [location.pathname]);
  
  const handleMainShopClick = () => {
    if (!mainShop) {
      toast({
        title: "No main shop selected",
        description: "Please go to Select Your Shops to choose your main shop.",
        variant: "default"
      });
      navigate('/select-shops');
      return;
    }
    
    navigate(`/shop/${mainShop.id}`);
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${mode === 'dark' ? 'bg-[#1C2526] text-white border-b border-gray-800' : 'bg-white border-b border-gray-100'}`}
      style={{ height: '60px' }}
    >
      <div className="container mx-auto px-4 h-full flex justify-between items-center">
        {/* Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`p-2 ${mode === 'dark' ? 'text-white' : 'text-[#2A866A]'}`}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
        
        {/* Logo - with advanced animation */}
        <div className="flex items-center ml-3 mr-auto">
          <Link to="/" className="flex items-center">
            <motion.span 
              className={`text-lg font-sans font-medium ${mode === 'dark' ? 'text-white' : 'text-[#2A866A]'}`}
              style={{ 
                fontFamily: "'Product Sans', 'Google Sans', 'Roboto', sans-serif",
                letterSpacing: '-0.02em'
              }}
              animate={{
                opacity: [0.9, 1, 0.9],
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Haluna
            </motion.span>
            
            {/* Advanced animated logo design */}
            <div className="relative ml-1">
              {/* Main orange ball */}
              <motion.div 
                className="w-4 h-4 bg-[#E4875E] rounded-full"
                animate={{
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    '0 0 0 rgba(228, 135, 94, 0.4)',
                    '0 0 10px rgba(228, 135, 94, 0.7)',
                    '0 0 0 rgba(228, 135, 94, 0.4)'
                  ]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              
              {/* Orbiting green ball */}
              <motion.div
                className={`w-2 h-2 ${mode === 'dark' ? 'bg-[#3AA88C]' : 'bg-[#2A866B]'} rounded-full absolute`}
                animate={{
                  x: [2, 1.5, 0, -1.5, -2, -1.5, 0, 1.5, 2],
                  y: [0, 1.5, 2, 1.5, 0, -1.5, -2, -1.5, 0],
                  opacity: [0.7, 1, 0.7],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </div>
          </Link>
        </div>
        
        {/* Right side buttons */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Location Button */}
          <motion.button 
            onClick={requestLocation}
            className={`p-2 rounded-full ${
              mode === 'dark' 
                ? 'text-white hover:bg-gray-700' 
                : 'text-[#2A866A] hover:bg-[#d5efe8]'
            } transition-colors`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MapPin className="h-5 w-5" />
          </motion.button>
          
          {/* Main Shop Button */}
          <motion.button 
            onClick={handleMainShopClick}
            className={`relative p-2 rounded-full ${
              mode === 'dark' 
                ? 'text-white hover:bg-gray-700' 
                : 'text-[#2A866A] hover:bg-[#d5efe8]'
            } transition-colors`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {mainShop ? (
              <>
                {mainShop.logo ? (
                  <div className="w-5 h-5 rounded-full overflow-hidden border border-current">
                    <img src={mainShop.logo} alt={mainShop.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <Store className="h-5 w-5" />
                )}
                <motion.div 
                  className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#E4875E] rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              </>
            ) : (
              <div className="relative">
                <Store className="h-5 w-5" />
                <motion.div 
                  className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                />
              </div>
            )}
          </motion.button>
          
          {/* Cart Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/cart" 
              className="relative p-2 rounded-lg bg-[#FF7A45] text-white block"
            >
              <ShoppingCart className="h-5 w-5" />
              {cart.items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#2A866A] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.items.length}
                </span>
              )}
            </Link>
          </motion.div>
          
          {/* User Profile */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to={isLoggedIn ? (user?.role === 'business' ? '/dashboard' : '/profile') : '/login'}
              className="p-2 rounded-full bg-[#2A866A] text-white block"
            >
              <User className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </div>
      
      {/* Mobile menu with Uber-like styling */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              className="fixed inset-0 bg-black/60 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Menu panel */}
            <motion.div 
              className={`fixed inset-y-0 left-0 w-[280px] ${
                mode === 'dark' ? 'bg-[#1C2526]' : 'bg-white'
              } z-50 shadow-xl overflow-y-auto`}
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              {/* User info section */}
              <div className={`p-6 ${mode === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                {isLoggedIn && user ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-[#2A866A] flex items-center justify-center">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-white text-lg font-medium">
                          {user.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className={`font-medium ${mode === 'dark' ? 'text-white' : 'text-black'}`}>
                        {user.name}
                      </h3>
                      <p className={`text-sm ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {user.email}
                      </p>
                    </div>
                  </div>
                ) : (
                  <Link 
                    to="/login"
                    className="flex items-center space-x-2 p-2 rounded-lg bg-[#2A866A]/10 text-[#2A866A] hover:bg-[#2A866A]/20 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    <span className="font-medium">Sign in</span>
                  </Link>
                )}
              </div>
              
              {/* Navigation links */}
              <nav className="p-4">
                <div className="mb-2 px-2">
                  <h4 className={`text-xs uppercase font-medium ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Browse
                  </h4>
                </div>
                
                <Link
                  to="/"
                  className={`flex items-center gap-3 p-3 mb-1 rounded-lg transition ${
                    mode === 'dark'
                      ? (isActive('/') 
                        ? 'bg-[#2A866A]/20 text-white' 
                        : 'text-gray-300 hover:bg-gray-800')
                      : (isActive('/') 
                        ? 'bg-[#E4F5F0] text-[#2A866A]' 
                        : 'text-gray-700 hover:bg-gray-100')
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-sm font-medium">Home</span>
                </Link>
                
                <Link
                  to="/shops"
                  className={`flex items-center gap-3 p-3 mb-1 rounded-lg transition ${
                    mode === 'dark'
                      ? (isActive('/shops') 
                        ? 'bg-[#2A866A]/20 text-white' 
                        : 'text-gray-300 hover:bg-gray-800')
                      : (isActive('/shops') 
                        ? 'bg-[#E4F5F0] text-[#2A866A]' 
                        : 'text-gray-700 hover:bg-gray-100')
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-sm font-medium">Shops</span>
                </Link>
                
                <Link
                  to="/browse"
                  className={`flex items-center gap-3 p-3 mb-1 rounded-lg transition ${
                    mode === 'dark'
                      ? (isActive('/browse') 
                        ? 'bg-[#2A866A]/20 text-white' 
                        : 'text-gray-300 hover:bg-gray-800')
                      : (isActive('/browse') 
                        ? 'bg-[#E4F5F0] text-[#2A866A]' 
                        : 'text-gray-700 hover:bg-gray-100')
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-sm font-medium">Browse</span>
                </Link>
                
                {/* Divider */}
                <div className="my-3 border-t border-gray-200 dark:border-gray-700"></div>
                
                <div className="mb-2 px-2">
                  <h4 className={`text-xs uppercase font-medium ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Your Account
                  </h4>
                </div>
                
                {/* Select Shops link */}
                <Link
                  to="/select-shops"
                  className={`flex items-center gap-3 p-3 mb-1 rounded-lg transition ${
                    mode === 'dark'
                      ? (isActive('/select-shops') 
                        ? 'bg-[#2A866A]/20 text-white' 
                        : 'text-gray-300 hover:bg-gray-800')
                      : (isActive('/select-shops') 
                        ? 'bg-[#E4F5F0] text-[#2A866A]' 
                        : 'text-gray-700 hover:bg-gray-100')
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-sm font-medium">Select Your Shops</span>
                </Link>
                
                <Link
                  to="/cart"
                  className={`flex items-center justify-between p-3 mb-1 rounded-lg transition ${
                    mode === 'dark'
                      ? (isActive('/cart') 
                        ? 'bg-[#2A866A]/20 text-white' 
                        : 'text-gray-300 hover:bg-gray-800')
                      : (isActive('/cart') 
                        ? 'bg-[#E4F5F0] text-[#2A866A]' 
                        : 'text-gray-700 hover:bg-gray-100')
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-sm font-medium">Your Cart</span>
                  {cart.items.length > 0 && (
                    <span className="text-xs py-0.5 px-2 rounded-full bg-[#2A866A] text-white">
                      {cart.items.length}
                    </span>
                  )}
                </Link>
                
                {user?.role === 'business' && (
                  <Link
                    to="/dashboard"
                    className={`flex items-center gap-3 p-3 mb-1 rounded-lg transition ${
                      mode === 'dark'
                        ? (isActive('/dashboard') 
                          ? 'bg-[#2A866A]/20 text-white' 
                          : 'text-gray-300 hover:bg-gray-800')
                        : (isActive('/dashboard') 
                          ? 'bg-[#E4F5F0] text-[#2A866A]' 
                          : 'text-gray-700 hover:bg-gray-100')
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-sm font-medium">Seller Dashboard</span>
                  </Link>
                )}
                
                <Link
                  to={isLoggedIn ? '/profile' : '/login'}
                  className={`flex items-center gap-3 p-3 mb-1 rounded-lg transition ${
                    mode === 'dark'
                      ? ((isActive('/profile') || isActive('/login'))
                        ? 'bg-[#2A866A]/20 text-white' 
                        : 'text-gray-300 hover:bg-gray-800')
                      : ((isActive('/profile') || isActive('/login'))
                        ? 'bg-[#E4F5F0] text-[#2A866A]' 
                        : 'text-gray-700 hover:bg-gray-100')
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-sm font-medium">{isLoggedIn ? 'My Account' : 'Sign In'}</span>
                </Link>
              </nav>
              
              {/* Footer section */}
              <div className="p-4 mt-auto border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <ThemeToggle />
                  <div className={`text-xs ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Version 1.0.0
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
