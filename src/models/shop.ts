
// Shop model interfaces
export interface Shop {
  id: string;
  name: string;
  description: string;
  location: string;
  address?: string;
  category: string;
  logo_url?: string | null;
  cover_image?: string | null;
  owner_id: string;
  latitude: number | null;
  longitude: number | null;
  rating: number;
  product_count: number;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShopProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string; 
  images: string[];
  shop_id: string;
  is_published: boolean;
  is_halal_certified: boolean;
  rating: number;
  stock: number;
  created_at?: string;
  updated_at?: string;
  // Add these properties to match Product interface requirements
  sellerId: string;
  sellerName?: string;
}

export interface ShopLocation {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface ShopPaymentMethod {
  id: string;
  shop_id: string;
  method_type: 'bank' | 'paypal' | 'stripe';
  account_name?: string;
  account_number?: string;
  bank_name?: string;
  paypal_email?: string;
  stripe_account_id?: string;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShopSale {
  id: string;
  shop_id: string;
  order_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'refunded';
  created_at: string;
  updated_at: string;
}

// Business signup form data
export interface BusinessSignupFormData {
  email: string;
  password: string;
  name: string;
  shopName: string;
  shopDescription: string;
  shopCategory: string;
  shopLocation: string;
}

// Shop categories for dropdown menus
export const shopCategories = [
  "Food & Groceries",
  "Clothing & Fashion",
  "Beauty & Personal Care",
  "Health & Wellness",
  "Home & Kitchen",
  "Books & Media",
  "Electronics",
  "Toys & Games",
  "Sports & Outdoors",
  "Baby & Kids",
  "Jewelry & Accessories",
  "Halal Meat & Poultry",
  "Modest Fashion",
  "Islamic Books & Media",
  "Prayer Supplies",
  "Eid & Ramadan",
  "Home Decor",
  "Other"
];
