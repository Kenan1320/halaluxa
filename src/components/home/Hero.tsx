
import { ArrowRight, LogIn, UserPlus, Store, Search, MapPin } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from '@/context/LocationContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
  const { isLoggedIn, user } = useAuth();
  const { isLocationEnabled, location, requestLocation } = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
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
              The Premier <span className="text-haluna-primary">Halal</span> Marketplace
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
                href="/browse" 
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
          
          {/* Featured Image */}
          <div className="lg:w-1/2 relative">
            <motion.div 
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <img 
                src="/lovable-uploads/0c423741-0711-4e97-8c56-ca4fe31dc6ca.png" 
                alt="Halal marketplace" 
                className="w-full h-auto"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h3 className="text-white text-xl font-serif font-bold mb-2">Discover Authentic Halal Products</h3>
                <p className="text-white/80 mb-4">From local sellers committed to quality and tradition</p>
                <Button 
                  href="/shop"
                  size="sm"
                  className="bg-white text-haluna-primary hover:bg-gray-100"
                >
                  Start Shopping <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
