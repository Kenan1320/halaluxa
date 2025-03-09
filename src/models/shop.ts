
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
  is_halal_certified?: boolean;
  is_published?: boolean;
  stock?: number;
  created_at?: string;
  updated_at?: string;
  long_description?: string;
  details?: any;
  sellerId: string;
  sellerName: string;
}

export interface ShopPaymentMethod {
  id: string;
  shopId: string;
  methodType: "bank" | "paypal" | "stripe" | "applepay";
  accountName?: string;
  accountNumber?: string;
  bankName?: string;
  paypalEmail?: string;
  stripeAccountId?: string;
  isActive: boolean;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
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

// User shop preference interface for the SelectShops page
export interface UserShopPreference {
  id?: string;
  user_id: string;
  shop_id: string;
  is_following?: boolean;
  is_favorite?: boolean;
  is_main_shop?: boolean;
}

// Extended profile interface
export interface UserProfile {
  id?: string;
  user_id?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  role?: string;
  is_business_owner?: boolean;
  shop_name?: string;
  shop_description?: string; 
  shop_category?: string;
  shop_location?: string;
  shop_logo?: string;
  main_shop_id?: string;
}
