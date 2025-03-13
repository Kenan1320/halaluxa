
import React, { useEffect, useState } from 'react';
import { useLocation } from '@/context/LocationContext';
import { getAllShops } from '@/services/shopService';
import { Shop } from '@/types/database';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { SearchIcon, Map as MapIcon, MapPin, Store, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Helmet } from 'react-helmet';
import MapView from '@/components/map/MapView';
import { motion } from 'framer-motion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const MapPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [shops, setShops] = useState<Shop[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredShops, setFilteredShops] = useState<Shop[]>([]);
  const [filterType, setFilterType] = useState('all');
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

  // Filter shops when search query or filter type changes
  useEffect(() => {
    let filtered = [...shops];
    
    // Apply type filter first, but check if the properties exist before filtering
    if (filterType === 'delivery') {
      filtered = filtered.filter(shop => 
        shop.hasOwnProperty('delivery_available') ? shop.delivery_available : false
      );
    } else if (filterType === 'pickup') {
      filtered = filtered.filter(shop => 
        shop.hasOwnProperty('pickup_available') ? shop.pickup_available : false
      );
    }
    
    // Then apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        shop => 
          shop.name.toLowerCase().includes(query) || 
          shop.category?.toLowerCase().includes(query) ||
          shop.description?.toLowerCase().includes(query) ||
          shop.location?.toLowerCase().includes(query)
      );
    }
    
    setFilteredShops(filtered);
  }, [searchQuery, shops, filterType]);

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
        <title>Live Updates | Halvi</title>
      </Helmet>
      
      <div className="relative min-h-screen pb-16">
        {/* Header with title */}
        <div className="fixed top-16 left-0 right-0 z-10 bg-white dark:bg-gray-900 pt-4 px-4 shadow-md">
          <div className="max-w-xl mx-auto">
            <div className="flex items-center mb-4">
              <MapIcon className="h-6 w-6 mr-2 text-[#2A866A]" />
              <h1 className="text-xl font-bold">Live Updates</h1>
            </div>
            
            {/* Search and filter section */}
            <div className="flex flex-col gap-3 pb-3">
              <div className="flex gap-2">
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
                    className="bg-white dark:bg-gray-800"
                  >
                    <MapPin className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="flex items-center justify-start space-x-2">
                <RadioGroup 
                  defaultValue="all" 
                  value={filterType}
                  onValueChange={setFilterType}
                  className="flex space-x-2"
                >
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="all" id="all" className="h-3 w-3" />
                    <Label htmlFor="all" className="text-xs cursor-pointer">All Shops</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="delivery" id="delivery" className="h-3 w-3" />
                    <Label htmlFor="delivery" className="text-xs cursor-pointer">Delivery Only</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="pickup" id="pickup" className="h-3 w-3" />
                    <Label htmlFor="pickup" className="text-xs cursor-pointer">Pickup Only</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-full pt-48">
            <div className="space-y-4 w-full max-w-md px-4">
              <div className="flex items-center space-x-2 mb-4">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-6 w-40" />
              </div>
              <Skeleton className="h-10 w-full rounded-lg mb-2" />
              <Skeleton className="h-4 w-full rounded-lg mb-6" />
              <Skeleton className="h-[60vh] w-full rounded-xl" />
              <div className="flex space-x-4">
                <Skeleton className="h-20 w-1/3 rounded-lg" />
                <Skeleton className="h-20 w-1/3 rounded-lg" />
                <Skeleton className="h-20 w-1/3 rounded-lg" />
              </div>
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="pt-40"
          >
            <MapView shops={filteredShops} isLoading={isLoading} />
          </motion.div>
        )}
      </div>
    </>
  );
};

export default MapPage;
