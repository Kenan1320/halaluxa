
import { Shop, ShopProduct } from '@/models/shop';
import { Product } from '@/models/product';
import { Json } from '@/types/supabase';

export interface DbShop {
  id: string;
  name: string;
  description: string;
  location: string;
  owner_id: string;
  category: string;
  is_verified: boolean;
  logo_url: string | null;
  cover_image: string | null;
  created_at: string;
  updated_at: string;
  rating: number;
  product_count: number | null;
  latitude: number | null;
  longitude: number | null;
  address: string;
  distance?: number | null;
}

export interface DbProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  shop_id: string;
  category: string;
  images: string[];
  created_at: string;
  updated_at: string;
  is_halal_certified: boolean;
  in_stock: boolean;
  seller_id?: string | null;
  shop_name?: string | null;
  details?: Json;
  long_description?: string;
  is_published: boolean;
  stock?: number;
  rating?: number;
}

/**
 * Converts database Shop object to Shop model
 */
export const adaptDbShopToShop = (dbShop: DbShop): Shop => {
  return {
    id: dbShop.id,
    name: dbShop.name,
    description: dbShop.description,
    location: dbShop.location,
    rating: dbShop.rating || 0,
    productCount: dbShop.product_count || 0,
    isVerified: dbShop.is_verified,
    category: dbShop.category,
    logo: dbShop.logo_url,
    coverImage: dbShop.cover_image,
    ownerId: dbShop.owner_id,
    latitude: dbShop.latitude,
    longitude: dbShop.longitude,
    distance: dbShop.distance || null
  };
};

/**
 * Converts database Product to ShopProduct model
 */
export const adaptDbProductToShopProduct = (dbProduct: DbProduct): ShopProduct => {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    price: dbProduct.price,
    description: dbProduct.description,
    category: dbProduct.category,
    images: dbProduct.images,
    sellerId: dbProduct.seller_id || '',
    sellerName: dbProduct.shop_name || '',
    rating: dbProduct.rating || 5,
    isHalalCertified: dbProduct.is_halal_certified,
    inStock: dbProduct.in_stock
  };
};

/**
 * Converts database Product to Product model
 */
export const adaptDbProductToProduct = (dbProduct: DbProduct): Product => {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    description: dbProduct.description,
    price: dbProduct.price,
    images: dbProduct.images,
    category: dbProduct.category,
    shopId: dbProduct.shop_id,
    isHalalCertified: dbProduct.is_halal_certified,
    inStock: dbProduct.in_stock,
    createdAt: dbProduct.created_at,
    sellerId: dbProduct.seller_id || undefined,
    sellerName: dbProduct.shop_name || undefined,
    rating: dbProduct.rating,
    details: dbProduct.details as any
  };
};

export const convertShopProductsToProducts = (shopProducts: ShopProduct[]): Product[] => {
  return shopProducts.map(shopProduct => ({
    id: shopProduct.id,
    name: shopProduct.name,
    description: shopProduct.description,
    price: shopProduct.price,
    images: shopProduct.images,
    category: shopProduct.category,
    shopId: shopProduct.id, // Missing shopId in ShopProduct model
    isHalalCertified: shopProduct.isHalalCertified,
    inStock: shopProduct.inStock,
    createdAt: new Date().toISOString(),
    sellerId: shopProduct.sellerId,
    sellerName: shopProduct.sellerName,
    rating: shopProduct.rating
  }));
};
