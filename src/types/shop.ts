
export interface Shop {
  id: string;
  name: string;
  description: string;
  location: string;
  address?: string;
  logo_url?: string;
  cover_image?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  category: string;
  is_verified?: boolean;
  rating?: number;
  product_count?: number;
  latitude?: number;
  longitude?: number;
  distance?: number;
}

// Use 'export type' when re-exporting types with isolatedModules enabled
export type { Category } from '@/types/database';

// Add ShopDetails interface used in ShopHeader and ShopDetail
export interface ShopDetails extends Shop {
  products?: number;
  followers?: number;
  reviews?: number;
}

// Add ShopCategory for ShopDetail page
export interface ShopCategory {
  id: string;
  name: string;
  count: number;
}
