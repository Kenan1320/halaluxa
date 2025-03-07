import { supabase } from '@/integrations/supabase/client';
import { Product, ProductDetails, mapDbProductToModel, mapModelToDbProduct } from '@/models/product';

// Helper function to safely handle JSON conversion
const safeJsonParse = (data: any): ProductDetails => {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch (e) {
      return {};
    }
  }
  return data || {};
};

// Safely check if profiles data indicates this is a business account
const isBusinessAccount = (profilesData: any): boolean => {
  if (!profilesData) return false;
  if (typeof profilesData !== 'object') return false;
  if (profilesData === null) return false;
  
  return typeof profilesData === 'object' && 
         'role' in profilesData && 
         profilesData.role === 'business';
};

// Custom mapper for Supabase data to our model
const customMapDbProductToModel = (data: any): Product => {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    price: data.price,
    inStock: data.stock > 0,
    category: data.category,
    images: data.images || [],
    sellerId: data.seller_id,
    sellerName: data.seller_name,
    rating: data.rating,
    isHalalCertified: data.is_halal_certified,
    details: safeJsonParse(data.details),
    createdAt: data.created_at
  };
};

// Fetch all products
export async function getProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, profiles:seller_id(role)')
      .order('created_at', { ascending: false });
    
    if (error || !data) {
      console.error('Error fetching products:', error);
      return [];
    }
    
    // Only return products from verified business accounts with proper null checks
    const validProducts = data.filter(product => 
      product.profiles && isBusinessAccount(product.profiles)
    );
    
    return validProducts.map(customMapDbProductToModel);
  } catch (err) {
    console.error('Error in getProducts:', err);
    return [];
  }
}

// Alias for getAllProducts
export const getAllProducts = getProducts;

// Fetch a single product by ID
export async function getProductById(id: string): Promise<Product | undefined> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, profiles:seller_id(role)')
      .eq('id', id)
      .maybeSingle();
    
    if (error || !data) {
      console.error(`Error fetching product with id ${id}:`, error);
      return undefined;
    }
    
    // Only return product if it's from a business account with proper null checks
    if (!data.profiles || !isBusinessAccount(data.profiles)) {
      console.error(`Product ${id} is not from a valid business account`);
      return undefined;
    }
    
    return customMapDbProductToModel(data);
  } catch (err) {
    console.error(`Error in getProductById for ${id}:`, err);
    return undefined;
  }
}

// Helper function to prepare product data for database
const prepareProductForDb = (product: Partial<Product>) => {
  const dbProduct: any = {
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.inStock ? 1 : 0,
    category: product.category,
    images: product.images,
    seller_id: product.sellerId,
    seller_name: product.sellerName,
    rating: product.rating,
    is_halal_certified: product.isHalalCertified,
    details: product.details ? JSON.stringify(product.details) : '{}'
  };
  
  // Only include id if it exists (for updates)
  if (product.id) {
    dbProduct.id = product.id;
  }
  
  return dbProduct;
};

// Save a new product or update an existing one
export async function saveProduct(product: Partial<Product>): Promise<Product | undefined> {
  try {
    // Check if the user is a business owner
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      console.error('User not authenticated');
      return undefined;
    }
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.session.user.id)
      .single();
      
    if (!profile || profile.role !== 'business') {
      console.error('Only business accounts can add products');
      return undefined;
    }
    
    // Set the product seller to the current user
    product.sellerId = session.session.user.id;
    
    const dbProduct = prepareProductForDb(product);
    
    if (product.id) {
      // Update existing product
      const { data, error } = await supabase
        .from('products')
        .update(dbProduct)
        .eq('id', product.id)
        .eq('seller_id', session.session.user.id) // Only allow update if seller owns the product
        .select()
        .single();
      
      if (error) {
        console.error('Error updating product:', error);
        return undefined;
      }
      
      return customMapDbProductToModel(data);
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
      
      return customMapDbProductToModel(data);
    }
  } catch (err) {
    console.error('Error in saveProduct:', err);
    return undefined;
  }
}

// Add a new product - implemented function that was previously just an alias
export async function addProduct(product: Partial<Product>): Promise<Product | undefined> {
  return saveProduct(product);
}

// Update an existing product - implemented function that was previously just an alias
export async function updateProduct(product: Partial<Product>): Promise<Product | undefined> {
  if (!product.id) {
    console.error('Cannot update product without id');
    return undefined;
  }
  return saveProduct(product);
}

// Delete a product
export async function deleteProduct(id: string): Promise<boolean> {
  try {
    // Check if the user is a business owner
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      console.error('User not authenticated');
      return false;
    }
    
    // Delete the product only if the current user is the owner
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .eq('seller_id', session.session.user.id);
    
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
      .select('*, profiles:seller_id(role)')
      .eq('is_halal_certified', true)
      .order('created_at', { ascending: false })
      .limit(6);
    
    if (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
    
    // Only return products from business accounts
    const validProducts = data.filter(product => isBusinessAccount(product.profiles));
    
    return validProducts.map(customMapDbProductToModel);
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
      .select('*, profiles:seller_id(role)')
      .eq('category', category)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error(`Error fetching products in category ${category}:`, error);
      return [];
    }
    
    // Only return products from business accounts
    const validProducts = data.filter(product => isBusinessAccount(product.profiles));
    
    return validProducts.map(customMapDbProductToModel);
  } catch (err) {
    console.error(`Error in getProductsByCategory for ${category}:`, err);
    return [];
  }
}

// Get products by seller ID
export async function getProductsBySeller(sellerId: string): Promise<Product[]> {
  try {
    // First check if this seller is a business account
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', sellerId)
      .single();
      
    if (profileError || !profile || profile.role !== 'business') {
      console.error('Invalid seller or not a business account');
      return [];
    }
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error(`Error fetching products for seller ${sellerId}:`, error);
      return [];
    }
    
    return data.map(customMapDbProductToModel);
  } catch (err) {
    console.error(`Error in getProductsBySeller for ${sellerId}:`, err);
    return [];
  }
}

// Function to provide mock data
export function getMockProducts(): Product[] {
  return [];  // No more mock products - only real ones from business users
}

// Export the Product type to make it available to other modules
export type { Product };
