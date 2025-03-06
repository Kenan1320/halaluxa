
import { useState, useEffect } from 'react';
import { useLocation } from '@/context/LocationContext';
import { motion } from 'framer-motion';
import { Store } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Shop } from '@/services/shopService';

const NearbyShopsSection = () => {
  const { isLocationEnabled, location, getNearbyShops } = useLocation();
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadShops = async () => {
      if (isLocationEnabled) {
        setIsLoading(true);
        try {
          const nearbyShops = await getNearbyShops();
          setShops(nearbyShops.slice(0, 6)); // Only show top 6 shops
        } catch (error) {
          console.error('Error loading nearby shops:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadShops();
  }, [isLocationEnabled, getNearbyShops]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-square bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {shops.map((shop, index) => (
        <motion.div
          key={shop.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          className="aspect-square bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
        >
          <Link to={`/shop/${shop.id}`} className="block w-full h-full p-4">
            <div className="w-full h-full flex items-center justify-center">
              {shop.logo ? (
                <img 
                  src={shop.logo} 
                  alt={shop.name}
                  className="w-24 h-24 object-contain"
                />
              ) : (
                <Store className="w-16 h-16 text-gray-400" />
              )}
            </div>
            <p className="mt-2 text-center text-sm font-medium text-gray-700 truncate">
              {shop.name}
            </p>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default NearbyShopsSection;
