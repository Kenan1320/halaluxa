
import { Json } from '@/integrations/supabase/types';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  shop_id: string;
  category: string;
  images?: string[];
  rating?: number;
  is_halal_certified?: boolean;
  is_published?: boolean;
  stock?: number;
  created_at?: string;
  updated_at?: string;
  long_description?: string;
  details?: ProductDetails;
  // For UI compatibility
  isHalalCertified?: boolean;
  inStock?: number;
  sellerId?: string;
  sellerName?: string;
  createdAt?: string;
}

export interface ProductDetails {
  weight?: string;
  dimensions?: string;
  color?: string;
  material?: string;
  origin?: string;
  ingredients?: string[];
  allergens?: string[];
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  shop_id: string;
  category: string;
  images?: string[];
  is_halal_certified?: boolean;
  is_published?: boolean;
  stock?: number;
  long_description?: string;
  details?: ProductDetails;
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  shop_id?: string;
  category?: string;
  images?: string[];
  is_halal_certified?: boolean;
  is_published?: boolean;
  stock?: number;
  long_description?: string;
  details?: ProductDetails;
}

export interface ProductFilterOptions {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  isHalalCertified?: boolean;
}

export interface BulkUploadItem {
  name: string;
  description: string;
  price: number;
  category: string;
  stock?: number;
  images?: string[];
  is_published?: boolean;
  is_halal_certified?: boolean;
  long_description?: string;
  details?: ProductDetails;
}

// Product categories for UI components
export const productCategories = [
  "Food",
  "Beverages",
  "Clothing",
  "Accessories",
  "Beauty",
  "Health",
  "Home",
  "Electronics",
  "Books",
  "Toys",
  "Other"
];
