
import { supabase } from '@/integrations/supabase/client';
import { 
  Product, 
  CreateProductInput, 
  UpdateProductInput, 
  BulkUploadItem,
  ProductDetails,
  productCategories
} from '@/models/product';
import { Json } from '@/integrations/supabase/types';

// Helper function to transform database product to our Product interface
const mapDbProductToProduct = (dbProduct: any): Product => {
  return {
    ...dbProduct,
    // UI compatibility properties
    isHalalCertified: dbProduct.is_halal_certified,
    inStock: dbProduct.stock,
    createdAt: dbProduct.created_at,
    details: dbProduct.details as ProductDetails
  };
};

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, shops:shop_id(name, owner_id)')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Map database products to our Product interface
    return data.map((product) => ({
      ...mapDbProductToProduct(product),
      sellerId: product.shops?.owner_id || '',
      sellerName: product.shops?.name || ''
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Get product by ID
export const getProductById = async (id: string): Promise<Product> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, shops:shop_id(name, owner_id)')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return {
      ...mapDbProductToProduct(data),
      sellerId: data.shops?.owner_id || '',
      sellerName: data.shops?.name || ''
    };
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};

// Get products by shop ID
export const getProductsByShopId = async (shopId: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, shops:shop_id(name, owner_id)')
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data.map(product => ({
      ...mapDbProductToProduct(product),
      sellerId: product.shops?.owner_id || '',
      sellerName: product.shops?.name || ''
    }));
  } catch (error) {
    console.error(`Error fetching products for shop ${shopId}:`, error);
    throw error;
  }
};

// Create a new product
export const createProduct = async (productData: CreateProductInput): Promise<Product> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert(productData)
      .select('*, shops:shop_id(name, owner_id)')
      .single();

    if (error) {
      throw error;
    }

    return {
      ...mapDbProductToProduct(data),
      sellerId: data.shops?.owner_id || '',
      sellerName: data.shops?.name || ''
    };
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Update an existing product
export const updateProduct = async (id: string, productData: UpdateProductInput): Promise<Product> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select('*, shops:shop_id(name, owner_id)')
      .single();

    if (error) {
      throw error;
    }

    return {
      ...mapDbProductToProduct(data),
      sellerId: data.shops?.owner_id || '',
      sellerName: data.shops?.name || ''
    };
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    throw error;
  }
};

// Search products
export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, shops:shop_id(name, owner_id)')
      .or(`name.ilike.%${query}%, description.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data.map(product => ({
      ...mapDbProductToProduct(product),
      sellerId: product.shops?.owner_id || '',
      sellerName: product.shops?.name || ''
    }));
  } catch (error) {
    console.error(`Error searching products for query ${query}:`, error);
    throw error;
  }
};

// Function to upload images and return URLs
export const uploadProductImages = async (files: File[], productId: string): Promise<string[]> => {
  try {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `${productId}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (error) {
        console.error('Error uploading image:', error);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(data.path);

      uploadedUrls.push(urlData.publicUrl);
    }

    return uploadedUrls;
  } catch (error) {
    console.error('Error uploading product images:', error);
    throw error;
  }
};

// Get featured products (could be based on ratings, new arrivals, etc.)
export const getFeaturedProducts = async (limit = 8): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, shops:shop_id(name, owner_id)')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return data.map(product => ({
      ...mapDbProductToProduct(product),
      sellerId: product.shops?.owner_id || '',
      sellerName: product.shops?.name || ''
    }));
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
};

// Get products by category
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, shops:shop_id(name, owner_id)')
      .eq('category', category)
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data.map(product => ({
      ...mapDbProductToProduct(product),
      sellerId: product.shops?.owner_id || '',
      sellerName: product.shops?.name || ''
    }));
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    throw error;
  }
};

// For pagination purpose
export const getProductsWithPagination = async (page = 1, limit = 10): Promise<{ products: Product[], total: number }> => {
  try {
    // Calculate the range based on page and limit
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Get products
    const { data, error, count } = await supabase
      .from('products')
      .select('*, shops:shop_id(name, owner_id)', { count: 'exact' })
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      throw error;
    }

    const products = data.map(product => ({
      ...mapDbProductToProduct(product),
      sellerId: product.shops?.owner_id || '',
      sellerName: product.shops?.name || ''
    }));

    return { products, total: count || 0 };
  } catch (error) {
    console.error('Error fetching products with pagination:', error);
    throw error;
  }
};

// Bulk upload products
export const bulkUploadProducts = async (products: BulkUploadItem[], shopId: string): Promise<void> => {
  try {
    // Add shop_id to each product
    const productsWithShopId = products.map(product => ({
      ...product,
      shop_id: shopId
    }));

    const { error } = await supabase
      .from('products')
      .insert(productsWithShopId);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error bulk uploading products:', error);
    throw error;
  }
};

// For compatibility with existing code
export const getProducts = getAllProducts;

export { productCategories };
