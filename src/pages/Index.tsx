
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from '@/context/LocationContext';
import BottomNavigation from '@/components/layout/BottomNavigation';
import Footer from '@/components/layout/Footer';
import SearchBar from '@/components/home/SearchBar';
import LocationBar from '@/components/home/LocationBar';
import CategoryScroll from '@/components/home/CategoryScroll';
import ProductGrid from '@/components/home/ProductGrid';
import NearbyShops from '@/components/home/NearbyShops';
import { motion } from 'framer-motion';
import { Menu, ShoppingCart, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { isLoggedIn, user } = useAuth();
  const { isLocationEnabled, requestLocation } = useLocation();
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // We will automatically request location on first load
  useEffect(() => {
    if (!isLocationEnabled) {
      requestLocation();
    }
  }, [isLocationEnabled, requestLocation]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Amazon-style header */}
      <header className="bg-zinc-800 text-white py-2 px-4">
        <div className="container mx-auto flex items-center justify-between">
          {/* Menu and Logo */}
          <div className="flex items-center gap-4">
            <button className="p-2">
              <Menu className="h-6 w-6" />
            </button>
            
            <Link to="/" className="flex items-center gap-1">
              <span className="text-2xl font-bold bg-gradient-to-r from-zinc-700 to-haluna-primary bg-clip-text text-transparent">Haluna</span>
              <img src="/logo-smile.svg" alt="Haluna" className="h-6" />
            </Link>
          </div>
          
          {/* User and Cart */}
          <div className="flex items-center gap-4">
            {isLoggedIn && user ? (
              <div className="flex items-center gap-1">
                <span className="text-sm hidden md:inline">Hello, {user.name}</span>
                <User className="h-6 w-6" />
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-1">
                <span className="text-sm hidden md:inline">Sign in</span>
                <User className="h-6 w-6" />
              </Link>
            )}
            
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-orange-400" />
              <span className="absolute -top-2 -right-2 bg-orange-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Search area */}
      <div className="bg-zinc-700 py-3 px-4">
        <div className="container mx-auto space-y-2">
          <SearchBar />
          <LocationBar />
        </div>
      </div>
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-4">
        {/* Category Scroll */}
        <CategoryScroll />
        
        {/* Welcome message for logged in users */}
        {isLoggedIn && user && (
          <motion.div
            className="mt-6 mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-semibold">
              Hi, {user.name || 'Welcome back'}!
            </h2>
            <p className="text-gray-500">Discover products you'll love</p>
          </motion.div>
        )}
        
        {/* Featured Section */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Featured Products</h2>
          <ProductGrid />
        </section>
        
        {/* Nearby Shops */}
        <NearbyShops />
      </div>
      
      <Footer />
      <BottomNavigation />
    </div>
  );
};

export default Index;
