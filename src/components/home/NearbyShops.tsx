
import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { getShops, Shop, getShopProducts, convertToModelProduct } from '@/services/shopService';
import { useLocation } from '@/context/LocationContext';
import ShopCard from '@/components/shop/ShopCard';
import ShopProductList from '@/components/shop/ShopProductList';
import { Link } from 'react-router-dom';
import { ensureAbuOmarProducts } from '@/scripts/addAbuOmarProducts';

const NearbyShops = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isLocationEnabled, location, getNearbyShops } = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  
  useEffect(() => {
    // Initial load of shops
    const loadShops = async () => {
      try {
        setIsLoading(true);
        // Use getNearbyShops from the LocationContext
        const nearbyShops = await getNearbyShops();
        setShops(nearbyShops);
        
        // Check if Abu Omar products exist and add them if not
        await ensureAbuOmarProducts();
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
  
  // Start animation when shops are loaded
  useEffect(() => {
    if (!isLoading && shops.length > 0) {
      controls.start("visible");
    }
  }, [isLoading, shops, controls]);
  
  // Animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.4
      }
    }
  };
  
  const logoVariants = {
    hidden: { scale: 0.8, rotate: -5 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        bounce: 0.5,
        delay: 0.2
      }
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        type: "spring",
        bounce: 0.6
      }
    }
  };
  
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
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {shops.map((shop, index) => (
          <motion.div key={shop.id} variants={itemVariants} whileHover={{ y: -5 }}>
            {/* Shop header with name and logo - now animated and clickable */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <Link to={`/shop/${shop.id}`} className="block">
                <div className="h-32 bg-[#f7f8fc] relative flex items-center justify-center">
                  <motion.div 
                    className="w-20 h-20 rounded-full overflow-hidden bg-white shadow-sm flex items-center justify-center"
                    variants={logoVariants}
                    whileHover="hover"
                  >
                    {shop.logo ? (
                      <img 
                        src={shop.logo} 
                        alt={`${shop.name} logo`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-haluna-primary-light flex items-center justify-center">
                        <span className="text-xl font-medium text-haluna-primary">
                          {shop.name.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </motion.div>
                </div>
                
                <div className="p-4">
                  <motion.h3 
                    className="text-lg font-medium text-center mb-2"
                    whileHover={{ color: "#2A866A" }}
                  >
                    {shop.name}
                  </motion.h3>
                  
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="text-xs bg-haluna-primary-light text-haluna-primary px-2 py-1 rounded-full">
                      {shop.category || 'Food & Groceries'}
                    </span>
                    
                    {shop.isVerified && (
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-500 text-center line-clamp-2 mb-4">
                    {shop.description || `Quality products from ${shop.name}`}
                  </p>
                  
                  <Link to={`/shop/${shop.id}`}>
                    <motion.button 
                      className="w-full py-2 px-4 bg-haluna-primary text-white rounded-lg text-sm font-medium"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Visit Shop
                    </motion.button>
                  </Link>
                </div>
              </Link>
            </div>
            
            {/* Shop products in horizontal scroll - shown below each shop card */}
            <div className="mt-4">
              <ShopProductList shopId={shop.id} />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default NearbyShops;
