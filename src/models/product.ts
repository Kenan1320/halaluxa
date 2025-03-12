
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
  "Groceries",             // Was "Halal Meat" (1)
  "Restaurants",           // Was "Books" (2)
  "Halal Meat",            // Was "Furniture" (10)
  "Furniture",             // Was "Online Shops" (11)
  "Books",                 // Was "Arabic Calligraphy" (6)
  "Thobes",                // Was "Modest Clothing" (9)
  "Hijab",                 // Was "Thobes" (4)
  "Decorations",           // Was "Abaya" (8)
  "Abaya",                 // Was "Decorations" (7)
  "Online Shops",          // Was "Arabic Language" (5)
  "Gifts",                 // Was "Hijab" (3)
  "Arabic Calligraphy",    // New category
  "Muslim Therapists"      // New category
];
