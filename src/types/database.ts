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
  logo_url: string;
  cover_image: string;
  address: string;
  location: string;
  latitude: number;
  longitude: number;
  category: string;
  owner_id: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  phone?: string;
  email?: string;
  website?: string;
  is_featured?: boolean;
  rating?: {
    average: number;
    count: number;
  };
  distance?: number;
  product_count?: number;
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
  image_url?: string;
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
  group?: ShopGroup;
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

export interface DatabaseProfile {
  id: string;
  created_at: string;
  updated_at?: string;
  email: string;
  name?: string;
  role: 'shopper' | 'business' | 'admin';
  avatar_url?: string;
  address?: string | UserAddress; // Allow both string and UserAddress for flexibility
  phone?: string;
  preferences?: UserPreferences;
  // Shop-related fields
  shop_id?: string;
  shop_name?: string;
  shop_description?: string;
  shop_category?: string;
  shop_location?: string;
  shop_logo?: string;
  // Simple address fields
  city?: string;
  state?: string;
  zip?: string;
}

export interface SellerAccount {
  id: string;
  user_id: string;
  shop_id: string;
  account_type: 'individual' | 'business' | 'bank' | 'paypal' | 'stripe' | 'applepay'; 
  account_status: 'pending' | 'active' | 'suspended';
  payout_details: {
    bank_name?: string;
    account_holder?: string;
    account_number_last4?: string;
    routing_number_last4?: string;
    paypal_email?: string;
  };
  created_at: string;
  updated_at: string;
  // Additional fields needed for payment accounts
  account_name?: string;
  account_number?: string;
  bank_name?: string;
  paypal_email?: string;
  stripe_account_id?: string;
  applepay_merchant_id?: string;
  routing_number?: string;
}

export interface Admin {
  id: string;
  user_id: string;
  role: 'super_admin' | 'admin' | 'moderator';
  created_at: string;
  last_login: string | null;
  permissions: AdminPermission[];
}

export interface AdminPermission {
  id: string;
  admin_id: string;
  role: string;
  resource: 'shops' | 'products' | 'users' | 'orders' | 'system';
  can_create: boolean;
  can_read: boolean;
  can_update: boolean;
  can_delete: boolean;
  created_at: string;
}

export type ShopGroup = "online" | "featured" | "nearby" | "popular" | "transitional";
