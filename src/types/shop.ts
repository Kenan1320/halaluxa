import { type } from "os";

export interface Shop {
  id: string;
  name: string;
  description: string;
  location: string;
  address?: string;
  logo_url: string;
  cover_image?: string;
  owner_id: string;
  is_verified?: boolean;
  category: string;
  rating?: number;
  product_count?: number;
  created_at: string;
  updated_at: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
  logo?: string;
}

export interface ShopDetails extends Omit<Shop, 'rating'> {
  products: number;
  followers: number;
  reviews: number;
  rating: { average: number; count: number };
  categories?: string[];
  deliveryInfo: {
    fee: number;
    minOrder: number;
    estimatedTime: string;
  };
  isGroupOrderEnabled: boolean;
}

export type ShopCategory = {
  id: string;
  name: string;
  icon?: string;
  count?: number;
};

export type Category = {
  id: string;
  name: string;
  slug?: string;
  icon?: string;
  parent_id?: string | null;
  created_at: string;
  updated_at: string;
};

export type FeaturedShop = {
  id: string;
  name: string;
  logo_url?: string;
  cover_image?: string;
  category: string;
  rating?: number;
  distance?: string;
  is_favorite?: boolean;
};

export type UserShopPreference = {
  user_id: string;
  shop_id: string;
  is_favorite: boolean;
  last_visited?: string;
  created_at: string;
  updated_at: string;
};
