
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, ShoppingCart, User, MapPin, Store, AlertCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useLocation as useLocationContext } from '@/context/LocationContext';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { getShopById, getMainShop, Shop } from '@/services/shopService';
import { ThemeToggle } from "@/components/theme/ThemeToggle";

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

  return (
    <header 
      className="fixed top-0 w-full z-50 transition-all duration-300 bg-background border-b border-border dark:bg-[#121212] dark:border-[#2A2A2A]"
      style={{ height: '70px' }}
    >
      <div className="container mx-auto px-4 h-full flex justify-between items-center">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-primary dark:text-[#29866B]"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
        
        <div className="flex items-center ml-3 mr-auto">
          <Link to="/" className="flex items-center">
            <span className="text-lg font-serif font-bold text-primary dark:text-[#29866B]">Haluna</span>
            
            <div className="relative ml-1">
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
              
              <motion.div
                className="w-2 h-2 bg-primary dark:bg-[#29866B] rounded-full absolute"
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
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          <motion.button 
            onClick={requestLocation}
            className="p-2 rounded-full text-[#2A866A] hover:bg-[#d5efe8] transition-colors dark:hover:bg-[#1A3B32]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MapPin className="h-6 w-6" />
          </motion.button>
          
          <motion.button 
            onClick={handleMainShopClick}
            className="relative p-2 rounded-full text-[#2A866A] hover:bg-[#d5efe8] transition-colors dark:hover:bg-[#1A3B32]"
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
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/select-shops" 
              className="p-2 rounded-full text-[#2A866A] hover:bg-[#d5efe8] transition-colors block dark:hover:bg-[#1A3B32]"
            >
              <Store className="h-6 w-6" />
            </Link>
          </motion.div>
          
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
                <span className="absolute -top-2 -right-2 bg-[#2A866A] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
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
              className="p-2 rounded-full bg-[#2A866A] text-white block"
            >
              <User className="h-6 w-6" />
            </Link>
          </motion.div>
        </div>
      </div>
      
      {mobileMenuOpen && (
        <div className="container mx-auto px-4 py-4 bg-background border-t border-border dark:bg-[#121212] dark:border-[#2A2A2A]">
          <div className="md:hidden mb-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search your shop and products"
                className="w-full py-2 px-4 pl-10 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 dark:bg-[#1A1A1A] dark:border-[#2A2A2A] dark:text-[#E4F5F0]"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          
          <nav className="grid grid-cols-1 gap-3">
            <ThemeToggle mobile={true} />
            
            <Link
              to="/"
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                isActive('/') ? 'bg-secondary text-primary dark:bg-[#1A3B32] dark:text-[#29866B]' : 'text-foreground hover:bg-secondary/50 dark:text-[#E4F5F0] dark:hover:bg-[#1A3B32]/50'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Home</span>
            </Link>
            
            <Link
              to="/shops"
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                isActive('/shops') ? 'bg-secondary text-primary dark:bg-[#1A3B32] dark:text-[#29866B]' : 'text-foreground hover:bg-secondary/50 dark:text-[#E4F5F0] dark:hover:bg-[#1A3B32]/50'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Shops</span>
            </Link>
            
            <Link
              to="/browse"
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                isActive('/browse') ? 'bg-secondary text-primary dark:bg-[#1A3B32] dark:text-[#29866B]' : 'text-foreground hover:bg-secondary/50 dark:text-[#E4F5F0] dark:hover:bg-[#1A3B32]/50'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Browse</span>
            </Link>
            
            <Link
              to="/select-shops"
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                isActive('/select-shops') ? 'bg-secondary text-primary dark:bg-[#1A3B32] dark:text-[#29866B]' : 'text-foreground hover:bg-secondary/50 dark:text-[#E4F5F0] dark:hover:bg-[#1A3B32]/50'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Select Your Shops</span>
            </Link>
            
            {user?.role === 'business' && (
              <Link
                to="/dashboard"
                className={`flex items-center gap-3 p-3 rounded-lg transition ${
                  isActive('/dashboard') ? 'bg-secondary text-primary dark:bg-[#1A3B32] dark:text-[#29866B]' : 'text-foreground hover:bg-secondary/50 dark:text-[#E4F5F0] dark:hover:bg-[#1A3B32]/50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Seller Dashboard</span>
              </Link>
            )}
            
            <Link
              to={isLoggedIn ? '/profile' : '/login'}
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                isActive('/profile') || isActive('/login') ? 'bg-secondary text-primary dark:bg-[#1A3B32] dark:text-[#29866B]' : 'text-foreground hover:bg-secondary/50 dark:text-[#E4F5F0] dark:hover:bg-[#1A3B32]/50'
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
