
/**
 * Calculate the distance between two coordinates in kilometers using the Haversine formula
 */
export const calculateDistance = (
  lat1: number | null,
  lon1: number | null,
  lat2: number | null,
  lon2: number | null
): number => {
  if (lat1 === null || lon1 === null || lat2 === null || lon2 === null) {
    return Infinity;
  }
  
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  ;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
};

/**
 * Convert degrees to radians
 */
const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

/**
 * Format a distance in a human-readable way
 */
export const formatDistance = (distance: number | null | undefined): string => {
  if (distance === null || distance === undefined) return 'Unknown distance';
  
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }
  
  return `${distance.toFixed(1)} km`;
};

/**
 * Get a formatted address string from an address object
 */
export const formatAddress = (
  street?: string,
  city?: string,
  state?: string,
  zipCode?: string,
  country?: string
): string => {
  const parts = [street, city, state, zipCode, country].filter(Boolean);
  return parts.join(', ');
};

/**
 * Initialize location object with coords property
 */
export const initializeLocation = (
  latitude: number | null,
  longitude: number | null,
  address?: string,
  city?: string,
  state?: string,
  country?: string
) => {
  return {
    latitude,
    longitude,
    address,
    city,
    state,
    country,
    coords: {
      latitude,
      longitude
    }
  };
};
