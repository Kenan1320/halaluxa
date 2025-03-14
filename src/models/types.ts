
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
