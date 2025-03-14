
import { supabase } from '@/integrations/supabase/client';
import { Product, adaptDatabaseProductToProduct } from '@/models/product';
import { UUID } from '@/models/types';

export const getProducts = async (limit?: number, offset?: number): Promise<Product[]> => {
  try {
    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (limit) {
      query = query.limit(limit);
    }
    
    if (offset) {
      query = query.range(offset, offset + (limit || 10) - 1);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return (data || []).map(item => adaptDatabaseProductToProduct(item));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const getProductById = async (id: UUID): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data ? adaptDatabaseProductToProduct(data) : null;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    return null;
  }
};

export const getProductsByShopId = async (shopId: UUID, limit?: number): Promise<Product[]> => {
  try {
    let query = supabase
      .from('products')
      .select('*')
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false });
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return (data || []).map(item => adaptDatabaseProductToProduct(item));
  } catch (error) {
    console.error(`Error fetching products for shop ${shopId}:`, error);
    return [];
  }
};

export const createProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product | null> => {
  try {
    const dbProduct = {
      id: crypto.randomUUID(),
      name: product.name,
      description: product.description || '',
      price: product.price,
      images: product.images || [],
      category: product.category || '',
      shop_id: product.shopId,
      stock: product.stock || 0,
      is_halal_certified: product.isHalalCertified || false,
      in_stock: product.inStock !== undefined ? product.inStock : true,
      details: product.details || {},
      created_at: new Date().toISOString(),
      rating: product.rating || 0,
      review_count: product.reviewCount || 0,
      featured: product.featured || false,
      seller_id: product.sellerId,
      seller_name: product.sellerName,
      delivery_mode: product.deliveryMode || 'online',
      pickup_options: product.pickupOptions || { store: false, curbside: false }
    };
    
    const { data, error } = await supabase
      .from('products')
      .insert([dbProduct])
      .select()
      .single();
    
    if (error) throw error;
    
    return data ? adaptDatabaseProductToProduct(data) : null;
  } catch (error) {
    console.error('Error creating product:', error);
    return null;
  }
};

export const updateProduct = async (id: UUID, product: Partial<Product>): Promise<Product | null> => {
  try {
    const updates: any = {};
    
    if (product.name !== undefined) updates.name = product.name;
    if (product.description !== undefined) updates.description = product.description;
    if (product.price !== undefined) updates.price = product.price;
    if (product.images !== undefined) updates.images = product.images;
    if (product.category !== undefined) updates.category = product.category;
    if (product.stock !== undefined) updates.stock = product.stock;
    if (product.isHalalCertified !== undefined) updates.is_halal_certified = product.isHalalCertified;
    if (product.inStock !== undefined) updates.in_stock = product.inStock;
    if (product.details !== undefined) updates.details = product.details;
    if (product.rating !== undefined) updates.rating = product.rating;
    if (product.reviewCount !== undefined) updates.review_count = product.reviewCount;
    if (product.featured !== undefined) updates.featured = product.featured;
    if (product.deliveryMode !== undefined) updates.delivery_mode = product.deliveryMode;
    if (product.pickupOptions !== undefined) updates.pickup_options = product.pickupOptions;
    
    updates.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data ? adaptDatabaseProductToProduct(data) : null;
  } catch (error) {
    console.error(`Error updating product with ID ${id}:`, error);
    return null;
  }
};

export const deleteProduct = async (id: UUID): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Error deleting product with ID ${id}:`, error);
    return false;
  }
};

export const getFeaturedProducts = async (limit: number = 8): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .limit(limit);
    
    if (error) throw error;
    
    return (data || []).map(item => adaptDatabaseProductToProduct(item));
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
};

export const getProductsByCategory = async (category: string, limit?: number): Promise<Product[]> => {
  try {
    let query = supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return (data || []).map(item => adaptDatabaseProductToProduct(item));
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    return [];
  }
};

export const searchProducts = async (term: string, limit?: number): Promise<Product[]> => {
  try {
    let query = supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${term}%,description.ilike.%${term}%,category.ilike.%${term}%`)
      .order('created_at', { ascending: false });
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return (data || []).map(item => adaptDatabaseProductToProduct(item));
  } catch (error) {
    console.error(`Error searching products with term ${term}:`, error);
    return [];
  }
};
