
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
    stock: dbProduct.stock || 0,
    isHalalCertified: dbProduct.is_halal_certified || false,
    inStock: dbProduct.in_stock !== undefined ? dbProduct.in_stock : true,
    details: dbProduct.details || {},
    createdAt: dbProduct.created_at,
    updatedAt: dbProduct.updated_at,
    rating: dbProduct.rating || 0,
    reviewCount: dbProduct.review_count || 0,
    featured: dbProduct.featured || false,
    sellerId: dbProduct.seller_id,
    sellerName: dbProduct.seller_name,
    deliveryMode: dbProduct.delivery_mode || 'online',
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
    shop_id: product.shopId,
    stock: product.stock,
    is_halal_certified: product.isHalalCertified,
    in_stock: product.inStock,
    details: product.details,
    created_at: product.createdAt,
    updated_at: product.updatedAt,
    rating: product.rating,
    review_count: product.reviewCount,
    featured: product.featured,
    seller_id: product.sellerId,
    seller_name: product.sellerName,
    delivery_mode: product.deliveryMode,
    pickup_options: product.pickupOptions
  };
};
