
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getNearbyShops } from '@/services/shopService';
import { Shop } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

// Using a more complete location interface that matches what we need
export interface EnhancedLocation {
  coords: {
    latitude: number;
    longitude: number;
  };
  timestamp: number;
  city?: string;
  state?: string;
}

interface LocationContextProps {
  isLocationEnabled: boolean;
  location: EnhancedLocation | null;
  userLocation: EnhancedLocation | null; // Added userLocation
  requestLocation: () => void;
  getCurrentLocation: () => void; // Added getCurrentLocation
  getNearbyShops: () => Promise<Shop[]>;
}

const LocationContext = createContext<LocationContextProps>({
  isLocationEnabled: false,
  location: null,
  userLocation: null, // Added userLocation
  requestLocation: () => {},
  getCurrentLocation: () => {}, // Added getCurrentLocation
  getNearbyShops: async () => [],
});

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [location, setLocation] = useState<EnhancedLocation | null>(null);
  const { toast } = useToast();

  // Create userLocation as an alias to location for backward compatibility
  const userLocation = location;

  useEffect(() => {
    // Load saved location from localStorage
    const savedLocationStr = localStorage.getItem('userLocation');
    if (savedLocationStr) {
      try {
        const savedLocation = JSON.parse(savedLocationStr);
        setLocation(savedLocation);
        setIsLocationEnabled(true);
      } catch (error) {
        console.error('Error parsing saved location:', error);
      }
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
          // Get coordinates
          const { latitude, longitude } = position.coords;
          
          // Create enhanced location object
          const newLocation: EnhancedLocation = {
            coords: {
              latitude,
              longitude,
            },
            timestamp: position.timestamp,
            // We'll add city and state later if available
          };
          
          // Try to get city and state using reverse geocoding
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
            .then(response => response.json())
            .then(data => {
              if (data && data.address) {
                // Update location with city and state
                const updatedLocation: EnhancedLocation = {
                  ...newLocation,
                  city: data.address.city || data.address.town || data.address.village || 'Unknown',
                  state: data.address.state || data.address.region || 'Unknown'
                };
                
                setLocation(updatedLocation);
                localStorage.setItem('userLocation', JSON.stringify(updatedLocation));
              } else {
                setLocation(newLocation);
                localStorage.setItem('userLocation', JSON.stringify(newLocation));
              }
            })
            .catch(error => {
              console.error("Error getting location details:", error);
              setLocation(newLocation);
              localStorage.setItem('userLocation', JSON.stringify(newLocation));
            });
          
          setIsLocationEnabled(true);
          
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

  // Add getCurrentLocation as an alias to requestLocation for backward compatibility
  const getCurrentLocation = requestLocation;

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
        userLocation, // Add userLocation
        requestLocation,
        getCurrentLocation, // Add getCurrentLocation
        getNearbyShops: fetchNearbyShops,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
