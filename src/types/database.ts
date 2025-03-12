import { Json } from '@/integrations/supabase/types';

export interface Profile {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  avatar_url: string;
  role: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
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
  category?: string;
  logo?: string;
  coverImage?: string;
  rating?: number;
  productCount?: number;
  isVerified?: boolean;
  ownerId?: string;
  latitude?: number | null;
  longitude?: number | null;
  distance?: number | null;
}

export interface SellerAccount {
  id: string;
  user_id: string;
  shop_id?: string;
  account_type: string;
  account_name?: string;
  account_number?: string;
  bank_name?: string;
  paypal_email?: string;
  stripe_account_id?: string;
  applepay_merchant_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  shopId: string;
  isHalalCertified: boolean;
  inStock?: boolean;
  createdAt: string;
  // Additional fields needed for consistency with the model
  sellerId?: string;
  sellerName?: string;
  rating?: number;
  details?: any;
}
