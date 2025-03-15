
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface EnhancedLocation {
  coords: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
  timestamp?: number;
}

interface LocationContextType {
  currentLocation: EnhancedLocation | null;
  isLocationLoading: boolean;
  requestLocation: () => Promise<EnhancedLocation | null>;
}

const LocationContext = createContext<LocationContextType>({
  currentLocation: null,
  isLocationLoading: false,
  requestLocation: async () => null,
});

export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState<EnhancedLocation | null>(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const { toast } = useToast();

  const requestLocation = async (): Promise<EnhancedLocation | null> => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      return null;
    }

    setIsLocationLoading(true);
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });
      
      const location: EnhancedLocation = {
        coords: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        },
        timestamp: position.timestamp,
      };
      
      setCurrentLocation(location);
      return location;
    } catch (error: any) {
      console.error('Error getting location:', error);
      
      toast({
        title: "Location Error",
        description: error.message || "Could not get your location",
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsLocationLoading(false);
    }
  };

  // Try to get location on first load
  useEffect(() => {
    requestLocation();
  }, []);

  return (
    <LocationContext.Provider value={{ currentLocation, isLocationLoading, requestLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
