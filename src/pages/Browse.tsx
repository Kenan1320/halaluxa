
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ShopCard from '@/components/shop/ShopCard';
import { getShops, Shop } from '@/services/shopService';
import Footer from '@/components/layout/Footer';
import { useLocation } from '@/context/LocationContext';

const Browse = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getNearbyShops } = useLocation();

  useEffect(() => {
    const loadShops = async () => {
      try {
        setIsLoading(true);
        const nearbyShops = await getNearbyShops();
        setShops(nearbyShops);
      } catch (error) {
        console.error('Error loading shops:', error);
        // Fallback to all shops if location-based fails
        const allShops = await getShops();
        setShops(allShops);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadShops();
  }, [getNearbyShops]);

  return (
    <div className="min-h-screen pt-16 pb-20 bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Browse Shops</h1>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-gray-100 h-64 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop, index) => (
              <motion.div
                key={shop.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <ShopCard shop={shop} index={index} minimal={true} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Browse;
