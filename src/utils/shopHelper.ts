
import { Shop as TypesShop } from '@/types/shop';
import { Shop as DatabaseShop } from '@/types/database';
import { Shop as ModelsShop } from '@/models/shop';

/**
 * Normalizes a shop object to ensure it conforms to the expected Shop type
 * This is needed because we have multiple Shop interfaces in the codebase
 */
export function normalizeShop(shop: any): TypesShop {
  const now = new Date().toISOString();
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
    created_at: shop.created_at || now,
    updated_at: shop.updated_at || now,
    latitude: shop.latitude || null,
    longitude: shop.longitude || null,
    distance: shop.distance || null,
    logo: shop.logo || shop.logo_url || '',
    address: shop.address || '',
    status: shop.status || 'pending',
    // Only include these fields if they exist on the incoming shop object
    ...(shop.phone && { phone: shop.phone }),
    ...(shop.email && { email: shop.email }),
    ...(shop.website && { website: shop.website }),
    ...(shop.is_featured !== undefined && { is_featured: shop.is_featured })
  };
}

/**
 * Converts any shop object to a TypesShop array
 */
export function normalizeShopArray(shops: any[]): TypesShop[] {
  return shops.map(normalizeShop);
}
