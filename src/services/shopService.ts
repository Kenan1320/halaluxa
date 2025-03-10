
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/models/product';
import { Shop as ShopModel } from '@/models/shop';

export interface Shop extends ShopModel {}

/**
 * Get all shops with optional limit and category filter
 */
export const getShops = async (limit?: number, category?: string): Promise<Shop[]> => {
  try {
    let query = supabase.from('shops').select('*');
    
    if (category) {
      query = query.eq('category', category);
    }
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching shops:', error);
      return [];
    }
    
    return data as Shop[] || [];
  } catch (error) {
    console.error('Error in getShops:', error);
    return [];
  }
};

/**
 * Alias for getShops for backward compatibility
 */
export const getAllShops = getShops;

/**
 * Get a shop by ID
 */
export const getShopById = async (id: string): Promise<Shop | null> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching shop:', error);
      return null;
    }
    
    return data as Shop;
  } catch (error) {
    console.error('Error in getShopById:', error);
    return null;
  }
};

/**
 * Get the main shop for a user
 */
export const getMainShop = async (): Promise<Shop | null> => {
  try {
    // For demo purposes, just get the first shop
    const { data: shop } = await supabase
      .from('shops')
      .select('*')
      .limit(1)
      .single();
    
    return shop as Shop;
  } catch (error) {
    console.error('Error getting main shop:', error);
    return null;
  }
};

/**
 * Get products for a shop
 */
export const getShopProducts = async (shopId: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', shopId);
    
    if (error) {
      console.error('Error fetching shop products:', error);
      return [];
    }
    
    return data as Product[] || [];
  } catch (error) {
    console.error('Error in getShopProducts:', error);
    return [];
  }
};

/**
 * Upload a product image
 */
export const uploadProductImage = async (
  file: File, 
  onProgress: (progress: number) => void
): Promise<string> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `product-images/${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('products')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      throw error;
    }
    
    const { data: urlData } = supabase.storage
      .from('products')
      .getPublicUrl(data.path);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export default {
  getShops,
  getAllShops,
  getShopById,
  getMainShop,
  getShopProducts,
  uploadProductImage
};
