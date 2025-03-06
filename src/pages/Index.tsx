
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from '@/context/LocationContext';
import { Link } from 'react-router-dom';
import Footer from '@/components/layout/Footer';
import SearchBar from '@/components/home/SearchBar';
import CategoryScroll from '@/components/home/CategoryScroll';
import ProductGrid from '@/components/home/ProductGrid';
import NearbyShops from '@/components/home/NearbyShops';
import { motion } from 'framer-motion';
import { getShopById, Shop } from '@/services/shopService';

const Index = () => {
  const { isLoggedIn, user } = useAuth();
  const { isLocationEnabled, requestLocation, location, getNearbyShops } = useLocation();
  const [selectedShops, setSelectedShops] = useState<Shop[]>([]);
  const [nearbyShops, setNearbyShops] = useState<Shop[]>([]);
  const [isLoadingShops, setIsLoadingShops] = useState(false);
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Automatically request location on first load
  useEffect(() => {
    if (!isLocationEnabled) {
      requestLocation();
    }
  }, [isLocationEnabled, requestLocation]);

  // Load selected shops and nearby shops
  useEffect(() => {
    const loadShops = async () => {
      setIsLoadingShops(true);
      
      try {
        // Load selected shops from localStorage
        const savedShopIds = localStorage.getItem('selectedShops');
        if (savedShopIds) {
          const shopIds = JSON.parse(savedShopIds) as string[];
          const shopPromises = shopIds.map(id => getShopById(id));
          const shops = await Promise.all(shopPromises);
          setSelectedShops(shops.filter((shop): shop is Shop => shop !== null));
        }
        
        // Always get nearby shops based on location
        const nearby = await getNearbyShops();
        
        // If no selected shops, use 5 nearby shops as default
        if ((!savedShopIds || JSON.parse(savedShopIds).length === 0) && nearby.length > 0) {
          setSelectedShops(nearby.slice(0, 5));
        }
        
        setNearbyShops(nearby);
      } catch (error) {
        console.error('Error loading shops:', error);
      } finally {
        setIsLoadingShops(false);
      }
    };
    
    loadShops();
  }, [getNearbyShops, location]);

  // Get current hour to determine greeting
  const currentHour = new Date().getHours();
  let greeting = "Good morning";
  if (currentHour >= 12 && currentHour < 18) {
    greeting = "Good afternoon";
  } else if (currentHour >= 18) {
    greeting = "Good evening";
  }

  return (
    <div className="min-h-screen pt-16 pb-20 bg-white">
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
            <h2 className="text-xs font-medium text-[#2A866A]">
              {greeting}, {isLoggedIn && user ? user.name : 'Guest'}
            </h2>
          </motion.div>
          
          {/* Category scroll inside mint background */}
          <div className="mt-1">
            <CategoryScroll />
          </div>
        </div>
      </div>
      
      {/* Main content with white background */}
      <div className="container mx-auto px-4 pt-3 bg-white">
        {/* Selected/Featured Shops Section - Always visible */}
        <section className="mt-3 mb-5">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-gray-800">Your Shops</h2>
            <Link to="/select-shops" className="text-xs text-[#29866B] hover:underline">
              Edit Selection
            </Link>
          </div>
          
          <div className="relative h-20 overflow-hidden">
            <motion.div
              className="flex absolute whitespace-nowrap"
              animate={{
                x: [0, -1000],
              }}
              transition={{
                repeat: Infinity,
                duration: 20,
                ease: "linear"
              }}
            >
              {/* Duplicate the shops array to create seamless loop */}
              {[...selectedShops, ...selectedShops].map((shop, index) => (
                <motion.div
                  key={`${shop.id}-${index}`}
                  className="flex flex-col items-center mx-4"
                  whileHover={{ scale: 1.1 }}
                >
                  <Link to={`/shop/${shop.id}`}>
                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center overflow-hidden">
                      {shop.logo ? (
                        <img src={shop.logo} alt={shop.name} className="w-8 h-8 object-contain" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#F9F5EB] text-[#29866B] font-semibold">
                          {shop.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-center mt-1 block font-medium tracking-tight">
                      {shop.name.length > 10 ? `${shop.name.substring(0, 10)}...` : shop.name}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
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
