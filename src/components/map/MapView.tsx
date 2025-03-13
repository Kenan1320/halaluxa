
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
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, MapPin, Store, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Set Mapbox token from user's provided token
mapboxgl.accessToken = 'pk.eyJ1Ijoia2VuYW4yNSIsImEiOiJjbTg3czM3bmswaGd0MndvY2I1cjQyaTMwIn0.LXzq8OtO1sCTiuTmtFVZrA';

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
  const { location, requestLocation } = useLocation();
  const navigate = useNavigate();
  const routerLocation = useRouterLocation();
  const { toast } = useToast();

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
      center: userLocation as [number, number],
      zoom: 12,
      pitch: 40,
      bearing: 20,
      antialias: true
    });

    // Add 3D buildings and terrain for better visual appeal
    map.current.on('style.load', () => {
      if (!map.current) return;
      
      // Add 3D building layer
      const layers = map.current.getStyle().layers;
      
      // Find the first symbol layer in the map style
      let firstSymbolId;
      for (const layer of layers!) {
        if (layer.type === 'symbol') {
          firstSymbolId = layer.id;
          break;
        }
      }
      
      // Add 3D buildings if not already present
      if (!map.current.getLayer('3d-buildings')) {
        map.current.addLayer(
          {
            'id': '3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 14,
            'paint': {
              'fill-extrusion-color': mode === 'dark' ? '#242424' : '#aaa',
              'fill-extrusion-height': [
                'interpolate', ['linear'], ['zoom'],
                14, 0,
                16, ['get', 'height']
              ],
              'fill-extrusion-base': [
                'interpolate', ['linear'], ['zoom'],
                14, 0,
                16, ['get', 'min_height']
              ],
              'fill-extrusion-opacity': 0.7
            }
          },
          firstSymbolId
        );
      }
      
      // Add atmospheric fog effect for depth
      map.current.setFog({
        'color': mode === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'white',
        'high-color': mode === 'dark' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(200, 200, 225, 0.8)',
        'horizon-blend': 0.1,
        'space-color': mode === 'dark' ? 'rgba(0, 0, 0, 0.9)' : 'rgba(200, 220, 255, 1)',
        'star-intensity': mode === 'dark' ? 0.15 : 0
      });
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
      // Add pulsing dot for user location
      const el = document.createElement('div');
      el.className = 'user-location-marker';
      el.innerHTML = `
        <div class="marker-dot"></div>
        <div class="marker-pulse"></div>
      `;
      
      // Apply styles
      const style = document.createElement('style');
      style.innerHTML = `
        .user-location-marker {
          position: relative;
          width: 20px;
          height: 20px;
        }
        .marker-dot {
          position: absolute;
          top: 5px;
          left: 5px;
          width: 10px;
          height: 10px;
          background-color: #FF7A45;
          border-radius: 50%;
          z-index: 2;
        }
        .marker-pulse {
          position: absolute;
          top: 0;
          left: 0;
          width: 20px;
          height: 20px;
          background-color: rgba(255, 122, 69, 0.4);
          border-radius: 50%;
          z-index: 1;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% {
            transform: scale(0.5);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
      
      new mapboxgl.Marker(el)
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
    if (!map.current || isLoading) return;

    // Remove existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    // Create bounds to fit all markers
    const bounds = new mapboxgl.LngLatBounds();
    let hasValidShops = false;

    // Add markers for each shop
    shops.forEach(shop => {
      // Skip if no coordinates, but we'll still render the shop in the list
      if (!shop.latitude || !shop.longitude) return;
      
      hasValidShops = true;

      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'shop-marker';
      el.innerHTML = `
        <div class="marker-icon" style="background-color: #2A866A;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-store"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2v0"/><path d="M18 12v0a2 2 0 0 1-2-2v0"/><path d="M14 7v3a2 2 0 0 1-2 2v0"/><path d="M10 12v0a2 2 0 0 1-2-2v0"/><path d="M6 12v0a2 2 0 0 1-2-2v0"/></svg>
        </div>
        <div class="marker-shadow"></div>
      `;
      
      // Apply styles
      const style = document.createElement('style');
      style.innerHTML = `
        .shop-marker {
          position: relative;
          width: 40px;
          height: 40px;
        }
        .marker-icon {
          position: absolute;
          top: 0;
          left: 8px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #2A866A;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          border: 2px solid white;
          transition: transform 0.2s;
          z-index: 2;
        }
        .marker-shadow {
          position: absolute;
          top: 22px;
          left: 12px;
          width: 16px;
          height: 4px;
          border-radius: 50%;
          background: rgba(0,0,0,0.2);
          transform: translateY(5px);
          z-index: 1;
          filter: blur(2px);
        }
        .shop-marker:hover .marker-icon {
          transform: scale(1.15) translateY(-2px);
        }
        .shop-marker:hover .marker-shadow {
          transform: translateY(6px) scaleX(1.1);
          opacity: 0.7;
        }
      `;
      document.head.appendChild(style);

      // Create popup with rich content
      const popup = new mapboxgl.Popup({ 
        offset: 25,
        closeButton: false,
        maxWidth: '300px'
      }).setHTML(`
        <div class="p-3">
          <div class="flex items-center mb-2">
            ${shop.logo_url ? 
              `<img src="${shop.logo_url}" alt="${shop.name}" class="w-8 h-8 rounded-full mr-2 object-cover" />` : 
              `<div class="w-8 h-8 rounded-full mr-2 bg-[#2A866A] flex items-center justify-center text-white font-bold">${shop.name.charAt(0)}</div>`
            }
            <div>
              <h3 class="font-medium text-sm">${shop.name}</h3>
              <p class="text-xs text-gray-500">${shop.category || 'Halal Shop'}</p>
            </div>
          </div>
          ${shop.rating ? 
            `<div class="text-xs mb-2">
              <span class="bg-yellow-100 text-yellow-800 py-0.5 px-1 rounded text-xs inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" class="mr-0.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                ${shop.rating.toFixed(1)}
              </span>
            </div>` : ''
          }
          <p class="text-xs text-gray-600">${shop.description || 'Visit this halal shop for quality products'}</p>
          <div class="mt-2 flex justify-end">
            <button class="bg-[#2A866A] hover:bg-[#1f6e55] text-white text-xs py-1 px-2 rounded" 
              onclick="window.location.href='/shop/${shop.id}'">
              Visit Shop
            </button>
          </div>
        </div>
      `);

      // Create marker
      const marker = new mapboxgl.Marker(el)
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

    // If no valid shops with coordinates, center on user's location or default
    if (!hasValidShops && map.current) {
      if (location?.coords) {
        map.current.flyTo({
          center: [location.coords.longitude, location.coords.latitude],
          zoom: 12
        });
      } else {
        // Default view showing a wide area
        map.current.flyTo({
          center: [-95.7129, 37.0902], // Center of US
          zoom: 3
        });
      }
    }
    // Fit map to bounds if we have markers
    else if (!bounds.isEmpty() && map.current) {
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
    
    // Center map on shop if it has coordinates
    if (shop.latitude && shop.longitude) {
      map.current.flyTo({
        center: [shop.longitude, shop.latitude],
        zoom: 15,
        duration: 1000,
        pitch: 50,
        bearing: Math.random() * 60 - 30 // Random bearing for visual interest
      });
      
      // Open marker popup
      const marker = markersRef.current[shop.id];
      if (marker) {
        marker.togglePopup();
      }
    } else {
      // If shop doesn't have coordinates, show a message
      toast({
        title: "Shop location unavailable",
        description: "This shop hasn't provided their exact location yet.",
        variant: "default"
      });
    }
    
    // Set selected shop
    setSelectedShop(shop);
  };

  // Refresh user location
  const handleRefreshLocation = async () => {
    const success = await requestLocation();
    if (success && location?.coords && map.current) {
      map.current.flyTo({
        center: [location.coords.longitude, location.coords.latitude],
        zoom: 14,
        duration: 1000
      });
      
      toast({
        title: "Location updated",
        description: "Your location has been refreshed.",
      });
    }
  };

  // Navigate to shop detail page
  const goToShopDetail = (shopId: string) => {
    navigate(`/shop/${shopId}`);
  };

  return (
    <div className="relative h-[calc(100vh-120px)]">
      {/* Map container with decorative elements */}
      <div className="relative w-full h-full">
        <div ref={mapContainer} className="w-full h-full" />
        <div className="absolute inset-0 pointer-events-none border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden" />
        
        {/* Map overlay gradient for better readability */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/10 rounded-lg" />
        
        {/* Location refresh button */}
        <div className="absolute top-4 right-16 z-10">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
            onClick={handleRefreshLocation}
            title="Refresh location"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Shop list overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: showShopList ? 0 : 260 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`rounded-t-xl shadow-lg ${mode === 'dark' ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-sm border border-gray-200 dark:border-gray-800`}
        >
          <div 
            className="flex justify-center p-2 cursor-pointer"
            onClick={() => setShowShopList(!showShopList)}
          >
            <div className="w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
          </div>
          
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold flex items-center">
                <Store className="h-5 w-5 mr-2 text-[#2A866A]" />
                Halal Shops
                {location?.city && (
                  <span className="ml-1 font-normal text-sm text-gray-500">
                    in {location.city}
                  </span>
                )}
              </h2>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowShopList(!showShopList)}
                className="h-8 w-8 p-0"
              >
                {showShopList ? (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                )}
              </Button>
            </div>
            
            <ScrollArea className="h-[240px] pr-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {shopsWithDistance.length > 0 ? (
                  shopsWithDistance.map(shop => (
                    <motion.div 
                      key={shop.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                        selectedShop?.id === shop.id 
                          ? (mode === 'dark' ? 'border-white bg-gray-800' : 'border-black bg-gray-100')
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                      onClick={() => handleShopClick(shop)}
                    >
                      <div className="flex items-start gap-3">
                        <div 
                          className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden flex-shrink-0 border border-gray-200 dark:border-gray-700"
                          style={{ 
                            backgroundImage: shop.logo_url ? `url(${shop.logo_url})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        >
                          {!shop.logo_url && (
                            <div className="w-full h-full flex items-center justify-center bg-[#2A866A]/10 text-[#2A866A] font-bold">
                              {shop.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate flex items-center">
                            {shop.name}
                            {!shop.latitude && !shop.longitude && (
                              <span className="ml-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-xs px-1.5 py-0.5 rounded">
                                No location
                              </span>
                            )}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 truncate">
                            {shop.category || 'Shop'} • {shop.location || 'Location not available'}
                          </p>
                          
                          <div className="flex justify-between items-center">
                            {shop.distance !== null ? (
                              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                <MapPin className="h-3 w-3 mr-0.5" />
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
                              className="h-7 px-2 text-xs text-[#2A866A] hover:text-[#1f6e55] hover:bg-[#2A866A]/10"
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
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-2 py-8 text-center">
                    <Store className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-500 dark:text-gray-400">
                      No halal shops found in this area.
                    </p>
                    <p className="text-sm text-gray-400 max-w-xs mx-auto mt-1">
                      Try searching in a different area or check back later as more shops join Halvi.
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </motion.div>
      </div>
      
      {/* Selected shop card */}
      <AnimatePresence>
        {selectedShop && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-0 right-0 flex justify-center px-4 z-10"
          >
            <ShopPreviewCard 
              shop={selectedShop} 
              onClose={() => setSelectedShop(null)}
              onViewShop={() => goToShopDetail(selectedShop.id)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MapView;
