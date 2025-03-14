
import { supabase } from '@/lib/supabaseClient';
import { Product, ShopProduct, adaptDatabaseProductToProduct } from '@/models/product';
import { UUID } from '@/models/types';
import { adaptDbProductToShopProduct } from './shopServiceHelpers';

export const getProductById = async (productId: UUID): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();
      
    if (error) {
      console.error("Error fetching product:", error);
      return null;
    }
    
    return adaptDatabaseProductToProduct(data);
  } catch (error) {
    console.error("Unexpected error fetching product:", error);
    return null;
  }
};

export const getProducts = async (limit: number = 20, offset: number = 0): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .range(offset, offset + limit - 1);
      
    if (error) {
      console.error("Error fetching products:", error);
      return [];
    }
    
    return data.map(adaptDatabaseProductToProduct);
  } catch (error) {
    console.error("Unexpected error fetching products:", error);
    return [];
  }
};

export const getProductsWithShopDetails = async (limit: number = 20, offset: number = 0): Promise<ShopProduct[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, shops(name, logo_url)')
      .range(offset, offset + limit - 1);
      
    if (error) {
      console.error("Error fetching products with shop details:", error);
      return [];
    }
    
    return data.map((product) => {
      return adaptDbProductToShopProduct({
        ...product,
        shop_name: product.shops?.name,
        shop_logo: product.shops?.logo_url
      });
    });
  } catch (error) {
    console.error("Unexpected error fetching products with shop details:", error);
    return [];
  }
};

export const getFeaturedProducts = async (limit: number = 8): Promise<ShopProduct[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, shops(name, logo_url)')
      .eq('featured', true)
      .limit(limit);
      
    if (error) {
      console.error("Error fetching featured products:", error);
      return [];
    }
    
    return data.map((product) => {
      return adaptDbProductToShopProduct({
        ...product,
        shop_name: product.shops?.name,
        shop_logo: product.shops?.logo_url
      });
    });
  } catch (error) {
    console.error("Unexpected error fetching featured products:", error);
    return [];
  }
};

export const createProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product | null> => {
  try {
    const dbProduct = {
      name: product.name,
      description: product.description,
      price: product.price,
      images: product.images,
      category: product.category,
      shop_id: product.shopId,
      stock: product.stock || 0,
      is_halal_certified: product.isHalalCertified,
      in_stock: product.inStock !== undefined ? product.inStock : true,
      details: product.details || {},
      seller_id: product.sellerId,
      rating: product.rating || 0,
      featured: product.featured || false
    };
    
    const { data, error } = await supabase
      .from('products')
      .insert([dbProduct])
      .select()
      .single();
      
    if (error) {
      console.error("Error creating product:", error);
      return null;
    }
    
    return adaptDatabaseProductToProduct(data);
  } catch (error) {
    console.error("Unexpected error creating product:", error);
    return null;
  }
};

export const updateProduct = async (productId: UUID, updates: Partial<Product>): Promise<Product | null> => {
  try {
    // Convert to database format
    const dbUpdates: any = {};
    
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.price !== undefined) dbUpdates.price = updates.price;
    if (updates.images !== undefined) dbUpdates.images = updates.images;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.stock !== undefined) dbUpdates.stock = updates.stock;
    if (updates.isHalalCertified !== undefined) dbUpdates.is_halal_certified = updates.isHalalCertified;
    if (updates.inStock !== undefined) dbUpdates.in_stock = updates.inStock;
    if (updates.details !== undefined) dbUpdates.details = updates.details;
    if (updates.featured !== undefined) dbUpdates.featured = updates.featured;
    
    dbUpdates.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('products')
      .update(dbUpdates)
      .eq('id', productId)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating product:", error);
      return null;
    }
    
    return adaptDatabaseProductToProduct(data);
  } catch (error) {
    console.error("Unexpected error updating product:", error);
    return null;
  }
};

export const deleteProduct = async (productId: UUID): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);
      
    if (error) {
      console.error("Error deleting product:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Unexpected error deleting product:", error);
    return false;
  }
};
