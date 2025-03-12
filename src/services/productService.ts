
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/database';

export const createProduct = async (productData: Partial<Product & { isHalalCertified?: boolean }>) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        shop_id: productData.shop_id,
        category: productData.category,
        images: productData.images,
        is_halal_certified: productData.isHalalCertified,
        status: 'active',
        inventory_count: 100, // Default inventory
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error('Error creating product:', error);
      throw error;
    }

    return data?.[0] as Product;
  } catch (error) {
    console.error('Error in createProduct:', error);
    throw error;
  }
};

export const getProductsByShop = async (shopId: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('shop_id', shopId);

    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }

    return data as Product[];
  } catch (error) {
    console.error('Error in getProductsByShop:', error);
    return [];
  }
};

export const getProductById = async (productId: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      return null;
    }

    return data as Product;
  } catch (error) {
    console.error('Error in getProductById:', error);
    return null;
  }
};

export const updateProduct = async (productId: string, updates: Partial<Product>): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', productId)
      .select();

    if (error) {
      console.error('Error updating product:', error);
      return null;
    }

    return data?.[0] as Product;
  } catch (error) {
    console.error('Error in updateProduct:', error);
    return null;
  }
};

export const deleteProduct = async (productId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      console.error('Error deleting product:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    return false;
  }
};

export const getRelatedProducts = async (productId: string, category: string, limit = 4): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .neq('id', productId)
      .limit(limit);

    if (error) {
      console.error('Error fetching related products:', error);
      return [];
    }

    return data as Product[];
  } catch (error) {
    console.error('Error in getRelatedProducts:', error);
    return [];
  }
};
