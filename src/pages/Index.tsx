
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import SearchBar from '@/components/home/SearchBar';
import CategoryScroll from '@/components/home/CategoryScroll';
import NearbyShops from '@/components/home/NearbyShops';

const Index = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-16 pb-0 bg-background dark:bg-[#0d1b2a] black:bg-black">
      {/* Search bar header section with more compact layout */}
      <section className="relative py-4 md:py-5 overflow-hidden mint-header border-b border-border">
        <div className="container mx-auto px-4">
          {/* Search bar */}
          <motion.div 
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SearchBar placeholderText="Search Halvi: Your Hal Village" rotatingTexts={[
              "Don't just shop—Halvi it! It's your Halvillage",
              "Are you Halvi-ing your Groceries today?",
              "You can Halvi & visit your online shops"
            ]} />
          </motion.div>
        </div>
      </section>
      
      {/* Categories flowing right under search - still in mint color area */}
      <section className="py-2 mint-header">
        <div className="container mx-auto px-4">
          <CategoryScroll />
        </div>
      </section>
      
      {/* Nearby Shops (right under categories) - reduced spacing */}
      <section className="pt-1 pb-4 bg-background dark:bg-[#0d1b2a] black:bg-black">
        <div className="container mx-auto px-4">
          <NearbyShops />
        </div>
      </section>
    </div>
  );
};

export default Index;
