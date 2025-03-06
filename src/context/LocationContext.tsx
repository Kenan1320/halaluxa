
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LocationInfo, getCurrentLocation, getSavedUserLocation } from '@/services/locationService';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';

interface LocationContextType {
  location: LocationInfo | null;
  isLocationEnabled: boolean;
  loading: boolean;
  requestLocation: () => Promise<void>;
  clearLocation: () => void;
  getNearbyShops: () => Promise<any[]>;
}

const initialLocationState: LocationInfo = {
  coordinates: { latitude: 0, longitude: 0 },
  city: '',
  state: '',
  country: '',
  loading: true,
  error: null
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { translate } = useLanguage();

  // Check for previously saved location on mount
  useEffect(() => {
    const savedLocation = getSavedUserLocation();
    if (savedLocation) {
      setLocation(savedLocation);
      setIsLocationEnabled(true);
    }
  }, []);

  const requestLocation = async () => {
    setLoading(true);
    try {
      const userLocation = await getCurrentLocation();
      setLocation(userLocation);
      setIsLocationEnabled(true);
      toast({
        title: translate("Location updated"),
        description: translate(`We'll show you shops and products near ${userLocation.city}, ${userLocation.state}`),
      });
    } catch (error) {
      const locationError = error as LocationInfo;
      setLocation(locationError);
      setIsLocationEnabled(false);
      toast({
        title: translate("Location error"),
        description: locationError.error || translate("Something went wrong getting your location"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearLocation = () => {
    setLocation(null);
    setIsLocationEnabled(false);
    localStorage.removeItem('userLocation');
    toast({
      title: translate("Location cleared"),
      description: translate("Your location data has been removed"),
    });
  };

  const getNearbyShops = async () => {
    if (!location || !isLocationEnabled) {
      return [];
    }
    
    // This would normally call an API that uses the user's coordinates
    // to find nearby shops. For now, we'll simulate this functionality
    // by pulling from our existing shops
    const { getShops } = await import('@/services/shopService');
    const allShops = await getShops();
    
    // In a real implementation, we would sort by actual distance
    // For now, we'll return the shops with a "simulated" nearby flag
    return allShops.map(shop => ({
      ...shop,
      distance: Math.random() * 10, // Simulated distance in miles
      isNearby: true
    })).sort((a, b) => a.distance - b.distance);
  };

  return (
    <LocationContext.Provider 
      value={{ 
        location, 
        isLocationEnabled, 
        loading, 
        requestLocation, 
        clearLocation,
        getNearbyShops
      }}
    >
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
