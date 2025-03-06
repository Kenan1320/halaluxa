
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
      <div className="bg-[#3a9e7e] pt-4 pb-6">
        <div className="container mx-auto px-4">
          {/* Search bar */}
          <div className="mb-4">
            <SearchBar />
          </div>
          
          {/* Category scroll inside mint background */}
          <div className="mt-4">
            <CategoryScroll />
          </div>
        </div>
      </div>
      
      {/* Main content with white background */}
      <div className="container mx-auto px-4 pt-6">
        {/* Personalized greeting for user */}
        <motion.div
          className="mt-2 mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-semibold text-gray-800">
            {greeting}, {isLoggedIn && user ? user.name : 'Guest'}
          </h2>
          <p className="text-gray-500">Discover products you'll love</p>
        </motion.div>
        
        {/* Nearby Shops - now displayed before products */}
        <NearbyShops />
        
        {/* Featured Section */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Featured Products</h2>
          <ProductGrid />
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
