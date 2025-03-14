
import { Coordinates } from '@/types/LocationTypes';

export const getCurrentLocation = (): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coordinates: Coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }
        };
        
        // Get city and state from coordinates
        getAddressFromCoords(coordinates)
          .then(address => {
            resolve({
              ...coordinates,
              ...address
            });
          })
          .catch(() => {
            // If reverse geocoding fails, still return the coordinates
            resolve(coordinates);
          });
      },
      (error) => {
        reject(error);
      }
    );
  });
};

export const getAddressFromCoords = async (coordinates: Coordinates): Promise<Partial<Coordinates>> => {
  try {
    // Simulated response as we don't have a real geocoding API here
    // In a real app, this would call a geocoding service
    return {
      city: 'Current City',
      state: 'Current State',
      country: 'Current Country'
    };
  } catch (error) {
    console.error('Error getting address from coordinates:', error);
    return {};
  }
};
