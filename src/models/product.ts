
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  shop_id: string;
  is_halal_certified: boolean;
  in_stock: boolean;
  created_at: string;
  updated_at: string;
  seller_id: string;
  seller_name: string;
  rating?: number;
  details?: Record<string, any>;
  stock?: number;
  is_published?: boolean;
  long_description?: string;
  delivery_mode?: 'pickup' | 'online' | 'local_delivery';
  pickup_options?: {
    store: boolean;
    curbside: boolean;
  };
  image_url?: string;
}

export interface ProductFilter {
  search?: string;
  category?: string;
  shop_id?: string;
  seller_id?: string;
  min_price?: number;
  max_price?: number;
  is_halal_certified?: boolean;
  in_stock?: boolean;
  sort_by?: 'price_asc' | 'price_desc' | 'newest' | 'rating';
}

export interface ProductResponse {
  data: Product[];
  error: string | null;
  filter: (predicate: (product: Product) => boolean) => Product[];
}

export const productCategories = [
  'Clothing',
  'Electronics',
  'Grocery',
  'Home',
  'Beauty',
  'Books',
  'Toys',
  'Sports',
  'Health',
  'Jewelry',
  'Automotive',
  'Garden',
  'Food',
  'Meat',
  'Accessories'
];
