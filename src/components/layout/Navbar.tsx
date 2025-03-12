
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, ShoppingCart, User, MapPin } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { useLocation as useLocationContext } from '@/context/LocationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { getMainShop } from '@/services/shopService';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Shop } from '@/types/database';
import { cn } from '@/lib/utils';

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
  const { isLocationEnabled, requestLocation } = useLocationContext();
  const { toast } = useToast();
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  
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
        description: "Select a main shop in Your Shops page",
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

  // Create a beautiful gradient for the navbar
  const navbarGradient = isDark 
    ? 'bg-gradient-to-b from-[#1f3a29] to-[#1C2526] border-b border-gray-800'
    : 'bg-gradient-to-b from-[#DFF0D8] to-[#E4F5F0]';

  return (
    <header 
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300", 
        navbarGradient,
        isScrolled && "shadow-sm"
      )}
      style={{ height: '70px' }}
    >
      <div className="container mx-auto px-4 h-full flex justify-between items-center">
        {/* Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`p-2 ${isDark ? 'text-white' : 'text-[#2A866A]'}`}
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
            <span className={`text-lg font-serif font-bold ${isDark ? 'text-white' : 'text-[#2A866A]'}`}>Haluna</span>
            
            {/* Animated logo design */}
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
                className={`w-2 h-2 ${isDark ? 'bg-[#3AA88C]' : 'bg-[#2A866B]'} rounded-full absolute`}
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
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Location Button */}
          <motion.button 
            onClick={requestLocation}
            className={`p-2 rounded-full ${
              isDark 
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
              isDark 
                ? 'text-white hover:bg-gray-700' 
                : 'text-[#2A866A] hover:bg-[#d5efe8]'
            } transition-colors`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {mainShop ? (
              <>
                {mainShop.logo ? (
                  <div className="w-5 h-5 rounded-full overflow-hidden">
                    <img 
                      src={mainShop.logo} 
                      alt={mainShop.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-[#E4875E] flex items-center justify-center text-white text-xs font-bold">
                    {mainShop.name.charAt(0)}
                  </div>
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
              <div className="flex items-center justify-center">
                <motion.div
                  className="w-5 h-5 rounded-full border border-[#E4875E] flex items-center justify-center"
                  initial={{ borderWidth: 1 }}
                  animate={{ 
                    borderWidth: [1, 2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  <span className="text-[8px]">Shop</span>
                </motion.div>
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
      
      {/* Mobile menu - Uber-inspired design */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className={`fixed inset-0 z-40 pt-[70px] ${
              isDark 
                ? 'bg-[#1C2526]' 
                : 'bg-white'
            }`}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="container mx-auto px-4 py-4">
              <div className="mb-6">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search"
                    className={`w-full py-2 px-4 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A866A]/30 ${
                      isDark
                        ? 'bg-gray-800 border border-gray-700 text-white placeholder:text-gray-400'
                        : 'bg-[#F5F5F5] border border-[#E0E0E0]'
                    }`}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <nav className="grid grid-cols-1 gap-2">
                {[
                  { path: '/', label: 'Home' },
                  { path: '/shops', label: 'Shops' },
                  { path: '/browse', label: 'Browse' },
                  { path: '/select-shops', label: 'Your Shops' },
                  ...(user?.role === 'business' ? [{ path: '/dashboard', label: 'Seller Dashboard' }] : []),
                  { path: isLoggedIn ? '/profile' : '/login', label: isLoggedIn ? 'My Account' : 'Sign In' },
                ].map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`flex items-center gap-3 p-3 rounded-lg transition ${
                      isDark
                        ? (isActive(item.path) 
                          ? 'bg-[#2A866A]/20 text-white' 
                          : 'text-gray-300 hover:bg-gray-800')
                        : (isActive(item.path) 
                          ? 'bg-[#E4F5F0] text-[#2A866A]' 
                          : 'text-gray-700 hover:bg-gray-100')
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>{item.label}</span>
                    {isActive(item.path) && (
                      <div className="ml-auto">
                        <motion.div
                          className="w-2 h-2 bg-[#2A866A] rounded-full"
                          layoutId="indicator"
                        />
                      </div>
                    )}
                  </Link>
                ))}
              </nav>
              
              {mainShop && (
                <div className="mt-8 p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
                  <h3 className="text-sm font-medium mb-2">Your Main Shop</h3>
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => {
                      navigate(`/shop/${mainShop.id}`);
                      setMobileMenuOpen(false);
                    }}
                  >
                    {mainShop.logo ? (
                      <img 
                        src={mainShop.logo} 
                        alt={mainShop.name} 
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#E4875E] flex items-center justify-center text-white mr-3">
                        {mainShop.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{mainShop.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{mainShop.location || 'No location'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
