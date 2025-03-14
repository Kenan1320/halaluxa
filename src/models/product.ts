
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
  // Database compatibility fields
  shop_id?: string;
  created_at?: string;
  updated_at?: string;
  is_halal_certified?: boolean;
  in_stock?: boolean;
  // Add more optional fields for compatibility
  logo?: string;
  logo_url?: string;
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
