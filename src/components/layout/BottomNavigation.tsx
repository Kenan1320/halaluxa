
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, Search, ShoppingCart, User, Map } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';

const BottomNavigation = () => {
  const location = useLocation();
  const { user, isLoggedIn } = useAuth();
  const { cart } = useCart();
  const cartCount = cart.items.length;

  const links = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/search', icon: Search, label: 'Search' },
    { to: '/map', icon: Map, label: 'Explore' },
    { to: '/cart', icon: ShoppingCart, label: 'Cart', count: cartCount },
    { to: isLoggedIn ? (user?.role === 'business' ? '/dashboard' : '/profile') : '/login', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 pb-safe">
      <nav className="flex justify-around items-center h-16">
        {links.map((link) => {
          const isActive = location.pathname === link.to || 
                          (link.to !== '/' && location.pathname.startsWith(link.to));
          
          return (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full relative py-1",
                isActive 
                  ? "text-gray-900 dark:text-white" 
                  : "text-gray-400 dark:text-gray-500"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-gray-900 dark:bg-white rounded-b-full"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
              
              <div className="relative">
                <link.icon className={cn(
                  "h-6 w-6",
                  isActive 
                    ? "stroke-gray-900 dark:stroke-white" 
                    : "stroke-gray-400 dark:stroke-gray-500"
                )} />
                
                {link.count && link.count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                    {link.count > 9 ? '9+' : link.count}
                  </span>
                )}
              </div>
              
              <span className="text-[10px] mt-1 font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNavigation;
