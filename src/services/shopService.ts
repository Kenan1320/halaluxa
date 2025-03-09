
import { supabase } from '@/integrations/supabase/client';
import { Shop, ShopProduct, ShopPaymentMethod } from '@/models/shop';
import { Product } from '@/models/product';

// Get all shops
export async function getAllShops(): Promise<Shop[]> {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching shops:', error);
      return [];
    }
    
    return data as Shop[];
  } catch (error) {
    console.error('Error in getAllShops:', error);
    return [];
  }
}

// Get a shop by ID
export async function getShopById(id: string): Promise<Shop | null> {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching shop with id ${id}:`, error);
      return null;
    }
    
    return data as Shop;
  } catch (error) {
    console.error(`Error in getShopById for ${id}:`, error);
    return null;
  }
}

// Get current user's shop
export async function getCurrentUserShop(): Promise<Shop | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }
    
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('owner_id', user.id)
      .single();
    
    if (error) {
      console.error('Error fetching user shop:', error);
      return null;
    }
    
    return data as Shop;
  } catch (error) {
    console.error('Error in getCurrentUserShop:', error);
    return null;
  }
}

// Create a new shop
export async function createShop(shopData: Partial<Shop>): Promise<Shop | null> {
  try {
    const { data, error } = await supabase
      .from('shops')
      .insert(shopData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating shop:', error);
      return null;
    }
    
    return data as Shop;
  } catch (error) {
    console.error('Error in createShop:', error);
    return null;
  }
}

// Update shop
export async function updateShop(shopData: Partial<Shop>): Promise<Shop | null> {
  try {
    if (!shopData.id) {
      throw new Error('Shop ID is required');
    }
    
    const { data, error } = await supabase
      .from('shops')
      .update(shopData)
      .eq('id', shopData.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating shop:', error);
      return null;
    }
    
    return data as Shop;
  } catch (error) {
    console.error('Error in updateShop:', error);
    return null;
  }
}

// Upload shop logo
export async function uploadShopLogo(file: File, shopId: string): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${shopId}-${Date.now()}.${fileExt}`;
    const filePath = `shop-logos/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('public')
      .upload(filePath, file);
    
    if (uploadError) {
      console.error('Error uploading logo:', uploadError);
      return null;
    }
    
    const { data: urlData } = supabase.storage
      .from('public')
      .getPublicUrl(filePath);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadShopLogo:', error);
    return null;
  }
}

// Get products for a shop
export async function getShopProducts(shopId: string): Promise<ShopProduct[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('shop_id', shopId);
    
    if (error) {
      console.error(`Error fetching products for shop ${shopId}:`, error);
      return [];
    }
    
    return data.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      images: product.images || [],
      shop_id: product.shop_id,
      is_published: product.is_published,
      is_halal_certified: product.is_halal_certified,
      rating: product.rating || 0,
      stock: product.stock || 0
    }));
  } catch (error) {
    console.error(`Error in getShopProducts for ${shopId}:`, error);
    return [];
  }
}

// Publish or unpublish a product
export async function toggleProductPublishStatus(productId: string, isPublished: boolean): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('products')
      .update({ is_published: isPublished })
      .eq('id', productId);
    
    if (error) {
      console.error('Error toggling product publish status:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in toggleProductPublishStatus:', error);
    return false;
  }
}

// Toggle halal certification status
export async function toggleHalalCertifiedStatus(productId: string, isHalalCertified: boolean): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('products')
      .update({ is_halal_certified: isHalalCertified })
      .eq('id', productId);
    
    if (error) {
      console.error('Error toggling halal certification status:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in toggleHalalCertifiedStatus:', error);
    return false;
  }
}

// Get payment methods for a shop
export async function getShopPaymentMethods(shopId: string): Promise<ShopPaymentMethod[]> {
  try {
    const { data, error } = await supabase
      .from('shop_payment_methods')
      .select('*')
      .eq('shop_id', shopId);
    
    if (error) {
      console.error(`Error fetching payment methods for shop ${shopId}:`, error);
      return [];
    }
    
    return data as ShopPaymentMethod[];
  } catch (error) {
    console.error(`Error in getShopPaymentMethods for ${shopId}:`, error);
    return [];
  }
}

// Add payment method
export async function addShopPaymentMethod(methodData: Omit<ShopPaymentMethod, 'id' | 'created_at' | 'updated_at'>): Promise<ShopPaymentMethod | null> {
  try {
    const { data, error } = await supabase
      .from('shop_payment_methods')
      .insert(methodData)
      .select()
      .single();
    
    if (error) {
      console.error('Error adding payment method:', error);
      return null;
    }
    
    return data as ShopPaymentMethod;
  } catch (error) {
    console.error('Error in addShopPaymentMethod:', error);
    return null;
  }
}

// Update payment method
export async function updateShopPaymentMethod(methodData: Partial<ShopPaymentMethod>): Promise<ShopPaymentMethod | null> {
  try {
    if (!methodData.id) {
      throw new Error('Payment method ID is required');
    }
    
    const { data, error } = await supabase
      .from('shop_payment_methods')
      .update(methodData)
      .eq('id', methodData.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating payment method:', error);
      return null;
    }
    
    return data as ShopPaymentMethod;
  } catch (error) {
    console.error('Error in updateShopPaymentMethod:', error);
    return null;
  }
}

// Get shop sales data
export async function getShopSales(shopId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('shop_sales')
      .select(`
        id,
        amount,
        status,
        created_at,
        orders:order_id (
          id,
          customer:user_id (
            email,
            name
          ),
          items,
          total,
          status
        )
      `)
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error(`Error fetching sales for shop ${shopId}:`, error);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error(`Error in getShopSales for ${shopId}:`, error);
    return [];
  }
}

// Setup database tables (called during app initialization)
export async function setupDatabaseTables(): Promise<boolean> {
  try {
    // Check if required storage buckets exist
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();
    
    if (bucketsError) {
      console.error('Error checking storage buckets:', bucketsError);
      return false;
    }
    
    // Check if 'public' bucket exists, create if not
    const publicBucketExists = buckets.some(bucket => bucket.name === 'public');
    if (!publicBucketExists) {
      const { error: createBucketError } = await supabase
        .storage
        .createBucket('public', {
          public: true
        });
      
      if (createBucketError) {
        console.error('Error creating public bucket:', createBucketError);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error setting up database tables:', error);
    return false;
  }
}

// Helper function to convert a regular product to a shop product
export function convertToShopProduct(product: Product, shopId: string): ShopProduct {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    description: product.description,
    category: product.category,
    images: product.images,
    shop_id: shopId,
    is_published: false,
    is_halal_certified: product.isHalalCertified,
    rating: product.rating || 0,
    stock: product.stock || 0
  };
}

// Convert ShopProduct to Product model
export function convertToModelProduct(shopProduct: ShopProduct): Product {
  return {
    id: shopProduct.id,
    name: shopProduct.name,
    description: shopProduct.description,
    price: shopProduct.price,
    category: shopProduct.category,
    images: shopProduct.images,
    sellerId: shopProduct.shop_id,
    sellerName: "", // This would typically be filled in by the service calling this function
    inStock: shopProduct.stock > 0,
    isHalalCertified: shopProduct.is_halal_certified,
    rating: shopProduct.rating,
    createdAt: new Date().toISOString(), // Default value
    stock: shopProduct.stock || 0
  };
}
