
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, ShoppingCart, User, MapPin, Store, Moon, Sun } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useLocation as useLocationContext } from '@/context/LocationContext';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { getShopById, getMainShop } from '@/services/shopService';
import type { Shop } from '@/models/shop';
import { useTheme } from '@/context/ThemeContext';

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
  const { theme, setTheme } = useTheme();
  
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

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header 
      className="fixed top-0 w-full z-50 transition-all duration-300 bg-[#E4F5F0] dark:bg-gray-900"
      style={{ height: '70px' }}
    >
      <div className="container mx-auto px-4 h-full flex justify-between items-center">
        {/* Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-[#2A866A] dark:text-[#4ECBA5]"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
        
        {/* Logo - with animation */}
        <div className="flex items-center ml-3 mr-auto">
          <Link to="/" className="flex items-center">
            <span className="text-lg font-serif font-bold text-[#2A866A] dark:text-[#4ECBA5]">Halvi</span>
            
            {/* Main animated element */}
            <motion.div 
              className="relative ml-1"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Main orange ball */}
              <motion.div 
                className="w-4 h-4 bg-[#E4875E] rounded-full"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            </motion.div>
          </Link>
        </div>
        
        {/* Right side buttons */}
        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <motion.button 
            onClick={toggleTheme}
            className="p-2 rounded-full text-[#2A866A] dark:text-[#4ECBA5] hover:bg-[#d5efe8] dark:hover:bg-gray-800 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="h-6 w-6" />
            ) : (
              <Moon className="h-6 w-6" />
            )}
          </motion.button>
          
          {/* Location Button */}
          <motion.button 
            onClick={requestLocation}
            className="p-2 rounded-full text-[#2A866A] dark:text-[#4ECBA5] hover:bg-[#d5efe8] dark:hover:bg-gray-800 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MapPin className="h-6 w-6" />
          </motion.button>
          
          {/* Main Shop Button */}
          <motion.button 
            onClick={handleMainShopClick}
            className="relative p-2 rounded-full text-[#2A866A] dark:text-[#4ECBA5] hover:bg-[#d5efe8] dark:hover:bg-gray-800 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {mainShop ? (
              <>
                {mainShop.logo_url ? (
                  <div className="w-6 h-6 rounded-full overflow-hidden">
                    <img src={mainShop.logo_url} alt={mainShop.name} className="w-full h-full object-cover" />
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
              className="p-2 rounded-full text-[#2A866A] dark:text-[#4ECBA5] hover:bg-[#d5efe8] dark:hover:bg-gray-800 transition-colors block"
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
              className="relative p-2 rounded-lg bg-[#FF7A45] dark:bg-[#FF7A45] text-white block"
            >
              <ShoppingCart className="h-6 w-6" />
              {cart.items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#2A866A] dark:bg-[#4ECBA5] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
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
              className="p-2 rounded-full bg-[#2A866A] dark:bg-[#4ECBA5] text-white block"
            >
              <User className="h-6 w-6" />
            </Link>
          </motion.div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="container mx-auto px-4 py-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
          <div className="md:hidden mb-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search your shop and products"
                className="w-full py-2 px-4 pl-10 bg-[#F5F5F5] dark:bg-gray-700 border border-[#E0E0E0] dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A866A]/30 dark:focus:ring-[#4ECBA5]/30 dark:text-white"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-300" />
            </div>
          </div>
          
          {/* Mobile menu navigation */}
          <nav className="grid grid-cols-1 gap-3">
            <Link
              to="/"
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                isActive('/') ? 'bg-[#E4F5F0] dark:bg-[#2A866A]/20 text-[#2A866A] dark:text-[#4ECBA5]' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Home</span>
            </Link>
            <Link
              to="/shops"
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                isActive('/shops') ? 'bg-[#E4F5F0] dark:bg-[#2A866A]/20 text-[#2A866A] dark:text-[#4ECBA5]' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Shops</span>
            </Link>
            <Link
              to="/browse"
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                isActive('/browse') ? 'bg-[#E4F5F0] dark:bg-[#2A866A]/20 text-[#2A866A] dark:text-[#4ECBA5]' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Browse</span>
            </Link>
            {/* Select Shops link */}
            <Link
              to="/select-shops"
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                isActive('/select-shops') ? 'bg-[#E4F5F0] dark:bg-[#2A866A]/20 text-[#2A866A] dark:text-[#4ECBA5]' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Select Your Shops</span>
            </Link>
            {user?.role === 'business' && (
              <Link
                to="/dashboard"
                className={`flex items-center gap-3 p-3 rounded-lg transition ${
                  isActive('/dashboard') ? 'bg-[#E4F5F0] dark:bg-[#2A866A]/20 text-[#2A866A] dark:text-[#4ECBA5]' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Seller Dashboard</span>
              </Link>
            )}
            <Link
              to={isLoggedIn ? '/profile' : '/login'}
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                isActive('/profile') || isActive('/login') ? 'bg-[#E4F5F0] dark:bg-[#2A866A]/20 text-[#2A866A] dark:text-[#4ECBA5]' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>{isLoggedIn ? 'My Account' : 'Sign In'}</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
