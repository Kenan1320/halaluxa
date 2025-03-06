
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { getShops, Shop } from '@/services/shopService';
import { useLocation } from '@/context/LocationContext';
import ShopCard from '@/components/shop/ShopCard';
import ShopProductList from '@/components/shop/ShopProductList';

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
          {/* Shop header with name and logo */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
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
              </div>
              <h3 className="text-base font-medium">{shop.name}</h3>
            </div>
            <a 
              href={`/shop/${shop.id}`} 
              className="text-xs font-medium text-[#29866B] hover:underline"
            >
              View all
            </a>
          </div>
          
          {/* Shop products in horizontal scroll */}
          <ShopProductList shopId={shop.id} />
        </div>
      ))}
    </div>
  );
};

export default NearbyShops;
