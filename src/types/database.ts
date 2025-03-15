
import { Json } from '@/integrations/supabase/types';

export interface User {
  id: string;
  created_at: string;
  email: string;
  name: string;
  role: 'shopper' | 'business' | 'admin';
  avatar_url?: string;
  address?: UserAddress;
  phone?: string;
  preferences?: UserPreferences;
}

export interface UserAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  is_default: boolean;
}

export interface UserPreferences {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  language: string;
  theme: 'light' | 'dark' | 'system';
}

export interface Shop {
  id: string;
  name: string;
  description: string;
  location: string;
  address?: string;
  logo_url?: string;
  cover_image?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  category: string;
  is_verified?: boolean;
  rating?: number;
  product_count?: number;
  latitude?: number;
  longitude?: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  long_description: string;
  price: number;
  shop_id: string;
  images: string[];
  category: string;
  stock: number;
  created_at: string;
  updated_at: string;
  is_published: boolean;
  is_halal_certified: boolean;
  details: Json;
  in_stock: boolean;
  delivery_mode?: 'online' | 'pickup' | 'local_delivery';
  pickup_options: {
    store: boolean;
    curbside: boolean;
  };
}

export interface Order {
  id: string;
  user_id: string;
  shop_id: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  shipping_address: UserAddress;
  payment_method: string;
  payment_status: PaymentStatus;
  delivery_date?: string;
  notes?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  shop_id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  user_name: string;
  user_avatar?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  parent_id?: string;
  created_at: string;
  updated_at: string;
  group?: 'featured' | 'nearby' | 'online' | 'popular';
}

export interface PaymentMethod {
  id: string;
  user_id: string;
  type: 'card' | 'paypal' | 'bank_transfer';
  details: {
    last4?: string;
    brand?: string;
    exp_month?: number;
    exp_year?: number;
    name?: string;
    email?: string;
    bank_name?: string;
    account_number_last4?: string;
  };
  is_default: boolean;
  created_at: string;
}
