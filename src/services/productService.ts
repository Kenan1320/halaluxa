import { supabase } from '@/integrations/supabase/client';
import { Product as DbProduct } from '@/types/database';
import { Product as ModelProduct } from '@/models/product';

// Convert database product to model product
const convertToModelProduct = (product: DbProduct): ModelProduct => {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    shopId: product.shop_id,
    category: product.category,
    images: product.images || [],
    isHalalCertified: product.is_halal_certified,
    inStock: product.in_stock,
    createdAt: product.created_at,
    sellerId: product.seller_id || product.shop_id,
    sellerName: product.shop_name || '', // This would typically come from a join
    rating: product.rating || 0, // Default rating
    details: product.details || {},
    shop_id: product.shop_id,
    created_at: product.created_at,
    updated_at: product.updated_at,
    is_halal_certified: product.is_halal_certified,
    in_stock: product.in_stock
  };
};

// Add getFeaturedProducts function
export const getFeaturedProducts = async (): Promise<ModelProduct[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(6)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }

    // Convert to model products
    return (data || []).map(convertToModelProduct);
  } catch (error) {
    console.error('Error in getFeaturedProducts:', error);
    return [];
  }
};

// Add createProduct function
export const createProduct = async (productData: Partial<DbProduct>): Promise<DbProduct | null> => {
  try {
    // Ensure required fields are present
    if (!productData.name || !productData.description || !productData.price || 
        !productData.shop_id || !productData.category) {
      console.error('Missing required fields for product creation');
      return null;
    }
    
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        shop_id: productData.shop_id,
        category: productData.category,
        images: productData.images || [],
        is_halal_certified: productData.is_halal_certified || false,
        in_stock: productData.in_stock !== undefined ? productData.in_stock : true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating product:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in createProduct:', error);
    return null;
  }
};

export const getProducts = async (): Promise<ModelProduct[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    return (data || []).map(convertToModelProduct);
  } catch (error) {
    console.error('Error in getProducts:', error);
    return [];
  }
};

export const getProductById = async (id: string): Promise<ModelProduct | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      return null;
    }

    return convertToModelProduct(data);
  } catch (error) {
    console.error('Error in getProductById:', error);
    return null;
  }
};

export const getProductsByShopId = async (shopId: string): Promise<ModelProduct[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products by shop ID:', error);
      return [];
    }

    return (data || []).map(convertToModelProduct);
  } catch (error) {
    console.error('Error in getProductsByShopId:', error);
    return [];
  }
};

export const getProductsByCategory = async (category: string): Promise<ModelProduct[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }

    return (data || []).map(convertToModelProduct);
  } catch (error) {
    console.error('Error in getProductsByCategory:', error);
    return [];
  }
};

export const updateProduct = async (id: string, updates: Partial<DbProduct>): Promise<ModelProduct | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update({
        ...updates, 
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating product:', error);
      return null;
    }

    return convertToModelProduct(data);
  } catch (error) {
    console.error('Error in updateProduct:', error);
    return null;
  }
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

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

export const searchProducts = async (query: string): Promise<ModelProduct[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching products:', error);
      return [];
    }

    return (data || []).map(convertToModelProduct);
  } catch (error) {
    console.error('Error in searchProducts:', error);
    return [];
  }
};
