
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Store, Search, ShoppingBag, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';

const BottomNavigation = () => {
  const location = useLocation();
  const { mode } = useTheme();
  const { isLoggedIn, user } = useAuth();
  const { cart } = useCart();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Hide navigation when scrolling down, show when scrolling up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Define navigation items with more modern icons
  const navItems = [
    {
      label: 'Home',
      icon: <Home className="h-5 w-5" />,
      path: '/',
      match: ['/']
    },
    {
      label: 'Shops',
      icon: <Store className="h-5 w-5" />,
      path: '/shops',
      match: ['/shops', '/shop', '/shop/']
    },
    {
      label: 'Search',
      icon: <Search className="h-5 w-5" />,
      path: '/browse',
      match: ['/browse', '/browse/']
    },
    {
      label: 'Cart',
      icon: <ShoppingBag className="h-5 w-5" />,
      path: isLoggedIn && user?.role !== 'business' ? '/cart' : '/login',
      match: ['/cart', '/checkout', '/orders', '/order-confirmation'],
      badge: cart.items.length > 0 ? cart.items.length : undefined,
      hideForBusiness: true
    },
    {
      label: 'Account',
      icon: <User className="h-5 w-5" />,
      path: isLoggedIn ? '/profile' : '/login',
      match: ['/profile', '/login', '/signup']
    }
  ];

  // Filter out cart for business users
  const filteredNavItems = navItems.filter(item => 
    !(user?.role === 'business' && item.hideForBusiness)
  );

  const isActive = (item: typeof navItems[0]) => {
    return item.match.some(path => location.pathname.startsWith(path));
  };

  // Don't show bottom nav on admin or dashboard pages
  if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard')) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav 
          className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ duration: 0.3 }}
        >
          <div 
            className={`mobile-nav ${
              mode === 'dark' 
                ? 'bg-gray-900 backdrop-blur-md border-t border-gray-800' 
                : 'bg-white/95 backdrop-blur-md border-t border-gray-100'
            } shadow-[0_-4px_15px_rgba(0,0,0,0.08)]`}
            style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}
          >
            {filteredNavItems.map((item) => {
              const active = isActive(item);
              
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className="relative flex flex-col items-center justify-center w-full"
                >
                  <motion.div 
                    className={`flex flex-col items-center justify-center px-2 py-2 rounded-full ${
                      active ? (mode === 'dark' ? 'bg-gray-800' : 'bg-gray-100') : ''
                    }`}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="relative">
                      <div className={active 
                        ? (mode === 'dark' ? 'text-white' : 'text-haluna-primary')
                        : (mode === 'dark' ? 'text-gray-500' : 'text-gray-500')
                      }>
                        {item.icon}
                      </div>
                      
                      {item.badge && (
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-[10px] rounded-full shadow-sm"
                        >
                          {item.badge > 9 ? '9+' : item.badge}
                        </motion.span>
                      )}
                    </div>
                    
                    <span className={`mt-1 text-[10px] ${
                      active 
                        ? (mode === 'dark' ? 'text-white font-medium' : 'text-haluna-primary font-medium')
                        : (mode === 'dark' ? 'text-gray-500' : 'text-gray-500')
                    }`}>
                      {item.label}
                    </span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default BottomNavigation;
