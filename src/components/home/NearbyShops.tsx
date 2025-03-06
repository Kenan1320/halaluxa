
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from '@/context/LocationContext';
import { Link } from 'react-router-dom';
import { Store, MapPin } from 'lucide-react';

const NearbyShops = () => {
  const { isLocationEnabled, location, getNearbyShops, requestLocation } = useLocation();
  const [shops, setShops] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadShops = async () => {
      if (isLocationEnabled) {
        try {
          const nearbyShops = await getNearbyShops();
          setShops(nearbyShops.slice(0, 4)); // Show top 4 shops
        } catch (error) {
          console.error('Error loading shops:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    
    loadShops();
  }, [isLocationEnabled, getNearbyShops]);
  
  const getShopGradient = (index: number) => {
    const gradients = [
      'linear-gradient(135deg, #6366F1, #8B5CF6)',
      'linear-gradient(135deg, #10B981, #059669)',
      'linear-gradient(135deg, #F59E0B, #D97706)',
      'linear-gradient(135deg, #EF4444, #DC2626)',
      'linear-gradient(135deg, #EC4899, #DB2777)',
      'linear-gradient(135deg, #3B82F6, #2563EB)',
    ];
    
    return gradients[index % gradients.length];
  };
  
  if (isLoading) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Nearby Shops</h2>
        <div className="overflow-hidden">
          <div className="flex space-x-4 py-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-64 h-48 flex-shrink-0 rounded-xl bg-gray-200 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (!isLocationEnabled) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Nearby Shops</h2>
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <MapPin className="mx-auto h-10 w-10 text-gray-300 mb-2" />
          <h3 className="text-lg font-medium mb-2">Enable location to see nearby shops</h3>
          <p className="text-gray-500 mb-4">Discover Muslim-owned businesses in your area</p>
          <button
            onClick={requestLocation}
            className="bg-orange-400 text-white px-4 py-2 rounded-lg hover:bg-orange-500 transition"
          >
            Enable Location
          </button>
        </div>
      </div>
    );
  }
  
  if (shops.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Nearby Shops</h2>
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <Store className="mx-auto h-10 w-10 text-gray-300 mb-2" />
          <h3 className="text-lg font-medium mb-2">No shops found nearby</h3>
          <p className="text-gray-500 mb-4">Try exploring all shops instead</p>
          <Link
            to="/shops"
            className="bg-orange-400 text-white px-4 py-2 rounded-lg hover:bg-orange-500 transition inline-block"
          >
            View All Shops
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          Shops Near {location?.city || 'You'}
        </h2>
        <Link 
          to="/shops" 
          className="text-[#3a9e7e] text-sm font-medium hover:underline"
        >
          View All
        </Link>
      </div>
      
      <div className="relative overflow-hidden">
        <motion.div 
          className="flex space-x-4 py-2"
          animate={{ x: [-20, 0] }}
          transition={{ 
            repeat: Infinity, 
            repeatType: "mirror", 
            duration: 25,
            ease: "linear"
          }}
        >
          {shops.map((shop, index) => (
            <motion.div
              key={shop.id}
              className="relative w-64 h-48 flex-shrink-0 rounded-xl overflow-hidden shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              {/* Background gradient with animation */}
              <motion.div 
                className="absolute inset-0 z-0"
                style={{ background: getShopGradient(index) }}
                animate={{ 
                  background: [
                    getShopGradient(index),
                    getShopGradient((index + 2) % 6),
                    getShopGradient(index)
                  ] 
                }}
                transition={{ 
                  duration: 10, 
                  repeat: Infinity,
                  repeatType: "mirror"
                }}
              />
              
              <Link to={`/shop/${shop.id}`} className="block relative z-10 h-full">
                <div className="p-5 flex flex-col h-full text-white">
                  <div className="mb-4">
                    {shop.logo ? (
                      <img 
                        src={shop.logo} 
                        alt={shop.name} 
                        className="w-14 h-14 object-cover rounded-full bg-white p-1"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-white/30 flex items-center justify-center">
                        <Store className="h-7 w-7 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-1 truncate">{shop.name}</h3>
                  <p className="text-white/90 text-sm line-clamp-2 mb-2">{shop.description}</p>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <div className="text-sm text-white/90">
                      {shop.distance && (
                        <span>{shop.distance.toFixed(1)} miles away</span>
                      )}
                    </div>
                    
                    {shop.isVerified && (
                      <span className="bg-white/30 text-white text-xs px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
          
          {/* Repeat the first set of shops to create a seamless loop effect */}
          {shops.map((shop, index) => (
            <motion.div
              key={`repeat-${shop.id}`}
              className="relative w-64 h-48 flex-shrink-0 rounded-xl overflow-hidden shadow-lg"
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <motion.div 
                className="absolute inset-0 z-0"
                style={{ background: getShopGradient(index + shops.length) }}
                animate={{ 
                  background: [
                    getShopGradient(index + shops.length),
                    getShopGradient((index + 2) % 6 + shops.length),
                    getShopGradient(index + shops.length)
                  ] 
                }}
                transition={{ 
                  duration: 10, 
                  repeat: Infinity,
                  repeatType: "mirror"
                }}
              />
              
              <Link to={`/shop/${shop.id}`} className="block relative z-10 h-full">
                <div className="p-5 flex flex-col h-full text-white">
                  <div className="mb-4">
                    {shop.logo ? (
                      <img 
                        src={shop.logo} 
                        alt={shop.name} 
                        className="w-14 h-14 object-cover rounded-full bg-white p-1"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-white/30 flex items-center justify-center">
                        <Store className="h-7 w-7 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-1 truncate">{shop.name}</h3>
                  <p className="text-white/90 text-sm line-clamp-2 mb-2">{shop.description}</p>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <div className="text-sm text-white/90">
                      {shop.distance && (
                        <span>{shop.distance.toFixed(1)} miles away</span>
                      )}
                    </div>
                    
                    {shop.isVerified && (
                      <span className="bg-white/30 text-white text-xs px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default NearbyShops;
