
import React, { useEffect, useState } from 'react';
import { useLocation } from '@/context/LocationContext';
import { getAllShops } from '@/services/shopService';
import { Shop } from '@/types/database';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { SearchIcon, Map, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Helmet } from 'react-helmet';
import MapView from '@/components/map/MapView';

const MapPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [shops, setShops] = useState<Shop[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredShops, setFilteredShops] = useState<Shop[]>([]);
  const { getNearbyShops, isLocationEnabled, requestLocation } = useLocation();

  useEffect(() => {
    const loadShops = async () => {
      setIsLoading(true);
      try {
        // Try to get nearby shops first
        const nearbyShops = await getNearbyShops();
        
        if (nearbyShops && nearbyShops.length > 0) {
          setShops(nearbyShops);
          setFilteredShops(nearbyShops);
        } else {
          // Fallback to all shops
          const allShops = await getAllShops();
          setShops(allShops);
          setFilteredShops(allShops);
        }
      } catch (error) {
        console.error('Error loading shops for map:', error);
        
        // Fallback to all shops on error
        try {
          const allShops = await getAllShops();
          setShops(allShops);
          setFilteredShops(allShops);
        } catch (fallbackError) {
          console.error('Error in fallback shops loading:', fallbackError);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadShops();
  }, [getNearbyShops]);

  // Filter shops when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredShops(shops);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = shops.filter(
      shop => 
        shop.name.toLowerCase().includes(query) || 
        shop.category?.toLowerCase().includes(query) ||
        shop.description?.toLowerCase().includes(query) ||
        shop.location?.toLowerCase().includes(query)
    );
    
    setFilteredShops(filtered);
  }, [searchQuery, shops]);

  // Handle location request
  const handleLocationRequest = async () => {
    await requestLocation();
    // Reload shops after location is enabled
    const nearbyShops = await getNearbyShops();
    if (nearbyShops && nearbyShops.length > 0) {
      setShops(nearbyShops);
      setFilteredShops(nearbyShops);
    }
  };

  return (
    <>
      <Helmet>
        <title>Shop Map | Halvi</title>
      </Helmet>
      
      <div className="relative min-h-screen pb-16">
        {/* Search bar and location request */}
        <div className="fixed top-16 left-0 right-0 z-10 bg-white dark:bg-gray-900 py-3 px-4 shadow-md">
          <div className="flex gap-2 max-w-xl mx-auto">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search shops, categories, or areas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            
            {!isLocationEnabled && (
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleLocationRequest}
                title="Use my location"
              >
                <MapPin className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-full pt-28">
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
          <div className="pt-24">
            <MapView shops={filteredShops} isLoading={isLoading} />
          </div>
        )}
      </div>
    </>
  );
};

export default MapPage;
