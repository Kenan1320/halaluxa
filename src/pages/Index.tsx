
import React, { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useToast } from "@/hooks/use-toast";
import SnoonuNavbar from '@/components/layout/SnoonuNavbar';
import BottomNavigation from '@/components/layout/BottomNavigation';
import SwitchableTabs from '@/components/home/SwitchableTabs';
import PromoBanner from '@/components/home/PromoBanner';
import CategoryGrid from '@/components/home/CategoryGrid';
import ProductSection from '@/components/home/ProductSection';
import { getFeaturedProducts } from '@/services/productService';
import { getAllShops } from '@/services/shopService';
import { adaptToModelProduct } from '@/models/shop';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

// Mock data for categories
const categories = [
  { id: '1', name: 'Restaurants', icon: '/icons/restaurant.png', link: '/browse?category=Restaurants' },
  { id: '2', name: 'Grocery', icon: '/icons/grocery.png', link: '/browse?category=Grocery' },
  { id: '3', name: 'Electronics', icon: '/icons/electronics.png', link: '/browse?category=Electronics' },
  { id: '4', name: 'Pets', icon: '/icons/pets.png', link: '/browse?category=Pets' },
  { id: '5', name: 'Toys & Kids', icon: '/icons/toys.png', link: '/browse?category=Toys' },
  { id: '6', name: 'Clothing', icon: '/icons/clothing.png', link: '/browse?category=Clothing' },
  { id: '7', name: 'Home', icon: '/icons/home.png', link: '/browse?category=Home' },
  { id: '8', name: 'All Services', icon: '/icons/services.png', link: '/shops' },
];

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
      
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          {/* Ramadan Banner - only show during Ramadan */}
          {isRamadan && (
            <div className="bg-gradient-to-b from-[#0a0a29] to-[#19195c] rounded-xl p-6 text-white my-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Ramadan Kareem</h2>
                  <div className="flex items-center">
                    <div className="mr-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 15C10.2 15 8.7 13.5 8.7 11.7C8.7 10.1 9.0 9.5 11.5 5.1C11.6 4.9 11.8 4.8 12 4.8C12.2 4.8 12.4 4.9 12.5 5.1C15 9.5 15.3 10.1 15.3 11.7C15.3 13.5 13.8 15 12 15Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg">Iftar Time</p>
                      <p className="text-sm opacity-80">0h 32m until Fajr • Suhur ends at 04:26</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <img src="/ramadan-lantern.png" alt="Ramadan Lantern" className="h-20" />
                </div>
              </div>
              <div className="mt-6">
                <button className="w-full text-center bg-white text-[#0a0a29] py-3 rounded-full font-bold">
                  Plan your Iftar meal
                </button>
              </div>
            </div>
          )}
          
          {/* Featured Banner */}
          <PromoBanner 
            title="Outdoor Adventures"
            backgroundImage="/lovable-uploads/e15591df-5393-406d-83ca-1422ca0938cd.png"
            actionText="Shop Now"
            discountText="up to 20% off"
            onClick={() => window.location.href = "/browse?category=Outdoor"}
          />
          
          {/* Categories Grid */}
          <CategoryGrid categories={categories} />
          
          {/* Switchable Tabs */}
          <SwitchableTabs onTabChange={handleTabChange} />
          
          {/* Ramadan Essentials Section */}
          {isRamadan && (
            <ProductSection
              title="Ramadan essentials"
              emoji="🌙"
              products={ramadanProducts}
              viewAllLink="/browse?category=Ramadan"
              backgroundColor="#FFF6F1"
            />
          )}
          
          {/* ForYou or Popular Products based on active tab */}
          {activeTab === 'forYou' ? (
            <ProductSection
              title="Your Favorites"
              emoji="⭐"
              products={featuredProducts}
              viewAllLink="/browse?featured=true"
              backgroundColor="#F0F8FF"
            />
          ) : (
            <ProductSection
              title="Most Popular"
              emoji="🔥"
              products={popularProducts}
              viewAllLink="/browse?sort=popular"
              backgroundColor="#F0FFF4"
            />
          )}
          
          {/* Promotional Item Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <motion.div 
              className="bg-white rounded-xl overflow-hidden shadow-sm"
              whileHover={{ y: -5 }}
            >
              <div className="aspect-[4/3] relative">
                <img 
                  src="/lovable-uploads/8028e660-8690-4cb9-a7d3-0eb169394591.png" 
                  alt="Product" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Promo
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-xl">238 QR</h3>
                    <p className="text-gray-400 line-through">280 QR</p>
                    <p className="mt-1 font-medium">New Mini Smartphone</p>
                  </div>
                  <button className="bg-white border border-gray-200 text-black px-6 py-2 rounded-full font-medium hover:bg-gray-50 transition">
                    Add
                  </button>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl overflow-hidden shadow-sm"
              whileHover={{ y: -5 }}
            >
              <div className="aspect-[4/3] relative">
                <img 
                  src="/lovable-uploads/f052daba-ba6b-4375-9602-6e077f496a21.png" 
                  alt="Traveler" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-xl">12 QR</h3>
                    <p className="mt-1 font-medium">Qatar Traveler</p>
                  </div>
                  <button className="bg-white border border-gray-200 text-black px-6 py-2 rounded-full font-medium hover:bg-gray-50 transition">
                    Add
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      
      <BottomNavigation />
    </>
  );
};

export default Index;
