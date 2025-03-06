
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getShops } from '@/services/shopService';

interface LocationCoordinates {
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
}

interface LocationContextType {
  isLocationEnabled: boolean;
  location: LocationCoordinates | null;
  requestLocation: () => Promise<void>;
  getNearbyShops: () => Promise<any[]>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [isLocationEnabled, setIsLocationEnabled] = useState<boolean>(false);
  const [location, setLocation] = useState<LocationCoordinates | null>(null);
  
  useEffect(() => {
    // Check if we have stored location data
    const storedLocation = localStorage.getItem('location');
    if (storedLocation) {
      try {
        const parsedLocation = JSON.parse(storedLocation);
        setLocation(parsedLocation);
        setIsLocationEnabled(true);
      } catch (error) {
        console.error('Failed to parse stored location', error);
      }
    } else {
      // Automatically request location on first load
      requestLocation();
    }
  }, []);
  
  const requestLocation = async (): Promise<void> => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser');
      // Use fallback location
      const fallbackLocation = {
        latitude: 40.7128,
        longitude: -74.0060,
        city: "New York",
        state: "NY"
      };
      localStorage.setItem('location', JSON.stringify(fallbackLocation));
      setLocation(fallbackLocation);
      setIsLocationEnabled(true);
      return;
    }
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 600000 // 10 minutes
        });
      });
      
      const { latitude, longitude } = position.coords;
      
      // Get city and state from coordinates using reverse geocoding
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`
        );
        const data = await response.json();
        
        const city = data.address?.city || data.address?.town || data.address?.village || 'Unknown';
        const state = data.address?.state || '';
        
        const locationData = { latitude, longitude, city, state };
        
        // Store location data in localStorage
        localStorage.setItem('location', JSON.stringify(locationData));
        
        setLocation(locationData);
        setIsLocationEnabled(true);
      } catch (error) {
        console.error('Error fetching location details:', error);
        const locationData = { latitude, longitude };
        localStorage.setItem('location', JSON.stringify(locationData));
        setLocation(locationData);
        setIsLocationEnabled(true);
      }
    } catch (error) {
      console.error('Error getting location:', error);
      // Fallback to approximate location based on IP
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        if (data.latitude && data.longitude) {
          const locationData = {
            latitude: data.latitude,
            longitude: data.longitude,
            city: data.city || 'Unknown',
            state: data.region || ''
          };
          
          localStorage.setItem('location', JSON.stringify(locationData));
          setLocation(locationData);
          setIsLocationEnabled(true);
        }
      } catch (ipError) {
        console.error('Error getting IP location:', ipError);
        // Use default fallback
        const fallbackLocation = {
          latitude: 40.7128,
          longitude: -74.0060,
          city: "New York",
          state: "NY"
        };
        localStorage.setItem('location', JSON.stringify(fallbackLocation));
        setLocation(fallbackLocation);
        setIsLocationEnabled(true);
      }
    }
  };
  
  const calculateDistance = (
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): number => {
    // Haversine formula to calculate distance between two points
    const R = 3959; // Radius of the earth in miles
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in miles
    return distance;
  };
  
  const deg2rad = (deg: number): number => {
    return deg * (Math.PI/180);
  };
  
  const getNearbyShops = async (): Promise<any[]> => {
    if (!location) {
      // If location is not available yet, try to request it
      await requestLocation();
    }
    
    const shops = await getShops();
    
    // For demo purposes, assign random coordinates to shops without real coordinates
    const shopsWithCoordinates = shops.map(shop => {
      // Default coordinates (randomly generated for demo based on current location)
      const currentLat = location?.latitude || 40.7128;
      const currentLng = location?.longitude || -74.0060;
      
      const randomLat = currentLat + (Math.random() - 0.5) * 0.1;
      const randomLng = currentLng + (Math.random() - 0.5) * 0.1;
      
      // Calculate distance from current location
      const distance = calculateDistance(
        currentLat,
        currentLng,
        shop.latitude || randomLat,
        shop.longitude || randomLng
      );
      
      return {
        ...shop,
        latitude: shop.latitude || randomLat,
        longitude: shop.longitude || randomLng,
        distance
      };
    });
    
    // Sort by distance
    return shopsWithCoordinates.sort((a, b) => a.distance - b.distance);
  };
  
  return (
    <LocationContext.Provider value={{ 
      isLocationEnabled, 
      location,
      requestLocation,
      getNearbyShops
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  
  return context;
};
