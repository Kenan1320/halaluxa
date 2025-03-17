
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shop } from '@/types/shop';
import { useTheme } from '@/context/ThemeContext';
import { normalizeShop } from '@/utils/shopHelper';

interface ShopLogoScrollerProps {
  shops: Shop[];
  direction?: 'left' | 'right';
}

const ShopLogoScroller = ({ 
  shops, 
  direction = 'left' 
}: ShopLogoScrollerProps) => {
  const { mode } = useTheme();
  
  if (!shops || shops.length === 0) return null;
  
  // Make sure we normalize all shops
  const normalizedShops = shops.map(shop => normalizeShop(shop));
  
  return (
    <div className="relative overflow-hidden">
      {/* Static background instead of dynamic gradient */}
      <div className={`absolute inset-0 rounded-3xl ${
        mode === 'dark'
          ? 'bg-gray-800/30 border border-gray-700/50'
          : 'bg-white border border-gray-200/50'
      }`} />
      
      {/* Top fade effect */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white dark:from-gray-900 to-transparent z-10"></div>
      
      {/* Bottom fade effect */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-gray-900 to-transparent z-10"></div>
      
      {/* Left fade effect */}
      <div className="absolute top-0 left-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-gray-900 to-transparent z-10"></div>
      
      {/* Right fade effect */}
      <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-gray-900 to-transparent z-10"></div>
      
      {/* Shops continuously flowing in one direction */}
      <motion.div
        className="flex py-6 px-6"
        initial={{ x: direction === 'left' ? "0%" : "-100%" }}
        animate={{ x: direction === 'left' ? "-100%" : "0%" }}
        transition={{
          repeat: Infinity,
          duration: 30,
          ease: "linear",
          repeatType: "loop"
        }}
      >
        {[...normalizedShops, ...normalizedShops, ...normalizedShops].map((shop, index) => (
          <motion.div
            key={`${shop.id}-flow-${index}`}
            className="mx-4 flex flex-col items-center"
            whileHover={{ scale: 1.1, y: -5 }}
          >
            <Link to={`/shop/${shop.id}`}>
              <motion.div 
                className={`w-20 h-20 rounded-2xl bg-white shadow-md flex items-center justify-center overflow-hidden ${
                  mode === 'dark' ? 'border border-gray-700' : 'border border-gray-100'
                }`}
                whileHover={{ 
                  boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                  borderColor: "#0F1B44" 
                }}
              >
                {shop.logo_url ? (
                  <img src={shop.logo_url} alt={shop.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#F9F5EB] text-[#29866B] font-semibold text-xl">
                    {shop.name.charAt(0)}
                  </div>
                )}
              </motion.div>
              <div className="mt-2 w-20 text-center">
                {shop.name.split(' ').map((word, i) => (
                  <div key={i} className={`text-xs font-medium truncate ${
                    mode === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {word}
                  </div>
                ))}
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ShopLogoScroller;
