
import { Shop as TypesShop } from '@/types/shop';
import { Shop as DatabaseShop } from '@/types/database';
import { Shop as ModelsShop } from '@/models/shop';

/**
 * Convert between different Shop interface implementations
 */
export function adaptShopType(shop: any, targetType: 'types' | 'database' | 'models'): any {
  if (!shop) return null;
  
  // Cast to a common baseline with all possible properties
  const baseShop = {
    ...shop,
    cover_image: shop.cover_image || shop.coverImage || '',
    rating: typeof shop.rating === 'object' ? shop.rating : { average: shop.rating || 0, count: 0 },
    status: shop.status || 'pending',
    is_featured: shop.is_featured || shop.isFeatured || false,
    email: shop.email || '',
    phone: shop.phone || '',
    website: shop.website || '',
  };
  
  if (targetType === 'types') {
    // For types/shop.ts Shop
    return {
      ...baseShop,
      rating: typeof baseShop.rating === 'object' ? baseShop.rating.average : baseShop.rating,
    } as TypesShop;
  } else if (targetType === 'database') {
    // For types/database.ts Shop
    return baseShop as DatabaseShop;
  } else {
    // For models/shop.ts Shop
    return {
      ...baseShop,
      rating: typeof baseShop.rating === 'object' ? baseShop.rating.average : baseShop.rating,
    } as ModelsShop;
  }
}

/**
 * Adapt Product types between different interfaces
 */
export function adaptProductType(product: any): any {
  if (!product) return null;
  
  return {
    ...product,
    seller_id: product.seller_id || product.sellerId || '',
    seller_name: product.seller_name || product.sellerName || '',
    image_url: product.image_url || (product.images && product.images.length > 0 ? product.images[0] : ''),
  };
}

/**
 * Convert an array of shops to the target type
 */
export function adaptShopArray(shops: any[], targetType: 'types' | 'database' | 'models'): any[] {
  return shops.map(shop => adaptShopType(shop, targetType));
}
