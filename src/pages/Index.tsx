
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Footer from '@/components/layout/Footer';
import SearchBar from '@/components/home/SearchBar';
import CategoryScroll from '@/components/home/CategoryScroll';
import ProductGrid from '@/components/home/ProductGrid';
import NearbyShops from '@/components/home/NearbyShops';
import { ArrowRight, Building, ShoppingBag, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { isLoggedIn, user } = useAuth();
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-16 pb-0 bg-background dark:bg-[#0d1b2a]">
      {/* Search bar header section */}
      <section className="relative py-6 md:py-8 overflow-hidden border-b border-border">
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
      
      {/* Featured Categories */}
      <section className="py-8 bg-background dark:bg-[#0d1b2a]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold mb-2">Shop by Category</h2>
            <p className="text-muted-foreground">Discover products from various halal categories</p>
          </div>
          
          <CategoryScroll />
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-10 bg-secondary/50 dark:bg-[#1b263b]/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold">Featured Products</h2>
            <Link to="/browse" className="text-primary hover:underline flex items-center dark:text-primary dark:hover:text-primary/90">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <ProductGrid />
        </div>
      </section>
      
      {/* Nearby Shops */}
      <section className="py-10 bg-background dark:bg-[#0d1b2a]">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold">Nearby Shops</h2>
            <Link to="/shops" className="text-primary hover:underline flex items-center dark:text-primary dark:hover:text-primary/90">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <NearbyShops />
        </div>
      </section>
      
      {/* Why Choose Halvi */}
      <section className="py-10 bg-secondary/50 dark:bg-[#1b263b]/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-2xl font-bold mb-2">Why Choose Halvi</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your trusted marketplace for discovering and supporting halal businesses in your community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              className="bg-card p-6 rounded-lg shadow-sm dark:shadow-md dark:shadow-primary/5"
              whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 dark:bg-primary/20">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Verified Businesses</h3>
              <p className="text-muted-foreground">All businesses on our platform are verified to ensure authenticity and quality.</p>
            </motion.div>
            
            <motion.div 
              className="bg-card p-6 rounded-lg shadow-sm dark:shadow-md dark:shadow-primary/5"
              whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 dark:bg-primary/20">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Halal Certified</h3>
              <p className="text-muted-foreground">Shop with confidence knowing all products meet halal standards and requirements.</p>
            </motion.div>
            
            <motion.div 
              className="bg-card p-6 rounded-lg shadow-sm dark:shadow-md dark:shadow-primary/5"
              whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 dark:bg-primary/20">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Community Focused</h3>
              <p className="text-muted-foreground">Supporting local businesses strengthens our community and economy.</p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Become a Seller CTA */}
      {!isLoggedIn && (
        <section className="py-10 bg-primary text-primary-foreground dark:bg-primary/90">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-xl md:text-2xl font-bold mb-4">Join The Halal Village</h2>
            <p className="max-w-2xl mx-auto mb-6">
              Are you a halal business owner? Join our platform and connect with customers looking for your products and services.
            </p>
            <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-primary dark:border-primary-foreground dark:text-primary-foreground dark:hover:bg-primary-foreground dark:hover:text-primary">
              <Link to="/signup" className="flex items-center">
                <Store className="mr-2 h-5 w-5" />
                Become a Seller
              </Link>
            </Button>
          </div>
        </section>
      )}
      
      <Footer />
    </div>
  );
};

export default Index;
