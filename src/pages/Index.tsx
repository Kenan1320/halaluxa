
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from '@/context/LocationContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import CategoryCard from '@/components/home/CategoryCard';
import Stats from '@/components/home/Stats';
import ShopCard from '@/components/shop/ShopCard';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, LogIn, UserPlus, MapPin, Store } from 'lucide-react';

const Index = () => {
  const { isLoggedIn, user } = useAuth();
  const { isLocationEnabled, location, requestLocation, getNearbyShops } = useLocation();
  const [nearbyShops, setNearbyShops] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Load nearby shops when location changes
  useEffect(() => {
    const loadNearbyShops = async () => {
      if (isLocationEnabled) {
        setIsLoading(true);
        try {
          const shops = await getNearbyShops();
          setNearbyShops(shops.slice(0, 4)); // Show top 4 shops
        } catch (error) {
          console.error("Error fetching nearby shops:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadNearbyShops();
  }, [isLocationEnabled, location, getNearbyShops]);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <Hero />
        
        {/* Nearby Shops Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
              <div>
                <h2 className="text-3xl font-serif font-bold mb-2">
                  {isLocationEnabled && location 
                    ? `Shops Near ${location.city}`
                    : "Discover Local Shops"}
                </h2>
                <p className="text-haluna-text-light max-w-2xl">
                  {isLocationEnabled 
                    ? `Support Muslim-owned businesses in your area.`
                    : `Enable location to discover Muslim-owned businesses near you.`}
                </p>
              </div>
              
              {!isLocationEnabled && (
                <Button 
                  onClick={requestLocation}
                  className="mt-4 md:mt-0 flex items-center"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Enable Location
                </Button>
              )}
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-6 space-y-4">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : nearbyShops.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {nearbyShops.map((shop, index) => (
                  <ShopCard key={shop.id} shop={shop} index={index} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-10 text-center">
                {isLocationEnabled ? (
                  <>
                    <Store className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-medium mb-2">No shops found nearby</h3>
                    <p className="text-haluna-text-light mb-6 max-w-lg mx-auto">
                      We couldn't find any shops near your location. Try exploring all shops instead.
                    </p>
                  </>
                ) : (
                  <>
                    <MapPin className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-medium mb-2">Enable location to see nearby shops</h3>
                    <p className="text-haluna-text-light mb-6 max-w-lg mx-auto">
                      Allow location access to discover Muslim-owned businesses in your area.
                    </p>
                  </>
                )}
                <Button onClick={() => navigate('/shops')}>
                  Browse All Shops
                </Button>
              </div>
            )}
            
            <div className="text-center mt-10">
              <Button 
                href="/shops" 
                variant="outline"
                className="inline-flex items-center"
              >
                View All Shops <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <Features />
        
        {/* Categories Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1 rounded-full bg-haluna-primary-light text-haluna-primary text-sm font-medium mb-4">
                Browse By Category
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                Discover Our Collection
              </h2>
              <p className="text-haluna-text-light max-w-2xl mx-auto">
                Explore a wide range of halal products across multiple categories curated for quality and authenticity.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <CategoryCard 
                title="Clothing & Fashion"
                description="Modest apparel with contemporary designs"
                imageSrc="/placeholder.svg"
                backgroundColor="bg-haluna-primary-light"
                link="/shops"
              />
              <CategoryCard 
                title="Food & Groceries"
                description="Authentic halal delicacies and ingredients"
                imageSrc="/placeholder.svg"
                backgroundColor="bg-haluna-beige"
                link="/shops"
              />
              <CategoryCard 
                title="Beauty & Wellness"
                description="Natural and halal-certified care products"
                imageSrc="/placeholder.svg"
                backgroundColor="bg-haluna-sage"
                link="/shops"
              />
              <CategoryCard 
                title="Home & Decor"
                description="Elegant Islamic art and home accessories"
                imageSrc="/placeholder.svg"
                backgroundColor="bg-haluna-cream"
                link="/shops"
              />
            </div>
            
            <div className="text-center mt-12">
              <Button href="/shops" variant="outline" className="inline-flex items-center">
                View All Categories <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        </section>
        
        {/* Stats Section */}
        <Stats />
        
        {/* Call To Action Section */}
        <section className="py-20 bg-haluna-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
                Ready to Join the Haluna Community?
              </h2>
              <p className="text-haluna-text-light text-lg mb-8 max-w-2xl mx-auto">
                Whether you're looking to shop ethically sourced halal products or grow your business reach, Haluna is the platform for you.
              </p>
              
              {isLoggedIn ? (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    href={user?.role === 'business' ? '/dashboard' : '/shops'} 
                    size="lg"
                  >
                    {user?.role === 'business' ? 'Go to Dashboard' : 'Start Shopping'}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button href="/signup" size="lg" className="flex items-center">
                    <UserPlus size={18} className="mr-2" />
                    Sign Up
                  </Button>
                  <Button href="/login" variant="outline" size="lg" className="flex items-center">
                    <LogIn size={18} className="mr-2" />
                    Log In
                  </Button>
                  <Button href="/sellers" variant="secondary" size="lg">
                    Become a Seller
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
