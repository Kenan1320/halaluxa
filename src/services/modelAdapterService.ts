
import { DBShop, Category, UUID } from '@/models/types';
import { Shop } from '@/models/shop';
import { Product, ShopProduct, adaptDatabaseProductToProduct } from '@/models/product';

/**
 * Convert database shop model to frontend shop model
 */
export const adaptDbShopToShop = (dbShop: DBShop): Shop => {
  return {
    id: dbShop.id,
    name: dbShop.name,
    description: dbShop.description,
    location: dbShop.location,
    category: dbShop.category,
    rating: {
      average: dbShop.rating || 0,
      count: 0 // Default, should be updated if available
    },
    productCount: dbShop.product_count || 0,
    isVerified: dbShop.is_verified || false,
    logo: dbShop.logo_url,
    coverImage: dbShop.cover_image,
    ownerId: dbShop.owner_id,
    latitude: dbShop.latitude,
    longitude: dbShop.longitude, 
    distance: dbShop.distance,
    deliveryAvailable: dbShop.delivery_available,
    pickupAvailable: dbShop.pickup_available,
    isHalalCertified: dbShop.is_halal_certified,
    address: dbShop.address,
    displayMode: dbShop.display_mode || 'online',
    // Legacy properties for backward compatibility
    logo_url: dbShop.logo_url,
    product_count: dbShop.product_count,
    is_verified: dbShop.is_verified,
    cover_image: dbShop.cover_image,
    owner_id: dbShop.owner_id,
    delivery_available: dbShop.delivery_available,
    pickup_available: dbShop.pickup_available,
    is_halal_certified: dbShop.is_halal_certified,
    display_mode: dbShop.display_mode
  };
};

/**
 * Convert frontend shop model to database shop model
 */
export const adaptShopToDbShop = (shop: Shop): DBShop => {
  return {
    id: shop.id,
    name: shop.name,
    description: shop.description,
    logo_url: shop.logo || shop.logo_url,
    category: shop.category,
    location: shop.location,
    rating: typeof shop.rating === 'object' ? shop.rating.average : shop.rating,
    product_count: shop.productCount || shop.product_count || 0,
    is_verified: shop.isVerified || shop.is_verified || false,
    owner_id: shop.ownerId || shop.owner_id || '',
    latitude: shop.latitude,
    longitude: shop.longitude,
    cover_image: shop.coverImage || shop.cover_image,
    delivery_available: shop.deliveryAvailable || shop.delivery_available,
    pickup_available: shop.pickupAvailable || shop.pickup_available,
    is_halal_certified: shop.isHalalCertified || shop.is_halal_certified,
    address: shop.address,
    display_mode: shop.displayMode || shop.display_mode,
    distance: shop.distance
  };
};

/**
 * Convert an array of database shops to frontend shop models
 */
export const adaptDbShopsToShops = (dbShops: DBShop[]): Shop[] => {
  return dbShops.map(adaptDbShopToShop);
};

/**
 * Convert database product to frontend product model
 */
export const adaptDbProductToProduct = (dbProduct: any): Product => {
  return adaptDatabaseProductToProduct(dbProduct);
};

/**
 * Adapt database product to shop product (with shop details)
 */
export const adaptDbProductToShopProduct = (dbProduct: any, shopDetails?: any): ShopProduct => {
  const product = adaptDatabaseProductToProduct(dbProduct);
  
  return {
    ...product,
    shopId: dbProduct.shop_id,
    shopName: shopDetails?.name || dbProduct.shop_name || '',
    shopLogo: shopDetails?.logo_url || dbProduct.shop_logo || '',
    distance: shopDetails?.distance || dbProduct.distance || null
  };
};
