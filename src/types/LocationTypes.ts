
export interface Coordinates {
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  country?: string;
  coords?: {
    latitude: number;
    longitude: number;
  };
}

export interface LocationContextProps {
  isLocationEnabled: boolean;
  location: Coordinates | null;
  requestLocation: () => void;
  enableLocation?: () => void;
  getNearbyShops?: () => Promise<any[]>;
}
