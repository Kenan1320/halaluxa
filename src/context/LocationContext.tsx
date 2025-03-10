
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getShops } from '@/services/shopService';
import type { Shop } from '@/services/shopService';

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

// Default fallback locations
const DEFAULT_LOCATIONS = [
  { latitude: 40.7128, longitude: -74.0060, city: "New York", state: "NY" },
  { latitude: 34.0522, longitude: -118.2437, city: "Los Angeles", state: "CA" },
  { latitude: 41.8781, longitude: -87.6298, city: "Chicago", state: "IL" },
  { latitude: 29.7604, longitude: -95.3698, city: "Houston", state: "TX" },
  { latitude: 33.4484, longitude: -112.0740, city: "Phoenix", state: "AZ" }
];

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [isLocationEnabled, setIsLocationEnabled] = useState<boolean>(false);
  const [location, setLocation] = useState<LocationCoordinates | null>(null);
  const [locationFetchAttempted, setLocationFetchAttempted] = useState(false);
  
  useEffect(() => {
    // Check if we have stored location data
    const storedLocation = localStorage.getItem('location');
    if (storedLocation) {
      try {
        const parsedLocation = JSON.parse(storedLocation);
        setLocation(parsedLocation);
        setIsLocationEnabled(true);
        setLocationFetchAttempted(true);
      } catch (error) {
        console.error('Failed to parse stored location', error);
        // Continue to fetch location
        requestLocation();
      }
    } else {
      // Automatically request location on first load
      requestLocation();
    }
  }, []);
  
  const requestLocation = async (): Promise<void> => {
    if (locationFetchAttempted) return;
    setLocationFetchAttempted(true);
    
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by this browser');
      useFallbackLocation();
      return;
    }
    
    try {
      // Add a timeout promise to handle very slow permission responses
      const locationPromise = new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000, // Shorter timeout for better UX
          maximumAge: 600000 // 10 minutes
        });
      });
      
      // Race the location request against a timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Location request timed out')), 6000);
      });
      
      const position = await Promise.race([locationPromise, timeoutPromise]) as GeolocationPosition;
      
      const { latitude, longitude } = position.coords;
      
      // Get city and state from coordinates using reverse geocoding
      try {
        await fetchCityAndState(latitude, longitude);
      } catch (error) {
        console.error('Error fetching location details:', error);
        const locationData = { latitude, longitude };
        localStorage.setItem('location', JSON.stringify(locationData));
        setLocation(locationData);
        setIsLocationEnabled(true);
      }
    } catch (error) {
      console.error('Error getting location:', error);
      tryIpBasedLocation();
    }
  };
  
  const fetchCityAndState = async (latitude: number, longitude: number) => {
    try {
      // Use multiple geocoding services for redundancy
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`,
        { headers: { 'User-Agent': 'HalaluxaLocalShopFinder/1.0' } }
      );
      
      if (!response.ok) throw new Error('Geocoding service unavailable');
      
      const data = await response.json();
      
      const city = data.address?.city || data.address?.town || data.address?.village || 'Unknown';
      const state = data.address?.state || '';
      
      const locationData = { latitude, longitude, city, state };
      
      localStorage.setItem('location', JSON.stringify(locationData));
      setLocation(locationData);
      setIsLocationEnabled(true);
    } catch (error) {
      throw error;
    }
  };
  
  const tryIpBasedLocation = async () => {
    try {
      // Try multiple IP geolocation services for redundancy
      const services = [
        'https://ipapi.co/json/',
        'https://api.ipify.org?format=json'
      ];
      
      // Try each service until one works
      for (const service of services) {
        try {
          const response = await fetch(service);
          if (!response.ok) continue;
          
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
            return;
          }
        } catch (serviceError) {
          console.warn(`Error with geolocation service ${service}:`, serviceError);
          // Continue to next service
        }
      }
      
      // If all services fail, use fallback
      useFallbackLocation();
    } catch (error) {
      console.error('Error getting IP location:', error);
      useFallbackLocation();
    }
  };
  
  const useFallbackLocation = () => {
    // Select a random default location
    const fallbackLocation = DEFAULT_LOCATIONS[Math.floor(Math.random() * DEFAULT_LOCATIONS.length)];
    localStorage.setItem('location', JSON.stringify(fallbackLocation));
    setLocation(fallbackLocation);
    setIsLocationEnabled(true);
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
    
    // If we still don't have location after request, use a fallback
    if (!location) {
      useFallbackLocation();
    }
    
    try {
      const shops = await getShops();
      
      // For demo purposes, assign random coordinates to shops without real coordinates
      const shopsWithCoordinates = shops.map(shop => {
        // Default coordinates (randomly generated for demo based on current location)
        const currentLat = location?.latitude || 40.7128;
        const currentLng = location?.longitude || -74.0060;
        
        // Small variation for more realistic location distribution
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
          distance: parseFloat(distance.toFixed(1))
        };
      });
      
      // Sort by distance
      return shopsWithCoordinates.sort((a, b) => a.distance - b.distance);
    } catch (error) {
      console.error('Error getting shops:', error);
      return [];
    }
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
