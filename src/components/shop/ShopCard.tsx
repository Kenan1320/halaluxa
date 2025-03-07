
import { memo } from 'react';
import { motion } from 'framer-motion';
import { Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ShopCardProps {
  shop: any;
  index: number;
  featured?: boolean;
  minimal?: boolean;
}

// Using memo to prevent unnecessary re-renders
const ShopCard = memo(({ shop, index, featured = false, minimal = false }: ShopCardProps) => {
  if (minimal) {
    return (
      <motion.div 
        className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow dark:border dark:border-[#2A2A2A]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        <div className="h-32 bg-white dark:bg-[#1E1E1E] relative flex items-center justify-center">
          {shop.logo ? (
            <img 
              src={shop.logo} 
              alt={`${shop.name} logo`} 
              className="max-h-20 max-w-[80%] object-contain"
              loading="lazy"
            />
          ) : (
            <div className="flex items-center justify-center bg-haluna-primary-light dark:bg-[#1A3B32] h-full w-full">
              <Store className="h-12 w-12 text-haluna-primary dark:text-[#29866B]" />
            </div>
          )}
        </div>
        
        <div className="p-4 text-center">
          <h3 className="text-lg font-medium mb-2 dark:text-[#E4F5F0]">{shop.name}</h3>
          
          <Link to={`/shop/${shop.id}`}>
            <Button 
              className="w-full text-sm bg-[#29866B] hover:bg-[#1A3B32] text-white"
              size="sm"
            >
              Visit Shop
            </Button>
          </Link>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      className={`bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow ${featured ? 'lg:flex' : ''} dark:border dark:border-[#2A2A2A]`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <div className={`${featured ? 'lg:w-2/5 h-48 lg:h-auto' : 'h-48'} bg-white dark:bg-[#1E1E1E] relative`}>
        {shop.coverImage ? (
          <img 
            src={shop.coverImage} 
            alt={shop.name} 
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : shop.logo ? (
          <div className="w-full h-full flex items-center justify-center bg-haluna-primary-light dark:bg-[#1A3B32] p-4">
            <img 
              src={shop.logo} 
              alt={`${shop.name} logo`} 
              className="max-h-full max-w-full object-contain"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-haluna-primary-light dark:bg-[#1A3B32]">
            <Store className="h-12 w-12 text-haluna-primary dark:text-[#29866B]" />
          </div>
        )}
        {shop.isVerified && (
          <div className="absolute top-4 right-4 bg-white/80 dark:bg-[#1E1E1E]/80 px-2 py-1 rounded-full text-xs font-medium shadow-sm dark:text-[#29866B]">
            Verified
          </div>
        )}
      </div>
      
      <div className={`p-6 ${featured ? 'lg:w-3/5' : ''}`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-medium dark:text-[#E4F5F0]">{shop.name}</h3>
          <div className="flex items-center text-yellow-500">
            <span className="ml-1 text-sm dark:text-yellow-400">{shop.rating}</span>
          </div>
        </div>
        
        <p className={`text-haluna-text-light dark:text-[#A0A0A0] mb-4 ${featured ? 'line-clamp-3' : 'line-clamp-2'}`}>
          {shop.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm bg-gray-100 dark:bg-[#1D2626] px-3 py-1 rounded-full dark:text-[#E4F5F0]">
            {shop.category}
          </span>
          
          <div className="flex items-center text-sm text-haluna-text-light dark:text-[#A0A0A0]">
            {shop.location}
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-halula-text-light dark:text-[#A0A0A0] mb-4">
          <span>{shop.productCount} Products</span>
          
          {shop.distance && (
            <span className="font-medium text-haluna-primary dark:text-[#29866B]">
              {shop.distance.toFixed(1)} miles away
            </span>
          )}
        </div>
        
        <Link to={`/shop/${shop.id}`}>
          <Button className="w-full flex items-center justify-center bg-[#29866B] hover:bg-[#1A3B32] text-white">
            Visit Shop
          </Button>
        </Link>
      </div>
    </motion.div>
  );
});

ShopCard.displayName = 'ShopCard';

export default ShopCard;
