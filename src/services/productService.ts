
import { db } from '@/integrations/supabase/client';
import { Product, ProductFilter, ProductResponse } from '@/models/product';
import { normalizeProduct, prepareProductForUpdate } from '@/lib/productUtils';

export const getProducts = async (filter?: ProductFilter): Promise<ProductResponse> => {
  try {
    let query = db.from('products').select('*');

    if (filter) {
      if (filter.category) {
        query = query.eq('category', filter.category);
      }
      
      if (filter.min_price) {
        query = query.gte('price', filter.min_price);
      }
      
      if (filter.max_price) {
        query = query.lte('price', filter.max_price);
      }
      
      if (filter.is_halal_certified !== undefined) {
        query = query.eq('is_halal_certified', filter.is_halal_certified);
      }
      
      if (filter.in_stock !== undefined) {
        query = query.eq('in_stock', filter.in_stock);
      }
      
      if (filter.shop_id) {
        query = query.eq('shop_id', filter.shop_id);
      }
      
      if (filter.search) {
        query = query.ilike('name', `%${filter.search}%`);
      }
      
      if (filter.sort_by) {
        switch (filter.sort_by) {
          case 'price_asc':
            query = query.order('price', { ascending: true });
            break;
          case 'price_desc':
            query = query.order('price', { ascending: false });
            break;
          case 'newest':
            query = query.order('created_at', { ascending: false });
            break;
          case 'popular':
            // Assuming there's a 'popularity' or similar field
            query = query.order('created_at', { ascending: false });
            break;
        }
      }
    }

    const { data, error } = await query;
    
    if (error) throw error;
    
    return { 
      data: data ? data.map(normalizeProduct) : null, 
      error: null 
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { data: null, error };
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const { data, error } = await db
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data ? normalizeProduct(data) : null;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    return null;
  }
};

export const createProduct = async (product: Partial<Product>): Promise<Product | null> => {
  try {
    // Prepare the product data for the database
    const productData = {
      name: product.name,
      description: product.description,
      long_description: product.long_description || '',
      price: product.price,
      shop_id: product.shop_id,
      images: product.images || [],
      category: product.category || '',
      stock: product.stock || 0,
      is_published: product.is_published ?? true,
      is_halal_certified: product.is_halal_certified ?? false,
      details: product.details || {},
      in_stock: product.in_stock ?? true,
      delivery_mode: product.delivery_mode || 'pickup',
      pickup_options: product.pickup_options || { store: true, curbside: false }
    };

    const { data, error } = await db
      .from('products')
      .insert(productData)
      .select()
      .single();
    
    if (error) throw error;
    
    return data ? normalizeProduct(data) : null;
  } catch (error) {
    console.error('Error creating product:', error);
    return null;
  }
};

export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product | null> => {
  try {
    // Prepare the product data for the database
    const productData = prepareProductForUpdate(product);

    const { data, error } = await db
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data ? normalizeProduct(data) : null;
  } catch (error) {
    console.error(`Error updating product with ID ${id}:`, error);
    return null;
  }
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    const { error } = await db
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

export const getFeaturedProducts = async (limit = 10): Promise<Product[]> => {
  try {
    const { data, error } = await db
      .from('products')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    return data ? data.map(normalizeProduct) : [];
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
};

export const getRelatedProducts = async (productId: string, category: string, limit = 4): Promise<Product[]> => {
  try {
    const { data, error } = await db
      .from('products')
      .select('*')
      .eq('category', category)
      .eq('is_published', true)
      .neq('id', productId)
      .limit(limit);
    
    if (error) throw error;
    
    return data ? data.map(normalizeProduct) : [];
  } catch (error) {
    console.error(`Error fetching related products for ${productId}:`, error);
    return [];
  }
};

export const getProductsByShop = async (shopId: string): Promise<Product[]> => {
  try {
    const { data, error } = await db
      .from('products')
      .select('*')
      .eq('shop_id', shopId)
      .eq('is_published', true);
    
    if (error) throw error;
    
    return data ? data.map(normalizeProduct) : [];
  } catch (error) {
    console.error(`Error fetching products for shop ${shopId}:`, error);
    return [];
  }
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const { data, error } = await db
      .from('products')
      .select('*')
      .eq('category', category)
      .eq('is_published', true);
    
    if (error) throw error;
    
    return data ? data.map(normalizeProduct) : [];
  } catch (error) {
    console.error(`Error fetching products in category ${category}:`, error);
    return [];
  }
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const { data, error } = await db
      .from('products')
      .select('*')
      .eq('is_published', true)
      .ilike('name', `%${query}%`);
    
    if (error) throw error;
    
    return data ? data.map(normalizeProduct) : [];
  } catch (error) {
    console.error(`Error searching products with query ${query}:`, error);
    return [];
  }
};
