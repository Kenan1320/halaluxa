
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useToast } from "@/hooks/use-toast";
import SnoonuNavbar from '@/components/layout/SnoonuNavbar';
import BottomNavigation from '@/components/layout/BottomNavigation';
import SearchBar from '@/components/home/SearchBar';
import CategoryScroll from '@/components/home/CategoryScroll';
import CategorySuggestions from '@/components/home/CategorySuggestions';
import FlowingCategories from '@/components/home/FlowingCategories';
import ProductSection from '@/components/home/ProductSection';
import NearbyShops from '@/components/home/NearbyShops';
import { getFeaturedProducts } from '@/services/productService';
import { getAllShops } from '@/services/shopService';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

const Index = () => {
  const { toast } = useToast();
  const { isLoggedIn, user } = useAuth();
  const [activeTab, setActiveTab] = useState('forYou');
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [popularProducts, setPopularProducts] = useState<any[]>([]);
  const [ramadanProducts, setRamadanProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [shops, setShops] = useState<any[]>([]);
  
  // Load featured products
  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        setIsLoading(true);
        const products = await getFeaturedProducts();
        
        // Split products into different categories
        setFeaturedProducts(products.slice(0, 6));
        setPopularProducts(products.slice(6, 12));
        setRamadanProducts(products.slice(0, 4).map(p => ({
          ...p,
          is_halal_certified: true
        })));
        
        // Also load shops
        const shopData = await getAllShops();
        setShops(shopData);
      } catch (error) {
        console.error('Error loading products:', error);
        toast({
          title: "Error loading products",
          description: "Could not load products. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFeaturedProducts();
  }, [toast]);
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  
  // Check if Ramadan is active (just for demo purposes)
  const isRamadan = true;
  const currentHour = new Date().getHours();
  const isNightTime = currentHour >= 18 || currentHour < 6;
  
  return (
    <>
      <Helmet>
        <title>Halvi - Halal products and services</title>
      </Helmet>
      
      <SnoonuNavbar />
      
      <main className="pt-24 pb-24">
        <div className="container mx-auto px-4">
          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar />
          </div>
          
          {/* Flowing Categories */}
          <div className="mb-6">
            <CategoryScroll />
          </div>
          
          {/* Flowing Logos Section */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-3">Explore Shops</h2>
            <FlowingCategories />
          </div>
          
          {/* Personalization Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {['Your Shop', 'Premium', 'Health', 'Beauty', 'Local Finds', 'New Arrivals'].map((item, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl p-4 shadow-sm flex flex-col items-center justify-center text-center aspect-square"
              >
                <div className="w-10 h-10 rounded-full bg-haluna-primary-light flex items-center justify-center mb-2">
                  <span className="text-haluna-primary text-xl font-bold">{item.charAt(0)}</span>
                </div>
                <span className="font-medium text-sm">{item}</span>
              </motion.div>
            ))}
          </div>
          
          {/* Shopping Modes Section */}
          <div className="mb-8">
            <CategorySuggestions />
          </div>
          
          {/* Shops Section */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-3">Popular Shops</h2>
            <div className="space-y-8">
              {shops.slice(0, 3).map(shop => (
                <div key={shop.id} className="bg-white rounded-xl p-4 shadow-sm">
                  <NearbyShops shop={shop} />
                </div>
              ))}
            </div>
          </div>
          
          {/* Featured Products Section */}
          <ProductSection
            title="Featured Products"
            emoji="⭐"
            products={featuredProducts}
            viewAllLink="/browse?featured=true"
            backgroundColor="#F8F9FB"
          />
          
          {/* Popular Products Section */}
          <ProductSection
            title="Popular Products"
            emoji="🔥"
            products={popularProducts}
            viewAllLink="/browse?sort=popular"
            backgroundColor="#F8F9FB"
          />
        </div>
      </main>
      
      <BottomNavigation />
    </>
  );
};

export default Index;
