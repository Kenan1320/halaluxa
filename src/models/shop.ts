
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
  coverImage: string | null;
  ownerId: string;
  latitude: number | null;
  longitude: number | null;
  distance: number | null;
  
  // Database compatibility fields
  logo_url?: string | null;
  cover_image?: string | null;
  owner_id?: string;
  product_count?: number;
  is_verified?: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShopProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  shop_id?: string;
  created_at?: string;
  updated_at?: string;
  is_halal_certified?: boolean;
  in_stock?: boolean;
  sellerId?: string;
  sellerName?: string;
  rating?: number;
}

export interface ShopReview {
  id: string;
  userId: string;
  shopId: string;
  rating: number;
  review: string;
  createdAt: string;
  userName?: string;
  userAvatar?: string;
}

export interface ShopFilterOptions {
  category?: string;
  rating?: number;
  distance?: number;
  isHalalCertified?: boolean;
  search?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}
