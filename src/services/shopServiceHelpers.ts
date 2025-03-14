import { supabase } from '@/integrations/supabase/client';
import { Shop, Product } from '@/types/database';
import { Shop as ModelShop, ShopProduct } from '@/models/shop';
import { Product as ModelProduct } from '@/models/product';

// Mock implementation for setupDatabaseTables
export const setupDatabaseTables = async (): Promise<void> => {
  console.log('Setting up database tables (mock)');
  return Promise.resolve();
};

// Mock implementation for getShops
export const getShops = async (): Promise<Shop[]> => {
  try {
    const { data: shops, error } = await supabase
      .from('shops')
      .select('*');

    if (error) {
      throw error;
    }

    return shops || [];
  } catch (error) {
    console.error('Error fetching shops:', error);
    return [];
  }
};

// Convert database Shop to model Shop
export const mapShopToModel = (shop: Shop): ModelShop => {
  return {
    id: shop.id,
    name: shop.name,
    description: shop.description,
    location: shop.location,
    rating: shop.rating || 0,
    productCount: shop.product_count || 0,
    isVerified: shop.is_verified || false,
    category: shop.category || '',
    logo: shop.logo_url || null,
    logo_url: shop.logo_url || null,
    coverImage: shop.cover_image || null,
    ownerId: shop.owner_id || '',
    latitude: shop.latitude || null,
    longitude: shop.longitude || null,
    distance: shop.distance || null,
    created_at: shop.created_at,
    updated_at: shop.updated_at,
    cover_image: shop.cover_image || null,
    owner_id: shop.owner_id,
    product_count: shop.product_count,
    is_verified: shop.is_verified
  };
};

// Mock implementation for getShopProducts
export const getShopProducts = async (shopId: string): Promise<ShopProduct[]> => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('shop_id', shopId);

    if (error) {
      throw error;
    }

    return (products || []).map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      description: item.description,
      category: item.category,
      images: item.images || [], 
      shop_id: item.shop_id,
      sellerId: item.seller_id || item.shop_id || '', // Use shop_id as seller_id if not available
      sellerName: item.shop_name || 'Shop Owner',
      rating: item.rating || 0,
      created_at: item.created_at,
      updated_at: item.updated_at,
      is_halal_certified: item.is_halal_certified || false,
      in_stock: item.in_stock !== undefined ? item.in_stock : true
    }));
  } catch (error) {
    console.error(`Error fetching products for shop with ID ${shopId}:`, error);
    return [];
  }
};

// Convert database Product to model Product
export const convertToModelProduct = (product: Product): ModelProduct => {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    images: product.images || [],
    category: product.category,
    shopId: product.shop_id || '',
    isHalalCertified: product.is_halal_certified || false,
    inStock: product.in_stock !== undefined ? product.in_stock : true,
    createdAt: product.created_at || new Date().toISOString(),
    sellerId: product.seller_id || product.shop_id || '', // Map shop_id to sellerId
    sellerName: product.shop_name || 'Shop Owner',
    rating: product.rating || 0,
    details: product.details || {},
    shop_id: product.shop_id || '',
    created_at: product.created_at || new Date().toISOString(),
    updated_at: product.updated_at || new Date().toISOString(),
    is_halal_certified: product.is_halal_certified || false,
    in_stock: product.in_stock !== undefined ? product.in_stock : true
  };
};

// Mock implementation for uploadProductImage
export const uploadProductImage = async (file: File): Promise<string> => {
  console.log('Uploading product image (mock):', file.name);
  return Promise.resolve(`https://via.placeholder.com/300?text=${file.name}`);
};
