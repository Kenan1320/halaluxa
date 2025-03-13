
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Skeleton } from '@/components/ui/skeleton';
import { Shop } from '@/types/database';
import { mapboxConfig } from '@/lib/utils';
import { motion } from 'framer-motion';
import ShopPreviewCard from './ShopPreviewCard';
import { useLocation } from '@/context/LocationContext';

// Set Mapbox token
mapboxgl.accessToken = mapboxConfig.publicToken;

interface MapViewProps {
  shops: Shop[];
  isLoading: boolean;
  onShopSelect?: (shop: Shop) => void;
}

const MapView: React.FC<MapViewProps> = ({ shops, isLoading, onShopSelect }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { location } = useLocation();
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Default location (San Francisco)
    const defaultLocation = {
      lng: -122.4194,
      lat: 37.7749
    };

    // Use user's location if available, otherwise use default
    const initialLocation = location?.coords ? {
      lng: location.coords.longitude,
      lat: location.coords.latitude
    } : defaultLocation;

    // Create the map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapboxConfig.styles.streets,
      center: [initialLocation.lng, initialLocation.lat],
      zoom: 12,
      pitch: 30
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');

    // Add geolocate control
    const geolocateControl = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    });
    map.current.addControl(geolocateControl, 'top-right');

    // Mark map as loaded when it's ready
    map.current.on('load', () => {
      setMapLoaded(true);
      
      // Set 3D terrain and fog
      if (map.current) {
        // Add 3D buildings for better visual
        map.current.addLayer({
          'id': '3d-buildings',
          'source': 'composite',
          'source-layer': 'building',
          'filter': ['==', 'extrude', 'true'],
          'type': 'fill-extrusion',
          'minzoom': 15,
          'paint': {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': [
              'interpolate', ['linear'], ['zoom'],
              15, 0,
              15.05, ['get', 'height']
            ],
            'fill-extrusion-base': [
              'interpolate', ['linear'], ['zoom'],
              15, 0,
              15.05, ['get', 'min_height']
            ],
            'fill-extrusion-opacity': 0.6
          }
        });
        
        // Add atmospheric fog for depth effect
        map.current.setFog({
          'color': 'rgb(186, 210, 235)', // Light blue
          'high-color': 'rgb(36, 92, 223)', // Sky blue
          'horizon-blend': 0.02, // Lower value means less fog at the horizon
          'space-color': 'rgb(11, 11, 25)', // Dark blue/black
          'star-intensity': 0.6 // Stars brightness at night
        });
      }
    });

    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  // Add shop markers to the map
  useEffect(() => {
    if (!map.current || !mapLoaded || isLoading) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    if (shops.length === 0) {
      // If no shops, just return without adding markers
      return;
    }

    // Bounds for fitting map to all markers
    const bounds = new mapboxgl.LngLatBounds();

    // Add markers for each shop
    shops.forEach(shop => {
      // Skip if no latitude/longitude
      if (!shop.latitude || !shop.longitude) return;

      // Create a custom marker element
      const markerElement = document.createElement('div');
      markerElement.className = 'relative';

      const markerPin = document.createElement('div');
      markerPin.className = 'w-5 h-5 bg-[#2A866A] rounded-full flex items-center justify-center shadow-md border-2 border-white';
      
      // Append pin to the marker container
      markerElement.appendChild(markerPin);

      // Add a pulse effect if this is the selected shop
      if (selectedShop && selectedShop.id === shop.id) {
        const pulseRing = document.createElement('div');
        pulseRing.className = 'absolute top-0 left-0 w-5 h-5 bg-[#2A866A] rounded-full opacity-50 animate-ping';
        markerElement.appendChild(pulseRing);
      }

      // Create marker
      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([shop.longitude, shop.latitude])
        .addTo(map.current!);

      // Add click event to marker
      marker.getElement().addEventListener('click', () => {
        setSelectedShop(shop);
        if (onShopSelect) {
          onShopSelect(shop);
        }
      });

      // Store marker reference for later removal
      markersRef.current[shop.id] = marker;

      // Extend bounds to include this marker
      bounds.extend([shop.longitude, shop.latitude]);
    });

    // Only fit bounds if we have markers and more than one shop
    if (!bounds.isEmpty() && shops.length > 1) {
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    } else if (shops.length === 1 && shops[0].latitude && shops[0].longitude) {
      // If only one shop, center on it
      map.current.flyTo({
        center: [shops[0].longitude, shops[0].latitude],
        zoom: 14
      });
    }
  }, [shops, mapLoaded, isLoading, selectedShop, onShopSelect]);

  // Handle shop selection
  const handleShopClick = (shop: Shop) => {
    setSelectedShop(shop);
    
    if (onShopSelect) {
      onShopSelect(shop);
    }
    
    // Fly to the shop location
    if (map.current && shop.latitude && shop.longitude) {
      map.current.flyTo({
        center: [shop.longitude, shop.latitude],
        zoom: 16,
        pitch: 45,
        bearing: Math.random() * 60 - 30, // Random bearing for visual interest
        duration: 1500
      });
    }
  };

  return (
    <div className="relative w-full pb-6">
      {isLoading ? (
        <Skeleton className="h-[60vh] w-full rounded-xl mb-4" />
      ) : (
        <>
          <div 
            ref={mapContainer} 
            className="h-[60vh] w-full rounded-xl overflow-hidden shadow-lg mb-4"
          />
            
          {/* Shop cards row */}
          <div className="mt-4 overflow-x-auto scrollbar-none">
            <div className="flex space-x-3 pb-2 pl-1 pr-3">
              {shops.map(shop => (
                <motion.div 
                  key={shop.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="min-w-[260px] max-w-[260px]"
                >
                  <ShopPreviewCard 
                    shop={shop} 
                    isSelected={selectedShop?.id === shop.id}
                    onClick={() => handleShopClick(shop)}
                  />
                </motion.div>
              ))}
              
              {shops.length === 0 && (
                <div className="flex items-center justify-center w-full py-6">
                  <p className="text-gray-500 dark:text-gray-400 text-center">
                    No shops found matching your criteria. Try adjusting your filters.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MapView;
