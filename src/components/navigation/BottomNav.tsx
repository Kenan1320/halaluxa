
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, ShoppingBag, User, Menu } from 'lucide-react';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/search', icon: Search, label: 'Search' },
  { path: '/cart', icon: ShoppingBag, label: 'Cart' },
  { path: '/account', icon: User, label: 'Account' },
  { path: '/menu', icon: Menu, label: 'Menu' }
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 z-50">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex justify-between items-center">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            
            return (
              <Link
                key={path}
                to={path}
                className="flex flex-col items-center py-1"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <Icon 
                    className={`w-6 h-6 ${
                      isActive 
                        ? 'text-haluna-primary' 
                        : 'text-gray-500'
                    }`} 
                  />
                  {isActive && (
                    <motion.div
                      layoutId="bottomNav"
                      className="absolute -bottom-1 left-1/2 w-1 h-1 bg-haluna-primary rounded-full transform -translate-x-1/2"
                    />
                  )}
                </motion.div>
                <span className={`text-xs mt-1 ${
                  isActive 
                    ? 'text-haluna-primary font-medium' 
                    : 'text-gray-500'
                }`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
