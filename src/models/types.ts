
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
  distance?: number | null;
  delivery_available?: boolean;
  pickup_available?: boolean;
  is_halal_certified?: boolean;
  created_at?: Timestamp;
  updated_at?: Timestamp;
  address?: string;
  display_mode?: DeliveryMode;
}

export interface DBProduct {
  id: UUID;
  name: string;
  description: string;
  price: number;
  shop_id: UUID;
  category: string;
  images: string[];
  created_at: string;
  updated_at?: string;
  is_halal_certified: boolean;
  in_stock: boolean;
  details?: Record<string, any>;
  long_description?: string;
  is_published?: boolean;
  stock?: number;
  featured?: boolean;
  shop_name?: string;
  shop_logo?: string;
  seller_id?: UUID;
  rating?: number;
  review_count?: number;
  delivery_mode?: DeliveryMode;
  pickup_options?: {
    store: boolean;
    curbside: boolean;
  };
  shops?: {
    id: UUID;
    name: string;
    logo_url?: string | null;
  };
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

export interface SellerAccount {
  id: string;
  user_id: string;
  account_number: string;
  routing_number?: string;
  bank_name: string;
  account_type: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  balance: number;
  currency: string;
  shop_id?: string;
  paypal_email?: string;
  stripe_account_id?: string;
  applepay_merchant_id?: string;
  account_name?: string;
  is_active?: boolean;
  type?: string;
  provider?: string;
  last4?: string;
  exp_month?: number;
  exp_year?: number;
  brand?: string;
  is_default?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  role: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
  shop_name?: string;
  shop_description?: string;
  shop_category?: string;
  shop_location?: string;
  shop_logo?: string;
}
