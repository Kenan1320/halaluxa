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
  owner_id: string;
  category: string;
  location: string;
  logo_url: string | null;
  cover_image: string | null;
  created_at: string;
  updated_at: string;
  is_verified: boolean;
  product_count: number;
  rating: number;
  latitude?: number;
  longitude?: number;
  distance?: number;
  address?: string;
  display_mode?: 'online' | 'local_pickup' | 'local_delivery';
  pickup_options?: {
    store: boolean;
    curbside: boolean;
  };
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
}

export interface SellerAccount {
  id: string;
  user_id: string;
  shop_id?: string;
  account_type: string;
  account_name: string;
  account_number: string;
  bank_name: string;
  paypal_email?: string;
  stripe_account_id?: string;
  applepay_merchant_id?: string;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
  is_verified: boolean;
  balance: number;
  currency: string;
}
