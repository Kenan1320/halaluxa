
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { getShops, Shop, getShopProducts } from '@/services/shopService';
import { useLocation } from '@/context/LocationContext';
import ShopCard from '@/components/shop/ShopCard';
import ShopProductList from '@/components/shop/ShopProductList';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';

const NearbyShops = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isLocationEnabled, location, getNearbyShops } = useLocation();
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Initial load of shops
    const loadShops = async () => {
      try {
        setIsLoading(true);
        // Use getNearbyShops from the LocationContext
        const nearbyShops = await getNearbyShops();
        setShops(nearbyShops);
      } catch (error) {
        console.error('Error loading nearby shops:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isLocationEnabled && location) {
      loadShops();
    } else {
      // Load anyway for demo purposes
      loadShops();
    }
  }, [isLocationEnabled, location, getNearbyShops]);
  
  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-lg">
        <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className="flex-shrink-0 w-64 h-56 bg-muted rounded-lg animate-pulse dark:bg-muted/50"
            />
          ))}
        </div>
      </div>
    );
  }
  
  if (!shops.length) {
    return null;
  }
  
  return (
    <div className="space-y-8">
      {shops.map((shop, index) => (
        <div key={shop.id} className="mb-8">
          {/* Shop header with name and logo - now animated and clickable */}
          <Link to={`/shop/${shop.id}`} className="group flex items-center gap-3 mb-4">
            <motion.div 
              className="w-10 h-10 rounded-full overflow-hidden bg-card shadow-sm flex items-center justify-center dark:shadow-md dark:shadow-primary/5"
              whileHover={{ 
                scale: 1.1,
                boxShadow: theme === 'dark' ? '0 0 10px rgba(209, 232, 226, 0.2)' : '0 4px 12px rgba(0,0,0,0.1)'
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {shop.logo_url ? (
                <img 
                  src={shop.logo_url} 
                  alt={`${shop.name} logo`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center dark:bg-primary/20">
                  <span className="text-xs font-medium text-primary">
                    {shop.name.substring(0, 2).toUpperCase()}
                  </span>
                </div>
              )}
            </motion.div>
            <motion.h3 
              className="text-base font-medium relative"
              whileHover={{ color: "hsl(var(--primary))" }}
            >
              {shop.name}
              <motion.span
                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.h3>
          </Link>
          
          {/* Shop products in horizontal scroll */}
          <ShopProductList shopId={shop.id} />
        </div>
      ))}
    </div>
  );
};

export default NearbyShops;
