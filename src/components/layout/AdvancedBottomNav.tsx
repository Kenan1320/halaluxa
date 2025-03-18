
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Package, Activity, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';

const AdvancedBottomNav = () => {
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

  // Define navigation items with animated icons
  const navItems = [
    {
      label: 'Home',
      icon: <Home className="h-5 w-5" />,
      path: '/',
      match: ['/']
    },
    {
      label: 'Search',
      icon: <Search className="h-5 w-5" />,
      path: '/browse',
      match: ['/browse', '/search']
    },
    {
      label: 'Services',
      icon: <Package className="h-5 w-5" />,
      path: '/services',
      match: ['/services']
    },
    {
      label: 'Activity',
      icon: <Activity className="h-5 w-5" />,
      path: isLoggedIn && user?.role !== 'business' ? '/orders' : '/login',
      match: ['/orders', '/order-confirmation'],
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

  // Filter out activity for business users
  const filteredNavItems = navItems.filter(item => 
    !(user?.role === 'business' && item.hideForBusiness)
  );

  const isActive = (item: typeof navItems[0]) => {
    return item.match.some(path => location.pathname === path);
  };

  // Don't show nav on admin pages or dashboard
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
            className={`flex justify-around ${
              mode === 'dark' 
                ? 'bg-gray-900/90 backdrop-blur-lg border-t border-gray-800' 
                : 'bg-white/95 backdrop-blur-lg border-t border-gray-100'
            } shadow-[0_-4px_20px_rgba(0,0,0,0.1)]`}
            style={{ 
              borderTopLeftRadius: '24px', 
              borderTopRightRadius: '24px',
              paddingBottom: 'env(safe-area-inset-bottom)'
            }}
          >
            {filteredNavItems.map((item, index) => {
              const active = isActive(item);
              
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className="relative flex flex-col items-center justify-center py-3 flex-1"
                >
                  <motion.div 
                    className={`flex flex-col items-center justify-center p-2 ${
                      active ? (
                        mode === 'dark' 
                          ? 'text-white bg-green-600/20 rounded-xl' 
                          : 'text-green-600 bg-green-600/10 rounded-xl'
                      ) : (
                        mode === 'dark' 
                          ? 'text-gray-500' 
                          : 'text-gray-500'
                      )
                    }`}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    layoutId={`nav-item-${index}`}
                  >
                    <div className="relative">
                      <motion.div
                        animate={active ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        {item.icon}
                      </motion.div>
                      
                      {item.badge && (
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-5 h-5 px-1 bg-red-500 text-white text-[10px] font-medium rounded-full shadow-sm"
                        >
                          {item.badge > 99 ? '99+' : item.badge}
                        </motion.span>
                      )}
                    </div>
                    
                    <motion.span 
                      className={`mt-1 text-[10px] font-medium ${
                        active 
                          ? (mode === 'dark' ? 'text-white' : 'text-green-600') 
                          : (mode === 'dark' ? 'text-gray-500' : 'text-gray-500')
                      }`}
                      animate={active ? { y: [0, -2, 0] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      {item.label}
                    </motion.span>
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

export default AdvancedBottomNav;
