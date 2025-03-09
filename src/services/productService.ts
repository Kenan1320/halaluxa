
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/models/product';
import { toast } from 'sonner';

/**
 * Fetches all products
 */
export const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*, shops(name)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }

  // Transform the data to match the Product type
  return (data || []).map(item => ({
    ...item,
    sellerId: item.shop_id,
    sellerName: item.shops?.name || 'Unknown Seller'
  }));
};

/**
 * Fetches products by shop ID
 */
export const fetchProductsByShopId = async (shopId: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*, shops(name)')
    .eq('shop_id', shopId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products by shop ID:', error);
    throw error;
  }

  return (data || []).map(item => ({
    ...item,
    sellerId: item.shop_id,
    sellerName: item.shops?.name || 'Unknown Seller'
  }));
};

/**
 * Fetches a product by its ID
 */
export const fetchProductById = async (productId: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .select('*, shops(name)')
    .eq('id', productId)
    .single();

  if (error) {
    console.error('Error fetching product by ID:', error);
    throw error;
  }

  if (!data) return null;

  return {
    ...data,
    sellerId: data.shop_id,
    sellerName: data.shops?.name || 'Unknown Seller'
  };
};

/**
 * Adds a new product
 */
export const addProduct = async (product: Omit<Partial<Product>, 'sellerId'>, sellerId: string): Promise<Product> => {
  // Prepare the data for Supabase
  const productData = {
    ...product,
    seller_id: sellerId,
    shop_id: product.shop_id
  };

  const { data, error } = await supabase
    .from('products')
    .insert(productData)
    .select('*, shops(name)')
    .single();

  if (error) {
    console.error('Error adding product:', error);
    throw error;
  }

  return {
    ...data,
    sellerId: data.shop_id,
    sellerName: data.shops?.name || 'Unknown Seller'
  };
};

/**
 * Updates an existing product
 */
export const updateProduct = async (productId: string, product: Partial<Product>): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .update(product)
    .eq('id', productId)
    .select('*, shops(name)')
    .single();

  if (error) {
    console.error('Error updating product:', error);
    throw error;
  }

  return {
    ...data,
    sellerId: data.shop_id,
    sellerName: data.shops?.name || 'Unknown Seller'
  };
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
    .select('*, shops(name)')
    .order('rating', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }

  return (data || []).map(item => ({
    ...item,
    sellerId: item.shop_id,
    sellerName: item.shops?.name || 'Unknown Seller'
  }));
};

/**
 * Searches products by name or description
 */
export const searchProducts = async (query: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*, shops(name)')
    .or(`name.ilike.%${query}%, description.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching products:', error);
    throw error;
  }

  return (data || []).map(item => ({
    ...item,
    sellerId: item.shop_id,
    sellerName: item.shops?.name || 'Unknown Seller'
  }));
};

/**
 * Fetches products by category
 */
export const fetchProductsByCategory = async (category: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*, shops(name)')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }

  return (data || []).map(item => ({
    ...item,
    sellerId: item.shop_id,
    sellerName: item.shops?.name || 'Unknown Seller'
  }));
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

// Alias functions to support existing code
export const getProductById = fetchProductById;
export const getProducts = fetchProducts;
export const getFeaturedProducts = fetchFeaturedProducts;
