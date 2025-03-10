export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  isFeatured?: boolean;
  isHalalCertified: boolean;
  createdAt: string;
  sellerId: string;
  sellerName?: string;
  rating?: number;
  reviewCount?: number;
  images: string[];
  variants?: ProductVariant[];
  tags?: string[];
  details?: ProductDetails;
}

export interface ProductVariant {
  id: string;
  name: string;
  price?: number;
  inStock: boolean;
  attributes: {
    [key: string]: string;
  };
}

export interface ProductDetails {
  weight?: string;
  servings?: string;
  ingredients?: string;
  [key: string]: any;
}

export interface ShopProduct extends Product {
  // ShopProduct already inherits all the required properties from Product
}

export interface NewProduct {
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  isFeatured?: boolean;
  isHalalCertified: boolean;
  sellerId: string;
  sellerName?: string;
  images: string[];
  variants?: ProductVariant[];
  tags?: string[];
  details?: ProductDetails;
}

// Define product categories for dropdown menus
export const productCategories = [
  "Food & Groceries",
  "Clothing",
  "Beauty & Personal Care",
  "Health & Wellness",
  "Home & Kitchen",
  "Books & Media",
  "Electronics",
  "Toys & Games",
  "Sports & Outdoors",
  "Baby & Kids",
  "Jewelry & Accessories"
];

// Mapper functions for database operations
export const mapDbProductToModel = (data: any): Product => {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    price: data.price,
    inStock: data.stock > 0,
    category: data.category,
    images: data.images || [],
    sellerId: data.seller_id,
    sellerName: data.seller_name,
    rating: data.rating,
    reviewCount: data.review_count,
    isHalalCertified: data.is_halal_certified,
    details: typeof data.details === 'string' ? JSON.parse(data.details) : data.details || {},
    createdAt: data.created_at
  };
};

export const mapModelToDbProduct = (product: Partial<Product>) => {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.inStock ? 1 : 0, // Convert boolean to number for DB
    category: product.category,
    images: product.images,
    seller_id: product.sellerId,
    seller_name: product.sellerName,
    rating: product.rating,
    review_count: product.reviewCount,
    is_halal_certified: product.isHalalCertified,
    details: product.details ? JSON.stringify(product.details) : '{}'
  };
};
