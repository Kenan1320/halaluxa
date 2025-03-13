
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getAddressFromCoords } from '@/services/locationService';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationAddress {
  formattedAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface LocationContextProps {
  isLocationEnabled: boolean;
  isGettingLocation: boolean;
  location: Coordinates | null;
  address: LocationAddress | null;
  requestLocation: () => Promise<Coordinates | null>;
  clearLocation: () => void;
  initializeLocation: () => Promise<void>;
  distance: number | null;
}

export const MAPBOX_API_KEY = 'sk.eyJ1Ijoia2VuYW4yNSIsImEiOiJjbTg3dGN0cHcwYmM0MnNxNHN5OTZidWViIn0.0Sba4mKBnPaKZfLj4p13iw';

const LocationContext = createContext<LocationContextProps>({
  isLocationEnabled: false,
  isGettingLocation: false,
  location: null,
  address: null,
  requestLocation: async () => null,
  clearLocation: () => {},
  initializeLocation: async () => {},
  distance: null,
});

export const useLocation = () => useContext(LocationContext);

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const { toast } = useToast();
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [address, setAddress] = useState<LocationAddress | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  // Initialize location from localStorage
  useEffect(() => {
    const storedLocation = localStorage.getItem('userLocation');
    if (storedLocation) {
      try {
        const parsedLocation = JSON.parse(storedLocation);
        setLocation(parsedLocation);
        setIsLocationEnabled(true);
        getAddressFromCoordinates(parsedLocation.latitude, parsedLocation.longitude);
      } catch (error) {
        console.error('Error parsing stored location', error);
        localStorage.removeItem('userLocation');
      }
    }
  }, []);

  const getAddressFromCoordinates = async (latitude: number, longitude: number) => {
    try {
      const addressDetails = await getAddressFromCoords(latitude, longitude);
      if (addressDetails) {
        setAddress(addressDetails);
      }
    } catch (error) {
      console.error('Error getting address from coordinates', error);
    }
  };

  const requestLocation = async (): Promise<Coordinates | null> => {
    setIsGettingLocation(true);
    
    try {
      // Check if geolocation is available
      if (!navigator.geolocation) {
        toast({
          title: "Location Unavailable",
          description: "Your browser does not support geolocation. Please enter your location manually.",
          variant: "destructive",
        });
        setIsGettingLocation(false);
        return null;
      }

      // Request geolocation permission
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });

      const newLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };

      localStorage.setItem('userLocation', JSON.stringify(newLocation));
      setLocation(newLocation);
      setIsLocationEnabled(true);
      
      await getAddressFromCoordinates(newLocation.latitude, newLocation.longitude);
      
      toast({
        title: "Location Updated",
        description: "We've updated your location.",
      });
      
      return newLocation;
    } catch (error) {
      console.error('Error getting location', error);
      let errorMessage = "Unable to get your location. Please try again or enter manually.";
      
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access was denied. Please enable location permissions in your browser.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out. Please try again.";
            break;
        }
      }
      
      toast({
        title: "Location Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsGettingLocation(false);
    }
  };

  const clearLocation = () => {
    localStorage.removeItem('userLocation');
    setLocation(null);
    setAddress(null);
    setIsLocationEnabled(false);
    toast({
      title: "Location Cleared",
      description: "Your location has been cleared.",
    });
  };

  const initializeLocation = async () => {
    // If we already have location, don't request again
    if (location) return;
    
    await requestLocation();
  };

  return (
    <LocationContext.Provider 
      value={{ 
        isLocationEnabled, 
        isGettingLocation,
        location, 
        address,
        requestLocation, 
        clearLocation,
        initializeLocation,
        distance
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
