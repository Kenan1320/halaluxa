
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shop } from '@/types/database';
import { useTheme } from '@/context/ThemeContext';
import { useLocation as useRouterLocation } from 'react-router-dom';
import { useLocation } from '@/context/LocationContext';
import { calculateDistance } from '@/services/locationService';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import ShopPreviewCard from '@/components/map/ShopPreviewCard';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';

// Set Mapbox token - in production this should come from environment variables
mapboxgl.accessToken = 'pk.eyJ1IjoiaGFsdmlkZXYiLCJhIjoiY2xzOGRlc2QyMDRzbTJwcGJrMG41ZThzNSJ9.WkKwQp19QGHLpgB4XDqDow';

interface MapViewProps {
  shops: Shop[];
  isLoading: boolean;
}

const MapView: React.FC<MapViewProps> = ({ shops, isLoading }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [showShopList, setShowShopList] = useState(true);
  const { mode } = useTheme();
  const { location } = useLocation();
  const navigate = useNavigate();
  const routerLocation = useRouterLocation();

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Create map with default center or user location
    const userLocation = location?.coords ? 
      [location.coords.longitude, location.coords.latitude] : 
      [-74.006, 40.7128]; // Default NYC

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mode === 'dark' ? 
        'mapbox://styles/mapbox/dark-v11' : 
        'mapbox://styles/mapbox/light-v11',
      center: userLocation,
      zoom: 12
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
        showCompass: true
      }),
      'top-right'
    );

    // Add user location marker if available
    if (location?.coords) {
      new mapboxgl.Marker({ color: '#FF7A45' })
        .setLngLat([location.coords.longitude, location.coords.latitude])
        .addTo(map.current)
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setText('Your Location'));
    }

    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [location, mode]);

  // Update map style when theme changes
  useEffect(() => {
    if (!map.current) return;

    map.current.setStyle(
      mode === 'dark' ? 
        'mapbox://styles/mapbox/dark-v11' : 
        'mapbox://styles/mapbox/light-v11'
    );
  }, [mode]);

  // Add shop markers to map
  useEffect(() => {
    if (!map.current || isLoading || shops.length === 0) return;

    // Remove existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    // Create bounds to fit all markers
    const bounds = new mapboxgl.LngLatBounds();

    // Add markers for each shop
    shops.forEach(shop => {
      // Skip if no coordinates
      if (!shop.latitude || !shop.longitude) return;

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div class="p-2">
            <h3 class="font-medium">${shop.name}</h3>
            <p class="text-xs text-gray-500">${shop.category || 'Shop'}</p>
          </div>
        `);

      // Create marker
      const marker = new mapboxgl.Marker({ 
        color: '#2A866A'
      })
        .setLngLat([shop.longitude, shop.latitude])
        .setPopup(popup)
        .addTo(map.current!);

      // Add marker to refs
      markersRef.current[shop.id] = marker;

      // Add marker to bounds
      bounds.extend([shop.longitude, shop.latitude]);

      // Add click event to marker
      marker.getElement().addEventListener('click', () => {
        setSelectedShop(shop);
      });
    });

    // Fit map to bounds if we have markers
    if (!bounds.isEmpty()) {
      map.current.fitBounds(bounds, {
        padding: { top: 120, bottom: 200, left: 50, right: 50 },
        maxZoom: 15
      });
    }
  }, [shops, isLoading, map.current]);

  // Calculate shop distances
  const shopsWithDistance = shops.map(shop => {
    let distance = null;
    
    if (location?.coords && shop.latitude && shop.longitude) {
      distance = calculateDistance(
        location.coords.latitude,
        location.coords.longitude,
        shop.latitude,
        shop.longitude
      );
    }
    
    return {
      ...shop,
      distance: distance
    };
  })
  .sort((a, b) => {
    // Sort by distance if available, otherwise by name
    if (a.distance !== null && b.distance !== null) {
      return a.distance - b.distance;
    }
    return a.name.localeCompare(b.name);
  });

  // Format distance
  const formatDistance = (distance: number | null) => {
    if (distance === null) return 'Unknown distance';
    
    if (distance < 1) {
      // Convert to meters
      const meters = Math.round(distance * 1000);
      return `${meters} m`;
    }
    
    return `${distance.toFixed(1)} km`;
  };

  // Handle shop card click
  const handleShopClick = (shop: Shop) => {
    if (!map.current) return;
    
    // Center map on shop
    map.current.flyTo({
      center: [shop.longitude, shop.latitude],
      zoom: 15,
      duration: 1000
    });
    
    // Open marker popup
    const marker = markersRef.current[shop.id];
    if (marker) {
      marker.togglePopup();
    }
    
    // Set selected shop
    setSelectedShop(shop);
  };

  // Navigate to shop detail page
  const goToShopDetail = (shopId: string) => {
    navigate(`/shop/${shopId}`);
  };

  return (
    <div className="relative h-[calc(100vh-120px)]">
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Shop list overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: showShopList ? 0 : 260 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`rounded-t-xl shadow-lg ${mode === 'dark' ? 'bg-gray-900' : 'bg-white'}`}
        >
          <div 
            className="flex justify-center p-2 cursor-pointer"
            onClick={() => setShowShopList(!showShopList)}
          >
            {showShopList ? (
              <ChevronDown className="h-6 w-6 text-gray-400" />
            ) : (
              <ChevronUp className="h-6 w-6 text-gray-400" />
            )}
          </div>
          
          <div className="p-4">
            <h2 className="text-lg font-bold mb-4">
              Nearby Halal Stores
              {location?.city && (
                <span className="ml-1 font-normal text-sm text-gray-500">
                  in {location.city}
                </span>
              )}
            </h2>
            
            <ScrollArea className="h-[240px] pr-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {shopsWithDistance.map(shop => (
                  <div 
                    key={shop.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedShop?.id === shop.id 
                        ? (mode === 'dark' ? 'border-white bg-gray-800' : 'border-black bg-gray-100')
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    onClick={() => handleShopClick(shop)}
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden flex-shrink-0"
                        style={{ 
                          backgroundImage: shop.logo_url ? `url(${shop.logo_url})` : 'none',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{shop.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 truncate">
                          {shop.category || 'Shop'} • {shop.location || 'Location not available'}
                        </p>
                        
                        <div className="flex justify-between items-center">
                          {shop.distance !== null ? (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDistance(shop.distance)}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Distance unknown
                            </span>
                          )}
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 px-2 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              goToShopDetail(shop.id);
                            }}
                          >
                            Visit
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {shopsWithDistance.length === 0 && (
                  <div className="col-span-2 py-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      No halal shops found in this area.
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </motion.div>
      </div>
      
      {/* Selected shop card */}
      {selectedShop && (
        <div className="absolute top-4 left-0 right-0 flex justify-center px-4 z-10">
          <ShopPreviewCard 
            shop={selectedShop} 
            onClose={() => setSelectedShop(null)}
            onViewShop={() => goToShopDetail(selectedShop.id)}
          />
        </div>
      )}
    </div>
  );
};

export default MapView;
