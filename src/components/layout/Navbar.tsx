
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, ShoppingCart, User, MapPin, Store, AlertCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { useLocation as useLocationContext } from '@/context/LocationContext';
import { motion } from 'framer-motion';
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
  }, [location.pathname]);
  
  const handleMainShopClick = () => {
    if (!mainShop) {
      toast({
        title: "No main shop selected",
        description: "Please go to Select Your Shops to choose your main shop.",
        variant: "destructive"
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
      className={`fixed top-0 w-full z-50 transition-all duration-300 premium-gradient-header islamic-pattern-overlay
        ${isScrolled ? 'shadow-lg' : ''}`}
      style={{ height: '70px' }}
    >
      <div className="container mx-auto px-4 h-full flex justify-between items-center">
        {/* Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-white dark:text-white"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
        
        {/* Logo - with advanced animation */}
        <div className="flex items-center ml-3 mr-auto">
          <Link to="/" className="flex items-center">
            <span className="text-lg font-serif font-bold text-white dark:text-white">Haluna</span>
            
            {/* Advanced animated logo design */}
            <div className="relative ml-1">
              {/* Main orange ball */}
              <motion.div 
                className="w-5 h-5 bg-[#E4875E] rounded-full"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              
              {/* Orbiting green ball */}
              <motion.div
                className="w-2 h-2 bg-white rounded-full absolute"
                animate={{
                  x: [2, 1.5, 0, -1.5, -2, -1.5, 0, 1.5, 2],
                  y: [0, 1.5, 2, 1.5, 0, -1.5, -2, -1.5, 0],
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
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Location Button */}
          <motion.button 
            onClick={requestLocation}
            className="p-2 rounded-full text-white hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MapPin className="h-6 w-6" />
          </motion.button>
          
          {/* Main Shop Button */}
          <motion.button 
            onClick={handleMainShopClick}
            className="relative p-2 rounded-full text-white hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {mainShop ? (
              <>
                {mainShop.logo ? (
                  <div className="w-6 h-6 rounded-full overflow-hidden">
                    <img src={mainShop.logo} alt={mainShop.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <Store className="h-6 w-6" />
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
                <Store className="h-6 w-6" />
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
          
          {/* Select Shops Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/select-shops" 
              className="p-2 rounded-full text-white hover:bg-white/10 transition-colors block"
            >
              <Store className="h-6 w-6" />
            </Link>
          </motion.div>
          
          {/* Cart Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/cart" 
              className="relative p-2 rounded-lg bg-[#FF7A45] text-white block"
            >
              <ShoppingCart className="h-6 w-6" />
              {cart.items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-[#3F8C54] text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
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
              className="p-2 rounded-full bg-white text-[#3F8C54] block"
            >
              <User className="h-6 w-6" />
            </Link>
          </motion.div>
        </div>
      </div>
      
      {/* Mobile menu - Uber-inspired side menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop - semi-transparent overlay */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Side drawer menu */}
          <motion.div 
            className="absolute top-0 left-0 h-full w-[85%] max-w-sm bg-white dark:bg-gray-900 shadow-lg overflow-y-auto"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Header with back button */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center">
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 mr-3"
              >
                <X className="h-5 w-5" />
              </button>
              <h2 className="text-lg font-semibold">Menu</h2>
            </div>
            
            {/* Search bar */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-800">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search shops and products"
                  className="w-full py-3 px-4 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3F8C54]/30 bg-gray-100 dark:bg-gray-800 dark:text-white"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            {/* Navigation links */}
            <nav className="p-2">
              <Link
                to="/"
                className={`flex items-center py-3 px-4 rounded-lg transition ${
                  isActive('/') 
                    ? 'bg-[#DFF0D8] text-[#3F8C54] dark:bg-[#3F8C54]/20 dark:text-white' 
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-base">Home</span>
              </Link>
              
              <Link
                to="/shops"
                className={`flex items-center py-3 px-4 rounded-lg transition ${
                  isActive('/shops') 
                    ? 'bg-[#DFF0D8] text-[#3F8C54] dark:bg-[#3F8C54]/20 dark:text-white' 
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-base">Shops</span>
              </Link>
              
              <Link
                to="/browse"
                className={`flex items-center py-3 px-4 rounded-lg transition ${
                  isActive('/browse') 
                    ? 'bg-[#DFF0D8] text-[#3F8C54] dark:bg-[#3F8C54]/20 dark:text-white' 
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-base">Browse</span>
              </Link>
              
              <Link
                to="/select-shops"
                className={`flex items-center py-3 px-4 rounded-lg transition ${
                  isActive('/select-shops') 
                    ? 'bg-[#DFF0D8] text-[#3F8C54] dark:bg-[#3F8C54]/20 dark:text-white' 
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-base">Select Your Shops</span>
              </Link>
              
              {user?.role === 'business' && (
                <Link
                  to="/dashboard"
                  className={`flex items-center py-3 px-4 rounded-lg transition ${
                    isActive('/dashboard') 
                      ? 'bg-[#DFF0D8] text-[#3F8C54] dark:bg-[#3F8C54]/20 dark:text-white' 
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-base">Seller Dashboard</span>
                </Link>
              )}
              
              <Link
                to={isLoggedIn ? '/profile' : '/login'}
                className={`flex items-center py-3 px-4 rounded-lg transition ${
                  isActive('/profile') || isActive('/login') 
                    ? 'bg-[#DFF0D8] text-[#3F8C54] dark:bg-[#3F8C54]/20 dark:text-white' 
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-base">{isLoggedIn ? 'My Account' : 'Sign In'}</span>
              </Link>
            </nav>
            
            {/* Footer section */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center">
                {isLoggedIn ? (
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#3F8C54] flex items-center justify-center text-white text-lg">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                    </div>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="w-full py-3 flex justify-center items-center bg-[#3F8C54] text-white rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
