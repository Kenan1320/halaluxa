
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StarIcon, MapPinIcon, HeartIcon, ClockIcon, CreditCardIcon, ShoppingBagIcon, UsersIcon } from 'lucide-react';
import { ShopDetails, ShopCategory } from '@/types/shop';

interface ShopHeaderProps {
  shop: ShopDetails;
  onFollow?: () => void;
  isFollowing?: boolean;
}

export const ShopHeader: React.FC<ShopHeaderProps> = ({ 
  shop, 
  onFollow, 
  isFollowing = false 
}) => {
  // Safely access shop categories, default to empty array if undefined
  const categories = shop.categories || [];
  
  return (
    <div className="w-full bg-white border-b">
      <div className="relative">
        {/* Cover Image */}
        <div className="h-48 md:h-64 w-full bg-gray-100 overflow-hidden">
          {shop.cover_image ? (
            <img 
              src={shop.cover_image} 
              alt={`${shop.name} cover`} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-500">No cover image</span>
            </div>
          )}
        </div>

        {/* Shop Logo */}
        <div className="absolute -bottom-16 left-8">
          <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
            {shop.logo_url ? (
              <img 
                src={shop.logo_url} 
                alt={shop.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <span className="text-2xl font-bold text-gray-400">
                  {shop.name.substring(0, 2).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Shop Info */}
      <div className="pt-20 pb-6 px-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">{shop.name}</h1>
            
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
              <div className="flex items-center">
                <StarIcon className="w-4 h-4 text-yellow-400" />
                <span className="ml-1">
                  {typeof shop.rating === 'object' ? shop.rating.average.toFixed(1) : '0.0'} 
                  <span className="text-gray-500">
                    ({typeof shop.rating === 'object' ? shop.rating.count : 0} reviews)
                  </span>
                </span>
              </div>
              <span>•</span>
              <div className="flex items-center">
                <MapPinIcon className="w-4 h-4" />
                <span className="ml-1">{shop.location}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-3">
              {categories.map((category, index) => (
                <Badge key={index} variant="secondary">
                  {category}
                </Badge>
              ))}
            </div>
            
            <p className="mt-4 text-gray-600">{shop.description}</p>
          </div>
          
          <div className="flex flex-col gap-2">
            <Button 
              variant={isFollowing ? "outline" : "default"} 
              className={isFollowing ? "gap-2" : "gap-2 bg-green-600 hover:bg-green-700"}
              onClick={onFollow}
            >
              <HeartIcon className={`w-4 h-4 ${isFollowing ? 'text-red-500 fill-red-500' : ''}`} />
              {isFollowing ? 'Following' : 'Follow Shop'}
            </Button>
            
            {shop.isGroupOrderEnabled && (
              <Button variant="outline" className="gap-2">
                <UsersIcon className="w-4 h-4" />
                Group Order
              </Button>
            )}
          </div>
        </div>
        
        {/* Stats and Delivery Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <ShoppingBagIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Products</p>
              <p className="font-semibold">{shop.products}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
              <ClockIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Delivery Time</p>
              <p className="font-semibold">{shop.deliveryInfo?.estimatedTime || 'N/A'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
              <CreditCardIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Min Order</p>
              <p className="font-semibold">${shop.deliveryInfo?.minOrder?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
