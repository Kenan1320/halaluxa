
import { Json } from '@/integrations/supabase/types';

export interface Profile {
  id: string;
  email: string;
  name: string;
  avatar_url: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  role: string;
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
  rating?: number;
  productCount?: number;
  isVerified?: boolean;
  category?: string;
  logo?: string;
  coverImage?: string;
  ownerId?: string;
  latitude?: number | null;
  longitude?: number | null;
  distance?: number | null;
}

export interface SellerAccount {
  id: string;
  user_id: string;
  shop_id: string;
  account_type: string;
  account_name: string;
  account_number: string;
  bank_name: string;
  paypal_email: string;
  stripe_account_id: string;
  applepay_merchant_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
