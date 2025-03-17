
export interface Shop {
  id: string;
  name: string;
  description: string;
  location: string;
  category: string;
  logo_url: string;
  cover_image?: string;
  owner_id: string;
  rating: number;
  product_count: number;
  is_verified: boolean;
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
  distance?: number;
  // Additional fields
  phone?: string;
  email?: string;
  website?: string;
  is_featured?: boolean;
  address?: string;
  // Frontend aliases
  logo?: string; // Alias for logo_url
  coverImage?: string; // Alias for cover_image
  ownerId?: string; // Alias for owner_id
  productCount?: number; // Alias for product_count
  isVerified?: boolean; // Alias for is_verified
  createdAt?: string; // Alias for created_at
  updatedAt?: string; // Alias for updated_at
}

export interface ShopProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  shop_id: string;
  is_halal_certified: boolean;
  in_stock: boolean;
  created_at: string;
  updated_at: string;
  seller_id?: string;
  seller_name?: string;
  rating?: number;
  // Frontend aliases
  shopId?: string; // Alias for shop_id
  isHalalCertified?: boolean; // Alias for is_halal_certified
  inStock?: boolean; // Alias for in_stock
  sellerId?: string; // Alias for seller_id
  sellerName?: string; // Alias for seller_name
  createdAt?: string; // Alias for created_at
  updatedAt?: string; // Alias for updated_at
}

export type Rating = {
  total: number;
  count: number;
  average: number;
};

export interface ReviewWithUser {
  id: string;
  shop_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_name: string;
  user_avatar?: string;
}

export interface ShopDetails extends Shop {
  products: number; 
  followers: number;
  reviews: number; 
  deliveryInfo: any;
  isGroupOrderEnabled: boolean;
}
