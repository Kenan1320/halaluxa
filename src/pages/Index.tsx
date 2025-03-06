
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from '@/context/LocationContext';
import Navbar from '@/components/layout/Navbar';
import BottomNav from '@/components/navigation/BottomNav';
import NearbyShopsSection from '@/components/home/NearbyShopsSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { isLoggedIn, user } = useAuth();
  const { isLocationEnabled, location, requestLocation } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-16 pb-24">
        {/* Location Banner */}
        {!isLocationEnabled && (
          <div className="bg-haluna-primary px-4 py-3">
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-white mr-2" />
                <p className="text-sm text-white">
                  Enable location to see shops near you
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={requestLocation}
                className="text-sm bg-white text-haluna-primary hover:bg-white/90"
              >
                Enable
              </Button>
            </div>
          </div>
        )}
        
        <div className="container mx-auto px-4">
          {/* Greeting */}
          <div className="mb-8 mt-6">
            <h1 className="text-3xl font-serif font-bold mb-2 text-haluna-primary">
              {isLoggedIn ? `Welcome back, ${user?.name || 'there'}!` : 'Welcome to Haluna'}
            </h1>
            <p className="text-haluna-text-light text-lg">
              {isLocationEnabled && location
                ? `Discover Muslim-owned businesses in ${location.city}`
                : 'Discover Muslim-owned businesses near you'}
            </p>
          </div>

          {/* Nearby Shops Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-serif font-bold mb-6 text-haluna-primary">Nearby Shops</h2>
            <NearbyShopsSection />
          </section>

          {/* Categories Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-serif font-bold mb-6 text-haluna-primary">Browse by Category</h2>
            <CategoriesSection />
          </section>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default Index;
