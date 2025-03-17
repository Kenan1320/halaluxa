
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
import { motion } from 'framer-motion';
import { getShopById, subscribeToShops, getShops, Shop } from '@/services/shopService';
import { useTheme } from '@/context/ThemeContext';
import { normalizeShop, normalizeShopArray } from '@/utils/shopHelper';
import ShopLogoScroller from '@/components/home/ShopLogoScroller';

const Index = () => {
  const { isLoggedIn, user } = useAuth();
  const { isLocationEnabled, requestLocation, location, getNearbyShops } = useLocation();
  const [selectedShops, setSelectedShops] = useState<Shop[]>([]);
  const [nearbyShops, setNearbyShops] = useState<Shop[]>([]);
  const [onlineShops, setOnlineShops] = useState<Shop[]>([]);
  const [trendingShops, setTrendingShops] = useState<Shop[]>([]);
  const [isLoadingShops, setIsLoadingShops] = useState(false);
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
        setSelectedShops(normalizeShopArray(shops.filter(Boolean) as Shop[]));
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
        const normalizedShops = normalizeShopArray(allShops);
        
        // Split shops into nearby, online, and trending
        const nearby = normalizedShops.filter(shop => 
          shop.distance !== null && shop.distance < 10
        ).slice(0, 10);
        
        const online = normalizedShops.filter(shop => 
          shop.distance === null || shop.location === 'Online'
        ).slice(0, 10);

        // Create a trending shops list - sort by product count as a proxy for popularity
        const trending = [...normalizedShops].sort((a, b) => 
          (b.product_count || 0) - (a.product_count || 0)
        ).slice(0, 10);
        
        setNearbyShops(nearby);
        setOnlineShops(online);
        setTrendingShops(trending);
        
        if ((!localStorage.getItem('selectedShops') || 
             JSON.parse(localStorage.getItem('selectedShops') || '[]').length === 0) && 
             normalizedShops.length > 0) {
          setSelectedShops(normalizedShops.slice(0, 5));
          localStorage.setItem('selectedShops', JSON.stringify(normalizedShops.slice(0, 5).map(s => s.id)));
          
          if (!localStorage.getItem('mainShopId')) {
            localStorage.setItem('mainShopId', normalizedShops[0].id);
          }
        }
        
        setIsLoadingShops(false);
      } catch (error) {
        console.error('Error loading shops:', error);
        setIsLoadingShops(false);
      }
    };
    
    const channel = subscribeToShops((shops) => {
      const normalizedShops = normalizeShopArray(shops);
      
      // Split shops into nearby, online, and trending
      const nearby = normalizedShops.filter(shop => 
        shop.distance !== null && shop.distance < 10
      ).slice(0, 10);
      
      const online = normalizedShops.filter(shop => 
        shop.distance === null || shop.location === 'Online'
      ).slice(0, 10);
      
      const trending = [...normalizedShops].sort((a, b) => 
        (b.product_count || 0) - (a.product_count || 0)
      ).slice(0, 10);
      
      setNearbyShops(nearby);
      setOnlineShops(online);
      setTrendingShops(trending);
      
      if (normalizedShops.length > 0 && selectedShops.length === 0) {
        const sortedShops = [...normalizedShops].sort((a, b) => (b.product_count || 0) - (a.product_count || 0));
        setSelectedShops(sortedShops.slice(0, 5));
        
        localStorage.setItem('selectedShops', JSON.stringify(sortedShops.slice(0, 5).map(s => s.id)));
        
        if (!localStorage.getItem('mainShopId')) {
          localStorage.setItem('mainShopId', sortedShops[0].id);
        }
      }
      
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
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Deep blue gradient header section with search and categories */}
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
        {/* Flowing logo sections - two rows of each type with minimal spacing */}
        <div className="my-3">
          {/* First row of nearby shop logos */}
          <div className="mt-1">
            <ShopLogoScroller shops={nearbyShops} direction="left" />
          </div>
          
          {/* Second row of nearby shop logos (same shops, different direction) */}
          <div className="mt-1">
            <ShopLogoScroller shops={nearbyShops.slice(0).reverse()} direction="right" />
          </div>
        </div>
        
        <div className="my-3">
          {/* First row of online shop logos */}
          <div className="mt-1">
            <ShopLogoScroller shops={onlineShops} direction="left" />
          </div>
          
          {/* Second row of online shop logos (same shops, different direction) */}
          <div className="mt-1">
            <ShopLogoScroller shops={onlineShops.slice(0).reverse()} direction="right" />
          </div>
        </div>
        
        <section className="mt-4 mb-6">
          <CategorySuggestions />
        </section>
        
        <section className="mt-1">
          <SectionHeading>
            {activeTab === 'online' ? 'Shops' : 'Nearby Shops'}
          </SectionHeading>
          
          <NearbyShops />
        </section>
        
        {/* Featured Products section */}
        <section className="mt-8">
          <SectionHeading>Featured Products</SectionHeading>
          <ProductGrid />
        </section>
      </div>
    </div>
  );
};

export default Index;
