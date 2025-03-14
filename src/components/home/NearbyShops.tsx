
import React, { useState, useEffect } from 'react';
import { useLocation as useLocationContext } from '@/context/LocationContext';
import ShopCard from '@/components/shop/ShopCard';
import { getNearbyShops } from '@/services/shopService';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/context/ThemeContext';
import { Shop } from '@/models/shop';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

interface NearbyShopsProps {
  limit?: number;
}

const NearbyShops: React.FC<NearbyShopsProps> = ({ limit = 4 }) => {
  const { location, isLocationEnabled, requestLocation } = useLocationContext();
  const { toast } = useToast();
  const { mode } = useTheme();
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchNearbyShops = async () => {
      if (!isLocationEnabled || !location) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const { latitude, longitude } = location;
        
        if (latitude !== null && longitude !== null) {
          const nearbyShops = await getNearbyShops(latitude, longitude, 10);
          setShops(nearbyShops.slice(0, limit));
        }
      } catch (error) {
        console.error('Error fetching nearby shops:', error);
        toast({
          title: 'Error',
          description: 'Failed to load nearby shops',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchNearbyShops();
  }, [location, isLocationEnabled, toast, limit]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(limit)].map((_, i) => (
          <div 
            key={i} 
            className={`h-64 rounded-lg animate-pulse ${mode === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}
          ></div>
        ))}
      </div>
    );
  }

  if (!isLocationEnabled) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-8 text-center rounded-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
      >
        <MapPin className="h-12 w-12 mx-auto mb-4 text-green-600" />
        <h3 className={`text-lg font-medium mb-2 ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Enable Location Services
        </h3>
        <p className={`mb-4 ${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Allow location access to see shops near you.
        </p>
        <button
          onClick={requestLocation}
          className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white font-medium"
        >
          Enable Location
        </button>
      </motion.div>
    );
  }

  if (shops.length === 0) {
    return (
      <div className={`p-8 text-center rounded-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <p className={mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
          No shops found near your location.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {shops.map(shop => (
        <ShopCard key={shop.id} shop={shop} />
      ))}
    </div>
  );
};

export default NearbyShops;
