import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from '@/context/LocationContext';
import { Link } from 'react-router-dom';
import Footer from '@/components/layout/Footer';
import SearchBar from '@/components/home/SearchBar';
import CategoryScroll from '@/components/home/CategoryScroll';
import ProductGrid from '@/components/home/ProductGrid';
import NearbyShops from '@/components/home/NearbyShops';
import CategorySuggestions from '@/components/home/CategorySuggestions';
import { motion, useAnimationControls } from 'framer-motion';
import { getShopById, subscribeToShops, Shop } from '@/services/shopService';

const Index = () => {
  const { isLoggedIn, user } = useAuth();
  const { isLocationEnabled, requestLocation, location, getNearbyShops } = useLocation();
  const [selectedShops, setSelectedShops] = useState<Shop[]>([]);
  const [nearbyShops, setNearbyShops] = useState<Shop[]>([]);
  const [isLoadingShops, setIsLoadingShops] = useState(false);
  const [activeShopIndex, setActiveShopIndex] = useState(0);
  const shopScrollRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('online');

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

  // Load selected shops from localStorage
  const loadSelectedShops = useCallback(async () => {
    try {
      const savedShopIds = localStorage.getItem('selectedShops');
      if (savedShopIds) {
        const shopIds = JSON.parse(savedShopIds) as string[];
        const shopPromises = shopIds.map(id => getShopById(id));
        const shops = await Promise.all(shopPromises);
        setSelectedShops(shops.filter((shop): shop is Shop => shop !== null));
      }
    } catch (error) {
      console.error('Error loading selected shops:', error);
    }
  }, []);

  // Subscribe to real-time shop updates and load selected shops
  useEffect(() => {
    setIsLoadingShops(true);
    
    // Setup real-time subscription for shops
    const channel = subscribeToShops((shops) => {
      // If we received real-time shops and have no selected shops yet,
      // use the first 5 as the default selection
      if (shops.length > 0 && selectedShops.length === 0) {
        // Sort by product count (popularity) first
        const sortedShops = [...shops].sort((a, b) => (b.productCount || 0) - (a.productCount || 0));
        setSelectedShops(sortedShops.slice(0, 5));
        
        // Also update localStorage
        localStorage.setItem('selectedShops', JSON.stringify(sortedShops.slice(0, 5).map(s => s.id)));
        
        // Set the first shop as main if none is set
        if (!localStorage.getItem('mainShopId')) {
          localStorage.setItem('mainShopId', sortedShops[0].id);
        }
      }
      
      setNearbyShops(shops);
      setIsLoadingShops(false);
    });
    
    // Load selected shops and nearby shops initially
    const initialLoad = async () => {
      await loadSelectedShops();
      
      try {
        // Always get nearby shops based on location
        const nearby = await getNearbyShops();
        setNearbyShops(nearby);
        
        // If no selected shops, use 5 nearby shops as default
        if ((!localStorage.getItem('selectedShops') || JSON.parse(localStorage.getItem('selectedShops') || '[]').length === 0) && nearby.length > 0) {
          setSelectedShops(nearby.slice(0, 5));
          localStorage.setItem('selectedShops', JSON.stringify(nearby.slice(0, 5).map(s => s.id)));
        }
      } catch (error) {
        console.error('Error loading nearby shops:', error);
      } finally {
        setIsLoadingShops(false);
      }
    };
    
    initialLoad();
    
    // Cleanup subscription on unmount
    return () => {
      channel.unsubscribe();
    };
  }, [getNearbyShops, loadSelectedShops, selectedShops.length]);

  // Cycling shop index animation effect with more efficient interval
  useEffect(() => {
    if (selectedShops.length === 0) return;
    
    const interval = setInterval(() => {
      setActiveShopIndex(prev => (prev + 1) % selectedShops.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [selectedShops.length]);

  // Get current hour to determine greeting
  const greeting = useMemo(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return "Good morning";
    if (currentHour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  return (
    <div className="min-h-screen pt-16 pb-20 bg-white dark:bg-gray-900">
      {/* Top container with lighter mint background */}
      <div className="bg-[#E4F5F0] dark:bg-gray-800 pt-2 pb-3">
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
            <h2 className="text-xs font-medium text-[#2A866A] dark:text-green-300">
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
      <div className="container mx-auto px-4 pt-3 bg-white dark:bg-gray-900">
        {/* Selected/Featured Shops Section - Always visible */}
        <section className="mt-3 mb-5">
          <div className="flex justify-between items-center mb-2">
            <div className="bg-gray-100 rounded-full px-4 py-1">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Your Shops</h2>
            </div>
            <Link 
              to="/select-shops" 
              className="bg-gray-100 hover:bg-gray-200 transition-colors duration-200 rounded-full px-4 py-1 text-sm text-gray-800"
            >
              Edit Selection
            </Link>
          </div>
          
          {/* Shop carousel */}
          <div ref={shopScrollRef} className="relative h-28 overflow-hidden">
            {selectedShops.length > 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full flex items-center">
                  {/* Create a continuous flow of logos - first set */}
                  <motion.div
                    className="flex absolute"
                    initial={{ x: "0%" }}
                    animate={{ x: "-100%" }}
                    transition={{
                      repeat: Infinity,
                      duration: 20,
                      ease: "linear",
                      repeatType: "loop"
                    }}
                  >
                    {/* Double the shops array for continuous animation */}
                    {[...selectedShops, ...selectedShops, ...selectedShops].map((shop, index) => (
                      <motion.div
                        key={`${shop.id}-flow1-${index}`}
                        className="flex flex-col items-center mx-6 relative"
                        animate={{
                          scale: activeShopIndex % selectedShops.length === index % selectedShops.length ? 1.15 : 1,
                          y: activeShopIndex % selectedShops.length === index % selectedShops.length ? -5 : 0,
                          zIndex: activeShopIndex % selectedShops.length === index % selectedShops.length ? 10 : 1,
                        }}
                        transition={{
                          duration: 0.5,
                          ease: "easeInOut"
                        }}
                      >
                        <Link to={`/shop/${shop.id}`}>
                          <motion.div 
                            className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center overflow-hidden"
                            whileHover={{ scale: 1.1, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          >
                            {shop.logo ? (
                              <img src={shop.logo} alt={shop.name} className="w-10 h-10 object-contain" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-[#F9F5EB] text-[#29866B] font-semibold">
                                {shop.name.charAt(0)}
                              </div>
                            )}
                          </motion.div>
                          <motion.span 
                            className="text-xs text-center mt-1 block font-medium tracking-tight"
                            initial={{ opacity: 0.8 }}
                            whileHover={{ opacity: 1, scale: 1.05, color: "#29866B" }}
                            animate={{
                              y: [0, -2, 0],
                              color: activeShopIndex % selectedShops.length === index % selectedShops.length 
                                ? ["#000000", "#29866B", "#000000"] 
                                : "#000000",
                              transition: {
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "mirror",
                                ease: "easeInOut",
                                delay: index * 0.2 % 1,
                              }
                            }}
                          >
                            {shop.name.length > 10 ? `${shop.name.substring(0, 10)}...` : shop.name}
                          </motion.span>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Second identical motion div that follows the first to create seamless transition */}
                  <motion.div
                    className="flex absolute"
                    initial={{ x: "100%" }}
                    animate={{ x: "0%" }}
                    transition={{
                      repeat: Infinity,
                      duration: 20,
                      ease: "linear",
                      repeatType: "loop"
                    }}
                  >
                    {[...selectedShops, ...selectedShops, ...selectedShops].map((shop, index) => (
                      <motion.div
                        key={`${shop.id}-flow2-${index}`}
                        className="flex flex-col items-center mx-6 relative"
                        animate={{
                          scale: activeShopIndex % selectedShops.length === index % selectedShops.length ? 1.15 : 1,
                          y: activeShopIndex % selectedShops.length === index % selectedShops.length ? -5 : 0,
                          zIndex: activeShopIndex % selectedShops.length === index % selectedShops.length ? 10 : 1,
                        }}
                        transition={{
                          duration: 0.5,
                          ease: "easeInOut"
                        }}
                      >
                        <Link to={`/shop/${shop.id}`}>
                          <motion.div 
                            className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center overflow-hidden"
                            whileHover={{ scale: 1.1, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          >
                            {shop.logo ? (
                              <img src={shop.logo} alt={shop.name} className="w-10 h-10 object-contain" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-[#F9F5EB] text-[#29866B] font-semibold">
                                {shop.name.charAt(0)}
                              </div>
                            )}
                          </motion.div>
                          <motion.span 
                            className="text-xs text-center mt-1 block font-medium tracking-tight"
                            initial={{ opacity: 0.8 }}
                            whileHover={{ opacity: 1, scale: 1.05, color: "#29866B" }}
                            animate={{
                              y: [0, -2, 0],
                              color: activeShopIndex % selectedShops.length === index % selectedShops.length 
                                ? ["#000000", "#29866B", "#000000"] 
                                : "#000000",
                              transition: {
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "mirror",
                                ease: "easeInOut",
                                delay: index * 0.2 % 1,
                              }
                            }}
                          >
                            {shop.name.length > 10 ? `${shop.name.substring(0, 10)}...` : shop.name}
                          </motion.span>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>
            )}
          </div>
        </section>
        
        {/* Category Suggestions - NEW SECTION */}
        <section className="mt-4 mb-6">
          <CategorySuggestions />
        </section>
        
        {/* Nearby Shops Section */}
        <section className="mt-1">
          {activeTab === 'online' ? (
            <h2 className="text-lg font-semibold mb-2 bg-gray-100 rounded-full px-4 py-1 inline-block text-gray-800 dark:text-white">
              Shops
            </h2>
          ) : (
            <h2 className="text-lg font-semibold mb-2 bg-gray-100 rounded-full px-4 py-1 inline-block text-gray-800 dark:text-white">
              Nearby Shops
            </h2>
          )}
          
          <NearbyShops />
        </section>
        
        {/* Featured Products Section */}
        <section className="mt-4">
          <h2 className="text-lg font-semibold mb-2 bg-gray-100 rounded-full px-4 py-1 inline-block text-gray-800 dark:text-white">
            Featured Products
          </h2>
          <ProductGrid />
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
