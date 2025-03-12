
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
  // Additional properties needed by components
  sellerId?: string;
  sellerName?: string;
  rating?: number;
  details?: ProductDetails;
}

// Product categories with renamed categories as requested
export const productCategories = [
  "Groceries",
  "Restaurants",
  "Halal Meat",
  "Furniture",
  "Books",
  "Hijab",
  "Gifts",
  "Decorations",
  "Abaya",
  "Online Shops",
  "Thobes",
  "Arabic Calligraphy",
  "Muslim Therapists"
];
