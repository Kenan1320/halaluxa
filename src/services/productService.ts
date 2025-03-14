
import { supabase } from '@/lib/supabaseClient';
import { Product } from '@/models/product';

export const getProducts = async (limit?: number, offset?: number, category?: string) => {
  try {
    let query = supabase.from('products').select('*');
    
    if (category) {
      query = query.eq('category', category);
    }
    
    if (limit) {
      query = query.limit(limit);
    }
    
    if (offset) {
      query = query.range(offset, offset + (limit || 10) - 1);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }
    
    return data.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      images: product.images || [],
      category: product.category,
      shopId: product.shop_id,
      stock: product.stock || 0,
      createdAt: product.created_at,
      updatedAt: product.updated_at
    }));
  } catch (error) {
    console.error('Unexpected error fetching products:', error);
    return [];
  }
};

export const getProductById = async (id: string) => {
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
    
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      images: data.images || [],
      category: data.category,
      shopId: data.shop_id,
      stock: data.stock || 0,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error('Unexpected error fetching product:', error);
    return null;
  }
};

export const createProduct = async (product: Partial<Product>) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          name: product.name,
          description: product.description,
          price: product.price,
          images: product.images,
          category: product.category,
          shop_id: product.shopId,
          stock: product.stock || 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select();
      
    if (error) {
      console.error('Error creating product:', error);
      return null;
    }
    
    return data[0];
  } catch (error) {
    console.error('Unexpected error creating product:', error);
    return null;
  }
};

export const updateProduct = async (id: string, product: Partial<Product>) => {
  try {
    const updateData: any = {
      updated_at: new Date().toISOString()
    };
    
    if (product.name !== undefined) updateData.name = product.name;
    if (product.description !== undefined) updateData.description = product.description;
    if (product.price !== undefined) updateData.price = product.price;
    if (product.images !== undefined) updateData.images = product.images;
    if (product.category !== undefined) updateData.category = product.category;
    if (product.shopId !== undefined) updateData.shop_id = product.shopId;
    if (product.stock !== undefined) updateData.stock = product.stock;
    
    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select();
      
    if (error) {
      console.error('Error updating product:', error);
      return null;
    }
    
    return data[0];
  } catch (error) {
    console.error('Unexpected error updating product:', error);
    return null;
  }
};

export const deleteProduct = async (id: string) => {
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
    console.error('Unexpected error deleting product:', error);
    return false;
  }
};

export const queryFunction = () => getProducts();
