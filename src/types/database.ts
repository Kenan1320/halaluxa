export interface DatabaseProfile {
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

export interface Shop {
  id: string;
  name: string;
  description: string;
  location: string;
  category: string;
  logo_url: string | null;
  cover_image?: string | null;
  rating: number;
  product_count: number;
  owner_id: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  latitude?: number | null;
  longitude?: number | null;
  delivery_available?: boolean;
  pickup_available?: boolean;
  is_halal_certified?: boolean;
  operating_hours?: {
    [key: string]: { open: string; close: string };
  };
  phone?: string;
  email?: string;
  website?: string;
  distance?: number | null;
  // Add logo for compatibility with frontend references
  logo?: string | null;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  shop_id: string;
  category: string;
  images: string[];
  created_at: string;
  updated_at: string;
  is_halal_certified: boolean;
  in_stock: boolean;
  details?: Record<string, any>;
  long_description?: string;
  is_published?: boolean;
  stock?: number;
  seller_id?: string;
  rating?: number;
  shop_name?: string;
  delivery_mode?: 'online' | 'local_pickup' | 'local_delivery';
  pickup_options?: {
    store: boolean;
    curbside: boolean;
  };
  shipping_details?: {
    tracking_number?: string;
    carrier?: string;
    estimated_arrival?: string;
    status?: string;
  };
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
}

export interface OrderStatus {
  id: string;
  order_id: string;
  status: 'pending' | 'received' | 'preparing' | 'ready' | 'on_the_way' | 'completed' | 'canceled';
  updated_at: string;
  notes?: string;
  driver_id?: string;
  location_data?: {
    latitude?: number;
    longitude?: number;
  };
}

export interface Order {
  id: string;
  user_id: string;
  shop_id: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'received' | 'preparing' | 'ready' | 'on_the_way' | 'completed' | 'canceled';
  created_at: string;
  updated_at: string;
  delivery_address?: string;
  pickup_time?: string;
  payment_method: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  estimated_delivery?: string;
  delivery_method: 'delivery' | 'pickup' | 'shipping';
  pickup_details?: {
    car_color?: string;
    arrival_time?: string;
    parking_spot?: string;
    notes?: string;
  };
  shipping_details?: {
    tracking_number?: string;
    carrier?: string;
    estimated_arrival?: string;
    status?: string;
  };
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  options?: Record<string, any>;
}

export interface DriverInfo {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: 'available' | 'busy' | 'offline';
  current_location?: {
    latitude: number;
    longitude: number;
    updated_at: string;
  };
  rating?: number;
  vehicle_info?: {
    make: string;
    model: string;
    color: string;
    license_plate: string;
  };
}

export interface Coordinates {
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  country?: string;
}

export type User = DatabaseProfile;
