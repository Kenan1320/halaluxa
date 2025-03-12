
import { createClient } from '@supabase/supabase-js';
import { Product } from '@/types/database';
import { Product as ModelProduct } from '@/models/product';

// Create a Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Convert database product to model product
export const convertToModelProduct = (dbProduct: Product): ModelProduct => {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    description: dbProduct.description,
    price: dbProduct.price,
    images: dbProduct.images,
    category: dbProduct.category,
    shopId: dbProduct.shop_id,
    isHalalCertified: dbProduct.is_halal_certified,
    inStock: dbProduct.in_stock,
    createdAt: dbProduct.created_at,
    sellerId: dbProduct.seller_id,
    sellerName: dbProduct.shop_name,
    rating: dbProduct.rating,
    details: dbProduct.details,
  };
};

// Get all products
export const getAllProducts = async (): Promise<ModelProduct[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  
  if (!data) return [];
  
  // Make sure we add in_stock property if it's missing
  return data.map(product => convertToModelProduct({
    ...product,
    in_stock: product.in_stock ?? true
  }));
};

// Get product by ID
export const getProductById = async (id: string): Promise<ModelProduct | null> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }
  
  if (!data) return null;
  
  return convertToModelProduct({
    ...data,
    in_stock: data.in_stock ?? true
  });
};

// Get products by shop ID
export const getProductsByShopId = async (shopId: string): Promise<ModelProduct[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('shop_id', shopId)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching shop products:', error);
    return [];
  }
  
  if (!data) return [];
  
  return data.map(product => convertToModelProduct({
    ...product,
    in_stock: product.in_stock ?? true
  }));
};

// Create a new product
export const createProduct = async (productData: Omit<ModelProduct, 'id' | 'createdAt'>): Promise<ModelProduct | null> => {
  // Convert from model product to database product
  const dbProduct = {
    name: productData.name,
    description: productData.description,
    price: productData.price,
    category: productData.category,
    images: productData.images,
    shop_id: productData.shopId,
    is_halal_certified: productData.isHalalCertified,
    in_stock: productData.inStock ?? true,
    details: productData.details || {},
  };
  
  const { data, error } = await supabase
    .from('products')
    .insert([dbProduct])
    .select()
    .single();
    
  if (error) {
    console.error('Error creating product:', error);
    return null;
  }
  
  if (!data) return null;
  
  return convertToModelProduct({
    ...data,
    in_stock: data.in_stock ?? true
  });
};

// Update a product
export const updateProduct = async (id: string, productData: Partial<ModelProduct>): Promise<ModelProduct | null> => {
  // Convert from model product to database product
  const dbProduct: any = {};
  
  if (productData.name) dbProduct.name = productData.name;
  if (productData.description) dbProduct.description = productData.description;
  if (productData.price) dbProduct.price = productData.price;
  if (productData.category) dbProduct.category = productData.category;
  if (productData.images) dbProduct.images = productData.images;
  if (productData.isHalalCertified !== undefined) dbProduct.is_halal_certified = productData.isHalalCertified;
  if (productData.inStock !== undefined) dbProduct.in_stock = productData.inStock;
  if (productData.details) dbProduct.details = productData.details;
  
  const { data, error } = await supabase
    .from('products')
    .update(dbProduct)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating product:', error);
    return null;
  }
  
  if (!data) return null;
  
  return convertToModelProduct({
    ...data,
    in_stock: data.in_stock ?? true
  });
};

// Delete a product
export const deleteProduct = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting product:', error);
    return false;
  }
  
  return true;
};

// Get products by category
export const getProductsByCategory = async (category: string): Promise<ModelProduct[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error(`Error fetching products in category '${category}':`, error);
    return [];
  }
  
  if (!data) return [];
  
  return data.map(product => convertToModelProduct({
    ...product,
    in_stock: product.in_stock ?? true
  }));
};

// Search products
export const searchProducts = async (query: string): Promise<ModelProduct[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error(`Error searching products with query '${query}':`, error);
    return [];
  }
  
  if (!data) return [];
  
  return data.map(product => convertToModelProduct({
    ...product,
    in_stock: product.in_stock ?? true
  }));
};
