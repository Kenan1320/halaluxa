import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, ShoppingCart, User, MapPin, Store, AlertCircle, Home, Package, CreditCard, Settings, LogOut, Info, HelpCircle, Moon, Sun, Flame } from 'lucide-react';
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
  
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
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

  const NavLogo = () => (
    <Link to="/" className="flex items-center">
      <h1 
        className="text-xl font-serif font-bold text-white italic"
        style={{ 
          fontFamily: "'Playfair Display', serif", 
          textShadow: "0 1px 2px rgba(0,0,0,0.1)",
          letterSpacing: "0.02em"
        }}
      >
        Halvi
      </h1>
    </Link>
  );

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 
        ${mode === 'dark' 
          ? 'bg-gradient-to-r from-[#0F1B44] via-[#132054] to-[#183080] text-white border-b border-gray-800' 
          : 'bg-gradient-to-r from-[#0F1B44] via-[#132054] to-[#183080] text-white'}`}
      style={{ height: '70px' }}
    >
      <div className="container mx-auto px-4 h-full flex justify-between items-center">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`p-2 rounded-full ${
            mode === 'dark' 
              ? 'text-white hover:bg-gray-700/30' 
              : 'text-white hover:bg-white/10'
          } transition-all duration-200`}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
        
        <div className="flex items-center ml-3 mr-auto">
          <NavLogo />
        </div>
        
        <div className="flex items-center gap-3">
          <motion.button 
            onClick={requestLocation}
            className="p-2 rounded-full text-white hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MapPin className="h-6 w-6" />
          </motion.button>
          
          <motion.button 
            onClick={handleMainShopClick}
            className="relative p-2 rounded-full text-white hover:bg-white/10 transition-colors shadow-sm"
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
      
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-50 bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div 
              className={`absolute left-0 top-[70px] bottom-0 w-[280px] p-4 ${
                mode === 'dark' 
                  ? 'bg-[#1C2526] text-white border-r border-gray-800' 
                  : 'bg-white border-r border-gray-100'
              } overflow-y-auto`}
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`p-4 mb-4 rounded-lg ${
                mode === 'dark' ? 'bg-gray-800' : 'bg-[#E4F5F0]'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    mode === 'dark' ? 'bg-gray-700' : 'bg-[#2A866A]'
                  } text-white`}>
                    {isLoggedIn && user ? user.name.charAt(0).toUpperCase() : <User size={20} />}
                  </div>
                  <div>
                    <p className="font-medium">
                      {isLoggedIn && user ? user.name : 'Welcome'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {isLoggedIn && user ? user.email : 'Sign in for the best experience'}
                    </p>
                  </div>
                </div>
                
                {!isLoggedIn && (
                  <Link 
                    to="/login"
                    className="mt-3 block w-full py-2 bg-[#2A866A] text-white text-center rounded-full text-sm font-medium"
                  >
                    Sign In
                  </Link>
                )}
              </div>
              
              <button
                onClick={toggleMode}
                className={`flex items-center gap-4 p-3 rounded-lg transition w-full text-left mb-3 ${
                  mode === 'dark'
                    ? 'bg-gray-800 text-white' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {mode === 'dark' ? (
                  <>
                    <Sun size={20} />
                    <span className="text-sm">Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon size={20} />
                    <span className="text-sm">Dark Mode</span>
                  </>
                )}
              </button>
              
              <div className="space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-4 p-3 rounded-lg transition ${
                      mode === 'dark'
                        ? (isActive(item.path) 
                          ? 'bg-[#2A866A]/20 text-white' 
                          : 'text-gray-300 hover:bg-gray-800')
                        : (isActive(item.path) 
                          ? 'bg-[#E4F5F0] text-[#2A866A]' 
                          : 'text-gray-700 hover:bg-gray-100')
                    }`}
                  >
                    {item.icon}
                    <span className="text-sm">{item.label}</span>
                    
                    {item.label === "Affiliate & Drivers" && (
                      <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full flex items-center">
                        <Flame className="h-3 w-3 mr-0.5" />
                        <span>New</span>
                      </span>
                    )}
                  </Link>
                ))}
                
                {isLoggedIn && (
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-4 p-3 rounded-lg transition w-full text-left ${
                      mode === 'dark'
                        ? 'text-gray-300 hover:bg-gray-800'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <LogOut size={20} />
                    <span className="text-sm">Sign Out</span>
                  </button>
                )}
              </div>
              
              <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 text-center">
                  Version 1.0.0
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
