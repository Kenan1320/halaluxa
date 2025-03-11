
export interface Profile {
  id: string;
  email: string;
  name: string | null;
  role: 'shopper' | 'business';
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  shop_name?: string | null;
  shop_description?: string | null;
  shop_category?: string | null;
  shop_location?: string | null;
  shop_logo?: string | null;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Shop {
  id: string;
  name: string;
  description: string;
  location: string;
  rating: number;
  productCount: number;
  isVerified: boolean;
  category: string;
  logo: string | null;
  coverImage: string | null;
  ownerId: string;
  latitude: number | null;
  longitude: number | null;
  distance?: number | null;
}

export interface SellerAccount {
  id: string;
  seller_id: string;
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
