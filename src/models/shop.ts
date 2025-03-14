
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
