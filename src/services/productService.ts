
import { supabase } from '@/lib/supabaseClient';
import { Product } from '@/models/product';

export const getProducts = async (
  limit: number = 10,
  offset: number = 0,
  category?: string
): Promise<Product[]> => {
  try {
    let query = supabase.from('products').select('*');
    
    if (category) {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) {
      throw error;
    }
    
    return data.map(dbProductToModel) || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Convert DB product to model
function dbProductToModel(product: any): Product {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    images: product.images || [],
    shopId: product.shop_id,
    shop_id: product.shop_id,
    createdAt: product.created_at,
    updatedAt: product.updated_at,
    isHalalCertified: product.is_halal_certified,
    inStock: product.in_stock !== undefined ? product.in_stock : true,
    details: product.details || {},
    sellerId: product.seller_id || product.shop_id,
    seller_id: product.seller_id || product.shop_id,
    longDescription: product.long_description || '',
    isPublished: product.is_published || false,
    in_stock: product.in_stock !== undefined ? product.in_stock : true,
    created_at: product.created_at,
    updated_at: product.updated_at,
    is_halal_certified: product.is_halal_certified,
    rating: product.rating || 0
  };
}

// Convert model product to DB format
function modelToDbProduct(product: Partial<Product>): any {
  const dbProduct: any = {
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    images: product.images || [],
    shop_id: product.shopId || product.shop_id,
    is_halal_certified: product.isHalalCertified || product.is_halal_certified,
    in_stock: product.inStock !== undefined ? product.inStock : (product.in_stock !== undefined ? product.in_stock : true),
    details: product.details || {},
    seller_id: product.sellerId || product.seller_id,
    long_description: product.longDescription || '',
    is_published: product.isPublished || false
  };

  // Only include these fields if they are present
  if (product.created_at) dbProduct.created_at = product.created_at;
  if (product.updated_at) dbProduct.updated_at = product.updated_at;
  
  return dbProduct;
}

export const getProductsByShop = async (shopId: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('shop_id', shopId);

    if (error) {
      throw error;
    }

    return data.map(dbProductToModel) || [];
  } catch (error) {
    console.error('Error fetching products by shop:', error);
    return [];
  }
};

export const getProductById = async (productId: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (error) {
      throw error;
    }

    return data ? dbProductToModel(data) : null;
  } catch (error) {
    console.error(`Error fetching product with ID ${productId}:`, error);
    return null;
  }
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category);

    if (error) {
      throw error;
    }

    return data.map(dbProductToModel) || [];
  } catch (error) {
    console.error(`Error fetching products in category ${category}:`, error);
    return [];
  }
};

export const searchProducts = async (
  query: string,
  limit: number = 20
): Promise<Product[]> => {
  try {
    // This is a simple implementation that searches by name or description
    // For more complex search, consider using Supabase's full-text search or pgvector
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(limit);

    if (error) {
      throw error;
    }

    return data.map(dbProductToModel) || [];
  } catch (error) {
    console.error(`Error searching products with query "${query}":`, error);
    return [];
  }
};

export const createProduct = async (product: Partial<Product>): Promise<Product | null> => {
  try {
    const dbProduct = modelToDbProduct(product);
    
    // Add timestamps if not present
    if (!dbProduct.created_at) {
      dbProduct.created_at = new Date().toISOString();
    }
    if (!dbProduct.updated_at) {
      dbProduct.updated_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('products')
      .insert([dbProduct])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data ? dbProductToModel(data) : null;
  } catch (error) {
    console.error('Error creating product:', error);
    return null;
  }
};

export const updateProduct = async (
  productId: string,
  product: Partial<Product>
): Promise<Product | null> => {
  try {
    const dbProduct = modelToDbProduct(product);
    
    // Always update the updated_at timestamp
    dbProduct.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('products')
      .update(dbProduct)
      .eq('id', productId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data ? dbProductToModel(data) : null;
  } catch (error) {
    console.error(`Error updating product with ID ${productId}:`, error);
    return null;
  }
};

export const deleteProduct = async (productId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error(`Error deleting product with ID ${productId}:`, error);
    return false;
  }
};

export const getFeaturedProducts = async (limit: number = 8): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return data.map(dbProductToModel) || [];
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
};
