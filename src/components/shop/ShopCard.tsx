
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Store, MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ShopCardProps {
  shop: any;
  index: number;
  featured?: boolean;
}

const ShopCard = ({ shop, index, featured = false }: ShopCardProps) => {
  return (
    <motion.div 
      className={`bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow ${featured ? 'lg:flex' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div className={`${featured ? 'lg:w-2/5 h-48 lg:h-auto' : 'h-48'} bg-gray-100 relative`}>
        {shop.coverImage ? (
          <img 
            src={shop.coverImage} 
            alt={shop.name} 
            className="w-full h-full object-cover"
          />
        ) : shop.logo ? (
          <div className="w-full h-full flex items-center justify-center bg-haluna-primary-light p-4">
            <img 
              src={shop.logo} 
              alt={`${shop.name} logo`} 
              className="max-h-full max-w-full object-contain"
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-haluna-primary-light">
            <Store className="h-12 w-12 text-haluna-primary" />
          </div>
        )}
        {shop.isVerified && (
          <div className="absolute top-4 right-4 bg-white/80 px-2 py-1 rounded-full text-xs font-medium shadow-sm">
            Verified
          </div>
        )}
      </div>
      
      <div className={`p-6 ${featured ? 'lg:w-3/5' : ''}`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-medium">{shop.name}</h3>
          <div className="flex items-center text-yellow-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="ml-1 text-sm">{shop.rating}</span>
          </div>
        </div>
        
        <p className={`text-haluna-text-light mb-4 ${featured ? 'line-clamp-3' : 'line-clamp-2'}`}>
          {shop.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
            {shop.category}
          </span>
          
          <div className="flex items-center text-sm text-haluna-text-light">
            <MapPin className="h-3 w-3 mr-1" />
            {shop.location}
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-haluna-text-light mb-4">
          <span>{shop.productCount} Products</span>
          
          {shop.distance && (
            <span className="font-medium text-haluna-primary">
              {shop.distance.toFixed(1)} miles away
            </span>
          )}
        </div>
        
        <Button 
          href={`/shop/${shop.id}`}
          className="w-full flex items-center justify-center"
        >
          {featured ? (
            <>
              Visit Shop <ExternalLink className="ml-2 h-4 w-4" />
            </>
          ) : (
            'View Shop'
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default ShopCard;
