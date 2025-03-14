
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Coordinates, EnhancedLocation } from '@/models/types';
import { getShops, Shop } from '@/services/shopService';
import { calculateDistance } from '@/utils/locationUtils';

interface LocationContextType {
  isLocationEnabled: boolean;
  location: EnhancedLocation | null;
  requestLocation: () => Promise<boolean>;
  getNearbyShops: (maxDistance?: number) => Promise<Shop[]>;
  loadingLocation: boolean;
  locationError: string | null;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLocationEnabled, setIsLocationEnabled] = useState<boolean>(false);
  const [location, setLocation] = useState<EnhancedLocation | null>(null);
  const [loadingLocation, setLoadingLocation] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const { toast } = useToast();

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedLocation = localStorage.getItem('userLocation');
    if (storedLocation) {
      try {
        const parsedLocation = JSON.parse(storedLocation);
        setLocation(parsedLocation);
        setIsLocationEnabled(true);
      } catch (error) {
        console.error('Error parsing stored location:', error);
        localStorage.removeItem('userLocation');
      }
    }
  }, []);

  // Function to request location permission and get coordinates
  const requestLocation = async (): Promise<boolean> => {
    setLoadingLocation(true);
    setLocationError(null);

    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by your browser');
      }

      // Request position from browser
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Reverse geocode to get address details
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to reverse geocode location');
        }
        
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
          const feature = data.features[0];
          const context = feature.context || [];
          
          // Extract address components
          const cityObj = context.find((item: any) => item.id.startsWith('place'));
          const stateObj = context.find((item: any) => item.id.startsWith('region'));
          const countryObj = context.find((item: any) => item.id.startsWith('country'));
          
          const enhancedLocation: EnhancedLocation = {
            latitude,
            longitude,
            address: feature.place_name,
            city: cityObj ? cityObj.text : undefined,
            state: stateObj ? stateObj.text : undefined,
            country: countryObj ? countryObj.text : undefined
          };
          
          setLocation(enhancedLocation);
          localStorage.setItem('userLocation', JSON.stringify(enhancedLocation));
        } else {
          // If reverse geocoding fails, just save coordinates
          const basicLocation: EnhancedLocation = {
            latitude,
            longitude
          };
          
          setLocation(basicLocation);
          localStorage.setItem('userLocation', JSON.stringify(basicLocation));
        }
      } catch (geocodeError) {
        console.error('Error reverse geocoding:', geocodeError);
        
        // Save basic location even if reverse geocoding fails
        const basicLocation: EnhancedLocation = {
          latitude,
          longitude
        };
        
        setLocation(basicLocation);
        localStorage.setItem('userLocation', JSON.stringify(basicLocation));
      }

      setIsLocationEnabled(true);
      
      toast({
        title: "Location Updated",
        description: "Your location has been successfully updated",
      });
      
      setLoadingLocation(false);
      return true;
    } catch (error) {
      console.error('Error getting location:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      setLocationError(errorMessage);
      setLoadingLocation(false);
      
      toast({
        title: "Location Error",
        description: `Unable to get your location: ${errorMessage}`,
        variant: "destructive"
      });
      
      return false;
    }
  };

  // Function to get nearby shops
  const getNearbyShops = async (maxDistance: number = 10): Promise<Shop[]> => {
    if (!isLocationEnabled || !location || location.latitude === null || location.longitude === null) {
      console.warn('Location not enabled or coordinates not available');
      return [];
    }

    try {
      const allShops = await getShops();
      
      return allShops
        .filter(shop => {
          if (!shop.latitude || !shop.longitude) return false;
          
          const distance = calculateDistance(
            location.latitude!,
            location.longitude!,
            shop.latitude,
            shop.longitude
          );
          
          shop.distance = distance;
          return distance <= maxDistance;
        })
        .sort((a, b) => {
          const distanceA = a.distance || Infinity;
          const distanceB = b.distance || Infinity;
          return distanceA - distanceB;
        });
    } catch (error) {
      console.error('Error fetching nearby shops:', error);
      return [];
    }
  };

  return (
    <LocationContext.Provider value={{
      isLocationEnabled,
      location,
      requestLocation,
      getNearbyShops,
      loadingLocation,
      locationError
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
