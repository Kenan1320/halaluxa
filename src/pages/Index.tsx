
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from '@/context/LocationContext';
import Navbar from '@/components/layout/Navbar';
import BottomNav from '@/components/navigation/BottomNav';
import NearbyShopsSection from '@/components/home/NearbyShopsSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

const Index = () => {
  const { isLoggedIn, user } = useAuth();
  const { isLocationEnabled, location, requestLocation } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pb-16">
      <Navbar />
      
      <main className="pt-20 pb-24">
        <div className="container mx-auto px-4">
          {/* Location Banner */}
          {!isLocationEnabled && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-haluna-primary-light rounded-lg p-4 mb-8 flex items-center justify-between"
            >
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-haluna-primary mr-2" />
                <p className="text-sm text-haluna-primary">
                  Enable location to see shops near you
                </p>
              </div>
              <Button
                size="sm"
                onClick={requestLocation}
                className="text-sm"
              >
                Enable
              </Button>
            </motion.div>
          )}
          
          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <h1 className="text-2xl font-serif font-bold mb-2">
              {isLoggedIn ? `Welcome back, ${user?.name || 'there'}!` : 'Welcome to Haluna'}
            </h1>
            <p className="text-haluna-text-light">
              {isLocationEnabled && location
                ? `Discover Muslim-owned businesses in ${location.city}`
                : 'Discover Muslim-owned businesses near you'}
            </p>
          </motion.div>

          {/* Nearby Shops Section */}
          <section className="mb-12">
            <h2 className="text-xl font-serif font-bold mb-6">Nearby Shops</h2>
            <NearbyShopsSection />
          </section>

          {/* Categories Section */}
          <section className="mb-12">
            <h2 className="text-xl font-serif font-bold mb-6">Browse by Category</h2>
            <CategoriesSection />
          </section>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default Index;
