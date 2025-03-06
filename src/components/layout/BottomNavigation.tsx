
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Store, Search, ShoppingCart, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

const BottomNavigation = () => {
  const location = useLocation();
  const { isLoggedIn, user } = useAuth();
  const { items } = useCart();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Hide navigation when scrolling down, show when scrolling up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Define navigation items
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
      icon: <ShoppingCart className="h-5 w-5" />,
      path: isLoggedIn ? '/cart' : '/login',
      match: ['/cart', '/checkout', '/orders', '/order-confirmation'],
      badge: items.length > 0 ? items.length : undefined
    },
    {
      label: 'Account',
      icon: <User className="h-5 w-5" />,
      path: isLoggedIn ? '/profile' : '/login',
      match: ['/profile', '/login', '/signup']
    }
  ];

  const isActive = (item: typeof navItems[0]) => {
    return item.match.includes(location.pathname);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav 
          className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-40 md:hidden"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-around items-center h-16 px-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="relative flex flex-col items-center justify-center w-full h-full"
              >
                <div 
                  className={`flex flex-col items-center justify-center transition-all ${
                    isActive(item) 
                      ? 'text-haluna-primary' 
                      : 'text-gray-500'
                  }`}
                >
                  <div className="relative">
                    {item.icon}
                    {item.badge && (
                      <span className="absolute -top-2 -right-2 flex items-center justify-center w-4 h-4 bg-red-500 text-white text-[10px] rounded-full">
                        {item.badge > 9 ? '9+' : item.badge}
                      </span>
                    )}
                  </div>
                  <span className="mt-1 text-xs font-medium">{item.label}</span>
                  {isActive(item) && (
                    <motion.div
                      layoutId="bottomNavIndicator"
                      className="absolute -bottom-1 w-12 h-0.5 bg-haluna-primary rounded-full"
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                </div>
              </Link>
            ))}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default BottomNavigation;
