
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingCart, Heart, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';

const BottomNavigation = () => {
  const location = useLocation();
  const { cart } = useCart();
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
      icon: <Home className="h-6 w-6" />,
      path: '/',
      match: ['/']
    },
    {
      label: 'Search',
      icon: <Search className="h-6 w-6" />,
      path: '/search',
      match: ['/search', '/browse']
    },
    {
      label: 'Cart',
      icon: <ShoppingCart className="h-6 w-6" />,
      path: '/cart',
      match: ['/cart', '/checkout', '/orders', '/order-confirmation'],
      badge: cart.items.length > 0 ? cart.items.length : undefined
    },
    {
      label: 'Wishlist',
      icon: <Heart className="h-6 w-6" />,
      path: '/wishlist', 
      match: ['/wishlist']
    },
    {
      label: 'Account',
      icon: <User className="h-6 w-6" />,
      path: '/profile',
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
          className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ duration: 0.3 }}
        >
          <div 
            className="flex justify-around items-center h-16 bg-white border-t border-gray-200"
          >
            {navItems.map((item) => {
              const active = isActive(item);
              
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className="relative flex flex-col items-center justify-center w-full h-full"
                >
                  <div className={`flex flex-col items-center justify-center`}>
                    <div className="relative">
                      <div className={active ? 'text-[#2A866A]' : 'text-gray-500'}>
                        {item.icon}
                      </div>
                      
                      {item.badge && (
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-5 h-5 bg-[#2A866A] text-white text-[10px] rounded-full"
                        >
                          {item.badge > 9 ? '9+' : item.badge}
                        </motion.span>
                      )}
                    </div>
                    
                    <span className={`mt-1 text-xs ${active ? 'text-[#2A866A]' : 'text-gray-500'}`}>
                      {item.label}
                    </span>
                  </div>
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
