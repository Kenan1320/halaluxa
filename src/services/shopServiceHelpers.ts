
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
export const getShops = async (): Promise<ModelShop[]> => {
  try {
    const { data: shops, error } = await supabase
      .from('shops')
      .select('*');

    if (error) {
      throw error;
    }

    return (shops || []).map(mapShopToModel);
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
    productCount: shop.productCount || 0,
    isVerified: shop.isVerified || false,
    category: shop.category || '',
    logo: shop.logo || null,
    coverImage: shop.coverImage || null,
    ownerId: shop.ownerId || '',
    latitude: shop.latitude || null,
    longitude: shop.longitude || null,
    distance: shop.distance || null
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
      sellerId: item.seller_id || '',
      sellerName: 'Shop Owner',
      rating: 0
    }));
  } catch (error) {
    console.error(`Error fetching products for shop with ID ${shopId}:`, error);
    return [];
  }
};

// Convert database Product to model Product
export const convertToModelProduct = (product: any): ModelProduct => {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    images: product.images || [],
    category: product.category,
    shopId: product.shop_id,
    isHalalCertified: product.is_halal_certified || false,
    inStock: product.in_stock !== false,
    createdAt: product.created_at
  };
};

// Mock implementation for uploadProductImage
export const uploadProductImage = async (file: File): Promise<string> => {
  console.log('Uploading product image (mock):', file.name);
  return Promise.resolve(`https://via.placeholder.com/300?text=${file.name}`);
};
