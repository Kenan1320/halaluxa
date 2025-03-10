
import { supabase } from '@/integrations/supabase/client';
import type { Shop } from '@/models/shop';
import { convertToModelShop, convertToDbShop } from '@/models/shop';

// Export the Shop type
export type { Shop };

export const getShops = async (limit?: number, category?: string): Promise<Shop[]> => {
  let query = supabase.from('shops').select('*');
  
  if (category) {
    query = query.eq('category', category);
  }
  
  if (limit) {
    query = query.limit(limit);
  }
  
  const { data, error } = await query;
  
  if (error) {
    throw error;
  }
  
  return data.map(convertToModelShop);
};

// Alias for getShops for compatibility
export const getAllShops = getShops;

export const getShopById = async (id: string): Promise<Shop | null> => {
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error("Error fetching shop by ID:", error);
    return null;
  }
  
  return convertToModelShop(data);
};

export const getMainShop = async (): Promise<Shop | null> => {
  try {
    const shopId = localStorage.getItem('mainShopId');
    if (!shopId) {
      return null;
    }
    
    const shop = await getShopById(shopId);
    return shop;
  } catch (error) {
    console.error("Error loading main shop from localStorage:", error);
    return null;
  }
};

export const setMainShop = async (shopId: string): Promise<void> => {
  localStorage.setItem('mainShopId', shopId);
};

export const createShop = async (shop: Shop): Promise<Shop | null> => {
  const { data, error } = await supabase
    .from('shops')
    .insert([convertToDbShop(shop)])
    .select('*')
    .single();
  
  if (error) {
    console.error("Error creating shop:", error);
    return null;
  }
  
  return convertToModelShop(data);
};

export const updateShop = async (id: string, updates: Partial<Shop>): Promise<Shop | null> => {
  const { data, error } = await supabase
    .from('shops')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single();
  
  if (error) {
    console.error("Error updating shop:", error);
    return null;
  }
  
  return convertToModelShop(data);
};

export const deleteShop = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('shops')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting shop:", error);
    return false;
  }
  
  return true;
};

// Add the missing function for getting shop products
export const getShopProducts = async (shopId: string) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('shop_id', shopId);
  
  if (error) {
    console.error("Error fetching shop products:", error);
    return [];
  }
  
  return data.map(convertToModelProduct);
};

// Add the missing function for uploading product images
export const uploadProductImage = async (file: File, productId: string): Promise<string | null> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${productId}-${Math.random()}.${fileExt}`;
  const filePath = `product-images/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    return null;
  }

  const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
  return data.publicUrl;
};

export const convertToModelProduct = (productData: any) => {
  return {
    id: productData.id,
    name: productData.name,
    description: productData.description,
    price: productData.price,
    category: productData.category,
    inStock: productData.in_stock,
    isHalalCertified: productData.is_halal_certified,
    sellerId: productData.seller_id,
    images: productData.images || [],
    createdAt: productData.created_at
  };
};
