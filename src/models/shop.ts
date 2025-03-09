
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

export type ShopFilterBy = 'all' | 'nearby' | 'featured' | 'popular' | 'new';
