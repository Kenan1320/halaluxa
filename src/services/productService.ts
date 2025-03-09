
import { supabase } from '@/integrations/supabase/client';
import { 
  Product, 
  CreateProductInput, 
  UpdateProductInput, 
  ProductFilterOptions,
  BulkUploadItem,
  ProductDetails
} from '@/models/product';
import { Shop } from '@/models/shop';

// Get all products
export const getAllProducts = async (filters?: ProductFilterOptions): Promise<Product[]> => {
  try {
    let query = supabase
      .from('products')
      .select('*');
    
    // Apply filters
    if (filters) {
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      
      if (filters.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice);
      }
      
      if (filters.maxPrice !== undefined) {
        query = query.lte('price', filters.maxPrice);
      }
      
      if (filters.rating !== undefined) {
        query = query.gte('rating', filters.rating);
      }
      
      if (filters.isHalalCertified !== undefined) {
        query = query.eq('is_halal_certified', filters.isHalalCertified);
      }
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    return [];
  }
};

// Get a product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
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
    
    return data || null;
  } catch (error) {
    console.error('Error in getProductById:', error);
    return null;
  }
};

// Get products by shop ID
export const getProductsByShopId = async (shopId: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('shop_id', shopId);
    
    if (error) {
      console.error('Error fetching shop products:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getProductsByShopId:', error);
    return [];
  }
};

// Create a product
export const createProduct = async (product: CreateProductInput): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating product:', error);
      return null;
    }
    
    return data || null;
  } catch (error) {
    console.error('Error in createProduct:', error);
    return null;
  }
};

// Update a product
export const updateProduct = async (id: string, product: UpdateProductInput): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating product:', error);
      return null;
    }
    
    return data || null;
  } catch (error) {
    console.error('Error in updateProduct:', error);
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
    console.error('Error in deleteProduct:', error);
    return false;
  }
};

// Bulk upload products
export const bulkUploadProducts = async (products: BulkUploadItem[], shopId: string): Promise<boolean> => {
  try {
    // Add shop_id to each product
    const productsWithShopId = products.map(product => ({
      ...product,
      shop_id: shopId
    }));
    
    // Need to process these one at a time because of the product_id constraints
    for (const product of productsWithShopId) {
      // Convert the details to a proper format for database insertion
      if (product.details && typeof product.details === 'object') {
        // Convert ProductDetails object to Supabase Json type
        const details = product.details as ProductDetails;
        
        // Create a new product with proper typing
        const newProduct: CreateProductInput = {
          name: product.name,
          description: product.description,
          price: product.price,
          shop_id: shopId,
          category: product.category,
          images: product.images,
          is_halal_certified: product.is_halal_certified,
          is_published: product.is_published,
          stock: product.stock,
          long_description: product.long_description,
          details: details
        };
        
        const { error } = await supabase
          .from('products')
          .insert([newProduct]);
        
        if (error) {
          console.error('Error in bulk insert product:', error);
          return false;
        }
      } else {
        // Handle case where details is undefined or not an object
        const newProduct: CreateProductInput = {
          name: product.name,
          description: product.description,
          price: product.price,
          shop_id: shopId,
          category: product.category,
          images: product.images,
          is_halal_certified: product.is_halal_certified,
          is_published: product.is_published,
          stock: product.stock,
          long_description: product.long_description
        };
        
        const { error } = await supabase
          .from('products')
          .insert([newProduct]);
        
        if (error) {
          console.error('Error in bulk insert product:', error);
          return false;
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in bulkUploadProducts:', error);
    return false;
  }
};

// Get featured products
export const getFeaturedProducts = async (limit: number = 8): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_published', true)
      .order('rating', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getFeaturedProducts:', error);
    return [];
  }
};

// Search products
export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .eq('is_published', true);
    
    if (error) {
      console.error('Error searching products:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in searchProducts:', error);
    return [];
  }
};

// Get product with shop details
export const getProductWithShopDetails = async (productId: string): Promise<{ product: Product; shop: Shop } | null> => {
  try {
    // Get the product
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();
    
    if (productError || !product) {
      console.error('Error fetching product:', productError);
      return null;
    }
    
    // Get the shop
    const { data: shop, error: shopError } = await supabase
      .from('shops')
      .select('*')
      .eq('id', product.shop_id)
      .single();
    
    if (shopError || !shop) {
      console.error('Error fetching shop:', shopError);
      return null;
    }
    
    return { product, shop };
  } catch (error) {
    console.error('Error in getProductWithShopDetails:', error);
    return null;
  }
};
