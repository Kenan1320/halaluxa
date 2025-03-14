import { Shop as DBShop } from '@/types/database';
import { Shop as ModelShop } from '@/models/shop';
import { Product, ShopProduct } from '@/models/product';
import { UUID } from '@/models/types';

export const adaptDbProductToShopProduct = (dbProduct: any): ShopProduct => {
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
    createdAt: dbProduct.created_at,
    updatedAt: dbProduct.updated_at,
    rating: dbProduct.rating || 0,
    reviewCount: dbProduct.review_count || 0,
    featured: dbProduct.featured || false,
    sellerId: dbProduct.seller_id,
    sellerName: dbProduct.seller_name || dbProduct.shop_name,
    shopName: dbProduct.shop_name,
    shopLogo: dbProduct.shop_logo,
    distance: dbProduct.distance || 0
  };
};

export const adaptDbShopToModelShop = (dbShop: DBShop): ModelShop => {
  return {
    id: dbShop.id,
    name: dbShop.name,
    description: dbShop.description,
    logo: dbShop.logo_url,
    category: dbShop.category,
    location: dbShop.location,
    rating: dbShop.rating || 0,
    productCount: dbShop.product_count || 0,
    isVerified: dbShop.is_verified || false,
    ownerId: dbShop.owner_id,
    latitude: dbShop.latitude,
    longitude: dbShop.longitude,
    coverImage: dbShop.cover_image,
    distance: dbShop.distance || 0,
    deliveryAvailable: dbShop.delivery_available,
    pickupAvailable: dbShop.pickup_available,
    isHalalCertified: dbShop.is_halal_certified,
    createdAt: dbShop.created_at,
    updatedAt: dbShop.updated_at,
    address: dbShop.address,
    displayMode: dbShop.display_mode
  };
};

export const adaptModelShopToDBShop = (modelShop: ModelShop): Partial<DBShop> => {
  return {
    id: modelShop.id,
    name: modelShop.name,
    description: modelShop.description,
    logo_url: modelShop.logo,
    category: modelShop.category,
    location: modelShop.location,
    rating: modelShop.rating,
    product_count: modelShop.productCount,
    is_verified: modelShop.isVerified,
    owner_id: modelShop.ownerId,
    latitude: modelShop.latitude,
    longitude: modelShop.longitude,
    cover_image: modelShop.coverImage,
    delivery_available: modelShop.deliveryAvailable,
    pickup_available: modelShop.pickupAvailable,
    is_halal_certified: modelShop.isHalalCertified,
    created_at: modelShop.createdAt,
    updated_at: modelShop.updatedAt,
    address: modelShop.address,
    display_mode: modelShop.displayMode
  };
};

// Helper function for when we need to display a product with shop details
export const enrichProductWithShopDetails = (product: Product, shop: ModelShop): ShopProduct => {
  return {
    ...product,
    shopId: shop.id,
    shopName: shop.name,
    shopLogo: shop.logo,
    distance: 0
  };
};

// Get shop products - this is now redundant as we have the function in shopService.ts
// Keeping for backward compatibility
export const getShopProducts = async (shopId: UUID): Promise<ShopProduct[]> => {
  try {
    const response = await fetch(`/api/shops/${shopId}/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch shop products');
    }
    const products = await response.json();
    return products.map(adaptDbProductToShopProduct);
  } catch (error) {
    console.error('Error fetching shop products:', error);
    return [];
  }
};
