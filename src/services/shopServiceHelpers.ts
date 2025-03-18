
import { supabase } from '@/integrations/supabase/client';
// Update import to use the same Shop type everywhere
import { Shop } from '@/types/shop';
import { ShopProduct } from '@/models/shop';
import { Product as ModelProduct } from '@/models/product';
import { Product as DatabaseProduct } from '@/types/database';
import { normalizeShop, normalizeProduct } from '@/lib/normalizeData';

export const setupDatabaseTables = async () => {
  // This function would normally set up database tables
  // But we're just providing a mock for type consistency
  console.log('Setting up database tables');
  return true;
};

export const dbShopToModel = (shop: any): Shop => {
  return normalizeShop(shop);
};

export const convertToModelProduct = (product: any): ModelProduct => {
  const normalized = normalizeProduct(product);
  // Add the required fields for ModelProduct
  return {
    ...normalized,
    seller_id: product.seller_id || '',
    seller_name: product.seller_name || '',
  } as ModelProduct;
};

export const getShops = async (): Promise<Shop[]> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*');
      
    if (error) throw error;
    
    return data?.map(shop => normalizeShop(shop)) || [];
  } catch (error) {
    console.error('Error getting shops:', error);
    return [];
  }
};

export const getShopProducts = async (shopId: string): Promise<ShopProduct[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('shop_id', shopId);
      
    if (error) throw error;
    
    return data?.map(product => {
      const normalized = normalizeProduct(product);
      return {
        ...normalized,
        seller_id: '',
        seller_name: '',
      } as unknown as ShopProduct;
    }) || [];
  } catch (error) {
    console.error('Error getting shop products:', error);
    return [];
  }
};

export const uploadProductImage = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `product-images/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, file);
      
    if (uploadError) throw uploadError;
    
    const { data } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);
      
    return data?.publicUrl || null;
  } catch (error) {
    console.error('Error uploading product image:', error);
    return null;
  }
};
