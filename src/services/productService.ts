
import { supabase } from '@/integrations/supabase/client';
import { Product, productCategories } from '@/models/product';
import { getRandomId } from '@/lib/utils';

// Helper to map database product to frontend model
function mapDbProductToModel(dbProduct: any): Product {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    description: dbProduct.description,
    price: dbProduct.price,
    category: dbProduct.category,
    inStock: dbProduct.stock > 0,
    isHalalCertified: dbProduct.is_halal_certified,
    images: dbProduct.images || [],
    sellerId: dbProduct.shop_id,
    sellerName: dbProduct.shop_name,
    rating: dbProduct.rating,
    reviewCount: dbProduct.review_count,
    isFeatured: dbProduct.is_published,
    createdAt: dbProduct.created_at,
    details: typeof dbProduct.details === 'string' ? JSON.parse(dbProduct.details) : dbProduct.details,
  };
}

// Helper to map frontend model to database product
function mapModelToDbProduct(product: Partial<Product>): any {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.inStock ? 1 : 0,
    category: product.category,
    images: product.images || [],
    shop_id: product.sellerId,
    is_halal_certified: product.isHalalCertified,
    is_published: product.isFeatured,
    details: product.details ? JSON.stringify(product.details) : '{}'
  };
}

export async function getProducts(limit = 10, category?: string): Promise<Product[]> {
  try {
    let query = supabase
      .from('products')
      .select('*');
    
    if (category && category !== 'All') {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }
    
    return (data || []).map(mapDbProductToModel);
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
      .eq('is_published', true)
      .limit(limit);
    
    if (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
    
    return (data || []).map(mapDbProductToModel);
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
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching products by shop:', error);
      return [];
    }
    
    return (data || []).map(mapDbProductToModel);
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
    
    return mapDbProductToModel(data);
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
    
    return (data || []).map(mapDbProductToModel);
  } catch (error) {
    console.error('Error in searchProducts:', error);
    return [];
  }
}

export async function addProduct(product: Partial<Product>): Promise<boolean> {
  try {
    // Convert frontend model to DB format
    const dbProduct = mapModelToDbProduct({
      ...product,
      id: product.id || getRandomId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    const { error } = await supabase
      .from('products')
      .insert(dbProduct);
    
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
    // Convert frontend model to DB format
    const dbProduct = mapModelToDbProduct({
      ...product,
      updatedAt: new Date().toISOString(),
    });
    
    const { error } = await supabase
      .from('products')
      .update(dbProduct)
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
