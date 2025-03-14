
import { Shop } from '@/types/shop';
import { Product } from '@/models/product';

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
 * Normalizes product data to ensure it has consistent property names
 */
export const normalizeProduct = (product: any): Product => {
  if (!product) return {} as Product;
  
  const normalized: Product = {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    images: product.images || [],
    category: product.category,
    shop_id: product.shop_id || product.shopId,
    is_halal_certified: product.is_halal_certified || product.isHalalCertified,
    in_stock: product.in_stock ?? product.inStock ?? true,
    created_at: product.created_at || product.createdAt,
    updated_at: product.updated_at || product.updatedAt,
    details: product.details || {},
    seller_id: product.seller_id || product.sellerId,
    seller_name: product.seller_name || product.sellerName,
    rating: product.rating,
    long_description: product.long_description,
    is_published: product.is_published,
    stock: product.stock,
    pickup_options: product.pickup_options || { store: true, curbside: false },
    delivery_mode: product.delivery_mode || 'pickup',
  };
  
  return normalized;
};
