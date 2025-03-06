
import { Product } from '@/models/product';
import { supabase } from '@/integrations/supabase/client';
import { updateShopProductCount, notifyShopUpdate } from '@/services/shopService';

// Custom event for product updates
const PRODUCT_UPDATE_EVENT = 'haluna-product-updated';

// Listen for product updates
window.addEventListener(PRODUCT_UPDATE_EVENT, () => {
  // Invalidate any product caches we might have
  console.log('Product update detected, refreshing data...');
});

// Notify product updates
export const notifyProductUpdate = () => {
  window.dispatchEvent(new Event(PRODUCT_UPDATE_EVENT));
};

// Get all products
export const getProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }
    
    return data as Product[];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Get a product by ID
export const getProductById = async (productId: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();
    
    if (error) {
      console.error('Error fetching product:', error);
      return null;
    }
    
    return data as Product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

// Add a new product
export const addProduct = async (product: Partial<Product>): Promise<Product> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: product.name || 'Untitled Product',
        description: product.description || '',
        long_description: product.longDescription || '',
        price: product.price || 0,
        stock: product.stock || 0,
        category: product.category || 'Uncategorized',
        images: product.images || [],
        is_halal_certified: product.isHalalCertified !== undefined ? product.isHalalCertified : true,
        seller_id: product.sellerId || '',
        seller_name: product.sellerName || '',
        rating: product.rating || 0,
        details: product.details || {}
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error adding product:', error);
      throw new Error('Failed to add product');
    }
    
    // Update shop product count
    if (data.seller_id) {
      await updateShopProductCount(data.seller_id);
      notifyShopUpdate();
    }
    
    // Notify product update
    notifyProductUpdate();
    
    return data as Product;
  } catch (error) {
    console.error('Error adding product:', error);
    throw new Error('Failed to add product');
  }
};

// Alias for addProduct to maintain compatibility
export const saveProduct = addProduct;

// Update a product
export const updateProduct = async (productData: Partial<Product> & { id: string }): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update({
        name: productData.name,
        description: productData.description,
        long_description: productData.longDescription,
        price: productData.price,
        stock: productData.stock,
        category: productData.category,
        images: productData.images,
        is_halal_certified: productData.isHalalCertified,
        seller_name: productData.sellerName,
        rating: productData.rating,
        details: productData.details
      })
      .eq('id', productData.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating product:', error);
      return null;
    }
    
    // Update shop product count if sellerId changed
    if (productData.sellerId) {
      // Update shop
      await updateShopProductCount(productData.sellerId);
      notifyShopUpdate();
    }
    
    // Notify product update
    notifyProductUpdate();
    
    return data as Product;
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
};

// Delete a product
export const deleteProduct = async (productId: string): Promise<boolean> => {
  try {
    // Get the product first to get the sellerId
    const product = await getProductById(productId);
    
    if (!product) {
      return false;
    }
    
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);
    
    if (error) {
      console.error('Error deleting product:', error);
      return false;
    }
    
    // Update shop product count
    if (product.sellerId) {
      await updateShopProductCount(product.sellerId);
      notifyShopUpdate();
    }
    
    // Notify product update
    notifyProductUpdate();
    
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};

// Get products by seller ID
export const getProductsBySellerId = async (sellerId: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', sellerId);
    
    if (error) {
      console.error('Error fetching seller products:', error);
      return [];
    }
    
    return data as Product[];
  } catch (error) {
    console.error('Error fetching seller products:', error);
    return [];
  }
};

// Get products by category
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category);
    
    if (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
    
    return data as Product[];
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
};

// Search products
export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`);
    
    if (error) {
      console.error('Error searching products:', error);
      return [];
    }
    
    return data as Product[];
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
};
