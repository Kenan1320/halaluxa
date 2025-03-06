
import { ArrowRight, LogIn, UserPlus, Store, Search, MapPin } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from '@/context/LocationContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ShopCard from '../shop/ShopCard';

const Hero = () => {
  const { isLoggedIn, user } = useAuth();
  const { isLocationEnabled, location, requestLocation, getNearbyShops } = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredShop, setFeaturedShop] = useState<any>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadFeaturedShop = async () => {
      if (isLocationEnabled) {
        try {
          const shops = await getNearbyShops();
          if (shops && shops.length > 0) {
            setFeaturedShop(shops[0]);
          }
        } catch (error) {
          console.error('Error loading featured shop:', error);
        }
      }
    };
    
    loadFeaturedShop();
  }, [isLocationEnabled, getNearbyShops]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/browse?search=${searchTerm}`);
  };
  
  return (
    <section className="pt-28 pb-20 md:pt-36 md:pb-28 bg-gradient-to-b from-haluna-primary-light to-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Text Content */}
          <div className="lg:w-1/2 mb-12 lg:mb-0 text-center lg:text-left">
            <span className="inline-block px-4 py-1 rounded-full bg-haluna-accent text-haluna-text text-sm font-medium mb-4 animate-fade-in">
              Shop Muslim Businesses and Shops
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6 animate-fade-in animate-delay-100">
              Find your <span className="text-haluna-primary">Local Shop</span> & Beyond
            </h1>
            <p className="text-haluna-text-light text-lg md:text-xl mb-8 max-w-2xl mx-auto lg:mx-0 animate-fade-in animate-delay-200">
              Connect with authentic Muslim businesses and discover ethically sourced products that align with your values.
            </p>
            
            {/* Search Bar */}
            <motion.div
              className="mb-8 relative max-w-xl mx-auto lg:mx-0"
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
            
            {/* Location Button */}
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {isLocationEnabled ? (
                <div className="inline-flex items-center justify-center gap-2 text-haluna-primary bg-haluna-primary-light/50 py-2 px-4 rounded-full">
                  <MapPin className="h-4 w-4" />
                  <span>
                    Showing shops near {location?.city || 'your location'}
                  </span>
                </div>
              ) : (
                <Button 
                  onClick={requestLocation}
                  className="group relative overflow-hidden bg-gradient-to-r from-haluna-primary to-purple-600 hover:from-purple-600 hover:to-haluna-primary transition-all duration-500 shadow-lg hover:shadow-xl"
                >
                  <div className="absolute inset-0 bg-white/20 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                  <div className="flex items-center relative z-10">
                    <MapPin className="mr-2 h-5 w-5" />
                    <span>Enable Location</span>
                  </div>
                </Button>
              )}
            </motion.div>
            
            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <Button 
                href="/shops" 
                size="lg" 
                className="flex items-center"
              >
                <Store className="mr-2 h-5 w-5" />
                Browse Shops
              </Button>
              
              {!isLoggedIn && (
                <>
                  <Button href="/signup" variant="outline" size="lg" className="flex items-center">
                    <UserPlus className="mr-2 h-5 w-5" />
                    Sign Up
                  </Button>
                  
                  <Button href="/login" variant="ghost" size="lg" className="flex items-center">
                    <LogIn className="mr-2 h-5 w-5" />
                    Log In
                  </Button>
                </>
              )}
            </motion.div>
            
            <div className="mt-10 grid grid-cols-3 gap-8 max-w-lg mx-auto lg:mx-0 animate-fade-in animate-delay-400">
              <div className="text-center">
                <p className="text-3xl font-serif font-bold text-haluna-primary">250+</p>
                <p className="text-haluna-text-light text-sm">Muslim Sellers</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-serif font-bold text-haluna-primary">2,500+</p>
                <p className="text-haluna-text-light text-sm">Halal Products</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-serif font-bold text-haluna-primary">10,000+</p>
                <p className="text-haluna-text-light text-sm">Happy Customers</p>
              </div>
            </div>
          </div>
          
          {/* Featured Shop */}
          <div className="lg:w-1/2 relative">
            {featuredShop ? (
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
              >
                <ShopCard shop={featuredShop} index={0} featured={true} />
              </motion.div>
            ) : (
              <motion.div 
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
              >
                <div className="h-80 bg-gradient-to-r from-haluna-primary-light to-purple-100 flex items-center justify-center">
                  <div className="text-center p-8">
                    <Store className="h-16 w-16 text-haluna-primary mx-auto mb-4" />
                    <h3 className="text-2xl font-serif font-bold mb-2">Discover Local Muslim Shops</h3>
                    <p className="text-haluna-text-light mb-6">
                      {isLocationEnabled 
                        ? "We're finding shops near you..."
                        : "Enable location to find shops in your area"}
                    </p>
                    {!isLocationEnabled && (
                      <Button 
                        onClick={requestLocation}
                        className="bg-white text-haluna-primary hover:bg-gray-100"
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        Enable Location
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
