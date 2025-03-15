
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getAllShops, Shop } from '@/services/shopService';

export interface EnhancedLocation {
  coords: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
  timestamp?: number;
}

// Additional location data including city and state
export interface LocationData {
  city: string;
  state: string;
  country?: string;
  zip?: string;
}

interface LocationContextType {
  currentLocation: EnhancedLocation | null;
  isLocationLoading: boolean;
  requestLocation: () => Promise<EnhancedLocation | null>;
  isLocationEnabled: boolean;
  location: LocationData | null;
  getNearbyShops: () => Promise<Shop[]>;
  enableLocation: () => Promise<boolean>;
}

const LocationContext = createContext<LocationContextType>({
  currentLocation: null,
  isLocationLoading: false,
  requestLocation: async () => null,
  isLocationEnabled: false,
  location: null,
  getNearbyShops: async () => [],
  enableLocation: async () => false,
});

export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState<EnhancedLocation | null>(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [location, setLocation] = useState<LocationData | null>(null);
  const { toast } = useToast();

  // Function to get location data from coordinates
  const getLocationData = async (latitude: number, longitude: number): Promise<LocationData | null> => {
    try {
      // In a real app, you would use a reverse geocoding service here
      // For now, we'll just return a mock location
      return {
        city: "Example City",
        state: "Example State",
        country: "Example Country",
        zip: "12345"
      };
    } catch (error) {
      console.error('Error getting location data:', error);
      return null;
    }
  };

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
      
      const locationData: EnhancedLocation = {
        coords: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        },
        timestamp: position.timestamp,
      };
      
      setCurrentLocation(locationData);
      setIsLocationEnabled(true);
      
      // Get location data (city, state) from coordinates
      const locationInfo = await getLocationData(locationData.coords.latitude, locationData.coords.longitude);
      setLocation(locationInfo);
      
      return locationData;
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

  const enableLocation = async (): Promise<boolean> => {
    const location = await requestLocation();
    const success = location !== null;
    setIsLocationEnabled(success);
    return success;
  };

  // Get nearby shops based on user's location
  const getNearbyShops = async (): Promise<Shop[]> => {
    try {
      // If location is enabled and we have coordinates, use them to get nearby shops
      if (isLocationEnabled && currentLocation) {
        // In a real app, you would use these coordinates to fetch shops from a backend API
        // For now, we'll just fetch all shops and sort them randomly
        const allShops = await getAllShops();
        
        // Mock distance calculation - in a real app, this would be done on the server
        return allShops.map(shop => ({
          ...shop,
          distance: Math.random() * 10 // Random distance between 0-10km
        })).sort((a, b) => (a.distance || 10) - (b.distance || 10));
      } else {
        // If location is not enabled, just return all shops
        return await getAllShops();
      }
    } catch (error) {
      console.error('Error getting nearby shops:', error);
      return [];
    }
  };

  // Try to get location on first load
  useEffect(() => {
    const savedLocationEnabled = localStorage.getItem('locationEnabled') === 'true';
    setIsLocationEnabled(savedLocationEnabled);
    
    if (savedLocationEnabled) {
      requestLocation();
    }
  }, []);

  // Save location enabled status to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('locationEnabled', isLocationEnabled.toString());
  }, [isLocationEnabled]);

  return (
    <LocationContext.Provider 
      value={{ 
        currentLocation, 
        isLocationLoading, 
        requestLocation,
        isLocationEnabled,
        location,
        getNearbyShops,
        enableLocation
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
