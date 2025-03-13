
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, Search, ShoppingCart, User, Map } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

const BottomNavigation = () => {
  const location = useLocation();
  const { user } = useAuth();
  const cartCount = 0; // Replace with actual cart count from context

  const links = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/search', icon: Search, label: 'Search' },
    { to: '/map', icon: Map, label: 'Live Updates' },
    { to: '/cart', icon: ShoppingCart, label: 'Cart', count: cartCount },
    { to: user ? '/profile' : '/auth/login', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800 pb-safe">
      <nav className="flex justify-around items-center h-14">
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
                  ? "text-[#2A866A]" 
                  : "text-gray-500 dark:text-gray-400"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-0.5 bg-[#2A866A] rounded-b-full"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
              
              <div className="relative">
                <link.icon className={cn(
                  "h-5 w-5",
                  isActive 
                    ? "stroke-[#2A866A]" 
                    : "stroke-gray-500 dark:stroke-gray-400"
                )} />
                
                {link.count && link.count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-3.5 h-3.5 flex items-center justify-center text-[10px]">
                    {link.count > 9 ? '9+' : link.count}
                  </span>
                )}
              </div>
              
              <span className="text-[10px] mt-0.5">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNavigation;
