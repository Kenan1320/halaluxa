
import { Json } from '@/integrations/supabase/types';

export interface Product {
  id: string;
  name: string;
  description: string;
  long_description: string;
  price: number;
  shop_id: string;
  images: string[];
  category: string;
  stock: number;
  created_at: string;
  updated_at: string;
  is_published: boolean;
  is_halal_certified: boolean;
  details: Json;
  in_stock: boolean;
  delivery_mode?: 'online' | 'pickup' | 'local_delivery';
  pickup_options: {
    store: boolean;
    curbside: boolean;
  };
}

export interface ProductFilter {
  category?: string;
  min_price?: number;
  max_price?: number;
  is_halal_certified?: boolean;
  in_stock?: boolean;
  shop_id?: string;
  search?: string;
  sort_by?: 'price_asc' | 'price_desc' | 'newest' | 'popular';
}

export interface ProductResponse {
  data: Product[] | null;
  error: any;
}
