
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
          setShops(nearbyShops.slice(0, 3)); // Show top 3 shops
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
  
  const getShopPrimaryColor = (shop: any) => {
    // This is a placeholder for a color extraction function
    // In a real app, you'd extract the dominant color from the shop's logo
    const shopColors: Record<string, string> = {
      1: 'bg-blue-500',
      2: 'bg-green-500',
      3: 'bg-orange-500',
      4: 'bg-purple-500',
      5: 'bg-pink-500',
      6: 'bg-yellow-500',
    };
    
    return shopColors[shop.id] || 'bg-gray-500';
  };
  
  if (isLoading) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Nearby Shops</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm h-40 animate-pulse">
              <div className="h-full bg-gray-200 rounded-lg"></div>
            </div>
          ))}
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
      <h2 className="text-xl font-semibold mb-4">
        Shops Near {location?.city || 'You'}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {shops.map((shop, index) => {
          const colorClass = getShopPrimaryColor(shop);
          
          return (
            <motion.div
              key={shop.id}
              className={`rounded-xl shadow-md overflow-hidden ${colorClass} text-white`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Link to={`/shop/${shop.id}`} className="block h-full">
                <div className="p-5 flex flex-col h-full">
                  <div className="mb-4">
                    {shop.logo ? (
                      <img 
                        src={shop.logo} 
                        alt={shop.name} 
                        className="w-16 h-16 object-cover rounded-full bg-white p-1"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                        <Store className="h-8 w-8 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-1">{shop.name}</h3>
                  <p className="text-white/80 text-sm line-clamp-2 mb-3">{shop.description}</p>
                  
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
          );
        })}
      </div>
    </div>
  );
};

export default NearbyShops;
