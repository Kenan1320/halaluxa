import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { getShops, Shop } from '@/services/shopService';
import { useLocation } from '@/context/LocationContext';

const NearbyShops = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const { mode } = useTheme();
  const { location, isLocationEnabled } = useLocation();
  
  useEffect(() => {
    const loadShops = async () => {
      setLoading(true);
      try {
        let nearbyShops: Shop[] = [];
        
        // If location is enabled, get nearby shops
        if (isLocationEnabled && location && location.latitude && location.longitude) {
          // Get all shops and calculate distance client-side
          const allShops = await getShops();
          nearbyShops = allShops
            .filter(shop => shop.latitude && shop.longitude)
            .sort((a, b) => {
              if (!a.distance) return 1;
              if (!b.distance) return -1;
              return a.distance - b.distance;
            })
            .slice(0, 10);
        } else {
          // Otherwise just get all shops
          nearbyShops = await getShops();
        }
        
        setShops(nearbyShops);
      } catch (error) {
        console.error('Error loading shops:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadShops();
  }, [isLocationEnabled, location]);
  
  if (loading) {
    return (
      <div className="py-4 flex justify-center">
        <div className="w-10 h-10 border-4 border-gray-300 dark:border-gray-700 border-t-haluna-primary rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (shops.length === 0) {
    return (
      <div className="py-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">No shops found nearby</p>
      </div>
    );
  }
  
  return (
    <div className="mt-4 overflow-x-auto scrollbar-none">
      <div className="flex space-x-4 pb-2">
        {shops.map((shop) => (
          <motion.div
            key={shop.id}
            className={`flex-shrink-0 rounded-xl shadow-sm overflow-hidden w-40 md:w-48 border ${
              mode === 'dark'
                ? 'border-gray-800 bg-gray-900'
                : 'border-gray-200 bg-white'
            }`}
            whileHover={{
              y: -5,
              boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
              transition: { duration: 0.2 }
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link to={`/shop/${shop.id}`} className="block relative">
              <div 
                className="h-24 bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
              >
                {shop.logo_url || shop.logo ? (
                  <img 
                    src={shop.logo_url || shop.logo} 
                    alt={shop.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-haluna-primary">{shop.name.charAt(0)}</span>
                )}
              </div>
              
              <div className="p-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-sm line-clamp-1">{shop.name}</h3>
                  {(shop.isHalalCertified || shop.is_halal_certified) && (
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 ml-1" />
                  )}
                </div>
                
                <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <Star className="h-3 w-3 text-yellow-500 mr-1" />
                  <span>{shop.rating.toFixed(1)}</span>
                  
                  <span className="mx-1">•</span>
                  
                  <span className="line-clamp-1">{shop.category}</span>
                </div>
                
                {(shop.distance || shop.distance === 0) && (
                  <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{shop.distance < 1 ? `${(shop.distance * 1000).toFixed(0)}m` : `${shop.distance.toFixed(1)} km`}</span>
                  </div>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default NearbyShops;
