
import { UUID, Timestamp, DeliveryMode } from './types';

export interface ProductDetails {
  weight?: string;
  servings?: string;
  ingredients?: string;
  origin?: string;
  [key: string]: any;
}

export interface Product {
  id: UUID;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  shopId: UUID;
  stock?: number;
  isHalalCertified: boolean;
  inStock?: boolean;
  details?: ProductDetails;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  rating?: number;
  reviewCount?: number;
  featured?: boolean;
  sellerId?: UUID;
  sellerName?: string;
  deliveryMode?: DeliveryMode;
  pickupOptions?: {
    store: boolean;
    curbside: boolean;
  };
  // Legacy properties for compatibility
  shop_id?: UUID;
  is_halal_certified?: boolean;
  in_stock?: boolean;
  created_at?: Timestamp;
  updated_at?: Timestamp;
  seller_id?: UUID;
  seller_name?: string;
  delivery_mode?: DeliveryMode;
}

export interface ShopProduct extends Product {
  shopId: UUID;
  shopName?: string;
  shopLogo?: string;
  distance?: number;
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

// Utility functions to help with type conversion
export const adaptDatabaseProductToProduct = (dbProduct: any): Product => {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    description: dbProduct.description || '',
    price: dbProduct.price || 0,
    images: dbProduct.images || [],
    category: dbProduct.category || '',
    shopId: dbProduct.shop_id,
    shop_id: dbProduct.shop_id,
    stock: dbProduct.stock || 0,
    isHalalCertified: dbProduct.is_halal_certified || false,
    is_halal_certified: dbProduct.is_halal_certified || false,
    inStock: dbProduct.in_stock !== undefined ? dbProduct.in_stock : true,
    in_stock: dbProduct.in_stock !== undefined ? dbProduct.in_stock : true,
    details: dbProduct.details || {},
    createdAt: dbProduct.created_at,
    created_at: dbProduct.created_at,
    updatedAt: dbProduct.updated_at,
    updated_at: dbProduct.updated_at,
    rating: dbProduct.rating || 0,
    reviewCount: dbProduct.review_count || 0,
    featured: dbProduct.featured || false,
    sellerId: dbProduct.seller_id,
    seller_id: dbProduct.seller_id,
    sellerName: dbProduct.seller_name || dbProduct.shops?.name,
    seller_name: dbProduct.seller_name || dbProduct.shops?.name,
    deliveryMode: dbProduct.delivery_mode || 'online',
    delivery_mode: dbProduct.delivery_mode || 'online',
    pickupOptions: dbProduct.pickup_options || { store: false, curbside: false }
  };
};

export const adaptProductToDatabaseProduct = (product: Product): any => {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    images: product.images,
    category: product.category,
    shop_id: product.shopId || product.shop_id,
    stock: product.stock,
    is_halal_certified: product.isHalalCertified || product.is_halal_certified,
    in_stock: product.inStock || product.in_stock,
    details: product.details,
    created_at: product.createdAt || product.created_at,
    updated_at: product.updatedAt || product.updated_at,
    rating: product.rating,
    review_count: product.reviewCount,
    featured: product.featured,
    seller_id: product.sellerId || product.seller_id,
    seller_name: product.sellerName || product.seller_name,
    delivery_mode: product.deliveryMode || product.delivery_mode,
    pickup_options: product.pickupOptions
  };
};
