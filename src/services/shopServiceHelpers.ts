
import { Shop as DBShop } from '@/types/database';
import { Shop as ModelShop } from '@/models/shop';
import { Product, ShopProduct } from '@/models/product';

export const adaptDbProductToShopProduct = (dbProduct: any): ShopProduct => {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    description: dbProduct.description,
    price: dbProduct.price,
    images: dbProduct.images || [],
    category: dbProduct.category,
    shopId: dbProduct.shop_id,
    stock: dbProduct.stock,
    createdAt: dbProduct.created_at,
    updatedAt: dbProduct.updated_at,
    rating: dbProduct.rating || 0,
    featured: dbProduct.featured || false,
    reviewCount: dbProduct.review_count || 0,
    distance: 0 // Default value
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
    distance: 0, // Default value
    deliveryAvailable: dbShop.delivery_available,
    pickupAvailable: dbShop.pickup_available,
    isHalalCertified: dbShop.is_halal_certified
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
    is_halal_certified: modelShop.isHalalCertified
  };
};

// Helper function for when we need to display a product with shop details
export const enrichProductWithShopDetails = (product: Product, shop: ModelShop): ShopProduct => {
  return {
    ...product,
    shopId: shop.id,
    shopName: shop.name,
    shopLogo: shop.logo,
    distance: 0 // Default value
  };
};

// Fix the getShopProducts function that was referenced
export const getShopProducts = async (shopId: string): Promise<ShopProduct[]> => {
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
