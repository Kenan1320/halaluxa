
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import SearchBar from '@/components/home/SearchBar';
import CategoryScroll from '@/components/home/CategoryScroll';
import NearbyShops from '@/components/home/NearbyShops';
import Footer from '@/components/layout/Footer';

const Index = () => {
  const { isLoggedIn, user } = useAuth();
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-16 pb-0 bg-background dark:bg-[#0d1b2a] black:bg-black">
      {/* Search bar header section - mint color extends down to include categories */}
      <section className="relative py-6 md:py-8 overflow-hidden bg-[#E4F5F0] dark:bg-gray-900 black:bg-black border-b border-border">
        <div className="container mx-auto px-4">
          {/* Search bar */}
          <motion.div 
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SearchBar />
          </motion.div>
        </div>
      </section>
      
      {/* Categories flowing right under search - still in mint color area */}
      <section className="py-4 bg-[#E4F5F0] dark:bg-gray-900 black:bg-black">
        <div className="container mx-auto px-4">
          <CategoryScroll />
        </div>
      </section>
      
      {/* Nearby Shops (right under categories) */}
      <section className="py-6 bg-background dark:bg-[#0d1b2a] black:bg-black">
        <div className="container mx-auto px-4">
          <NearbyShops />
        </div>
      </section>
    </div>
  );
};

export default Index;
