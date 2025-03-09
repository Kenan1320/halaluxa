import { supabase } from '@/integrations/supabase/client';
import { Product, ProductDetails } from '@/models/product';

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

const mapDbProductToModel = (data: any): Product => {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    price: data.price,
    inStock: data.stock > 0,
    category: data.category,
    images: data.images || [],
    sellerId: data.shop_id || data.business_owner_id,
    sellerName: data.business_owner_name,
    rating: data.rating,
    isHalalCertified: data.is_halal_certified,
    details: safeJsonParse(data.details),
    createdAt: data.created_at,
  };
};

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

export const getAllProducts = getProducts;

export async function getProductById(id: string): Promise<Product | undefined> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error || !data) {
      console.error(`Error fetching product with id ${id}:`, error);
      return undefined;
    }
    
    return mapDbProductToModel(data);
  } catch (err) {
    console.error(`Error in getProductById for ${id}:`, err);
    return undefined;
  }
}

const prepareProductForDb = (product: Partial<Product>) => {
  const dbProduct: Record<string, any> = {
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.inStock !== undefined ? (product.inStock ? 1 : 0) : 0,
    category: product.category,
    images: product.images,
    shop_id: product.sellerId,
    rating: product.rating,
    is_halal_certified: product.isHalalCertified,
    details: product.details ? JSON.stringify(product.details) : '{}'
  };
  
  if (product.id) {
    dbProduct.id = product.id;
  }
  
  return dbProduct;
};

export async function addProduct(product: Partial<Product>): Promise<Product | undefined> {
  try {
    const dbProduct = prepareProductForDb(product);
    
    const { data, error } = await supabase
      .from('products')
      .insert([dbProduct])
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

export async function updateProduct(product: Partial<Product>): Promise<Product | undefined> {
  try {
    if (!product.id) {
      console.error('Cannot update product without id');
      return undefined;
    }
    
    const dbProduct = prepareProductForDb(product);
    
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

export const uploadProductImage = async (imageDataUrl: string): Promise<string | null> => {
  try {
    const filename = `product-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    const res = await fetch(imageDataUrl);
    const blob = await res.blob();
    
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(`public/${filename}`, blob, {
        contentType: blob.type,
        cacheControl: '3600'
      });
    
    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }
    
    const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(data.path);
    
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadProductImage:', error);
    return null;
  }
};

export const createProduct = async (productData: Partial<Product>): Promise<Product | null> => {
  try {
    if (productData.images && productData.images.length > 0) {
      const processedImages = await Promise.all(
        productData.images.map(async (image) => {
          if (image.startsWith('data:')) {
            return await uploadProductImage(image);
          }
          return image;
        })
      );
      productData.images = processedImages.filter(img => img) as string[];
    }

    const { data, error } = await supabase
      .from('products')
      .insert({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        category: productData.category,
        images: productData.images || [],
        shop_id: productData.sellerId,
        is_published: true,
        is_halal_certified: productData.isHalalCertified || false,
        stock: productData.inStock !== undefined ? (productData.inStock ? 1 : 0) : 1,
        details: productData.details ? JSON.stringify(productData.details) : '{}'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating product:', error);
      return null;
    }

    return mapDbProductToModel(data);
  } catch (error) {
    console.error('Error in createProduct:', error);
    return null;
  }
};

export const updateProductById = async (id: string, productData: Partial<Product>): Promise<Product | null> => {
  try {
    const updateData: any = {
      ...productData,
    };
    
    delete updateData.id;
    delete updateData.sellerId;
    delete updateData.sellerName;
    delete updateData.createdAt;
    
    if (productData.isHalalCertified !== undefined) {
      updateData.is_halal_certified = productData.isHalalCertified;
      delete updateData.isHalalCertified;
    }
    
    if (productData.inStock !== undefined) {
      updateData.stock = productData.inStock ? 1 : 0;
      delete updateData.inStock;
    }
    
    if (productData.description !== undefined) {
      updateData.description = productData.description;
    }

    if (productData.images && productData.images.length > 0) {
      const processedImages = await Promise.all(
        productData.images.map(async (image) => {
          if (image.startsWith('data:')) {
            return await uploadProductImage(image);
          }
          return image;
        })
      );
      updateData.images = processedImages.filter(img => img) as string[];
    }

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating product:', error);
      return null;
    }

    return mapDbProductToModel(data);
  } catch (error) {
    console.error('Error in updateProductById:', error);
    return null;
  }
};

export const bulkUploadProducts = async (products: Record<string, any>[]): Promise<boolean> => {
  try {
    for (const product of products) {
      const formattedProduct = {
        name: product.name,
        description: product.description,
        price: parseFloat(product.price),
        category: product.category,
        images: product.images || [],
        shop_id: product.shop_id,
        is_published: product.is_published !== undefined ? product.is_published : true,
        is_halal_certified: product.is_halal_certified || false,
        stock: product.inStock ? 1 : 0,
        long_description: product.long_description || '',
        details: product.details || {}
      };

      const { error } = await supabase
        .from('products')
        .insert(formattedProduct);

      if (error) {
        console.error(`Error uploading product ${product.name}:`, error);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error in bulkUploadProducts:', error);
    return false;
  }
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(8);

    if (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }

    return data.map(mapDbProductToModel);
  } catch (error) {
    console.error('Error in getFeaturedProducts:', error);
    return [];
  }
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
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
};

export const getProductsBySeller = async (sellerId: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('shop_id', sellerId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error(`Error fetching products for business owner ${sellerId}:`, error);
      return [];
    }
    
    return data.map(mapDbProductToModel);
  } catch (err) {
    console.error(`Error in getProductsBySeller for ${sellerId}:`, err);
    return [];
  }
};

export function getMockProducts(): Product[] {
  return [
    {
      id: "1",
      name: "Halal Beef Burger Patties",
      description: "Premium grass-fed beef patties, perfect for homemade burgers.",
      price: 12.99,
      inStock: true,
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
    },
    {
      id: "2",
      name: "Organic Medjool Dates",
      description: "Sweet and succulent dates imported directly from the Middle East.",
      price: 9.99,
      inStock: true,
      category: "Food & Groceries",
      images: ["/lovable-uploads/d4ab324c-23f0-4fcc-9069-0afbc77d1c3e.png"],
      sellerId: "seller2",
      sellerName: "Barakah Organics",
      rating: 4.9,
      isHalalCertified: true,
      details: {
        weight: "250g",
        origin: "Jordan",
        ingredients: "100% organic Medjool dates"
      },
      createdAt: new Date().toISOString()
    }
  ];
};

export type { Product };
