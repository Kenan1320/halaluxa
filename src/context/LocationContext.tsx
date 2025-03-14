
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getAllShops } from '@/services/shopService';
import { Shop } from '@/types/database';
import logger from '@/lib/logger';

// Extended GeolocationPosition type with city and state
interface EnhancedLocation {
  coords: GeolocationCoordinates;
  timestamp: number;
  city?: string;
  state?: string;
}

interface LocationContextType {
  isLocationEnabled: boolean;
  enableLocation: () => Promise<boolean>;
  requestLocation: () => Promise<boolean>;
  location: EnhancedLocation | null;
  getNearbyShops: () => Promise<Shop[]>;
}

const LocationContext = createContext<LocationContextType>({
  isLocationEnabled: false,
  enableLocation: async () => false,
  requestLocation: async () => false,
  location: null,
  getNearbyShops: async () => [],
});

export const useLocation = () => useContext(LocationContext);

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const { toast } = useToast();
  const [isLocationEnabled, setIsLocationEnabled] = useState<boolean>(false);
  const [location, setLocation] = useState<EnhancedLocation | null>(null);
  const [hasShownLocationToast, setHasShownLocationToast] = useState<boolean>(false);

  useEffect(() => {
    // Check if geolocation is available in the browser
    if (!navigator.geolocation) {
      logger.warn("Geolocation not supported by browser");
      return;
    }

    // Check if location permission was previously granted
    if (localStorage.getItem('locationPermission') === 'granted') {
      enableLocation(false); // Silent mode - no toast
    }
  }, []);

  // Function to get the city and state from coordinates
  const getCityAndState = async (latitude: number, longitude: number): Promise<{city: string, state: string}> => {
    try {
      // This would typically be a reverse geocoding API call
      // For now, we'll return mock data
      return {
        city: "San Francisco",
        state: "CA"
      };
    } catch (error) {
      logger.error('Error getting city and state:', error);
      return {
        city: "Unknown",
        state: ""
      };
    }
  };

  const enableLocation = async (showToast: boolean = true): Promise<boolean> => {
    if (!navigator.geolocation) {
      return false;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        });
      });

      // Get city and state information
      const { city, state } = await getCityAndState(
        position.coords.latitude,
        position.coords.longitude
      );

      // Create enhanced location object
      const enhancedLocation: EnhancedLocation = {
        ...position,
        city,
        state
      };

      setLocation(enhancedLocation);
      setIsLocationEnabled(true);
      localStorage.setItem('locationPermission', 'granted');
      
      // Only show toast if explicitly asked and hasn't shown before
      if (showToast && !hasShownLocationToast) {
        toast({
          title: "Location enabled",
          description: "We can now show shops near you.",
        });
        setHasShownLocationToast(true);
      }

      return true;
    } catch (error) {
      logger.error('Error getting location:', error);
      
      if (error instanceof GeolocationPositionError) {
        if (error.code === error.PERMISSION_DENIED && showToast) {
          toast({
            title: "Location access denied",
            description: "Please enable location in your browser settings to see nearby shops.",
            variant: "destructive",
          });
        } else if (error.code === error.TIMEOUT && showToast) {
          toast({
            title: "Location timeout",
            description: "Getting your location took too long. Please try again.",
            variant: "destructive",
          });
        } else if (showToast) {
          toast({
            title: "Location error",
            description: "Could not get your location. Please try again.",
            variant: "destructive",
          });
        }
      }
      
      return false;
    }
  };

  // Add the requestLocation function (will show toasts)
  const requestLocation = async (): Promise<boolean> => {
    return enableLocation(true);
  };

  const getNearbyShops = async (): Promise<Shop[]> => {
    try {
      if (!isLocationEnabled || !location) {
        return await getAllShops();
      }

      const { latitude, longitude } = location.coords;
      
      // In a real app, we would call a function that retrieves shops sorted by distance
      // For now, we'll just get all shops and set a mocked distance
      const shops = await getAllShops();
      
      // Add a random distance to each shop for demo purposes
      return shops.map(shop => ({
        ...shop,
        distance: Math.random() * 5 // Random distance between 0 and 5 miles
      })).sort((a, b) => (a.distance || 99) - (b.distance || 99));
    } catch (error) {
      logger.error('Error getting nearby shops:', error);
      return [];
    }
  };

  return (
    <LocationContext.Provider value={{ 
      isLocationEnabled, 
      enableLocation,
      requestLocation, 
      location,
      getNearbyShops 
    }}>
      {children}
    </LocationContext.Provider>
  );
};
