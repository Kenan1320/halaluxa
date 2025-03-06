
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from '@/context/LocationContext';
import Footer from '@/components/layout/Footer';
import SearchBar from '@/components/home/SearchBar';
import LocationBar from '@/components/home/LocationBar';
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

  return (
    <div className="min-h-screen pt-20 pb-20">
      {/* Top container */}
      <div className="container mx-auto px-4">
        {/* Mobile only search bar */}
        <div className="md:hidden space-y-2 mb-6">
          <SearchBar />
          <LocationBar />
        </div>
        
        {/* Category Scroll */}
        <CategoryScroll />
        
        {/* Welcome message for logged in users */}
        {isLoggedIn && user && (
          <motion.div
            className="mt-6 mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-semibold">
              Hi, {user.name || 'Welcome back'}!
            </h2>
            <p className="text-gray-500">Discover products you'll love</p>
          </motion.div>
        )}
        
        {/* Featured Section */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Featured Products</h2>
          <ProductGrid />
        </section>
        
        {/* Nearby Shops */}
        <NearbyShops />
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
