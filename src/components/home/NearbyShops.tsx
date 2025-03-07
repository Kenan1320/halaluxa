
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { getShops, Shop, getShopProducts, convertToModelProduct } from '@/services/shopService';
import { useLocation } from '@/context/LocationContext';
import ShopProductList from '@/components/shop/ShopProductList';
import { Link } from 'react-router-dom';

const NearbyShops = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isLocationEnabled, location, getNearbyShops } = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const loadShops = async () => {
      try {
        setIsLoading(true);
        // Use getNearbyShops from the LocationContext
        const nearbyShops = await getNearbyShops();
        // Only show shops with products
        const shopsWithProducts = nearbyShops.filter(shop => shop.productCount && shop.productCount > 0);
        setShops(shopsWithProducts);
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
              className="flex-shrink-0 w-64 h-56 bg-gray-100 rounded-lg animate-pulse"
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
          {/* Shop header with name and logo - animated and clickable */}
          <div className="flex items-center justify-between mb-4">
            <Link to={`/shop/${shop.id}`} className="group flex items-center gap-3">
              <motion.div 
                className="w-12 h-12 rounded-full overflow-hidden bg-white shadow-sm flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {shop.logo ? (
                  <img 
                    src={shop.logo} 
                    alt={`${shop.name} logo`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-haluna-primary-light flex items-center justify-center">
                    <span className="text-xs font-medium text-haluna-primary">
                      {shop.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
              </motion.div>
              <motion.h3 
                className="text-base font-medium relative"
                initial={{ color: "#333" }}
                whileHover={{ 
                  color: "#2A866A",
                  scale: 1.02,
                  y: -1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 10
                }}
              >
                {shop.name}
                <motion.span
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#2A866A]"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.h3>
            </Link>
          </div>
          
          {/* Shop products in horizontal scroll */}
          <ShopProductList shopId={shop.id} />
        </div>
      ))}
    </div>
  );
};

export default NearbyShops;
