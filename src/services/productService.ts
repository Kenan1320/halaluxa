import { supabase } from '@/integrations/supabase/client';
import { Product, mapDbProductToModel, mapModelToDbProduct } from '@/models/product';

// Fetch all products
export async function getProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }
    
    return data.map(mapDbProductToModel);
  } catch (err) {
    console.error('Error in getProducts:', err);
    return [];
  }
}

// Fetch a single product by ID
export async function getProductById(id: string): Promise<Product | undefined> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching product with id ${id}:`, error);
      return undefined;
    }
    
    return mapDbProductToModel(data);
  } catch (err) {
    console.error(`Error in getProductById for ${id}:`, err);
    return undefined;
  }
}

// Save a new product or update an existing one
export async function saveProduct(product: Partial<Product>): Promise<Product | undefined> {
  try {
    const dbProduct = mapModelToDbProduct(product);
    
    if (product.id) {
      // Update existing product
      const { data, error } = await supabase
        .from('products')
        .update(dbProduct)
        .eq('id', product.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating product:', error);
        return undefined;
      }
      
      return mapDbProductToModel(data);
    } else {
      // Create new product
      const { data, error } = await supabase
        .from('products')
        .insert(dbProduct)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating product:', error);
        return undefined;
      }
      
      return mapDbProductToModel(data);
    }
  } catch (err) {
    console.error('Error in saveProduct:', err);
    return undefined;
  }
}

// Add a new product - implemented function that was previously just an alias
export async function addProduct(product: Partial<Product>): Promise<Product | undefined> {
  try {
    const dbProduct = mapModelToDbProduct(product);
    
    const { data, error } = await supabase
      .from('products')
      .insert(dbProduct)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating product:', error);
      return undefined;
    }
    
    return mapDbProductToModel(data);
  } catch (err) {
    console.error('Error in addProduct:', err);
    return undefined;
  }
}

// Update an existing product - implemented function that was previously just an alias
export async function updateProduct(product: Partial<Product>): Promise<Product | undefined> {
  try {
    if (!product.id) {
      console.error('Cannot update product without id');
      return undefined;
    }
    
    const dbProduct = mapModelToDbProduct(product);
    
    const { data, error } = await supabase
      .from('products')
      .update(dbProduct)
      .eq('id', product.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating product:', error);
      return undefined;
    }
    
    return mapDbProductToModel(data);
  } catch (err) {
    console.error('Error in updateProduct:', err);
    return undefined;
  }
}

// Delete a product
export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting product with id ${id}:`, error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error(`Error in deleteProduct for ${id}:`, err);
    return false;
  }
}

// Get featured products (for home page)
export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_halal_certified', true)
      .order('created_at', { ascending: false })
      .limit(6);
    
    if (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
    
    return data.map(mapDbProductToModel);
  } catch (err) {
    console.error('Error in getFeaturedProducts:', err);
    return [];
  }
}

// Get products by category
export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error(`Error fetching products in category ${category}:`, error);
      return [];
    }
    
    return data.map(mapDbProductToModel);
  } catch (err) {
    console.error(`Error in getProductsByCategory for ${category}:`, err);
    return [];
  }
}

// Get products by seller ID
export async function getProductsBySeller(sellerId: string): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error(`Error fetching products for seller ${sellerId}:`, error);
      return [];
    }
    
    return data.map(mapDbProductToModel);
  } catch (err) {
    console.error(`Error in getProductsBySeller for ${sellerId}:`, err);
    return [];
  }
}

// Function to provide mock data
export function getMockProducts(): Product[] {
  return [
    {
      id: "1",
      name: "Halal Beef Burger Patties",
      description: "Premium grass-fed beef patties, perfect for homemade burgers.",
      price: 12.99,
      stock: 50,
      category: "Food & Groceries",
      images: ["/lovable-uploads/0780684a-9c7f-4f32-affc-6f9ea641b814.png"],
      sellerId: "seller1",
      sellerName: "Halal Meats & More",
      rating: 4.8,
      isHalalCertified: true,
      details: {
        weight: "500g",
        servings: "4 patties",
        ingredients: "100% grass-fed beef, salt, black pepper"
      },
      createdAt: new Date().toISOString()
    }
  ];
}
