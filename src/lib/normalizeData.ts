
import { Shop } from '@/types/shop';
import { Product } from '@/types/database';

/**
 * Normalizes shop data to ensure it has consistent property names
 * This helps with handling both snake_case DB fields and camelCase frontend fields
 */
export const normalizeShop = (shop: any): Shop => {
  if (!shop) return {} as Shop;
  
  return {
    id: shop.id,
    name: shop.name,
    description: shop.description,
    location: shop.location,
    category: shop.category,
    logo_url: shop.logo_url || shop.logo,
    cover_image: shop.cover_image || shop.coverImage,
    owner_id: shop.owner_id || shop.ownerId,
    rating: shop.rating,
    product_count: shop.product_count || shop.productCount,
    is_verified: shop.is_verified || shop.isVerified,
    latitude: shop.latitude,
    longitude: shop.longitude,
    created_at: shop.created_at || shop.createdAt,
    updated_at: shop.updated_at || shop.updatedAt,
    distance: shop.distance
  };
};

/**
 * Normalizes an array of shop data
 */
export const normalizeShopArray = (shops: any[]): Shop[] => {
  if (!shops) return [];
  return shops.map(shop => normalizeShop(shop));
};

/**
 * Normalizes product data to ensure it has consistent property names
 */
export function normalizeProduct(product: any): Product {
  if (!product) return {} as Product;
  
  const normalized: Product = {
    id: product.id,
    name: product.name,
    description: product.description,
    long_description: product.long_description || '',
    price: product.price,
    shop_id: product.shop_id,
    images: product.images || [],
    category: product.category,
    stock: product.stock || 0,
    created_at: product.created_at || new Date().toISOString(),
    updated_at: product.updated_at || new Date().toISOString(),
    is_published: product.is_published || false,
    is_halal_certified: product.is_halal_certified || false,
    details: product.details || {},
    in_stock: product.in_stock || false,
    delivery_mode: product.delivery_mode || 'pickup',
    pickup_options: product.pickup_options || { store: true, curbside: false }
  };
  
  return normalized;
}
