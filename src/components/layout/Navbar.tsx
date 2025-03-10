
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, ShoppingCart, User, Moon, Sun, Store } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
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
          <Link to="/" className="flex items-center gap-1.5">
            <div className="relative">
              <motion.div
                className="absolute inset-0 rounded-full opacity-30 dark:opacity-20"
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
            <span className="text-xl font-giaza font-bold text-[#2A866A] dark:text-[#4ECBA5] tracking-wide">Halvi</span>
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
          
          {/* Main Shop Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/select-shops" 
              className="p-2 rounded-full text-[#2A866A] dark:text-[#4ECBA5] hover:bg-[#d5efe8] dark:hover:bg-gray-800 transition-colors block"
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
            <Link
              to="/categories"
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                isActive('/categories') ? 'bg-[#E4F5F0] dark:bg-[#2A866A]/20 text-[#2A866A] dark:text-[#4ECBA5]' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Categories</span>
            </Link>
            <Link
              to="/select-shops"
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                isActive('/select-shops') ? 'bg-[#E4F5F0] dark:bg-[#2A866A]/20 text-[#2A866A] dark:text-[#4ECBA5]' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Select Your Shop</span>
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
