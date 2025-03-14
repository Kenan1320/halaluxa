
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
  shopId: string;
  isHalalCertified: boolean;
  inStock: boolean;
  createdAt: string;
  sellerId?: string;
  sellerName?: string;
  rating?: number;
  details?: ProductDetails;
  // Add these to match database type requirements
  shop_id?: string;
  created_at?: string;
  updated_at?: string;
  is_halal_certified?: boolean;
  in_stock?: boolean;
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
