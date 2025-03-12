
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { useLocation } from '@/context/LocationContext';
import { getNearbyShops } from '@/services/shopService';
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
        // Load nearby shops based on location if available
        if (location && location.coords) {
          const nearby = await getNearbyShops(location.coords.latitude, location.coords.longitude);
          setNearbyShops(nearby);
        } else {
          // If no location, load shops without location filtering
          const shops = await getNearbyShops();
          setNearbyShops(shops);
        }
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
        <section className="text-center mb-10">
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
        <div className="space-y-10">
          {/* Shopping modes section */}
          <section className="mb-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold tracking-tight sf-pro">Halvi't Nearby</h2>
              <Link to="/shops" className="text-sm font-medium text-black dark:text-white hover:underline sf-pro">
                View All
              </Link>
            </div>
            <CategorySuggestions />
          </section>

          {/* Online Shopping section */}
          <section className="mb-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold tracking-tight sf-pro">Halvi Mall</h2>
              <Link to="/browse" className="text-sm font-medium text-black dark:text-white hover:underline sf-pro">
                View All
              </Link>
            </div>
            <CategorySuggestions />
          </section>

          {/* Shops section */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold tracking-tight sf-pro">Featured Shops</h2>
              <Link to="/shops" className="text-sm font-medium text-black dark:text-white hover:underline sf-pro">
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
