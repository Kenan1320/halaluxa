
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, CircleCheck } from 'lucide-react';
import { Shop } from '@/models/shop';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ShopCardProps {
  shop: Shop;
  className?: string;
}

const ShopCard: React.FC<ShopCardProps> = ({ shop, className }) => {
  return (
    <motion.div 
      className={cn(
        "bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm group",
        className
      )}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/shop/${shop.id}`}>
        <div className="aspect-[3/2] overflow-hidden relative">
          {shop.coverImage ? (
            <img 
              src={shop.coverImage} 
              alt={shop.name} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400 dark:text-gray-500">No cover image</span>
            </div>
          )}
          
          {/* Shop logo */}
          <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/60 to-transparent">
            <div className="flex items-center">
              <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-white bg-white dark:bg-gray-800">
                {shop.logo ? (
                  <img 
                    src={shop.logo} 
                    alt={`${shop.name} logo`} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-400 dark:text-gray-500 text-xl font-bold">
                      {shop.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="ml-3">
                <h3 className="font-semibold text-white text-lg line-clamp-1">{shop.name}</h3>
                <div className="flex items-center">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span className="text-xs text-white ml-1 mr-2">
                    {shop.rating.toFixed(1)}
                  </span>
                  {shop.isVerified && (
                    <div className="flex items-center text-xs text-white">
                      <CircleCheck className="h-3 w-3 text-green-400 mr-1" />
                      <span>Verified</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-3">
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
            <MapPin className="h-3 w-3 mr-1" />
            <span className="line-clamp-1">{shop.location}</span>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
            {shop.description}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              {shop.productCount} Products
            </span>
            <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300">
              {shop.category}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ShopCard;
