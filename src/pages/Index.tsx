import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from '@/context/LocationContext';
import { Link } from 'react-router-dom';
import Footer from '@/components/layout/Footer';
import SearchBar from '@/components/home/SearchBar';
import CategoryScroll from '@/components/home/CategoryScroll';
import ScrollableNavigation from '@/components/home/ScrollableNavigation';
import ProductGrid from '@/components/home/ProductGrid';
import NearbyShops from '@/components/home/NearbyShops';
import CategorySuggestions from '@/components/home/CategorySuggestions';
import { motion, useAnimationControls } from 'framer-motion';
import { getShopById, subscribeToShops, getShops, Shop } from '@/services/shopService';
import { useTheme } from '@/context/ThemeContext';
import { normalizeShop } from '@/lib/utils';

const Index = () => {
  const { isLoggedIn, user } = useAuth();
  const { isLocationEnabled, requestLocation, location, getNearbyShops } = useLocation();
  const [selectedShops, setSelectedShops] = useState<Shop[]>([]);
  const [nearbyShops, setNearbyShops] = useState<Shop[]>([]);
  const [isLoadingShops, setIsLoadingShops] = useState(false);
  const [activeShopIndex, setActiveShopIndex] = useState(0);
  const shopScrollRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('online');
  const { mode } = useTheme();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!isLocationEnabled) {
      requestLocation();
    }
  }, [isLocationEnabled, requestLocation]);

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

  useEffect(() => {
    setIsLoadingShops(true);
    
    const loadAllShops = async () => {
      try {
        const allShops = await getShops();
        setNearbyShops(allShops);
        
        if ((!localStorage.getItem('selectedShops') || 
             JSON.parse(localStorage.getItem('selectedShops') || '[]').length === 0) && 
             allShops.length > 0) {
          setSelectedShops(allShops.slice(0, 5));
          localStorage.setItem('selectedShops', JSON.stringify(allShops.slice(0, 5).map(s => s.id)));
          
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
    
    const channel = subscribeToShops((shops) => {
      if (shops.length > 0 && selectedShops.length === 0) {
        const sortedShops = [...shops].sort((a, b) => (b.product_count || 0) - (a.product_count || 0));
        setSelectedShops(sortedShops.slice(0, 5));
        
        localStorage.setItem('selectedShops', JSON.stringify(sortedShops.slice(0, 5).map(s => s.id)));
        
        if (!localStorage.getItem('mainShopId')) {
          localStorage.setItem('mainShopId', sortedShops[0].id);
        }
      }
      
      setNearbyShops(shops);
      setIsLoadingShops(false);
    });
    
    const initialLoad = async () => {
      await loadSelectedShops();
      await loadAllShops();
    };
    
    initialLoad();
    
    return () => {
      channel.unsubscribe();
    };
  }, [loadSelectedShops]);

  useEffect(() => {
    if (selectedShops.length === 0) return;
    
    const interval = setInterval(() => {
      setActiveShopIndex(prev => (prev + 1) % selectedShops.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [selectedShops.length]);

  const greeting = useMemo(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return "Good morning";
    if (currentHour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const SectionHeading = ({ children }: { children: React.ReactNode }) => (
    <h2 className={`text-sm font-bold tracking-wide ${
      mode === 'dark'
        ? 'text-white bg-gray-800/90 dark:border dark:border-gray-700'
        : 'text-gray-700 bg-gray-100'
    } rounded-full px-4 py-1 inline-block`}
    style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {children}
    </h2>
  );

  return (
    <div className="min-h-screen pt-16 pb-20 bg-white dark:bg-gray-900">
      <div className="deep-night-blue-gradient text-white pt-3 pb-4">
        <div className="container mx-auto px-4">
          <div className="mb-3">
            <SearchBar />
          </div>
          
          <motion.div
            className="mb-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-xs font-medium text-white/90">
              {greeting}, {isLoggedIn && user ? user.name : 'Guest'}
            </h2>
          </motion.div>
          
          <div className="mt-1">
            <CategoryScroll />
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-900 py-3 shadow-sm border-b border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <ScrollableNavigation />
        </div>
      </div>
      
      <div className="container mx-auto px-4 pt-5 bg-white dark:bg-gray-900">
        <section className="mt-3 mb-8">
          <SectionHeading>Your Shops</SectionHeading>
          
          <div className="relative h-28 mt-4 overflow-hidden">
            {selectedShops.length > 0 && (
              <div className="absolute inset-0 w-full h-full">
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
                      className="mx-6 relative"
                      whileHover={{ scale: 1.1, y: -5 }}
                    >
                      <Link to={`/shop/${shop.id}`}>
                        <motion.div 
                          className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden border-2 border-gray-100"
                          whileHover={{ 
                            boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                            borderColor: "#0F1B44" 
                          }}
                        >
                          {shop.logo_url ? (
                            <img src={shop.logo_url} alt={shop.name} className="w-12 h-12 object-contain" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#F9F5EB] text-[#29866B] font-semibold">
                              {shop.name.charAt(0)}
                            </div>
                          )}
                        </motion.div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>

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
                      className="mx-6 relative"
                      whileHover={{ scale: 1.1, y: -5 }}
                    >
                      <Link to={`/shop/${shop.id}`}>
                        <motion.div 
                          className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden border-2 border-gray-100"
                          whileHover={{ 
                            boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                            borderColor: "#0F1B44" 
                          }}
                        >
                          {shop.logo_url ? (
                            <img src={shop.logo_url} alt={shop.name} className="w-12 h-12 object-contain" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#F9F5EB] text-[#29866B] font-semibold">
                              {shop.name.charAt(0)}
                            </div>
                          )}
                        </motion.div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}
          </div>
        </section>
        
        <section className="mt-4 mb-6">
          <CategorySuggestions />
        </section>
        
        <section className="mt-1">
          <SectionHeading>
            {activeTab === 'online' ? 'Shops' : 'Nearby Shops'}
          </SectionHeading>
          
          <NearbyShops />
        </section>
        
        <section className="mt-4">
          <SectionHeading>Featured Products</SectionHeading>
          <ProductGrid />
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
