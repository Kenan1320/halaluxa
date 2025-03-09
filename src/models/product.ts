export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  shop_id: string;
  images?: string[];
  rating?: number;
  is_halal_certified?: boolean;
  is_published?: boolean;
  inStock?: number; // Change from boolean to number to match usage
  stock?: number;
  created_at?: string;
  updated_at?: string;
  long_description?: string;
  details?: any;
  sellerId: string;
  sellerName: string;
}
