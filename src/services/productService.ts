import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/database';
import { Product as ModelProduct } from '@/models/product';

// Convert database product to model product
const convertToModelProduct = (product: Product): ModelProduct => {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    shop_id: product.shop_id,
    shopId: product.shop_id,
    category: product.category,
    images: product.images || [],
    is_halal_certified: product.is_halal_certified,
    isHalalCertified: product.is_halal_certified,
    in_stock: product.in_stock !== undefined ? product.in_stock : true,
    inStock: product.in_stock !== undefined ? product.in_stock : true,
    created_at: product.created_at,
    createdAt: product.created_at,
    updated_at: product.updated_at,
    updatedAt: product.updated_at,
    seller_id: product.seller_id || product.shop_id,
    sellerId: product.seller_id || product.shop_id,
    sellerName: product.shop_name || '', // This would typically come from a join
    rating: product.rating || 0, // Default rating
    details: product.details || {}
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

    // Ensure each product has the required in_stock field
    const productsWithInStock = (data || []).map(product => ({
      ...product,
      in_stock: product.in_stock !== undefined ? product.in_stock : true
    }));

    // Convert to model products
    return productsWithInStock.map(product => convertToModelProduct(product as Product));
  } catch (error) {
    console.error('Error in getFeaturedProducts:', error);
    return [];
  }
};

// Add createProduct function
export const createProduct = async (productData: Partial<Product>): Promise<Product | null> => {
  try {
    // Ensure required fields are present
    if (!productData.name || !productData.description || !productData.price || 
        !productData.shop_id || !productData.category) {
      console.error('Missing required fields for product creation');
      return null;
    }
    
    // Ensure in_stock is set
    const dataWithInStock = {
      ...productData,
      in_stock: productData.in_stock !== undefined ? productData.in_stock : true
    };
    
    const { data, error } = await supabase
      .from('products')
      .insert(dataWithInStock)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating product:', error);
      return null;
    }
    
    return data as Product;
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

    // Ensure each product has the required in_stock field
    const productsWithInStock = (data || []).map(product => ({
      ...product,
      in_stock: product.in_stock !== undefined ? product.in_stock : true
    }));

    return productsWithInStock.map(product => convertToModelProduct(product as Product));
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

    // Ensure the product has the required in_stock field
    const productWithInStock = {
      ...data,
      in_stock: data.in_stock !== undefined ? data.in_stock : true
    };

    return convertToModelProduct(productWithInStock as Product);
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

    // Ensure each product has the required in_stock field
    const productsWithInStock = (data || []).map(product => ({
      ...product,
      in_stock: product.in_stock !== undefined ? product.in_stock : true
    }));

    return productsWithInStock.map(product => convertToModelProduct(product as Product));
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

    // Ensure each product has the required in_stock field
    const productsWithInStock = (data || []).map(product => ({
      ...product,
      in_stock: product.in_stock !== undefined ? product.in_stock : true
    }));

    return productsWithInStock.map(product => convertToModelProduct(product as Product));
  } catch (error) {
    console.error('Error in getProductsByCategory:', error);
    return [];
  }
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<ModelProduct | null> => {
  try {
    // Ensure in_stock is set if it's being updated
    const updatesWithInStock = updates.in_stock !== undefined 
      ? updates 
      : { ...updates, in_stock: true };
    
    const { data, error } = await supabase
      .from('products')
      .update(updatesWithInStock)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating product:', error);
      return null;
    }

    return convertToModelProduct(data as Product);
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

    // Ensure each product has the required in_stock field
    const productsWithInStock = (data || []).map(product => ({
      ...product,
      in_stock: product.in_stock !== undefined ? product.in_stock : true
    }));

    return productsWithInStock.map(product => convertToModelProduct(product as Product));
  } catch (error) {
    console.error('Error in searchProducts:', error);
    return [];
  }
};
