
import { useEffect, useState } from 'react';
import { useLocation as useLocationContext } from '@/context/LocationContext';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import BottomNav from '@/components/layout/BottomNav';
import AnimatedShopCard from '@/components/shop/AnimatedShopCard';
import CategoryTile from '@/components/home/CategoryTile';
import { Shop } from '@/services/shopService';
import { motion } from 'framer-motion';

const categories = [
  'Groceries',
  'Clothing',
  'Home Essentials',
  'Health & Beauty',
  'Electronics',
  'Books'
];

const Index = () => {
  const { isLocationEnabled, location, getNearbyShops } = useLocationContext();
  const { isLoggedIn, user } = useAuth();
  const [nearbyShops, setNearbyShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadNearbyShops = async () => {
      if (isLocationEnabled) {
        setIsLoading(true);
        try {
          const shops = await getNearbyShops();
          setNearbyShops(shops.slice(0, 6));
        } catch (error) {
          console.error('Error loading nearby shops:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadNearbyShops();
  }, [isLocationEnabled, getNearbyShops]);
  
  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24">
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {isLoggedIn && user ? (
            <h1 className="text-2xl font-medium mb-1">
              Hi, {user.name || 'Welcome back'}! 👋
            </h1>
          ) : (
            <h1 className="text-2xl font-medium mb-1">
              Welcome to Haluna! 👋
            </h1>
          )}
          <p className="text-haluna-text-light">
            {isLocationEnabled && location 
              ? `Discover shops near ${location.city}`
              : 'Enable location to see nearby shops'}
          </p>
        </motion.div>
        
        {/* Categories Section */}
        <section className="mb-12">
          <h2 className="text-lg font-medium mb-4">Categories</h2>
          <div className="grid grid-cols-3 gap-4">
            {categories.map((category, index) => (
              <CategoryTile 
                key={category} 
                category={category} 
                index={index}
              />
            ))}
          </div>
        </section>
        
        {/* Nearby Shops Section */}
        <section className="mb-12">
          <h2 className="text-lg font-medium mb-4">Nearby Shops</h2>
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-4 h-40 animate-pulse">
                  <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-3" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
                </div>
              ))}
            </div>
          ) : nearbyShops.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {nearbyShops.map((shop, index) => (
                <AnimatedShopCard 
                  key={shop.id} 
                  shop={shop} 
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-haluna-text-light">
                {isLocationEnabled 
                  ? "No shops found nearby. We're working on expanding!"
                  : "Enable location to discover shops near you"}
              </p>
            </div>
          )}
        </section>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default Index;
