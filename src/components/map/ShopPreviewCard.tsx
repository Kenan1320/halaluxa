
import React from 'react';
import { Shop } from '@/types/database';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Star, Navigation, Clock, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface ShopPreviewCardProps {
  shop: Shop;
  onClose: () => void;
}

const ShopPreviewCard: React.FC<ShopPreviewCardProps> = ({ shop, onClose }) => {
  // Determine if shop has delivery or is pickup only
  const hasDelivery = shop.display_mode === 'local_delivery' || shop.display_mode === 'online';
  const hasPickup = shop.display_mode === 'local_pickup' || 
                   (shop.pickup_options && (shop.pickup_options.store || shop.pickup_options.curbside));

  return (
    <motion.div
      layoutId={`shop-card-${shop.id}`}
      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
    >
      <Card className="overflow-hidden shadow-lg border-0">
        <div className="relative h-40 overflow-hidden">
          {shop.cover_image ? (
            <img 
              src={shop.cover_image} 
              alt={shop.name} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          
          <button 
            onClick={onClose} 
            className="absolute top-2 right-2 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          
          <div className="absolute bottom-0 left-0 p-4 text-white">
            <h3 className="text-lg font-bold">{shop.name}</h3>
            <div className="flex items-center mt-1">
              <div className="flex items-center mr-3">
                <Star className="h-3 w-3 text-yellow-400 mr-1" />
                <span className="text-xs">{shop.rating || 'New'}</span>
              </div>
              <div className="flex items-center mr-3">
                <Clock className="h-3 w-3 text-gray-300 mr-1" />
                <span className="text-xs">Open</span>
              </div>
              {shop.distance && (
                <div className="flex items-center">
                  <Navigation className="h-3 w-3 text-gray-300 mr-1" />
                  <span className="text-xs">{shop.distance.toFixed(1)} mi</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="flex flex-col space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {shop.description || `A ${shop.category} offering halal products and services`}
            </p>
            
            <div className="flex flex-wrap gap-2">
              <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs px-2 py-1 rounded-full">
                {shop.category || 'Halal Shop'}
              </div>
              {hasDelivery && (
                <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs px-2 py-1 rounded-full">
                  Delivery
                </div>
              )}
              {hasPickup && (
                <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 text-xs px-2 py-1 rounded-full">
                  Pickup
                </div>
              )}
              {shop.is_verified && (
                <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 text-xs px-2 py-1 rounded-full">
                  Verified
                </div>
              )}
            </div>
            
            <div className="flex space-x-2 pt-1">
              <Link to={`/shop/${shop.id}`} className="flex-grow">
                <Button className="w-full bg-[#2A866A] hover:bg-[#1f6e55]">
                  Order Now
                </Button>
              </Link>
              <Link to={`/order-tracking?shop=${shop.id}`} className="flex-shrink-0">
                <Button variant="outline" className="border-[#2A866A] text-[#2A866A] hover:bg-[#2A866A]/10">
                  Track Orders
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ShopPreviewCard;
