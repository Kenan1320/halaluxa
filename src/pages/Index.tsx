
import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from '@/context/LocationContext';
import { Link } from 'react-router-dom';
import SearchBar from '@/components/home/SearchBar';
import CategoryScroll from '@/components/home/CategoryScroll';
import ProductGrid from '@/components/home/ProductGrid';
import NearbyShops from '@/components/home/NearbyShops';
import CategorySuggestions from '@/components/home/CategorySuggestions';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getShopById, subscribeToShops, getShops, Shop } from '@/services/shopService';
import { useTheme } from '@/context/ThemeContext';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';

const Index = () => {
  const { isLoggedIn, user } = useAuth();
  const { isLocationEnabled, requestLocation, location, getNearbyShops } = useLocation();
  const [selectedShops, setSelectedShops] = useState<Shop[]>([]);
  const [nearbyShops, setNearbyShops] = useState<Shop[]>([]);
  const [isLoadingShops, setIsLoadingShops] = useState(false);
  const [activeShopIndex, setActiveShopIndex] = useState(0);
  const [showShopSelector, setShowShopSelector] = useState(false);
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const shopScrollRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('online');
  const { mode } = useTheme();

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

  // Shop subscription and loading logic
  useEffect(() => {
    setIsLoadingShops(true);
    
    // Always load shops regardless of location status
    const loadAllShops = async () => {
      try {
        const allShops = await getShops();
        setNearbyShops(allShops);
        
        // If no selected shops, use 5 shops as default
        if ((!localStorage.getItem('selectedShops') || 
             JSON.parse(localStorage.getItem('selectedShops') || '[]').length === 0) && 
             allShops.length > 0) {
          setSelectedShops(allShops.slice(0, 5));
          localStorage.setItem('selectedShops', JSON.stringify(allShops.slice(0, 5).map(s => s.id)));
          
          // Set the first shop as main if none is set
          if (!localStorage.getItem('mainShopId')) {
            localStorage.setItem('mainShopId', allShops[0].id);
          }
        }
        
        setIsLoadingShops(false);
      } catch (error) {
        console.error('Error loading shops:', error);
        setIsLoadingShops(false);
      }
    };
    
    // Setup real-time subscription for shops
    const channel = subscribeToShops((shops) => {
      // If we received real-time shops and have no selected shops yet,
      // use the first 5 as the default selection
      if (shops.length > 0 && selectedShops.length === 0) {
        // Sort by product count (popularity) first
        const sortedShops = [...shops].sort((a, b) => (b.product_count || 0) - (a.product_count || 0));
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
    
    // Load selected shops and all shops initially
    const initialLoad = async () => {
      await loadSelectedShops();
      await loadAllShops();
    };
    
    initialLoad();
    
    // Cleanup subscription on unmount
    return () => {
      channel.unsubscribe();
    };
  }, [loadSelectedShops]);

  // Cycling shop index animation
  useEffect(() => {
    if (selectedShops.length === 0) return;
    
    const interval = setInterval(() => {
      setActiveShopIndex(prev => (prev + 1) % selectedShops.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [selectedShops.length]);

  // Get greeting based on time of day
  const greeting = useMemo(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return "Good morning";
    if (currentHour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  // Set the shop as main
  const setAsMainShop = (shopId: string) => {
    localStorage.setItem('mainShopId', shopId);
    setSelectedShopId(null);
  };

  // Visit the shop
  const visitShop = (shopId: string) => {
    window.location.href = `/shop/${shopId}`;
  };

  // Toggle shop selection
  const toggleShopSelection = (shopId: string) => {
    const currentSelection = JSON.parse(localStorage.getItem('selectedShops') || '[]') as string[];
    
    if (currentSelection.includes(shopId)) {
      const newSelection = currentSelection.filter(id => id !== shopId);
      localStorage.setItem('selectedShops', JSON.stringify(newSelection));
    } else {
      currentSelection.push(shopId);
      localStorage.setItem('selectedShops', JSON.stringify(currentSelection));
    }
    
    loadSelectedShops();
  };

  // Shop selector modal content
  const ShopSelectorModal = () => (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div 
          className="flex items-center gap-1 cursor-pointer mt-1 mb-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <h2 className={`text-sm font-bold tracking-wide ${
            mode === 'dark'
              ? 'text-white bg-gray-800/90 dark:border dark:border-gray-700'
              : 'text-gray-700 bg-gray-100'
          } rounded-full px-4 py-1 inline-block`}
          style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif" }}>
            Your Shops
          </h2>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-t-xl p-0 gap-0">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-bold text-lg">Shop Selection</h2>
          <p className="text-gray-500 text-sm">Manage your favorite shops</p>
        </div>
        
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {nearbyShops.map(shop => (
              <div key={shop.id} className="flex flex-col items-center">
                <div 
                  className="w-16 h-16 rounded-lg flex items-center justify-center overflow-hidden cursor-pointer border border-gray-200 dark:border-gray-700"
                  onClick={() => setSelectedShopId(shop.id === selectedShopId ? null : shop.id)}
                >
                  {shop.logo_url ? (
                    <img src={shop.logo_url} alt={shop.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-500">
                      {shop.name.charAt(0)}
                    </div>
                  )}
                </div>
                <p className="text-xs text-center mt-1 font-medium">{shop.name}</p>
                
                {selectedShopId === shop.id && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-2 space-y-1"
                  >
                    <button 
                      onClick={() => visitShop(shop.id)}
                      className="w-full text-xs py-1 px-2 bg-[#2A866A] text-white rounded-md"
                    >
                      Visit Shop
                    </button>
                    <button 
                      onClick={() => setAsMainShop(shop.id)}
                      className="w-full text-xs py-1 px-2 bg-blue-500 text-white rounded-md"
                    >
                      Set as Main
                    </button>
                    <button 
                      onClick={() => toggleShopSelection(shop.id)}
                      className="w-full text-xs py-1 px-2 bg-gray-200 dark:bg-gray-700 rounded-md"
                    >
                      {JSON.parse(localStorage.getItem('selectedShops') || '[]').includes(shop.id) 
                        ? 'Remove' 
                        : 'Select Shop'}
                    </button>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen pt-16 pb-20 bg-white dark:bg-gray-900">
      {/* Top container with lighter mint background */}
      <div className="bg-[#E4F5F0] dark:bg-gray-800 pt-2 pb-3">
        <div className="container mx-auto px-4">
          {/* Search bar */}
          <div className="mb-2">
            <SearchBar />
          </div>
          
          {/* Personalized greeting for user */}
          <motion.div
            className="mb-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-xs font-medium text-[#2A866A] dark:text-green-300">
              {greeting}, {isLoggedIn && user ? user.name : 'Guest'}
            </h2>
          </motion.div>
          
          {/* Category scroll */}
          <div className="mt-1">
            <CategoryScroll />
          </div>
        </div>
      </div>
      
      {/* Main content with white background */}
      <div className="container mx-auto px-4 pt-3 bg-white dark:bg-gray-900">
        {/* Section divider */}
        <div className="border-b border-[#DADADA] dark:border-gray-700 my-2"></div>
        
        {/* Selected/Featured Shops Section - with new modal approach */}
        <section className="mt-3 mb-5">
          <div className="flex justify-between items-center mb-2">
            <ShopSelectorModal />
          </div>
          
          {/* Shop carousel */}
          <div ref={shopScrollRef} className="relative h-28 overflow-hidden">
            {selectedShops.length > 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full flex items-center">
                  {/* First set of logos */}
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
                            {shop.logo_url ? (
                              <img src={shop.logo_url} alt={shop.name} className="w-10 h-10 object-contain" />
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

                  {/* Second continuous flow of logos */}
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
                            {shop.logo_url ? (
                              <img src={shop.logo_url} alt={shop.name} className="w-10 h-10 object-contain" />
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
        
        {/* Section divider */}
        <div className="border-b border-[#DADADA] dark:border-gray-700 my-3"></div>
        
        {/* Category Suggestions */}
        <section className="mt-3 mb-4">
          <CategorySuggestions />
        </section>
        
        {/* Section divider */}
        <div className="border-b border-[#DADADA] dark:border-gray-700 my-2"></div>
        
        {/* Nearby Shops Section */}
        <section className="mt-4 mb-4">
          <h2 className={`text-sm font-bold tracking-wide ${
            mode === 'dark'
              ? 'text-white bg-gray-800/90 dark:border dark:border-gray-700'
              : 'text-gray-700 bg-gray-100'
          } rounded-full px-4 py-1 inline-block`}
          style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif" }}>
            {activeTab === 'online' ? 'Shops' : 'Nearby Shops'}
          </h2>
          
          <NearbyShops />
        </section>
        
        {/* Section divider */}
        <div className="border-b border-[#DADADA] dark:border-gray-700 my-3"></div>
        
        {/* Featured Products Section */}
        <section className="mt-4 mb-6">
          <h2 className={`text-sm font-bold tracking-wide ${
            mode === 'dark'
              ? 'text-white bg-gray-800/90 dark:border dark:border-gray-700'
              : 'text-gray-700 bg-gray-100'
          } rounded-full px-4 py-1 inline-block`}
          style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif" }}>
            Featured Products
          </h2>
          <ProductGrid />
        </section>
      </div>
    </div>
  );
};

export default Index;
