
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/models/product';
import { toast } from 'sonner';

/**
 * Fetches all products
 */
export const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }

  return data || [];
};

/**
 * Fetches products by shop ID
 */
export const fetchProductsByShopId = async (shopId: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('shop_id', shopId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products by shop ID:', error);
    throw error;
  }

  return data || [];
};

/**
 * Fetches a product by its ID
 */
export const fetchProductById = async (productId: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (error) {
    console.error('Error fetching product by ID:', error);
    throw error;
  }

  return data;
};

/**
 * Adds a new product
 */
export const addProduct = async (product: Partial<Product>, sellerId: string): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .insert({
      ...product,
      sellerId: sellerId
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding product:', error);
    throw error;
  }

  return data;
};

/**
 * Updates an existing product
 */
export const updateProduct = async (productId: string, product: Partial<Product>): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .update(product)
    .eq('id', productId)
    .select()
    .single();

  if (error) {
    console.error('Error updating product:', error);
    throw error;
  }

  return data;
};

/**
 * Deletes a product
 */
export const deleteProduct = async (productId: string): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);

  if (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

/**
 * Fetches featured products
 */
export const fetchFeaturedProducts = async (limit: number = 8): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('rating', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }

  return data || [];
};

/**
 * Searches products by name or description
 */
export const searchProducts = async (query: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(`name.ilike.%${query}%, description.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching products:', error);
    throw error;
  }

  return data || [];
};

/**
 * Fetches products by category
 */
export const fetchProductsByCategory = async (category: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }

  return data || [];
};

/**
 * Uploads product images
 */
export const uploadProductImage = async (file: File, productId: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${productId}_${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase
    .storage
    .from('product-images')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    throw uploadError;
  }

  const { data } = supabase
    .storage
    .from('product-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
};
