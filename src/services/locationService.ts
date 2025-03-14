
interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationInfo {
  coordinates: Coordinates;
  city: string;
  state: string;
  country: string;
  loading: boolean;
  error: string | null;
}

// Store current location in localStorage
export const saveUserLocation = (location: LocationInfo) => {
  localStorage.setItem('userLocation', JSON.stringify(location));
};

// Get user location from localStorage
export const getSavedUserLocation = (): LocationInfo | null => {
  const saved = localStorage.getItem('userLocation');
  return saved ? JSON.parse(saved) : null;
};

// Request user location using browser geolocation API
export const getCurrentLocation = (): Promise<LocationInfo> => {
  return new Promise((resolve, reject) => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      reject({
        coordinates: { latitude: 0, longitude: 0 },
        city: '',
        state: '',
        country: '',
        loading: false,
        error: 'Geolocation is not supported by your browser'
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Use reverse geocoding to get address details
          // In a real app, you would call an API like Google Maps Geocoding API
          // For demo purposes, we'll simulate this
          const locationInfo: LocationInfo = {
            coordinates: { latitude, longitude },
            city: 'Dallas', // Simulated response
            state: 'TX',
            country: 'USA',
            loading: false,
            error: null
          };
          
          // Save to localStorage
          saveUserLocation(locationInfo);
          resolve(locationInfo);
        } catch (error) {
          reject({
            coordinates: { latitude: 0, longitude: 0 },
            city: '',
            state: '',
            country: '',
            loading: false,
            error: 'Failed to get location details'
          });
        }
      },
      (error) => {
        let errorMessage;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
          default:
            errorMessage = 'An unknown error occurred';
        }
        
        reject({
          coordinates: { latitude: 0, longitude: 0 },
          city: '',
          state: '',
          country: '',
          loading: false,
          error: errorMessage
        });
      }
    );
  });
};

// Calculate distance between two coordinates (haversine formula)
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in km
  return d;
};

function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
}
