
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shop } from '@/types/database';
import { X, Star, Clock, MapPin, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface ShopPreviewCardProps {
  shop: Shop;
  onClose: () => void;
  onViewShop: () => void;
}

const ShopPreviewCard: React.FC<ShopPreviewCardProps> = ({ 
  shop, 
  onClose,
  onViewShop
}) => {
  const navigate = useNavigate();

  const handleOrderClick = () => {
    navigate(`/shop/${shop.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-md"
    >
      <Card className="shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="relative">
          {/* Header/Cover Image */}
          <div 
            className="h-24 bg-gradient-to-r from-green-600 to-emerald-500 relative"
            style={{ 
              backgroundImage: shop.cover_image ? `url(${shop.cover_image})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Close button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2 h-8 w-8 bg-black/20 hover:bg-black/40 text-white rounded-full"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
            
            {/* Shop logo */}
            <div 
              className="absolute -bottom-8 left-4 w-16 h-16 rounded-full border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-800 overflow-hidden"
              style={{ 
                backgroundImage: shop.logo_url ? `url(${shop.logo_url})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
          </div>
          
          {/* Body */}
          <div className="pt-10 px-4 pb-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-lg">{shop.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {shop.category || 'Halal Shop'}
                </p>
              </div>
              
              {shop.rating && (
                <Badge variant="outline" className="flex items-center gap-1 border-yellow-400 text-yellow-600 dark:text-yellow-400">
                  <Star className="h-3 w-3 fill-current" />
                  {shop.rating.toFixed(1)}
                </Badge>
              )}
            </div>
            
            {shop.description && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                {shop.description}
              </p>
            )}
            
            <div className="space-y-1 mb-4">
              {shop.location && (
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span className="truncate">{shop.location}</span>
                </div>
              )}
              
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Clock className="h-3 w-3 mr-1" />
                <span>Open Now • Closes at 9:00 PM</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-[#2A866A] hover:bg-[#1f6e55] text-white"
                onClick={handleOrderClick}
              >
                Order Now
              </Button>
              
              <Button 
                variant="outline" 
                className="flex items-center gap-1"
                onClick={onViewShop}
              >
                <ExternalLink className="h-4 w-4" />
                View Shop
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ShopPreviewCard;
