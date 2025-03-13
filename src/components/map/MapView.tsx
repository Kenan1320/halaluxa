
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useTheme } from '@/context/ThemeContext';
import { Shop } from '@/types/database';
import { useLocation } from '@/context/LocationContext';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Store, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import ShopPreviewCard from './ShopPreviewCard';

// Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiaGFsdmktbWFwIiwiYSI6ImNsczJicnlmZDFjZ2oyamx0dXJwbmdidzcifQ.3mj5Q-SExIbNmKzDnFSZjQ';

interface MapViewProps {
  shops?: Shop[];
  isLoading?: boolean;
}

const MapView: React.FC<MapViewProps> = ({ shops = [], isLoading = false }) => {
  const { mode } = useTheme();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const { isLocationEnabled, enableLocation, location } = useLocation();
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredShops, setFilteredShops] = useState<Shop[]>(shops);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  
  // Define available categories
  const categories = ['Restaurant', 'Grocery', 'Meat Shop', 'Bakery', 'Cafe'];
  
  // Filter shops based on search query and category
  useEffect(() => {
    let filtered = shops;
    
    if (searchQuery) {
      filtered = filtered.filter(shop => 
        shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (categoryFilter) {
      filtered = filtered.filter(shop => 
        shop.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }
    
    setFilteredShops(filtered);
  }, [searchQuery, shops, categoryFilter]);

  // Initialize map
  useEffect(() => {
    if (map.current || !mapContainer.current) return;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mode === 'dark' 
        ? 'mapbox://styles/mapbox/dark-v11' 
        : 'mapbox://styles/mapbox/light-v11',
      center: location ? [location.coords.longitude, location.coords.latitude] : [-74.5, 40],
      zoom: 11,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    }));

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      map.current?.remove();
      map.current = null;
    };
  }, [mode]);

  // Update map when location changes
  useEffect(() => {
    if (!map.current || !location) return;
    
    map.current.flyTo({
      center: [location.coords.longitude, location.coords.latitude],
      zoom: 13,
      essential: true
    });
  }, [location]);

  // Add markers for shops
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    
    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add markers for filtered shops
    filteredShops.forEach(shop => {
      if (!shop.latitude || !shop.longitude) return;
      
      // Create marker element
      const el = document.createElement('div');
      el.className = 'shop-marker';
      el.innerHTML = `<div class="w-8 h-8 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform cursor-pointer">
        <div class="w-6 h-6 bg-[#2A866A] rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
      </div>`;

      // Add marker to map
      const marker = new mapboxgl.Marker(el)
        .setLngLat([shop.longitude, shop.latitude])
        .addTo(map.current!);
      
      // Add click event listener
      el.addEventListener('click', () => {
        setSelectedShop(shop);
        
        // Fly to shop location
        map.current?.flyTo({
          center: [shop.longitude, shop.latitude],
          zoom: 15,
          essential: true
        });
      });
      
      markers.current.push(marker);
    });
  }, [filteredShops, mapLoaded, mode]);

  // Handle request location
  const handleRequestLocation = async () => {
    if (!isLocationEnabled) {
      await enableLocation();
    }
  };

  // Handle category filter
  const handleCategoryFilter = (category: string) => {
    setCategoryFilter(categoryFilter === category ? null : category);
  };

  // Close shop preview
  const closeShopPreview = () => {
    setSelectedShop(null);
  };

  return (
    <div className="relative w-full h-screen">
      {/* Map container */}
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Search panel */}
      <div className="absolute top-4 left-0 right-0 mx-auto max-w-md px-4 z-10">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search stores, products, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-gray-100 dark:bg-gray-700"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          {/* Category filters */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <Button
                key={category}
                variant={categoryFilter === category ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryFilter(category)}
                className={`whitespace-nowrap ${
                  categoryFilter === category 
                    ? "bg-[#2A866A] hover:bg-[#1f6e55]" 
                    : ""
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Location request banner */}
      {!isLocationEnabled && (
        <div className="absolute top-24 left-0 right-0 mx-auto max-w-md px-4 z-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 border border-amber-300 dark:border-amber-600 rounded-lg shadow-lg p-3 flex items-center"
          >
            <MapPin className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
            <p className="text-sm flex-grow">Enable location services to find shops near you</p>
            <Button 
              size="sm" 
              onClick={handleRequestLocation}
              className="bg-amber-500 hover:bg-amber-600 text-white ml-2"
            >
              Enable
            </Button>
          </motion.div>
        </div>
      )}
      
      {/* Bottom panel with nearby shops */}
      <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg rounded-t-2xl p-4 z-10">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-lg">Nearby Shops</h2>
          <Link to="/shops" className="text-[#2A866A] text-sm font-medium">
            See All
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-40 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse flex-shrink-0" />
            ))}
          </div>
        ) : filteredShops.length > 0 ? (
          <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
            {filteredShops.slice(0, 10).map((shop) => (
              <div
                key={shop.id}
                onClick={() => setSelectedShop(shop)}
                className="w-40 flex-shrink-0 cursor-pointer"
              >
                <div className="h-24 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden relative">
                  {shop.cover_image ? (
                    <img 
                      src={shop.cover_image} 
                      alt={shop.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Store className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                    <span className="text-white text-xs font-medium truncate w-full">
                      {shop.name}
                    </span>
                  </div>
                </div>
                <div className="mt-1">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-1" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {shop.distance ? `${shop.distance.toFixed(1)} mi` : 'Nearby'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center">
            <Store className="h-10 w-10 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-400">No shops found in this area</p>
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={() => {
                setCategoryFilter(null);
                setSearchQuery('');
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
      
      {/* Selected shop preview */}
      <AnimatePresence>
        {selectedShop && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute top-1/4 left-0 right-0 mx-auto max-w-sm px-4 z-20"
          >
            <ShopPreviewCard shop={selectedShop} onClose={closeShopPreview} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MapView;
