
import { Shop as TypesShop } from '@/types/shop';
import { Shop as DatabaseShop } from '@/types/database';
import { Shop as ModelsShop } from '@/models/shop';

/**
 * Normalizes a shop object to ensure it conforms to the expected Shop type
 * This is needed because we have multiple Shop interfaces in the codebase
 */
export function normalizeShop(shop: any): TypesShop {
  return {
    id: shop.id,
    name: shop.name,
    description: shop.description || '',
    location: shop.location || '',
    logo_url: shop.logo_url || shop.logo || '',
    cover_image: shop.cover_image || shop.coverImage || '',
    owner_id: shop.owner_id || shop.ownerId || '',
    category: shop.category || '',
    is_verified: shop.is_verified ?? shop.isVerified ?? false,
    rating: shop.rating || 0,
    product_count: shop.product_count ?? shop.productCount ?? 0,
    created_at: shop.created_at || new Date().toISOString(),
    updated_at: shop.updated_at || new Date().toISOString(),
    latitude: shop.latitude || null,
    longitude: shop.longitude || null,
    distance: shop.distance || null,
    address: shop.address || '',
    // Additional fields that were causing TypeScript errors
    phone: shop.phone || '',
    email: shop.email || '',
    website: shop.website || '',
    is_featured: shop.is_featured ?? false
  };
}

/**
 * Converts any shop object to a TypesShop array
 */
export function normalizeShopArray(shops: any[]): TypesShop[] {
  return shops.map(normalizeShop);
}
