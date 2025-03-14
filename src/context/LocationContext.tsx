
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Shop } from '@/models/shop';
import { calculateDistance, initializeLocation } from '@/utils/locationUtils';
import { EnhancedLocation } from '@/models/types';
import { convertDBShopToShop } from '@/services/shopServiceHelpers';

interface LocationContextType {
  isLocationEnabled: boolean;
  location: EnhancedLocation | null;
  requestLocation: () => void;
  getNearbyShops: (maxDistance?: number) => Promise<Shop[]>;
  enableLocation?: () => void;
}

const LocationContext = createContext<LocationContextType>({
  isLocationEnabled: false,
  location: null,
  requestLocation: () => {},
  getNearbyShops: async () => [],
});

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLocationEnabled, setIsLocationEnabled] = useState<boolean>(false);
  const [location, setLocation] = useState<EnhancedLocation | null>(null);

  // Request location permission and get current position
  const requestLocation = useCallback(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(initializeLocation(latitude, longitude));
          setIsLocationEnabled(true);
          
          // Store location in localStorage for persistence
          localStorage.setItem('userLocation', JSON.stringify({ latitude, longitude }));
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLocationEnabled(false);
          
          // Fallback to stored location if available
          const storedLocation = localStorage.getItem('userLocation');
          if (storedLocation) {
            try {
              const parsedLocation = JSON.parse(storedLocation);
              setLocation(initializeLocation(parsedLocation.latitude, parsedLocation.longitude));
              setIsLocationEnabled(true);
            } catch (err) {
              console.error('Error parsing stored location:', err);
            }
          }
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setIsLocationEnabled(false);
    }
  }, []);

  // Enable location access
  const enableLocation = useCallback(() => {
    requestLocation();
  }, [requestLocation]);

  // Get shops near the user's location
  const getNearbyShops = useCallback(async (maxDistance: number = 50): Promise<Shop[]> => {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*');

      if (error) {
        console.error('Error fetching shops:', error);
        return [];
      }

      if (!data) return [];

      // If location is enabled, calculate distances and sort
      if (location && location.latitude && location.longitude) {
        return data
          .map((shop) => {
            // Calculate distance using Haversine formula
            const distance = calculateDistance(
              location.latitude,
              location.longitude,
              shop.latitude,
              shop.longitude
            );
            
            return {
              ...shop,
              distance: distance
            };
          })
          .filter((shop) => shop.distance <= maxDistance) // Only include shops within maxDistance
          .sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity)) // Sort by distance
          .map(convertDBShopToShop);
      }
      
      // If location not enabled, return shops without distance calculation
      return data.map(convertDBShopToShop);
    } catch (error) {
      console.error('Error getting nearby shops:', error);
      return [];
    }
  }, [location]);

  // Load saved location from localStorage on initial render
  useEffect(() => {
    const storedLocation = localStorage.getItem('userLocation');
    
    if (storedLocation) {
      try {
        const parsedLocation = JSON.parse(storedLocation);
        if (parsedLocation.latitude && parsedLocation.longitude) {
          setLocation(initializeLocation(parsedLocation.latitude, parsedLocation.longitude));
          setIsLocationEnabled(true);
        }
      } catch (err) {
        console.error('Error parsing stored location:', err);
      }
    }
  }, []);

  return (
    <LocationContext.Provider
      value={{
        isLocationEnabled,
        location,
        requestLocation,
        getNearbyShops,
        enableLocation
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
