
import { supabase } from '@/integrations/supabase/client';
import { Product, ProductCategory, productCategories } from '@/models/product';
import { getRandomId } from '@/lib/utils';

export async function getProducts(limit = 10, category?: string): Promise<Product[]> {
  try {
    let query = supabase
      .from('products')
      .select('*')
      .eq('inStock', true);
    
    if (category && category !== 'All') {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query
      .order('createdAt', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getProducts:', error);
    return [];
  }
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('inStock', true)
      .limit(limit);
    
    if (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getFeaturedProducts:', error);
    return [];
  }
}

export async function getProductsByShop(shopId: string): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('sellerId', shopId)
      .order('createdAt', { ascending: false });
    
    if (error) {
      console.error('Error fetching products by shop:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getProductsByShop:', error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
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
    
    return data;
  } catch (error) {
    console.error('Error in getProductById:', error);
    return null;
  }
}

export async function searchProducts(query: string, limit = 20): Promise<Product[]> {
  try {
    // Using ilike for case-insensitive search
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(limit);
    
    if (error) {
      console.error('Error searching products:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in searchProducts:', error);
    return [];
  }
}

export async function addProduct(product: Partial<Product>): Promise<boolean> {
  try {
    // Generate a unique ID if one isn't provided
    const productWithId = {
      ...product,
      id: product.id || getRandomId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const { error } = await supabase
      .from('products')
      .insert(productWithId);
    
    if (error) {
      console.error('Error adding product:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in addProduct:', error);
    return false;
  }
}

export async function updateProduct(product: Partial<Product>): Promise<boolean> {
  if (!product.id) {
    console.error('Product ID is required for update');
    return false;
  }
  
  try {
    const productWithTimestamp = {
      ...product,
      updatedAt: new Date().toISOString(),
    };
    
    const { error } = await supabase
      .from('products')
      .update(productWithTimestamp)
      .eq('id', product.id);
    
    if (error) {
      console.error('Error updating product:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateProduct:', error);
    return false;
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
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
}
