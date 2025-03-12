
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, ShoppingCart, User, MapPin, Store, AlertCircle, Home, Package, CreditCard, Settings, LogOut, Info, HelpCircle, Moon, Sun } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { useLocation as useLocationContext } from '@/context/LocationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { getShopById, getMainShop } from '@/services/shopService';
import { Shop } from '@/types/database';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mainShop, setMainShop] = useState<Shop | null>(null);
  const { translate } = useLanguage();
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();
  const { cart } = useCart();
  const { isLocationEnabled, requestLocation, location: userLocation } = useLocationContext();
  const { toast } = useToast();
  const { mode, toggleMode } = useTheme();
  
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

  const menuItems = [
    { icon: <Home size={20} />, label: 'Home', path: '/' },
    { icon: <Store size={20} />, label: 'Shops', path: '/shops' },
    { icon: <Search size={20} />, label: 'Browse', path: '/browse' },
    { icon: <Package size={20} />, label: 'Select Your Shops', path: '/select-shops' },
    ...(user?.role === 'business' ? [{ icon: <CreditCard size={20} />, label: 'Seller Dashboard', path: '/dashboard' }] : []),
    { icon: <HelpCircle size={20} />, label: 'Help', path: '/help' },
    { icon: <Info size={20} />, label: 'About', path: '/about' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
  ];

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 
        ${mode === 'dark' 
          ? 'bg-[#1C2526] text-white border-b border-gray-800' 
          : 'bg-[#E4F5F0]'}`}
      style={{ height: '70px' }}
    >
      <div className="container mx-auto px-4 h-full flex justify-between items-center">
        {/* Menu Button - simplified to a dropdown */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`p-2 rounded-full ${
            mode === 'dark' 
              ? 'text-white hover:bg-gray-700' 
              : 'text-[#2A866A] hover:bg-[#d5efe8]'
          } transition-all duration-200`}
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
            <span className={`text-lg font-serif font-bold ${mode === 'dark' ? 'text-white' : 'text-[#2A866A]'}`}
                  style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif" }}>
              Haluna
            </span>
            
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
                className={`w-2 h-2 ${mode === 'dark' ? 'bg-[#3AA88C]' : 'bg-[#2A866B]'} rounded-full absolute`}
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
            <MapPin className="h-6 w-6" />
          </motion.button>
          
          {/* Main Shop Button - Only shop with pulse animation */}
          <motion.button 
            onClick={handleMainShopClick}
            className={`relative p-2 rounded-full ${
              mode === 'dark' 
                ? 'text-white hover:bg-gray-700' 
                : 'text-[#2A866A] hover:bg-[#d5efe8]'
            } transition-colors shadow-sm`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {mainShop ? (
              <>
                {mainShop.logo_url ? (
                  <div className="w-6 h-6 rounded-full overflow-hidden border-2 border-[#2A866A]">
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
          
          {/* Cart Button - Modernized */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/cart" 
              className="relative p-2 rounded-lg bg-[#FF7A45] text-white block shadow-sm"
            >
              <ShoppingCart className="h-6 w-6" />
              {cart.items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#2A866A] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                  {cart.items.length}
                </span>
              )}
            </Link>
          </motion.div>
          
          {/* User Profile - Modernized */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to={isLoggedIn ? (user?.role === 'business' ? '/dashboard' : '/profile') : '/login'}
              className="p-2 rounded-full bg-[#2A866A] text-white block shadow-sm"
            >
              <User className="h-6 w-6" />
            </Link>
          </motion.div>
        </div>
      </div>
      
      {/* Mobile menu - More compact with just icons for the sleek look */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div 
              className={`absolute left-0 top-[70px] py-4 px-2 ${
                mode === 'dark' 
                  ? 'bg-[#1C2526]/95 text-white border-r border-gray-800 backdrop-blur-sm' 
                  : 'bg-white/95 border-r border-gray-100 backdrop-blur-sm'
              } overflow-hidden rounded-r-xl shadow-lg`}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col gap-3 items-center">
                {/* Menu navigation - sleek icon-only buttons */}
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex flex-col items-center justify-center p-3 rounded-full w-12 h-12 transition-colors ${
                      mode === 'dark'
                        ? (isActive(item.path) 
                          ? 'bg-[#2A866A] text-white' 
                          : 'text-gray-300 hover:bg-gray-800')
                        : (isActive(item.path) 
                          ? 'bg-[#E4F5F0] text-[#2A866A]' 
                          : 'text-gray-700 hover:bg-gray-100')
                    }`}
                    title={item.label}
                  >
                    {item.icon}
                  </Link>
                ))}
                
                {/* Theme toggle - icon only */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMode();
                  }}
                  className={`flex items-center justify-center p-3 rounded-full w-12 h-12 transition-colors ${
                    mode === 'dark'
                      ? 'text-gray-300 hover:bg-gray-800' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  title={mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
                >
                  {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                
                {/* Sign out button - icon only */}
                {isLoggedIn && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-center p-3 rounded-full w-12 h-12 transition-colors ${
                      mode === 'dark'
                        ? 'text-gray-300 hover:bg-gray-800'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    title="Sign Out"
                  >
                    <LogOut size={20} />
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
