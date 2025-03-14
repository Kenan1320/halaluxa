
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, CircleCheck } from 'lucide-react';
import { Shop } from '@/models/shop';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { formatDistance } from '@/utils/locationUtils';
import { useTheme } from '@/context/ThemeContext';

interface ShopCardProps {
  shop: Shop;
  className?: string;
}

const ShopCard: React.FC<ShopCardProps> = ({ shop, className }) => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  
  // Handle both object and primitive rating types
  const ratingValue = typeof shop.rating === 'object' ? shop.rating.average : shop.rating;
  const formattedRating = typeof ratingValue === 'number' ? ratingValue.toFixed(1) : '0.0';
  
  // Use either camelCase or snake_case props (for backward compatibility)
  const shopLogo = shop.logo || shop.logo_url;
  const shopCover = shop.coverImage || shop.cover_image;
  const isVerified = shop.isVerified || shop.is_verified;
  const productCount = shop.productCount || shop.product_count || 0;
  
  return (
    <motion.div 
      className={cn(
        `rounded-xl overflow-hidden shadow-sm group transition-all duration-200 ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`,
        className
      )}
      whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/shop/${shop.id}`}>
        <div className="aspect-[3/2] overflow-hidden relative">
          {shopCover ? (
            <img 
              src={shopCover} 
              alt={shop.name} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${
              isDark ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>No cover image</span>
            </div>
          )}
          
          {/* Shop logo */}
          <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/70 to-transparent">
            <div className="flex items-center">
              <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-white bg-white shadow-md">
                {shopLogo ? (
                  <img 
                    src={shopLogo} 
                    alt={`${shop.name} logo`} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${
                    isDark ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <span className="text-gray-400 text-xl font-bold">
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
                    {formattedRating}
                  </span>
                  {isVerified && (
                    <div className="flex items-center text-xs text-white">
                      <CircleCheck className="h-3 w-3 text-green-400 mr-1" />
                      <span>Verified</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Distance badge if available */}
          {shop.distance && (
            <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
              {formatDistance(shop.distance)}
            </div>
          )}
        </div>
        
        <div className="p-3">
          <div className="flex items-center text-xs mb-2">
            <MapPin className={`h-3 w-3 mr-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <span className={`line-clamp-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {shop.location}
            </span>
          </div>
          
          <p className={`text-sm line-clamp-2 mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {shop.description}
          </p>
          
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {productCount} Products
            </span>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
            }`}>
              {shop.category}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ShopCard;
