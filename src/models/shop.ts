
export interface Shop {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  owner_name?: string;
  category: string;
  address: string;
  latitude: number;
  longitude: number;
  distance?: number;
  location: string;
  logo_url: string;
  cover_image: string;
  is_verified: boolean;
  rating?: number;
  product_count?: number;
  phone?: string;
  email?: string;
  created_at: string;
  updated_at: string;
  delivery_radius?: number;
  delivery_fee?: number;
  min_order?: number;
  tags?: string[];
}

export interface ShopFilter {
  radius?: number;
  category?: string;
  rating?: number;
  tags?: string[];
  orderBy?: 'distance' | 'rating' | 'newest';
}

export interface CreateShopInput {
  name: string;
  description: string;
  category: string;
  address: string;
  location: string;
  latitude?: number;
  longitude?: number;
  logo_url?: string;
  cover_image?: string;
  phone?: string;
  email?: string;
  delivery_radius?: number;
  delivery_fee?: number;
  min_order?: number;
  tags?: string[];
}

export interface UpdateShopInput {
  name?: string;
  description?: string;
  category?: string;
  address?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  logo_url?: string;
  cover_image?: string;
  phone?: string;
  email?: string;
  delivery_radius?: number;
  delivery_fee?: number;
  min_order?: number;
  tags?: string[];
}

export interface ShopProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  shop_id: string;
  images?: string[];
  rating?: number;
  isHalalCertified?: boolean;
  inStock?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ShopPaymentMethod {
  id: string;
  shop_id: string;
  method_type: "bank" | "paypal" | "stripe" | "applepay";
  account_name?: string;
  account_number?: string;
  bank_name?: string;
  paypal_email?: string;
  stripe_account_id?: string;
  is_active: boolean;
  is_default?: boolean;
  created_at: string;
  updated_at: string;
}

export interface BusinessSignupFormData {
  email: string;
  password: string;
  name: string;
  businessName: string;
  businessCategory: string;
  businessDescription: string;
  location: string;
  phone?: string;
}

export type ShopFilterBy = 'all' | 'nearby' | 'featured' | 'popular' | 'new';
