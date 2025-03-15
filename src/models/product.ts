
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
  // Additional fields for UI/display
  seller_id?: string;
  seller_name?: string;
  rating?: number;
  
  // Frontend aliases for backward compatibility
  shopId?: string;
  isHalalCertified?: boolean;
  inStock?: boolean;
  createdAt?: string;
  updatedAt?: string;
  sellerId?: string;
  sellerName?: string;
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
  filter?: (predicate: (value: Product, index: number, array: Product[]) => unknown) => Product[];
}

// Common product categories for UI selection
export const productCategories = [
  "Electronics", 
  "Clothing", 
  "Food", 
  "Home", 
  "Beauty", 
  "Books", 
  "Sports", 
  "Toys", 
  "Health", 
  "Grocery", 
  "Jewelry", 
  "Automotive", 
  "Garden"
];
