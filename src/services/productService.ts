
import { supabase } from '@/lib/supabaseClient';
import { Product } from '@/models/product';
import { adaptDbProductToProduct } from './shopServiceHelpers';

export const getProducts = async (
  limit: number = 20,
  offset: number = 0,
  category?: string
): Promise<Product[]> => {
  try {
    let query = supabase.from('products').select('*');

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    return data.map(product => adaptDbProductToProduct(product));
  } catch (error) {
    console.error('Unexpected error fetching products:', error);
    return [];
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
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

    return adaptDbProductToProduct(data);
  } catch (error) {
    console.error('Unexpected error fetching product:', error);
    return null;
  }
};

export const createProduct = async (product: Partial<Product>): Promise<Product | null> => {
  try {
    const newProduct = {
      name: product.name,
      description: product.description,
      price: product.price,
      shop_id: product.shopId,
      category: product.category,
      images: product.images || [],
      is_halal_certified: product.isHalalCertified || false,
      in_stock: product.inStock || true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      details: product.details || {},
      is_published: true
    };

    const { data, error } = await supabase
      .from('products')
      .insert([newProduct])
      .select()
      .single();

    if (error) {
      console.error('Error creating product:', error);
      return null;
    }

    return adaptDbProductToProduct(data);
  } catch (error) {
    console.error('Unexpected error creating product:', error);
    return null;
  }
};

export const updateProduct = async (
  id: string,
  updates: Partial<Product>
): Promise<Product | null> => {
  try {
    // Convert from our Product model to DB format
    const dbUpdates: any = {};
    
    if (updates.name) dbUpdates.name = updates.name;
    if (updates.description) dbUpdates.description = updates.description;
    if (updates.price !== undefined) dbUpdates.price = updates.price;
    if (updates.category) dbUpdates.category = updates.category;
    if (updates.images) dbUpdates.images = updates.images;
    if (updates.isHalalCertified !== undefined) dbUpdates.is_halal_certified = updates.isHalalCertified;
    if (updates.inStock !== undefined) dbUpdates.in_stock = updates.inStock;
    if (updates.details) dbUpdates.details = updates.details;
    
    dbUpdates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('products')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating product:', error);
      return null;
    }

    return adaptDbProductToProduct(data);
  } catch (error) {
    console.error('Unexpected error updating product:', error);
    return null;
  }
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error deleting product:', error);
    return false;
  }
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
      .limit(50);

    if (error) {
      console.error('Error searching products:', error);
      return [];
    }

    return data.map(product => adaptDbProductToProduct(product));
  } catch (error) {
    console.error('Unexpected error searching products:', error);
    return [];
  }
};

export const getProductsByShopId = async (shopId: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('shop_id', shopId);

    if (error) {
      console.error('Error fetching products by shop ID:', error);
      return [];
    }

    return data.map(product => adaptDbProductToProduct(product));
  } catch (error) {
    console.error('Unexpected error fetching products by shop ID:', error);
    return [];
  }
};
