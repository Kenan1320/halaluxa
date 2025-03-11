
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, Moon, Sun, Store, Monitor } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { getShopById, getMainShop } from '@/services/shopService';
import type { Shop } from '@/models/shop';
import { useTheme } from '@/context/ThemeContext';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header 
      className="fixed top-0 w-full z-50 transition-all duration-300 mint-header"
      style={{ height: '70px' }}
    >
      <div className="container mx-auto px-4 h-full flex justify-between items-center">
        {/* Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-[#2A866A] dark:text-[#4ECBA5] black:text-[#00C8FF]"
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
            <div className="relative">
              <motion.div
                className="absolute inset-0 rounded-full opacity-30 dark:opacity-20 black:opacity-20"
                animate={{ 
                  scale: [1, 1.15, 1],
                  opacity: [0.2, 0.3, 0.2]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "mirror"
                }}
                style={{ background: 'radial-gradient(circle, #2A866A 0%, transparent 70%)' }}
              />
              <img 
                src="/logo-digital-mall.svg" 
                alt="Halvi Digital Mall" 
                className="w-9 h-9 relative z-10"
              />
            </div>
          </Link>
        </div>
        
        {/* Right side buttons */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <Popover>
            <PopoverTrigger asChild>
              <motion.button 
                className="p-2 rounded-full text-[#2A866A] dark:text-[#4ECBA5] black:text-[#00C8FF] hover:bg-[#d5efe8] dark:hover:bg-gray-800 black:hover:bg-gray-900 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Theme settings"
              >
                {theme === 'light' ? (
                  <Sun className="h-6 w-6" />
                ) : theme === 'dark' ? (
                  <Moon className="h-6 w-6" />
                ) : (
                  <Monitor className="h-6 w-6" />
                )}
              </motion.button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0" align="end">
              <div className="p-2 grid gap-1">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex items-center gap-2 w-full text-left p-2 rounded-md transition-colors ${
                    theme === 'light' ? 'bg-primary/10 dark:bg-primary/20 black:bg-primary/20' : 'hover:bg-secondary'
                  }`}
                >
                  <Sun className="h-4 w-4" />
                  <span>Light</span>
                  {theme === 'light' && <span className="ml-auto text-primary">✓</span>}
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex items-center gap-2 w-full text-left p-2 rounded-md transition-colors ${
                    theme === 'dark' ? 'bg-primary/10 dark:bg-primary/20 black:bg-primary/20' : 'hover:bg-secondary'
                  }`}
                >
                  <Moon className="h-4 w-4" />
                  <span>Dark</span>
                  {theme === 'dark' && <span className="ml-auto text-primary">✓</span>}
                </button>
                <button
                  onClick={() => setTheme('black')}
                  className={`flex items-center gap-2 w-full text-left p-2 rounded-md transition-colors ${
                    theme === 'black' ? 'bg-primary/10 dark:bg-primary/20 black:bg-primary/20' : 'hover:bg-secondary'
                  }`}
                >
                  <Monitor className="h-4 w-4" />
                  <span>Black</span>
                  {theme === 'black' && <span className="ml-auto text-primary">✓</span>}
                </button>
              </div>
            </PopoverContent>
          </Popover>
          
          {/* Main Shop Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/select-shops" 
              className="p-2 rounded-full text-[#2A866A] dark:text-[#4ECBA5] black:text-[#00C8FF] hover:bg-[#d5efe8] dark:hover:bg-gray-800 black:hover:bg-gray-900 transition-colors block"
            >
              {mainShop?.logo_url ? (
                <img 
                  src={mainShop.logo_url} 
                  alt={mainShop.name}
                  className="h-6 w-6 rounded-full object-cover"
                />
              ) : (
                <Store className="h-6 w-6" />
              )}
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
                <span className="absolute -top-2 -right-2 bg-[#2A866A] dark:bg-[#4ECBA5] black:bg-[#00C8FF] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
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
              className="p-2 rounded-full bg-[#2A866A] dark:bg-[#4ECBA5] black:bg-[#00C8FF] text-white block"
            >
              <User className="h-6 w-6" />
            </Link>
          </motion.div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="container mx-auto px-4 py-4 bg-white dark:bg-gray-800 black:bg-black border-t border-gray-100 dark:border-gray-700 black:border-gray-800">
          {/* Mobile menu navigation */}
          <nav className="grid grid-cols-1 gap-3">
            <Link
              to="/"
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                isActive('/') ? 'bg-[#E4F5F0] dark:bg-[#2A866A]/20 black:bg-[#00C8FF]/20 text-[#2A866A] dark:text-[#4ECBA5] black:text-[#00C8FF]' : 'text-gray-700 dark:text-gray-300 black:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 black:hover:bg-gray-900'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Home</span>
            </Link>
            <Link
              to="/shops"
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                isActive('/shops') ? 'bg-[#E4F5F0] dark:bg-[#2A866A]/20 black:bg-[#00C8FF]/20 text-[#2A866A] dark:text-[#4ECBA5] black:text-[#00C8FF]' : 'text-gray-700 dark:text-gray-300 black:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 black:hover:bg-gray-900'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Shops</span>
            </Link>
            <Link
              to="/browse"
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                isActive('/browse') ? 'bg-[#E4F5F0] dark:bg-[#2A866A]/20 black:bg-[#00C8FF]/20 text-[#2A866A] dark:text-[#4ECBA5] black:text-[#00C8FF]' : 'text-gray-700 dark:text-gray-300 black:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 black:hover:bg-gray-900'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Browse</span>
            </Link>
            <Link
              to="/categories"
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                isActive('/categories') ? 'bg-[#E4F5F0] dark:bg-[#2A866A]/20 black:bg-[#00C8FF]/20 text-[#2A866A] dark:text-[#4ECBA5] black:text-[#00C8FF]' : 'text-gray-700 dark:text-gray-300 black:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 black:hover:bg-gray-900'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Categories</span>
            </Link>
            <Link
              to="/select-shops"
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                isActive('/select-shops') ? 'bg-[#E4F5F0] dark:bg-[#2A866A]/20 black:bg-[#00C8FF]/20 text-[#2A866A] dark:text-[#4ECBA5] black:text-[#00C8FF]' : 'text-gray-700 dark:text-gray-300 black:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 black:hover:bg-gray-900'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Select Your Shop</span>
            </Link>
            {user?.role === 'business' && (
              <Link
                to="/dashboard"
                className={`flex items-center gap-3 p-3 rounded-lg transition ${
                  isActive('/dashboard') ? 'bg-[#E4F5F0] dark:bg-[#2A866A]/20 black:bg-[#00C8FF]/20 text-[#2A866A] dark:text-[#4ECBA5] black:text-[#00C8FF]' : 'text-gray-700 dark:text-gray-300 black:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 black:hover:bg-gray-900'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Seller Dashboard</span>
              </Link>
            )}
            <Link
              to={isLoggedIn ? '/profile' : '/login'}
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                isActive('/profile') || isActive('/login') ? 'bg-[#E4F5F0] dark:bg-[#2A866A]/20 black:bg-[#00C8FF]/20 text-[#2A866A] dark:text-[#4ECBA5] black:text-[#00C8FF]' : 'text-gray-700 dark:text-gray-300 black:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 black:hover:bg-gray-900'
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
