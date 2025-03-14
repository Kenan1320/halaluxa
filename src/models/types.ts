
/**
 * Core shared types used throughout the application
 * This file contains types that bridge between database and frontend models
 */

// Common types
export type UUID = string;
export type Timestamp = string;
export type Currency = 'USD' | 'EUR' | 'GBP';
export type DeliveryMode = 'online' | 'local_pickup' | 'local_delivery';

// Coordinates type
export interface Coordinates {
  latitude: number | null;
  longitude: number | null;
}

// Address type
export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

// Rating type
export interface Rating {
  average: number;
  count: number;
}

// Location interface with enhanced functionality
export interface EnhancedLocation {
  latitude: number | null;
  longitude: number | null;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  coords?: {
    latitude: number | null;
    longitude: number | null;
  };
}

// Database to frontend model conversion interfaces
export interface DBShop {
  id: UUID;
  name: string;
  description: string;
  location: string;
  category: string;
  rating: number;
  product_count: number;
  is_verified: boolean;
  logo_url: string | null;
  cover_image: string | null;
  owner_id: UUID;
  latitude: number | null;
  longitude: number | null;
  distance: number | null;
  delivery_available?: boolean;
  pickup_available?: boolean;
  is_halal_certified?: boolean;
  created_at?: Timestamp;
  updated_at?: Timestamp;
  address?: string;
  display_mode?: DeliveryMode;
}

export interface Category {
  id: UUID;
  name: string;
  icon?: string;
  description?: string;
  parent_id?: UUID | null;
  image_url?: string | null;
  count?: number;
  group?: string;
}

export interface ShopDetails {
  id: UUID;
  name: string;
  description: string;
  location: string;
  logo: string | null;
  cover_image: string | null;
  rating: Rating;
  isVerified: boolean;
  categories?: Category[];
  deliveryInfo: {
    deliveryFee: number;
    estimatedTime: string;
  };
  isGroupOrderEnabled?: boolean;
}

export interface PaymentMethod {
  id: UUID;
  shop_id: UUID;
  name: string;
  is_enabled: boolean;
  provider: string;
  details?: any;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}
