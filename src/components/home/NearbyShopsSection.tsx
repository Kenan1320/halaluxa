
import { useState, useEffect } from 'react';
import { useLocation } from '@/context/LocationContext';
import { motion } from 'framer-motion';
import { Store } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Shop } from '@/services/shopService';
import { cn } from '@/lib/utils';

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
          setShops(nearbyShops.slice(0, 6));
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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
            className="flex flex-col items-center"
          >
            <div className="w-24 h-24 rounded-full bg-gray-100"></div>
            <div className="h-4 w-16 mt-2 bg-gray-100 rounded"></div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6">
      {shops.map((shop, index) => (
        <motion.div
          key={shop.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: index * 0.1,
            ease: "easeOut"
          }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="flex flex-col items-center"
        >
          <Link 
            to={`/shop/${shop.id}`}
            className="flex flex-col items-center"
          >
            <div className="w-24 h-24 rounded-full bg-white shadow-sm flex items-center justify-center p-1 border border-gray-100">
              {shop.logo ? (
                <motion.img 
                  src={shop.logo} 
                  alt={shop.name}
                  className="w-full h-full object-contain rounded-full p-2"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                />
              ) : (
                <Store className="w-12 h-12 text-haluna-primary opacity-50" />
              )}
            </div>
            <motion.p 
              className="mt-2 text-center font-medium text-gray-800 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {shop.name}
            </motion.p>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default NearbyShopsSection;
