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
  inStock?: boolean;
  createdAt: string;
  sellerId?: string;
  sellerName?: string;
  rating?: number;
  details?: ProductDetails;
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
  "Muslim Therapists"
];
