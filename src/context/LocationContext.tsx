
import React, { createContext, useContext, useState, useEffect } from 'react';
import { saveLocation, getLocation } from '@/services/locationService';
import { Shop } from '@/types/database';
import { getNearbyShops } from '@/services/shopService';
import { useToast } from '@/hooks/use-toast';

export interface EnhancedLocation {
  coords: {
    latitude: number;
    longitude: number;
  };
  timestamp: number;
}

interface LocationContextProps {
  isLocationEnabled: boolean;
  location: EnhancedLocation | null;
  requestLocation: () => void;
  getNearbyShops: () => Promise<Shop[]>;
}

const LocationContext = createContext<LocationContextProps>({
  isLocationEnabled: false,
  location: null,
  requestLocation: () => {},
  getNearbyShops: async () => [],
});

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [location, setLocation] = useState<EnhancedLocation | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedLocation = getLocation();
    if (savedLocation) {
      setLocation(savedLocation);
      setIsLocationEnabled(true);
    }
  }, []);

  const requestLocation = () => {
    if (navigator.geolocation) {
      toast({
        title: "Accessing location",
        description: "Please allow location access to find shops near you.",
      });
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation: EnhancedLocation = {
            coords: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
            timestamp: position.timestamp,
          };
          
          setLocation(newLocation);
          setIsLocationEnabled(true);
          saveLocation(newLocation);
          
          toast({
            title: "Location updated",
            description: "We'll now show you shops and products near you.",
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLocationEnabled(false);
          
          toast({
            title: "Location access denied",
            description: "We'll show you shops and products from all locations.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
    }
  };

  const fetchNearbyShops = async (): Promise<Shop[]> => {
    if (isLocationEnabled && location) {
      try {
        return await getNearbyShops(location.coords.latitude, location.coords.longitude);
      } catch (error) {
        console.error("Error fetching nearby shops:", error);
        return [];
      }
    } else {
      try {
        return await getNearbyShops();
      } catch (error) {
        console.error("Error fetching shops:", error);
        return [];
      }
    }
  };

  return (
    <LocationContext.Provider
      value={{
        isLocationEnabled,
        location,
        requestLocation,
        getNearbyShops: fetchNearbyShops,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
