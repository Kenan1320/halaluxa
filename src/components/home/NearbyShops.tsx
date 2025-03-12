
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Store, Star, MapPin } from 'lucide-react';
import { Shop } from '@/types/database';
import { motion } from 'framer-motion';

interface NearbyShopsProps {
  shops: Shop[];
  isLoading: boolean;
}

const NearbyShops = ({ shops, isLoading }: NearbyShopsProps) => {
  const shopVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm animate-pulse">
            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 mx-auto mb-3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mx-auto"></div>
          </div>
        ))}
      </div>
    );
  }

  if (shops.length === 0) {
    return (
      <div className="text-center py-8">
        <Store className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-medium mb-2">No shops nearby</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          We couldn't find any shops in your area.
        </p>
        <Link 
          to="/shops" 
          className="text-black dark:text-white font-medium hover:underline"
        >
          Browse all shops
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {shops.map((shop, index) => (
        <motion.div
          key={shop.id}
          custom={index}
          variants={shopVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center hover-scale"
        >
          <Link to={`/shop/${shop.id}`} className="w-full">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 mx-auto mb-2 flex items-center justify-center border border-gray-200 dark:border-gray-700">
              {shop.logo_url ? (
                <img src={shop.logo_url} alt={shop.name} className="w-full h-full object-cover" />
              ) : (
                <Store className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <h3 className="font-medium text-sm mb-1 line-clamp-1">{shop.name}</h3>
            <div className="flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 mb-1">
              <Star className="h-3 w-3 text-yellow-500 mr-1" fill="currentColor" />
              <span>{shop.rating?.toFixed(1) || "New"}</span>
            </div>
            {shop.distance && (
              <div className="flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                <MapPin className="h-3 w-3 mr-1" />
                <span>{shop.distance < 1 ? `${(shop.distance * 1000).toFixed(0)}m` : `${shop.distance.toFixed(1)}km`}</span>
              </div>
            )}
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default NearbyShops;
