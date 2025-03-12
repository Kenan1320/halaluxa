
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/models/product';
import type { Json } from '@/integrations/supabase/types';

// Helper function to convert DB columns to Product model
const convertToProduct = (product: any): Product => {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    images: product.images || [],
    isHalalCertified: product.is_halal_certified || false,
    shopId: product.shop_id,
    createdAt: product.created_at,
    // Additional properties needed for compatibility
    sellerId: product.seller_id || '',
    sellerName: product.seller_name || '',
    rating: product.rating || 5.0,
    inStock: true
  };
};

// Function to get all products
export const getProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');

    if (error) {
      throw error;
    }

    return (data || []).map(convertToProduct);
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Function to get products for a specific shop
export const getProductsByShop = async (shopId: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('shop_id', shopId);

    if (error) {
      throw error;
    }

    return (data || []).map(convertToProduct);
  } catch (error) {
    console.error(`Error fetching products for shop ${shopId}:`, error);
    return [];
  }
};

// Function to get a product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data ? convertToProduct(data) : null;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    return null;
  }
};

// Function to add a new product
export const addProduct = async (product: Partial<Product>): Promise<Product | null> => {
  try {
    // Map product model to database schema
    const dbProduct = {
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      images: product.images || [],
      is_halal_certified: product.isHalalCertified,
      shop_id: product.shopId,
      seller_id: product.sellerId,
      seller_name: product.sellerName,
      rating: product.rating,
      // Use a simplified approach for details to avoid excessive type depth
      details: JSON.stringify({}),
      is_published: true,
      long_description: product.description
    };

    const { data, error } = await supabase
      .from('products')
      .insert([dbProduct])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data ? convertToProduct(data) : null;
  } catch (error) {
    console.error('Error adding product:', error);
    return null;
  }
};

// Function to update an existing product
export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product | null> => {
  try {
    // Map product model updates to database schema
    const dbUpdates: Record<string, any> = {};
    
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.price !== undefined) dbUpdates.price = updates.price;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.images !== undefined) dbUpdates.images = updates.images;
    if (updates.isHalalCertified !== undefined) dbUpdates.is_halal_certified = updates.isHalalCertified;
    if (updates.shopId !== undefined) dbUpdates.shop_id = updates.shopId;
    
    const { data, error } = await supabase
      .from('products')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data ? convertToProduct(data) : null;
  } catch (error) {
    console.error(`Error updating product with ID ${id}:`, error);
    return null;
  }
};

// Function to delete a product
export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error(`Error deleting product with ID ${id}:`, error);
    return false;
  }
};

// Function to search products by name, description, or category
export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`);

    if (error) {
      throw error;
    }

    return (data || []).map(convertToProduct);
  } catch (error) {
    console.error(`Error searching products with query "${query}":`, error);
    return [];
  }
};

// Function to get featured products
export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(8);

    if (error) {
      throw error;
    }

    return (data || []).map(convertToProduct);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
};

// Function to get products by category
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category);

    if (error) {
      throw error;
    }

    return (data || []).map(convertToProduct);
  } catch (error) {
    console.error(`Error fetching products with category "${category}":`, error);
    return [];
  }
};

// Function to mock products (for development only)
export const mockProducts = async (): Promise<void> => {
  const products = [
    {
      name: 'Organic Halal Chicken',
      description: 'Free-range, locally sourced halal chicken',
      price: 12.99,
      category: 'Halal Meat',
      images: ['/placeholder.svg'],
      is_halal_certified: true,
      shop_id: '1',
      seller_id: '1',
      seller_name: 'Halal Farms',
      rating: 4.8,
      details: JSON.stringify({}),
      is_published: true,
      long_description: 'Premium, organic, free-range halal chicken raised locally without antibiotics or hormones.'
    },
    {
      name: 'Turkish Coffee Set',
      description: 'Traditional Turkish coffee set with cups',
      price: 45.99,
      category: 'Gifts',
      images: ['/placeholder.svg'],
      is_halal_certified: true,
      shop_id: '2',
      seller_id: '2',
      seller_name: 'Cultural Treasures',
      rating: 4.9,
      details: JSON.stringify({}),
      is_published: true,
      long_description: 'Authentic Turkish coffee set with ornate brass pot (cezve) and two porcelain cups with saucers.'
    }
  ];

  try {
    for (const product of products) {
      await supabase.from('products').insert([product]);
    }
  } catch (error) {
    console.error('Error mocking products:', error);
  }
};
