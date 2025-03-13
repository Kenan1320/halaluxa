
import React, { useEffect, useState } from 'react';
import MapView from '@/components/map/MapView';
import { Shop } from '@/types/database';
import { getAllShops } from '@/services/shopService';
import { useLocation } from '@/context/LocationContext';
import { Skeleton } from '@/components/ui/skeleton';

const MapPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [shops, setShops] = useState<Shop[]>([]);
  const { getNearbyShops } = useLocation();

  useEffect(() => {
    const loadShops = async () => {
      setIsLoading(true);
      try {
        // Try to get nearby shops first
        const nearbyShops = await getNearbyShops();
        
        if (nearbyShops && nearbyShops.length > 0) {
          setShops(nearbyShops);
        } else {
          // Fallback to all shops
          const allShops = await getAllShops();
          setShops(allShops);
        }
      } catch (error) {
        console.error('Error loading shops for map:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadShops();
  }, [getNearbyShops]);

  return (
    <div className="relative h-screen">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="space-y-4 w-full max-w-md px-4">
            <Skeleton className="h-8 w-3/4 mx-auto" />
            <Skeleton className="h-[60vh] w-full rounded-xl" />
            <div className="flex space-x-4">
              <Skeleton className="h-20 w-28 rounded-lg" />
              <Skeleton className="h-20 w-28 rounded-lg" />
              <Skeleton className="h-20 w-28 rounded-lg" />
            </div>
          </div>
        </div>
      ) : (
        <MapView shops={shops} isLoading={isLoading} />
      )}
    </div>
  );
};

export default MapPage;
