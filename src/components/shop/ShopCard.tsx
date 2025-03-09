
import { Link } from 'react-router-dom';
import { Shop } from '@/models/shop';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { MapPin, Star, Package2, CheckCircle2 } from 'lucide-react';

interface ShopCardProps {
  shop: Shop;
  isCompact?: boolean;
  showDistance?: boolean;
}

const ShopCard = ({ shop, isCompact = false, showDistance = false }: ShopCardProps) => {
  // Function to truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return isCompact ? (
    <Link to={`/shops/${shop.id}`} className="block">
      <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        <div className="p-3 flex items-start space-x-3">
          <div className="h-12 w-12 flex-shrink-0">
            <img 
              src={shop.logo || '/placeholder.svg'} 
              alt={shop.name} 
              className="h-full w-full object-cover rounded-md"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium truncate">{shop.name}</h3>
            <p className="text-xs text-gray-500 truncate">{shop.category}</p>
            <div className="flex items-center space-x-2 mt-1">
              <div className="flex items-center text-xs text-yellow-500">
                <Star className="h-3 w-3 mr-1" />
                {shop.rating.toFixed(1)}
              </div>
              {shop.isVerified && (
                <Badge variant="outline" className="px-1 py-0 h-4 text-xs border-green-500 text-green-600">
                  <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  ) : (
    <Link to={`/shops/${shop.id}`} className="block">
      <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        <div className="h-32 w-full bg-gradient-to-r from-slate-300 to-slate-200 relative">
          {shop.coverImage ? (
            <img 
              src={shop.coverImage} 
              alt={`${shop.name} cover`} 
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <span className="text-slate-400">{shop.name}</span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black/70 to-transparent"></div>
        </div>
        
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-start">
            <div className="h-16 w-16 bg-white rounded-full border-4 border-white -mt-12 mr-3 shadow-sm overflow-hidden flex-shrink-0">
              <img 
                src={shop.logo || '/placeholder.svg'} 
                alt={shop.name} 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 -mt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">{truncateText(shop.name, 20)}</h3>
                
                {shop.isVerified && (
                  <Badge variant="outline" className="ml-2 border-green-500 text-green-600">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="truncate max-w-[150px]">{shop.location}</span>
              </div>
              <div className="flex items-center">
                <Package2 className="h-4 w-4 mr-1" />
                <span>{shop.productCount} products</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Badge variant="outline" className="rounded-full px-2 py-0 text-xs">
                  {shop.category}
                </Badge>
              </div>
              <div className="flex items-center text-yellow-500">
                <Star className="h-4 w-4 mr-1 fill-current" />
                <span>{shop.rating.toFixed(1)}</span>
              </div>
            </div>
            
            {showDistance && shop.distance !== null && (
              <div className="mt-2 text-xs text-gray-500">
                {shop.distance < 1 
                  ? `${(shop.distance * 1000).toFixed(0)} meters away` 
                  : `${shop.distance.toFixed(1)} km away`}
              </div>
            )}
            
            <p className="mt-3 text-sm text-gray-600 line-clamp-2">
              {truncateText(shop.description, 100)}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ShopCard;
