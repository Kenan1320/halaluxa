
import { supabase } from '@/lib/supabase';
import { Product } from '@/models/product';
import { convertToModelProduct } from '@/services/shopService';

// Get products with limit and offset for pagination
export const getProducts = async (limit = 20, offset = 0, category?: string): Promise<Product[]> => {
  try {
    let query = supabase
      .from('products')
      .select('*')
      .range(offset, offset + limit - 1);
    
    if (category) {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }
    
    return data.map(convertToModelProduct);
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Function for getting featured products
export const getFeaturedProducts = async (limit = 8): Promise<Product[]> => {
  try {
    // In a real application, you might have a 'featured' flag or sort by popularity
    // Here we're just getting the first few products
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(limit);
    
    if (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
    
    return data.map(convertToModelProduct);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
};

// Get product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching product by ID:', error);
      return null;
    }
    
    return convertToModelProduct(data);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }
};

// Create a new product
export const createProduct = async (product: Partial<Product>): Promise<Product | null> => {
  try {
    // Convert from our model Product to database format
    const dbProduct = {
      name: product.name,
      description: product.description,
      price: product.price,
      images: product.images,
      category: product.category,
      shop_id: product.shopId,
      stock: product.quantity || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
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
    
    return convertToModelProduct(data);
  } catch (error) {
    console.error('Error creating product:', error);
    return null;
  }
};

// Update an existing product
export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product | null> => {
  try {
    // Convert from our model Product to database format
    const dbProduct: any = {};
    
    if (product.name) dbProduct.name = product.name;
    if (product.description) dbProduct.description = product.description;
    if (product.price !== undefined) dbProduct.price = product.price;
    if (product.images) dbProduct.images = product.images;
    if (product.category) dbProduct.category = product.category;
    if (product.quantity !== undefined) dbProduct.stock = product.quantity;
    
    dbProduct.updated_at = new Date().toISOString();
    
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
    
    return convertToModelProduct(data);
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
};

// Delete a product
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
    console.error('Error deleting product:', error);
    return false;
  }
};

// Search products by name or description
export const searchProducts = async (query: string, limit = 20): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(limit);
    
    if (error) {
      console.error('Error searching products:', error);
      return [];
    }
    
    return data.map(convertToModelProduct);
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
};

// Get products by shop ID
export const getProductsByShopId = async (shopId: string, limit = 50): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('shop_id', shopId)
      .limit(limit);
    
    if (error) {
      console.error('Error fetching products by shop ID:', error);
      return [];
    }
    
    return data.map(convertToModelProduct);
  } catch (error) {
    console.error('Error fetching products by shop ID:', error);
    return [];
  }
};
