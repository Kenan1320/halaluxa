
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Store, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLocationHook } from '@/context/LocationContext';
import { getShops } from '@/services/shopService';
import { cn } from '@/lib/utils';

const Browse = () => {
  const [shops, setShops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { location } = useLocationHook();
  
  useEffect(() => {
    const loadShops = async () => {
      setIsLoading(true);
      try {
        const shopsData = await getShops();
        setShops(shopsData);
      } catch (error) {
        console.error('Error loading shops:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadShops();
  }, []);
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };
  
  const logoVariant = {
    hidden: { scale: 0.8, opacity: 0 },
    show: { 
      scale: 1, 
      opacity: 1, 
      transition: { 
        duration: 0.5, 
        delay: 0.2,
        ease: [0.22, 1, 0.36, 1]
      } 
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-serif font-bold mb-4 text-center">Browse Shops</h1>
        
        <div className="animate-pulse bg-gray-100 rounded-lg p-4 max-w-lg mx-auto mb-8 flex items-center justify-center h-14">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="animate-pulse bg-white shadow-sm rounded-xl p-4 flex flex-col items-center h-48">
              <div className="rounded-full bg-gray-200 h-20 w-20 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-16">
      <motion.h1 
        className="text-3xl font-serif font-bold mb-4 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        Browse Shops
      </motion.h1>
      
      {location && location.city && (
        <motion.div 
          className="bg-haluna-primary-light rounded-lg p-4 max-w-lg mx-auto mb-8 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-haluna-primary flex items-center justify-center gap-2">
            <MapPin className="h-4 w-4" />
            Showing shops near {location.city}, {location.state}
          </p>
        </motion.div>
      )}
      
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {shops.map((shop, index) => (
          <motion.div
            key={shop.id}
            variants={item}
            className="bg-white shadow-sm hover:shadow-md rounded-xl overflow-hidden transition-all duration-300"
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Link to={`/shop/${shop.id}`} className="p-6 flex flex-col items-center">
              <motion.div 
                className="h-20 w-20 mb-4 rounded-full bg-haluna-primary-light flex items-center justify-center overflow-hidden"
                variants={logoVariant}
                whileHover={{ 
                  rotate: [0, -5, 5, -5, 0],
                  transition: { duration: 0.5 }
                }}
              >
                {shop.logo ? (
                  <img 
                    src={shop.logo} 
                    alt={`${shop.name} logo`} 
                    className="w-full h-full object-contain p-2"
                    loading="lazy"
                  />
                ) : (
                  <Store className="h-10 w-10 text-haluna-primary" />
                )}
              </motion.div>
              
              <h3 className={cn(
                "text-center font-medium text-lg mb-1",
                !shop.logo && "mt-2"
              )}>
                {shop.name}
              </h3>
              
              {shop.distance && (
                <span className="text-xs px-2 py-0.5 bg-gray-100 text-haluna-text-light rounded-full">
                  {shop.distance.toFixed(1)} miles
                </span>
              )}
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Browse;
