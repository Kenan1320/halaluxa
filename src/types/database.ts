
export interface Profile {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  avatar_url: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  role: string;
  shop_name?: string;
  shop_description?: string;
  shop_category?: string;
  shop_location?: string;
  shop_logo?: string;
}

export interface SellerAccount {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  business_name: string;
  business_type: string;
  business_description: string;
  business_address: string;
  business_city: string;
  business_state: string;
  business_zip: string;
  business_phone: string;
  business_email: string;
  business_website: string;
  business_logo: string;
  status: string;
  shop_id?: string;
  account_type?: string;
  account_name?: string;
  account_number?: string;
  bank_name?: string;
  paypal_email?: string;
  stripe_account_id?: string;
  applepay_merchant_id?: string;
}

export interface Shop {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  email?: string;
  website?: string;
  status?: string;
  owner_id?: string;
  categories?: string[];
  rating?: { average: number; count: number };
  productCount?: number;
  distance?: number;
  isGroupOrderEnabled?: boolean;
  deliveryInfo?: {
    deliveryFee: number;
    estimatedTime: string;
  };
}

export interface Product {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description?: string;
  price: number;
  sale_price?: number;
  images: string[];
  category?: string;
  shop_id: string;
  status?: string;
  inventory_count?: number;
  tags?: string[];
  options?: ProductOption[];
  variations?: ProductVariation[];
}

export interface ProductOption {
  name: string;
  values: string[];
  required?: boolean;
}

export interface ProductVariation {
  id: string;
  name: string;
  price: number;
  inventory_count?: number;
  option_values: Record<string, string>;
}
