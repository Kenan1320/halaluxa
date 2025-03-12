import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { useLocation } from '@/context/LocationContext';
import { getNearbyShops, getOnlineShops } from '@/services/shopService';
import { Shop } from '@/models/shop';
import CategorySuggestions from '@/components/home/CategorySuggestions';
import SearchBar from '@/components/home/SearchBar';
import NearbyShops from '@/components/home/NearbyShops';

const Index = () => {
  const { mode } = useTheme();
  const { location } = useLocation();
  const [nearbyShops, setNearbyShops] = useState<Shop[]>([]);
  const [onlineShops, setOnlineShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadShops = async () => {
      setIsLoading(true);
      try {
        if (location) {
          const nearby = await getNearbyShops(location.latitude, location.longitude);
          setNearbyShops(nearby);
        }
        const online = await getOnlineShops();
        setOnlineShops(online);
      } catch (error) {
        console.error("Error loading shops:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadShops();
  }, [location]);

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="space-y-8">
        {/* Hero section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover and Shop Halal Products
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
            Find verified halal products from trusted local and online sellers
          </p>
        </section>

        {/* Main content */}
        <div className="space-y-8">
          {/* Shopping modes tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <SearchBar />
          </div>

          {/* Categories section */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Categories</h2>
            <CategorySuggestions />
          </section>

          {/* Shops section */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Featured Shops</h2>
            <NearbyShops shops={nearbyShops} isLoading={isLoading} />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Index;
