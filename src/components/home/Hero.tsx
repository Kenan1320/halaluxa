
import { ArrowRight, LogIn, UserPlus, Store, Search, MapPin } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from '@/context/LocationContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
  const { isLoggedIn, user } = useAuth();
  const { isLocationEnabled, location, getNearbyShops } = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredShops, setFeaturedShops] = useState<any[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadFeaturedShops = async () => {
      try {
        const shops = await getNearbyShops();
        if (shops && shops.length > 0) {
          setFeaturedShops(shops.slice(0, 6));
        }
      } catch (error) {
        console.error('Error loading featured shops:', error);
      }
    };
    
    loadFeaturedShops();
  }, [getNearbyShops]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/browse?search=${searchTerm}`);
  };
  
  return (
    <section className="pt-28 pb-20 md:pt-36 md:pb-28 bg-gradient-to-b from-haluna-primary-light to-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center md:text-left md:max-w-3xl">
          {isLoggedIn && user && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-lg font-medium mb-4"
            >
              Hi, {user.name || 'Welcome back'}!
            </motion.p>
          )}
          
          <span className="inline-block px-4 py-1 rounded-full bg-haluna-accent text-haluna-text text-sm font-medium mb-4 animate-fade-in">
            Shop Muslim Businesses
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6 animate-fade-in animate-delay-100">
            Find your <span className="text-haluna-primary">Local Shop</span> & Beyond
          </h1>
          <p className="text-haluna-text-light text-lg md:text-xl mb-8 max-w-2xl mx-auto md:mx-0 animate-fade-in animate-delay-200">
            Connect with authentic Muslim businesses and discover ethically sourced products that align with your values.
          </p>
          
          {/* Search Bar */}
          <motion.div
            className="mb-8 relative max-w-xl mx-auto md:mx-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <form onSubmit={handleSearch} className="flex items-center shadow-lg rounded-full overflow-hidden">
              <input
                type="text"
                placeholder="Search shops and products..."
                className="flex-1 px-6 py-4 border-0 focus:ring-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="bg-haluna-primary text-white px-6 py-4 hover:bg-haluna-primary-dark transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>
          </motion.div>
          
          {/* Location Display */}
          {isLocationEnabled && location && (
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="inline-flex items-center justify-center gap-2 text-haluna-primary bg-haluna-primary-light/50 py-2 px-4 rounded-full">
                <MapPin className="h-4 w-4" />
                <span>
                  Showing shops near {location?.city || 'your location'}
                </span>
              </div>
            </motion.div>
          )}
          
          {/* Quick Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-4 justify-center md:justify-start"
          >
            <Button 
              to="/shops" 
              size="lg" 
              className="flex items-center"
            >
              <Store className="mr-2 h-5 w-5" />
              Browse Shops
            </Button>
            
            {!isLoggedIn && (
              <>
                <Button to="/signup" variant="outline" size="lg" className="flex items-center">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Sign Up
                </Button>
                
                <Button to="/login" variant="ghost" size="lg" className="flex items-center">
                  <LogIn className="mr-2 h-5 w-5" />
                  Log In
                </Button>
              </>
            )}
          </motion.div>
        </div>
        
        {/* Featured Shops */}
        <div className="mt-16">
          <h2 className="text-2xl font-serif font-bold mb-6">Featured Shops</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {featuredShops.length > 0 ? (
              featuredShops.map((shop) => (
                <motion.div
                  key={shop.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Button
                    to={`/shop/${shop.id}`}
                    variant="ghost"
                    className="w-full h-auto p-4 flex flex-col items-center gap-3 rounded-lg hover:bg-gray-50"
                  >
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                      {shop.logo ? (
                        <img src={shop.logo} alt={shop.name} className="w-full h-full object-cover" />
                      ) : (
                        <Store className="h-8 w-8 text-haluna-text-light" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-center line-clamp-2">{shop.name}</span>
                  </Button>
                </motion.div>
              ))
            ) : (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4 flex flex-col items-center gap-3 animate-pulse">
                  <div className="w-16 h-16 rounded-full bg-gray-200"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Popular Categories */}
        <div className="mt-16">
          <h2 className="text-2xl font-serif font-bold mb-6">Browse Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {['Groceries', 'Clothing', 'Home Essentials', 'Beauty', 'Electronics', 'Health', 'Books', 'Toys'].map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ scale: 1.03 }}
              >
                <Button
                  to={`/browse?category=${category}`}
                  variant="outline"
                  className="w-full h-20 flex items-center justify-center bg-white hover:bg-gray-50 text-haluna-text hover:text-haluna-primary border-gray-200"
                >
                  <span className="text-md font-medium">{category}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
