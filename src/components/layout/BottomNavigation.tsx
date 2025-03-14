
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Store, Search, ShoppingBag, UserCircle2 } from 'lucide-react';
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

  // Define navigation items with more modern icons
  const navItems = [
    {
      label: 'Home',
      icon: <LayoutDashboard className="h-6 w-6" />,
      path: '/',
      match: ['/']
    },
    {
      label: 'Shops',
      icon: <Store className="h-6 w-6" />,
      path: '/shops',
      match: ['/shops', '/shop', '/shop/']
    },
    {
      label: 'Search',
      icon: <Search className="h-6 w-6" />,
      path: '/browse',
      match: ['/browse', '/browse/']
    },
    {
      label: 'Cart',
      icon: <ShoppingBag className="h-6 w-6" />,
      path: isLoggedIn && user?.role !== 'business' ? '/cart' : '/login',
      match: ['/cart', '/checkout', '/orders', '/order-confirmation'],
      badge: cart.items.length > 0 ? cart.items.length : undefined,
      hideForBusiness: true
    },
    {
      label: 'Account',
      icon: <UserCircle2 className="h-6 w-6" />,
      path: isLoggedIn ? '/profile' : '/login',
      match: ['/profile', '/login', '/signup']
    }
  ];

  // Filter out cart for business users
  const filteredNavItems = navItems.filter(item => 
    !(user?.role === 'business' && item.hideForBusiness)
  );

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
            className={`flex justify-around items-center h-16 ${
              mode === 'dark' 
                ? 'bg-gray-900/90 backdrop-blur-md border-t border-gray-800' 
                : 'bg-white/90 backdrop-blur-md border-t border-gray-100'
            } shadow-[0_-2px_10px_rgba(0,0,0,0.05)]`}
            style={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}
          >
            {filteredNavItems.map((item) => {
              const active = isActive(item);
              
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className="relative flex flex-col items-center justify-center w-full h-full"
                >
                  <motion.div 
                    className={`flex flex-col items-center justify-center`}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="relative">
                      <div className={`p-1 rounded-full ${active 
                        ? (mode === 'dark' ? 'bg-gray-800' : 'bg-gray-100') 
                        : ''
                      }`}>
                        <div className={active 
                          ? (mode === 'dark' ? 'text-white' : 'text-black')
                          : (mode === 'dark' ? 'text-gray-500' : 'text-gray-400')
                        }>
                          {item.icon}
                        </div>
                      </div>
                      
                      {item.badge && (
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-5 h-5 bg-[#FF7A45] text-white text-[10px] rounded-full shadow-sm"
                        >
                          {item.badge > 9 ? '9+' : item.badge}
                        </motion.span>
                      )}
                    </div>
                    
                    <span className={`mt-1 text-[10px] ${
                      active 
                        ? (mode === 'dark' ? 'text-white font-medium' : 'text-black font-medium')
                        : (mode === 'dark' ? 'text-gray-500' : 'text-gray-500')
                    }`}>
                      {item.label}
                    </span>
                    
                    {active && (
                      <motion.div
                        layoutId="bottomNavIndicator"
                        className={`absolute bottom-0 w-10 h-1 rounded-full ${
                          mode === 'dark' ? 'bg-white' : 'bg-black'
                        }`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
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
