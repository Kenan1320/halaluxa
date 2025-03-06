
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from '@/context/LocationContext';
import Footer from '@/components/layout/Footer';
import SearchBar from '@/components/home/SearchBar';
import CategoryScroll from '@/components/home/CategoryScroll';
import ProductGrid from '@/components/home/ProductGrid';
import NearbyShops from '@/components/home/NearbyShops';
import { motion } from 'framer-motion';

const Index = () => {
  const { isLoggedIn, user } = useAuth();
  const { isLocationEnabled, requestLocation } = useLocation();
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // We will automatically request location on first load
  useEffect(() => {
    if (!isLocationEnabled) {
      requestLocation();
    }
  }, [isLocationEnabled, requestLocation]);

  // Get current hour to determine greeting
  const currentHour = new Date().getHours();
  let greeting = "Good morning";
  if (currentHour >= 12 && currentHour < 18) {
    greeting = "Good afternoon";
  } else if (currentHour >= 18) {
    greeting = "Good evening";
  }

  return (
    <div className="min-h-screen pt-16 pb-20">
      {/* Top container with lighter mint background */}
      <div className="bg-[#E4F5F0] pt-2 pb-3">
        <div className="container mx-auto px-4">
          {/* Search bar */}
          <div className="mb-2">
            <SearchBar />
          </div>
          
          {/* Personalized greeting for user - smaller text */}
          <motion.div
            className="mb-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-base font-medium text-[#2A866A]">
              {greeting}, {isLoggedIn && user ? user.name : 'Guest'}
            </h2>
          </motion.div>
          
          {/* Category scroll inside mint background - made more compact */}
          <div className="mt-1">
            <CategoryScroll />
          </div>
        </div>
      </div>
      
      {/* Main content with white background */}
      <div className="container mx-auto px-4 pt-3">
        {/* Nearby Shops Section */}
        <section className="mt-1">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">Nearby Shops</h2>
          <NearbyShops />
        </section>
        
        {/* Featured Products Section */}
        <section className="mt-4">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">Featured Products</h2>
          <ProductGrid />
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
