
export interface ProductDetails {
  weight?: string;
  servings?: string;
  ingredients?: string;
  origin?: string;
  [key: string]: any;
}

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
  details?: ProductDetails;
  seller_id?: string;
  seller_name?: string;
  rating?: number;
  // Properties used in frontend but mapped from database fields
  shopId?: string; // Alias for shop_id
  isHalalCertified?: boolean; // Alias for is_halal_certified
  inStock?: boolean; // Alias for in_stock
  createdAt?: string; // Alias for created_at
  updatedAt?: string; // Alias for updated_at
  sellerId?: string; // Alias for seller_id
  sellerName?: string; // Alias for seller_name
}

export const productCategories = [
  "Groceries",
  "Restaurants",
  "Furniture",
  "Halal Meat",
  "Books",
  "Thobes",
  "Hijab",
  "Decorations",
  "Abaya",
  "Online Shops",
  "Gifts",
  "Arabic Calligraphy",
  "Muslim Therapists",
  "Coffee Shops",
  "Hoodies"
];
