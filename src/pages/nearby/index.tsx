
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from '@/context/LocationContext';
import { Shop } from '@/types/database';
import { Store } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { ProductGrid } from '@/components/home/ProductGrid';

const NearbyPage = () => {
  const { isLocationEnabled, requestLocation, getNearbyShops } = useLocation();
  const [nearbyShops, setNearbyShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { mode } = useTheme();
  
  useEffect(() => {
    const loadNearbyShops = async () => {
      try {
        if (!isLocationEnabled) {
          await requestLocation();
        }
        
        const shops = await getNearbyShops();
        if (shops && shops.length > 0) {
          setNearbyShops(shops.slice(0, 8)); // Limit to 8 shops
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading nearby shops:', error);
        setIsLoading(false);
      }
    };
    
    loadNearbyShops();
  }, [isLocationEnabled, getNearbyShops, requestLocation]);

  return (
    <div className="min-h-screen pt-20 pb-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-serif font-bold mb-6 text-[#0F1B44] dark:text-white">
          Nearby Shops
        </h1>
        
        {/* Shop grid - 2 rows of 4 */}
        <div className="mb-12">
          {isLoading ? (
            <div className="grid grid-cols-4 gap-4">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-1"></div>
                  <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-16"></div>
                </div>
              ))}
            </div>
          ) : nearbyShops.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {nearbyShops.map((shop) => (
                <motion.div
                  key={shop.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center"
                >
                  <Link to={`/shop/${shop.id}`} className="group">
                    <div className="w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden mb-2 group-hover:shadow-lg transition-all">
                      {shop.logo_url ? (
                        <img 
                          src={shop.logo_url} 
                          alt={shop.name} 
                          className="w-16 h-16 object-cover group-hover:scale-110 transition-transform" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#F9F5EB] text-[#0F1B44]">
                          <Store className="h-8 w-8" />
                        </div>
                      )}
                    </div>
                    <h3 className="text-center font-medium text-sm mb-1 group-hover:text-[#0F1B44] transition-colors">
                      {shop.name}
                    </h3>
                    <p className="text-center text-xs text-gray-500">
                      {shop.distance ? `${shop.distance.toFixed(1)} km` : 'Nearby'}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Store className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No nearby shops found</h3>
              <p className="text-gray-500 mb-4">
                We couldn't find any shops near your current location.
              </p>
              <button 
                onClick={requestLocation}
                className="px-4 py-2 bg-[#0F1B44] text-white rounded-full hover:bg-[#183080] transition-colors"
              >
                Update Location
              </button>
            </div>
          )}
        </div>
        
        {/* Recommended products */}
        <div className="mt-8">
          <h2 className="text-xl font-serif font-bold mb-6 text-[#0F1B44] dark:text-white">
            Recommended For You
          </h2>
          <ProductGrid />
        </div>
      </div>
    </div>
  );
};

export default NearbyPage;
