
import { useState, useEffect } from 'react';
import { useLocation } from '@/context/LocationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Shop } from '@/services/shopService';
import { cn } from '@/lib/utils';

const NearbyShopsSection = () => {
  const { isLocationEnabled, location, getNearbyShops } = useLocation();
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredShop, setHoveredShop] = useState<string | null>(null);

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const shopVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const ratingVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 }
  };

  const floatAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      repeatType: "mirror" as const,
      ease: "easeInOut"
    }
  };

  if (isLoading) {
    return (
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-3 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            variants={shopVariants}
            className="flex flex-col items-center"
          >
            <motion.div 
              className="w-24 h-24 rounded-full bg-gray-100"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "mirror" }}
            />
            <motion.div 
              className="h-4 w-16 mt-3 bg-gray-100 rounded"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "mirror", delay: 0.2 }}
            />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {shops.map((shop, index) => (
        <motion.div
          key={shop.id}
          variants={shopVariants}
          className="flex flex-col items-center"
          onHoverStart={() => setHoveredShop(shop.id)}
          onHoverEnd={() => setHoveredShop(null)}
          custom={index}
          animate={hoveredShop === shop.id ? floatAnimation : {}}
        >
          <Link 
            to={`/shop/${shop.id}`}
            className="flex flex-col items-center"
          >
            <motion.div 
              className="relative w-24 h-24 rounded-full bg-white shadow-md flex items-center justify-center p-1 border border-gray-100 overflow-hidden group-hover:shadow-lg transition-shadow duration-300"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              {/* Shop logo */}
              {shop.logo ? (
                <motion.img 
                  src={shop.logo} 
                  alt={shop.name}
                  className="w-full h-full object-contain rounded-full p-2"
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                />
              ) : (
                <motion.div
                  className="w-full h-full flex items-center justify-center bg-haluna-primary/10 rounded-full"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Store className="w-12 h-12 text-haluna-primary" />
                </motion.div>
              )}
              
              {/* Distance indicator */}
              {shop.distance && (
                <motion.div 
                  className="absolute -bottom-1 right-0 bg-haluna-primary text-white text-xs px-2 py-0.5 rounded-full"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 + (index * 0.1) }}
                >
                  {shop.distance < 1 ? `${(shop.distance * 1000).toFixed(0)}m` : `${shop.distance.toFixed(1)}km`}
                </motion.div>
              )}
            </motion.div>

            {/* Shop name */}
            <motion.p 
              className="mt-3 text-center font-medium text-gray-800 text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 + (index * 0.1) }}
            >
              {shop.name}
            </motion.p>
            
            {/* Rating */}
            <AnimatePresence>
              {shop.rating && (
                <motion.div 
                  className="flex items-center mt-1"
                  variants={ratingVariants}
                  initial="hidden"
                  animate="show"
                  transition={{ delay: 0.4 + (index * 0.1) }}
                >
                  <Star className="w-3 h-3 text-amber-500 mr-1 fill-amber-500" />
                  <span className="text-xs text-gray-600">{shop.rating} ({shop.reviewCount || 0})</span>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Location tag - only show on hover */}
            <AnimatePresence>
              {hoveredShop === shop.id && shop.location && (
                <motion.div 
                  className="flex items-center mt-2 text-xs text-gray-500"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <MapPin className="w-3 h-3 mr-1" />
                  <span className="truncate max-w-[100px]">{shop.location}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default NearbyShopsSection;
