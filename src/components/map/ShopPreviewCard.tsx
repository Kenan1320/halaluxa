
import React from 'react';
import { Shop } from '@/types/database';
import { Link } from 'react-router-dom';
import { Star, MapPin, Clock, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ShopPreviewCardProps {
  shop: Shop;
  isSelected?: boolean;
  onClick?: () => void;
}

const ShopPreviewCard: React.FC<ShopPreviewCardProps> = ({ 
  shop, 
  isSelected = false,
  onClick 
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden cursor-pointer border",
        isSelected 
          ? "border-[#2A866A] shadow-[0_0_0_2px_rgba(42,134,106,0.2)]" 
          : "border-gray-200 dark:border-gray-700"
      )}
    >
      <div className="flex">
        <div className="relative w-24 h-full">
          <img 
            src={shop.logo_url || '/placeholder.svg'} 
            alt={shop.name}
            className="w-full h-full object-cover aspect-square"
          />
          {shop.is_halal_certified && (
            <Badge className="absolute top-2 left-2 bg-green-600 text-white text-[10px] px-1.5 py-0.5">
              Halal
            </Badge>
          )}
        </div>
        
        <div className="flex-1 p-3">
          <div className="flex justify-between">
            <h3 className="font-bold text-sm truncate">{shop.name}</h3>
            {shop.rating && (
              <div className="flex items-center">
                <Star className="h-3 w-3 fill-yellow-400 stroke-yellow-400 mr-0.5" />
                <span className="text-xs font-medium">{shop.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
          
          <p className="text-gray-500 dark:text-gray-400 text-xs truncate mt-1">
            {shop.category}
          </p>
          
          <div className="flex items-center mt-2">
            <MapPin className="h-3 w-3 text-gray-400 mr-1" />
            <p className="text-gray-500 dark:text-gray-400 text-xs truncate">
              {shop.location}
            </p>
          </div>
          
          <div className="mt-3 flex justify-between items-center">
            {shop.pickup_available && (
              <Badge variant="outline" className="text-[10px] bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 px-1.5 py-0.5">
                Pickup
              </Badge>
            )}
            
            {shop.delivery_available && (
              <Badge variant="outline" className="text-[10px] bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 px-1.5 py-0.5">
                Delivery
              </Badge>
            )}
            
            <Link 
              to={`/shop/${shop.id}`} 
              className="text-[#2A866A] text-xs flex items-center ml-auto"
              onClick={(e) => e.stopPropagation()}
            >
              View
              <ExternalLink className="h-3 w-3 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ShopPreviewCard;
