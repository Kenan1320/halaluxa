
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shop } from '@/services/shopService';
import { StarIcon, MapPinIcon, CheckCircleIcon } from 'lucide-react';

export interface ShopCardProps {
  shop: Shop;
  isSelected?: boolean;
  isMainShop?: boolean;
  onSelect?: () => void;
  onSetMain?: () => void;
  showControls?: boolean;
}

export const ShopCard = ({ 
  shop, 
  isSelected = false, 
  isMainShop = false, 
  onSelect, 
  onSetMain,
  showControls = false
}: ShopCardProps) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="h-48 overflow-hidden relative">
        <img 
          src={shop.cover_image || '/placeholder.svg'} 
          alt={shop.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 space-x-2">
          {shop.is_verified && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <CheckCircleIcon size={14} />
              <span>Verified</span>
            </Badge>
          )}
        </div>
      </div>
      
      <CardHeader className="relative pb-2">
        <div className="absolute -top-8 left-4 w-16 h-16 rounded-full bg-white p-1 shadow-md">
          <img 
            src={shop.logo_url || '/placeholder.svg'} 
            alt={`${shop.name} logo`} 
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <div className="ml-20">
          <CardTitle className="text-xl">{shop.name}</CardTitle>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span className="flex items-center">
              <StarIcon size={16} className="mr-1 text-yellow-500" />
              {shop.rating || '0.0'}
            </span>
            <span>•</span>
            <span>{shop.category}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-2">{shop.description}</p>
        
        <div className="flex items-center mt-3 text-sm text-muted-foreground">
          <MapPinIcon size={16} className="mr-1" />
          <span className="line-clamp-1">{shop.address || shop.location}</span>
        </div>
        
        {shop.distance !== undefined && (
          <div className="mt-1 text-sm text-muted-foreground">
            <span>{shop.distance < 1 ? 
              `${Math.round(shop.distance * 1000)} m away` : 
              `${shop.distance.toFixed(1)} km away`}
            </span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 flex flex-col gap-2">
        {showControls ? (
          <>
            <Button 
              className="w-full" 
              variant={isSelected ? "default" : "outline"}
              onClick={onSelect}
            >
              {isSelected ? "Selected" : "Select Shop"}
            </Button>
            
            {isSelected && (
              <Button 
                className="w-full" 
                variant={isMainShop ? "secondary" : "outline"}
                onClick={onSetMain}
                disabled={!isSelected}
              >
                {isMainShop ? "Main Shop" : "Set as Main Shop"}
              </Button>
            )}
          </>
        ) : (
          <Link to={`/shop/${shop.id}`} className="w-full">
            <Button className="w-full">View Shop</Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
};

// Add a default export for components that import it directly
export default ShopCard;
