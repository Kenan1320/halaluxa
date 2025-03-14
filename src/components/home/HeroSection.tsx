
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { Search, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLocation as useLocationContext } from '@/context/LocationContext';

const HeroSection: React.FC = () => {
  const { mode } = useTheme();
  const { requestLocation } = useLocationContext();
  const isDark = mode === 'dark';
  
  return (
    <div className={`relative w-full overflow-hidden ${isDark ? 'bg-gray-900' : 'bg-gradient-to-r from-green-50 to-blue-50'}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>
      
      <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl"
        >
          <h1 className={`text-3xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Discover Halal Shops & Products Near You
          </h1>
          <p className={`text-lg md:text-xl mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Browse local and online shops offering halal products, food, and services
          </p>
          
          {/* Search Bar */}
          <div className={`relative mx-auto max-w-xl mb-8 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-full shadow-lg p-1`}>
            <div className="flex items-center">
              <div className="flex-grow">
                <div className="relative">
                  <Search className={`absolute left-4 top-3 h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  <input
                    type="text"
                    placeholder="Search for shops or products..."
                    className={`w-full pl-12 pr-4 py-3 rounded-full outline-none ${
                      isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                    }`}
                  />
                </div>
              </div>
              <div>
                <Button
                  onClick={requestLocation}
                  className="ml-2 h-10 px-4 rounded-full flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  <MapPin className="h-4 w-4" />
                  <span className="hidden sm:inline">Near Me</span>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/map">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Explore Map
              </Button>
            </Link>
            <Link to="/shops">
              <Button size="lg" className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
                Browse All Shops
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
      
      {/* Wave SVG at bottom */}
      <div className={`absolute bottom-0 left-0 right-0 ${isDark ? 'text-gray-800' : 'text-white'}`}>
        <svg
          viewBox="0 0 1440 100"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0,50 C280,100 720,0 1440,50 L1440,100 L0,100 Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;
