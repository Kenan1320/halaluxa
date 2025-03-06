
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
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, LogIn, UserPlus, MapPin, Star, Store } from 'lucide-react';

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
          setNearbyShops(shops.slice(0, 3)); // Show top 3 shops
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {nearbyShops.map((shop, index) => (
                  <motion.div 
                    key={shop.id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="h-48 bg-gray-100 relative">
                      {shop.coverImage ? (
                        <img 
                          src={shop.coverImage} 
                          alt={shop.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-haluna-primary-light">
                          <Store className="h-12 w-12 text-haluna-primary" />
                        </div>
                      )}
                      {shop.isVerified && (
                        <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                          Verified
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-medium">{shop.name}</h3>
                        <div className="flex items-center text-yellow-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="ml-1 text-sm">{shop.rating}</span>
                        </div>
                      </div>
                      <p className="text-haluna-text-light mb-3 line-clamp-2">{shop.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                          {shop.category}
                        </span>
                        {isLocationEnabled && shop.distance && (
                          <span className="text-sm text-haluna-text-light">
                            {shop.distance.toFixed(1)} miles away
                          </span>
                        )}
                      </div>
                      <Button 
                        onClick={() => navigate(`/shop/${shop.id}`)}
                        className="w-full mt-4"
                      >
                        View Shop
                      </Button>
                    </div>
                  </motion.div>
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
                imageSrc="/lovable-uploads/26c50a86-ec95-4072-8f0c-ac930a65b34d.png"
                backgroundColor="bg-haluna-primary-light"
                link="/shop"
              />
              <CategoryCard 
                title="Food & Cuisine"
                description="Authentic halal delicacies and ingredients"
                imageSrc="/lovable-uploads/0c423741-0711-4e97-8c56-ca4fe31dc6ca.png"
                backgroundColor="bg-haluna-beige"
                link="/shop"
              />
              <CategoryCard 
                title="Beauty & Wellness"
                description="Natural and halal-certified care products"
                imageSrc="/lovable-uploads/9c75ca26-bc1a-4718-84bb-67d7f2337b30.png"
                backgroundColor="bg-haluna-sage"
                link="/shop"
              />
              <CategoryCard 
                title="Home & Decor"
                description="Elegant Islamic art and home accessories"
                imageSrc="/lovable-uploads/d8db1529-74b3-4d86-b64a-f0c8b0f92c5c.png"
                backgroundColor="bg-haluna-cream"
                link="/shop"
              />
            </div>
            
            <div className="text-center mt-12">
              <Button href="/shop" variant="outline" className="inline-flex items-center">
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
                    href={user?.role === 'business' ? '/dashboard' : '/shop'} 
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
