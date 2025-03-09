import { supabase } from '@/integrations/supabase/client';
import { Shop, ShopFilter, CreateShopInput, UpdateShopInput, ShopFilterBy } from '@/models/shop';
import { Product } from '@/models/product';
import { PaymentMethodType } from '@/models/payment';

// Re-export the Shop interface for backward compatibility
export type { Shop, ShopProduct, ShopPaymentMethod };

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

// Alias for getAllShops for backward compatibility
export const getShops = getAllShops;

// Get a main shop (for compatibility)
export async function getMainShop(): Promise<Shop | null> {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .order('created_at')
      .limit(1)
      .single();
    
    if (error) {
      console.error('Error fetching main shop:', error);
      return null;
    }
    
    return data as Shop;
  } catch (error) {
    console.error('Error in getMainShop:', error);
    return null;
  }
}

// Subscribe to shops updates (for compatibility)
export function subscribeToShops(callback: (shops: Shop[]) => void): () => void {
  // Load initial data
  getAllShops().then(shops => callback(shops));
  
  // Set up subscription
  const subscription = supabase
    .channel('shops_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'shops' }, () => {
      getAllShops().then(shops => callback(shops));
    })
    .subscribe();
  
  // Return unsubscribe function
  return () => {
    subscription.unsubscribe();
  };
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
export async function createShop(shopData: {
  name: string;
  description: string;
  category: string;
  location: string;
  logo?: string;
  rating?: number;
  productCount?: number;
  isVerified?: boolean;
  ownerId: string;
}): Promise<Shop | null> {
  try {
    const formattedData = {
      name: shopData.name,
      description: shopData.description,
      category: shopData.category,
      location: shopData.location,
      logo_url: shopData.logo,
      owner_id: shopData.ownerId,
      rating: shopData.rating || 0,
      product_count: shopData.productCount || 0,
      is_verified: shopData.isVerified || false
    };

    const { data, error } = await supabase
      .from('shops')
      .insert(formattedData)
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

// Upload product image (for compatibility)
export async function uploadProductImage(file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `product-${Date.now()}.${fileExt}`;
    const filePath = `product-images/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('public')
      .upload(filePath, file);
    
    if (uploadError) {
      console.error('Error uploading product image:', uploadError);
      return null;
    }
    
    const { data: urlData } = supabase.storage
      .from('public')
      .getPublicUrl(filePath);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadProductImage:', error);
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
      stock: product.stock || 0,
      created_at: product.created_at,
      updated_at: product.updated_at,
      // Add required properties for interface compatibility
      sellerId: product.shop_id,
      sellerName: '' // This will be populated by the calling function if needed
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

// Update product stock
export async function updateProductStock(productId: string, stock: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('products')
      .update({ stock })
      .eq('id', productId);
    
    if (error) {
      console.error('Error updating product stock:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateProductStock:', error);
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
export async function addShopPaymentMethod(shopId: string, paymentMethod: {
  methodType: PaymentMethodType;
  accountName?: string;
  accountNumber?: string;
  bankName?: string;
  paypalEmail?: string;
  stripeAccountId?: string;
  isActive?: boolean;
}): Promise<ShopPaymentMethod | null> {
  try {
    const { data, error } = await supabase
      .from('shop_payment_methods')
      .insert({
        shop_id: shopId,
        method_type: paymentMethod.methodType,
        account_name: paymentMethod.accountName,
        account_number: paymentMethod.accountNumber,
        bank_name: paymentMethod.bankName,
        paypal_email: paymentMethod.paypalEmail,
        stripe_account_id: paymentMethod.stripeAccountId,
        is_active: paymentMethod.isActive ?? true,
        is_default: false
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding shop payment method:', error);
      return null;
    }

    return {
      id: data.id,
      shopId: data.shop_id,
      methodType: data.method_type as PaymentMethodType,
      accountName: data.account_name,
      accountNumber: data.account_number,
      bankName: data.bank_name,
      paypalEmail: data.paypal_email,
      stripeAccountId: data.stripe_account_id,
      isActive: data.is_active,
      isDefault: data.is_default,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
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
    stock: product.inStock ? 10 : 0, // Default to 10 if in stock
    sellerId: shopId,
    sellerName: "" // This would typically be filled in by the service calling this function
  };
}

// Convert ShopProduct to Product model
export const convertToModelProduct = (shopProduct: ShopProduct): Product => {
  return {
    id: shopProduct.id,
    name: shopProduct.name,
    price: shopProduct.price,
    description: shopProduct.description,
    category: shopProduct.category,
    images: shopProduct.images || [],
    sellerId: shopProduct.shop_id,
    sellerName: shopProduct.sellerName || '',
    rating: shopProduct.rating || 0,
    isPublished: shopProduct.is_published,
    isHalalCertified: shopProduct.is_halal_certified,
    inStock: shopProduct.stock !== undefined ? Boolean(shopProduct.stock) : true,
    longDescription: shopProduct.long_description || '',
    details: shopProduct.details || {},
    createdAt: shopProduct.created_at || new Date().toISOString()
  };
};

// Create a product for a shop
export async function createProductForShop(shopId: string, product: Partial<Product>): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        images: product.images || [],
        shop_id: shopId,
        is_published: true,
        is_halal_certified: product.isHalalCertified || false,
        stock: product.inStock !== undefined ? (product.inStock ? 1 : 0) : 1,
        long_description: product.longDescription || '',
        details: product.details || {}
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating product for shop:', error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      inStock: data.stock > 0,
      category: data.category,
      images: data.images || [],
      sellerId: data.shop_id,
      sellerName: '',
      rating: data.rating,
      isHalalCertified: data.is_halal_certified,
      details: data.details,
      createdAt: data.created_at
    };
  } catch (error) {
    console.error('Error in createProductForShop:', error);
    return null;
  }
};
