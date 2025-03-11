
import { Database } from '@/integrations/supabase/types';

// Extend the Supabase types to work with our application
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type BusinessProfile = Database['public']['Tables']['business_profiles']['Row'];

// Create a composite profile type that includes business profile fields
export interface ExtendedProfile extends Profile {
  // Business profile fields
  shop_name?: string;
  shop_description?: string;
  shop_category?: string;
  shop_location?: string;
  shop_logo?: string;
  business_verified?: boolean;
  business_documents?: any;
}

// Export the Shop type so it can be used in other files
export interface Shop {
  id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  owner_id: string;
  logo_url?: string | null;
  cover_image?: string | null;
  address?: string | null;
  rating?: number | null;
  is_verified?: boolean | null;
  latitude?: number | null;
  longitude?: number | null;
  product_count?: number | null;
  created_at: string;
  updated_at: string;
}

// Create a type for seller accounts since it's used in the code but not in the Supabase types
export interface SellerAccount {
  id: string;
  user_id: string;
  shop_id: string;
  account_type: string;
  account_name: string;
  account_number: string;
  bank_name: string;
  paypal_email?: string;
  stripe_account_id?: string;
  applepay_merchant_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
