import React, { createContext, useContext, useState, useCallback } from 'react';
import { getNearbyShopsByCoordinates } from '@/services/shopService';
import { getUserLocation } from '@/services/locationService';

interface LocationContextProps {
  isLocationEnabled: boolean;
  location: { latitude: number; longitude: number } | null;
  requestLocation: () => void;
  getNearbyShops: () => Promise<any[]>;
}

const LocationContext = createContext<LocationContextProps | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  
  const requestLocation = useCallback(async () => {
    try {
      const userLocation = await getUserLocation();
      if (userLocation) {
        setLocation(userLocation);
        setIsLocationEnabled(true);
      } else {
        setIsLocationEnabled(false);
      }
    } catch (error) {
      console.error('Error getting location:', error);
      setIsLocationEnabled(false);
    }
  }, []);
  
  const getNearbyShops = useCallback(async () => {
    if (location) {
      return getNearbyShopsByCoordinates(location.latitude, location.longitude);
    } else {
      // Default coordinates (e.g., city center)
      return getNearbyShopsByCoordinates(40.7128, -74.0060);
    }
  }, [location]);
  
  return (
    <LocationContext.Provider value={{ isLocationEnabled, location, requestLocation, getNearbyShops }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
