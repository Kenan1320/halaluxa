
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
  inStock?: number; // Number for quantity in stock
  stock?: number;
  created_at?: string;
  updated_at?: string;
  long_description?: string;
  details?: any;
  sellerId: string;
  sellerName: string;
}

// Common product categories 
export const productCategories = [
  'Food',
  'Beverages',
  'Beauty',
  'Health',
  'Clothing',
  'Home',
  'Electronics',
  'Sports',
  'Toys',
  'Books',
  'Other'
];
