
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { useLocation } from '@/context/LocationContext';
import { getAllShops, getOnlineShops } from '@/services/shopService';
import CategorySuggestions from '@/components/home/CategorySuggestions';
import SearchBar from '@/components/home/SearchBar';
import NearbyShops from '@/components/home/NearbyShops';
import { Shop } from '@/types/database';

const Index = () => {
  const { mode } = useTheme();
  const { location, getNearbyShops } = useLocation();
  const [nearbyShops, setNearbyShops] = useState<Shop[]>([]);
  const [onlineShops, setOnlineShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadShops = async () => {
      setIsLoading(true);
      try {
        // Always load shops regardless of location
        const shops = await getAllShops();
        setNearbyShops(shops);
        
        // Also load online shops
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
        <section className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover and Shop Halal Products
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
            Find verified halal products from trusted local and online sellers
          </p>
          
          {/* Search Bar */}
          <div className="mb-10">
            <SearchBar />
          </div>
        </section>

        {/* Main content */}
        <div className="space-y-8">
          {/* Shopping modes section */}
          <section className="mb-2">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif" }}>
                Halvi't Nearby
              </h2>
              <Link to="/shops" className="text-sm font-medium text-black dark:text-white hover:underline" style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif" }}>
                View All
              </Link>
            </div>
            <CategorySuggestions />
          </section>

          {/* Online Shopping section */}
          <section className="mb-2">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif" }}>
                Halvi Mall
              </h2>
              <Link to="/browse" className="text-sm font-medium text-black dark:text-white hover:underline" style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif" }}>
                View All
              </Link>
            </div>
            <CategorySuggestions />
          </section>

          {/* Shops section */}
          <section>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif" }}>
                Featured Shops
              </h2>
              <Link to="/shops" className="text-sm font-medium text-black dark:text-white hover:underline" style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif" }}>
                View All
              </Link>
            </div>
            <NearbyShops shops={nearbyShops} isLoading={isLoading} />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Index;
