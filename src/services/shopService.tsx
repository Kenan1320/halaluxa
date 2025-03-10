
import { Shop, ShopProduct, mapDatabaseShopToModel, mapModelToDatabase } from '@/models/shop';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/models/product';

// Re-export the Shop type
export type { Shop, ShopProduct };

// Export all necessary functions
export { 
  getAllShops as getShops,
  getShopById,
  createShop,
  updateShop,
  deleteShop,
  getMainShop,
  getNearbyShops,
  uploadProductImage,
  getShopProducts,
  convertToModelProduct
};

// Function to create a new shop
export const createShop = async (shopData: Partial<Shop>): Promise<Shop | null> => {
  try {
    // Get the current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Prepare shop data for database
    const dbShopData = {
      ...mapModelToDatabase(shopData),
      owner_id: user.id
    };
    
    // Insert shop data into database
    const { data, error } = await supabase
      .from('shops')
      .insert(dbShopData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating shop:', error);
      throw error;
    }
    
    // Map database shop to model and return
    return mapDatabaseShopToModel(data);
  } catch (error) {
    console.error('Error creating shop:', error);
    return null;
  }
};

// Function to get all shops
export const getAllShops = async (): Promise<Shop[]> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error getting shops:', error);
      throw error;
    }
    
    // Map each shop to the model format
    return data.map(shop => mapDatabaseShopToModel(shop));
  } catch (error) {
    console.error('Error getting shops:', error);
    return [];
  }
};

// Re-export getAllShops as getShops for compatibility
export const getShops = getAllShops;

// Function to get a shop by ID
export const getShopById = async (shopId: string): Promise<Shop | null> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('id', shopId)
      .single();
    
    if (error) {
      console.error('Error getting shop:', error);
      throw error;
    }
    
    // Map database shop to model
    return mapDatabaseShopToModel(data);
  } catch (error) {
    console.error('Error getting shop:', error);
    return null;
  }
};

// Function to update a shop
export const updateShop = async (shopId: string, shopData: Partial<Shop>): Promise<Shop | null> => {
  try {
    // Get the current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Prepare shop data for database
    const dbShopData = mapModelToDatabase(shopData);
    
    // Update shop in database
    const { data, error } = await supabase
      .from('shops')
      .update(dbShopData)
      .eq('id', shopId)
      .eq('owner_id', user.id) // Ensure user owns the shop
      .select()
      .single();
    
    if (error) {
      console.error('Error updating shop:', error);
      throw error;
    }
    
    // Map database shop to model and return
    return mapDatabaseShopToModel(data);
  } catch (error) {
    console.error('Error updating shop:', error);
    return null;
  }
};

// Function to delete a shop
export const deleteShop = async (shopId: string): Promise<boolean> => {
  try {
    // Get the current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Delete shop from database
    const { error } = await supabase
      .from('shops')
      .delete()
      .eq('id', shopId)
      .eq('owner_id', user.id); // Ensure user owns the shop
    
    if (error) {
      console.error('Error deleting shop:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting shop:', error);
    return false;
  }
};

// Function to get the user's main shop (for business users)
export const getMainShop = async (): Promise<Shop | null> => {
  try {
    // Get the current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Get user's shop from database
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No shop found, return null
        return null;
      }
      console.error('Error getting main shop:', error);
      throw error;
    }
    
    // Map database shop to model
    return mapDatabaseShopToModel(data);
  } catch (error) {
    console.error('Error getting main shop:', error);
    return null;
  }
};

// Function to get nearby shops based on location
export const getNearbyShops = async (
  latitude: number,
  longitude: number,
  radiusKm: number = 10
): Promise<Shop[]> => {
  try {
    // Use PostGIS to find shops within radius
    const { data, error } = await supabase.rpc('find_shops_within_distance', {
      user_lat: latitude,
      user_lng: longitude,
      distance_km: radiusKm
    });
    
    if (error) {
      console.error('Error getting nearby shops:', error);
      throw error;
    }
    
    // Map each shop to the model format and include distance
    return data.map((shop: any) => ({
      ...mapDatabaseShopToModel(shop),
      distance: shop.distance
    }));
  } catch (error) {
    console.error('Error getting nearby shops:', error);
    return [];
  }
};

// Function to upload a product image
export const uploadProductImage = async (file: File): Promise<string | null> => {
  try {
    // Generate unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `product-images/${fileName}`;
    
    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('products')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Error uploading product image:', error);
      throw error;
    }
    
    // Get public URL of the uploaded file
    const { data: urlData } = supabase.storage
      .from('products')
      .getPublicUrl(data.path);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading product image:', error);
    return null;
  }
};

// Function to get all products for a shop
export const getShopProducts = async (shopId: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error getting shop products:', error);
      throw error;
    }
    
    // Convert database products to model format
    return data.map(product => convertToModelProduct(product));
  } catch (error) {
    console.error('Error getting shop products:', error);
    return [];
  }
};

// Function to convert a database product to the product model
export const convertToModelProduct = (shopProduct: any): Product => {
  return {
    id: shopProduct.id,
    name: shopProduct.name,
    description: shopProduct.description,
    price: shopProduct.price,
    sellerId: shopProduct.seller_id,
    sellerName: shopProduct.seller_name || '',
    category: shopProduct.category,
    images: shopProduct.images,
    rating: shopProduct.rating || 0,
    stock: shopProduct.stock || 0,
    shopId: shopProduct.shop_id,
    inStock: shopProduct.in_stock || true,
    isHalalCertified: shopProduct.is_halal_certified || false,
    details: shopProduct.details || {},
    createdAt: shopProduct.created_at
  };
};

// Function to subscribe to real-time shop updates
export const subscribeToShops = (callback: (shops: Shop[]) => void): (() => void) => {
  const subscription = supabase
    .channel('shops-channel')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'shops' }, 
      async () => {
        // When shops change, fetch all shops and call the callback
        const shops = await getAllShops();
        callback(shops);
      }
    )
    .subscribe();

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(subscription);
  };
};
