
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

// Product categories with updated names to match the provided icons
export const productCategories = [
  "Groceries",
  "Restaurants",
  "Halal Meat",
  "Furniture",
  "Books",
  "Modest Clothing",
  "Hijab",
  "Thobes",
  "Abaya",
  "Online Shops",
  "Gifts",
  "Decorations",
  "Arabic Language",
  "Arabic Calligraphy"
];
