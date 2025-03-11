
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

// Product categories for use in forms and filters
export const productCategories = [
  "Food & Groceries",
  "Clothing & Accessories",
  "Health & Beauty",
  "Home & Kitchen",
  "Books & Learning",
  "Religious Items",
  "Technology",
  "Toys & Games",
  "Baby & Kids",
  "Other"
];
