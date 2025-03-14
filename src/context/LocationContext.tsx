
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCurrentLocation, getAddressFromCoords } from '@/services/locationService';
import { getAllShops } from '@/services/shopService';
import { Coordinates, LocationContextProps } from '@/types/LocationTypes';
import { useToast } from '@/hooks/use-toast';

const LocationContext = createContext<LocationContextProps>({
  isLocationEnabled: false,
  location: null,
  requestLocation: () => {},
});

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [location, setLocation] = useState<Coordinates | null>(null);
  const { toast } = useToast();
  
  const requestLocation = useCallback(async () => {
    try {
      const coords = await getCurrentLocation();
      setLocation(coords);
      setIsLocationEnabled(true);
      
      toast({
        title: "Location updated",
        description: `Your location is now set to ${coords.city || 'your current position'}.`,
      });
      
      localStorage.setItem('location', JSON.stringify(coords));
    } catch (error) {
      console.error('Error getting location:', error);
      toast({
        title: "Location error",
        description: "Couldn't access your location. Please check your browser settings.",
        variant: "destructive",
      });
    }
  }, [toast]);
  
  const enableLocation = useCallback(() => {
    setIsLocationEnabled(true);
  }, []);
  
  // Check for saved location on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('location');
    if (savedLocation) {
      try {
        const parsedLocation = JSON.parse(savedLocation);
        setLocation(parsedLocation);
        setIsLocationEnabled(true);
      } catch (error) {
        console.error('Error parsing saved location:', error);
      }
    }
  }, []);
  
  // Method to get nearby shops based on location
  const getNearbyShops = useCallback(async () => {
    if (!location) {
      // If location is not available, return all shops
      return getAllShops();
    }
    
    try {
      // In a real implementation, we would pass the location to filter shops by proximity
      // For now, we just return all shops
      const shops = await getAllShops();
      
      // Sort shops by "distance" (simulated)
      return shops.map(shop => ({
        ...shop,
        distance: Math.random() * 10 // Random distance between 0-10 miles
      })).sort((a, b) => (a.distance || 999) - (b.distance || 999));
    } catch (error) {
      console.error('Error getting nearby shops:', error);
      return [];
    }
  }, [location]);
  
  return (
    <LocationContext.Provider 
      value={{ 
        isLocationEnabled, 
        location, 
        requestLocation,
        enableLocation,
        getNearbyShops
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
