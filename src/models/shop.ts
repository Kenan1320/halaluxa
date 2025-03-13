
// Shop model interfaces
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
  logo_url?: string | null; // For compatibility with database schema
  coverImage: string | null;
  ownerId: string;
  latitude: number | null;
  longitude: number | null;
  distance: number | null;
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
  sellerId: string;
  sellerName: string;
  rating: number;
  shop_id?: string;
  created_at?: string;
  updated_at?: string;
  is_halal_certified?: boolean;
  in_stock?: boolean;
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

export interface ShopDisplaySettings {
  id: string;
  shopId: string;
  primaryColor: string | null;
  secondaryColor: string | null;
  fontFamily: string | null;
  showRatings: boolean;
  showProductCount: boolean;
  featuredProducts: string[] | null;
  bannerMessage: string | null;
  created_at: string;
}
