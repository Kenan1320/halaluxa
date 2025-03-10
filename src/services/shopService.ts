
import { supabase } from '@/integrations/supabase/client';
import { Shop, ShopProduct, mapDatabaseShopToModel, mapModelToDatabase } from '@/models/shop';
import { Product } from '@/models/product';

// Create a new shop
export async function createShop(shopData: Partial<Shop>): Promise<Shop | null> {
  try {
    const dbShop = mapModelToDatabase(shopData);
    
    const { data, error } = await supabase
      .from('shops')
      .insert(dbShop)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating shop:', error);
      return null;
    }
    
    return mapDatabaseShopToModel(data);
  } catch (error) {
    console.error('Error creating shop:', error);
    return null;
  }
}

// Get shop by ID
export async function getShopById(id: string): Promise<Shop | null> {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      console.error('Error fetching shop:', error);
      return null;
    }
    
    return mapDatabaseShopToModel(data);
  } catch (error) {
    console.error('Error fetching shop:', error);
    return null;
  }
}

// Get shops owned by a user
export async function getShopsByUser(userId: string): Promise<Shop[]> {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('owner_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching user shops:', error);
      return [];
    }
    
    return data.map(mapDatabaseShopToModel);
  } catch (error) {
    console.error('Error fetching user shops:', error);
    return [];
  }
}

// Update an existing shop
export async function updateShop(id: string, shopData: Partial<Shop>): Promise<Shop | null> {
  try {
    const dbShop = mapModelToDatabase(shopData);
    
    const { data, error } = await supabase
      .from('shops')
      .update(dbShop)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating shop:', error);
      return null;
    }
    
    return mapDatabaseShopToModel(data);
  } catch (error) {
    console.error('Error updating shop:', error);
    return null;
  }
}

// Delete a shop
export async function deleteShop(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('shops')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting shop:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting shop:', error);
    return false;
  }
}

// Get products from a specific shop
export async function getShopProducts(shopId: string): Promise<ShopProduct[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('shop_id', shopId)
      .eq('is_published', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching shop products:', error);
      return [];
    }
    
    return data.map((product: any) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      images: product.images,
      sellerId: product.shop_id,
      sellerName: '', // This would typically be populated from a join with the shops table
      rating: product.rating
    }));
  } catch (error) {
    console.error('Error fetching shop products:', error);
    return [];
  }
}

// Get nearby shops based on coordinates
export async function getNearbyShops(lat: number, lng: number, radius: number = 10): Promise<Shop[]> {
  try {
    // Using a simple query instead of PostGIS RPC call to avoid errors
    const { data, error } = await supabase
      .from('shops')
      .select('*');
    
    if (error) {
      console.error('Error fetching nearby shops:', error);
      return [];
    }
    
    // Filter shops based on approximate distance calculation
    // This is a simplified approach without PostGIS
    const shops = data.map(mapDatabaseShopToModel).filter(shop => {
      if (!shop.latitude || !shop.longitude) return false;
      
      // Simple distance calculation (approximate)
      const dlat = (shop.latitude - lat) * (Math.PI / 180);
      const dlng = (shop.longitude - lng) * (Math.PI / 180);
      const a = Math.sin(dlat/2) * Math.sin(dlat/2) +
                Math.cos(lat * (Math.PI / 180)) * Math.cos(shop.latitude * (Math.PI / 180)) *
                Math.sin(dlng/2) * Math.sin(dlng/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = 6371 * c; // Earth radius in km
      
      // Add distance to shop object
      shop.distance = distance;
      
      return distance <= radius;
    });
    
    // Sort by distance
    return shops.sort((a, b) => (a.distance || 0) - (b.distance || 0));
  } catch (error) {
    console.error('Error fetching nearby shops:', error);
    return [];
  }
}

// Get popular shops based on rating
export async function getPopularShops(limit: number = 10): Promise<Shop[]> {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .order('rating', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching popular shops:', error);
      return [];
    }
    
    return data.map(mapDatabaseShopToModel);
  } catch (error) {
    console.error('Error fetching popular shops:', error);
    return [];
  }
}

// Get main shop (user's preferred shop)
export async function getMainShop(userId?: string): Promise<Shop | null> {
  try {
    if (!userId) {
      console.log('No user ID provided for getMainShop');
      // Try to get from localStorage if available in browser
      const mainShopId = typeof window !== 'undefined' ? localStorage.getItem('mainShopId') : null;
      if (!mainShopId) return null;
      
      return getShopById(mainShopId);
    }
    
    const { data, error } = await supabase
      .from('user_shop_preferences')
      .select('shops(*)')
      .eq('user_id', userId)
      .eq('is_main_shop', true)
      .single();
    
    if (error || !data || !data.shops) {
      return null;
    }
    
    return mapDatabaseShopToModel(data.shops);
  } catch (error) {
    console.error('Error fetching main shop:', error);
    return null;
  }
}

// Convert database product to model product
export function convertToModelProduct(dbProduct: any): Product {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    description: dbProduct.description,
    price: dbProduct.price,
    category: dbProduct.category,
    images: dbProduct.images || [],
    isHalalCertified: dbProduct.is_halal_certified || false,
    rating: dbProduct.rating || 0,
    stock: dbProduct.stock || 0,
    details: dbProduct.details || {},
    shopId: dbProduct.shop_id,
    createdAt: dbProduct.created_at,
    updatedAt: dbProduct.updated_at
  };
}

// Upload product image to Supabase storage
export async function uploadProductImage(file: File, shopId: string): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const filePath = `products/${shopId}/${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('shop-images')
      .upload(filePath, file);
    
    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('shop-images')
      .getPublicUrl(data.path);
    
    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

// Get all shops
export async function getShops(): Promise<Shop[]> {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching shops:', error);
      return [];
    }
    
    return data.map(mapDatabaseShopToModel);
  } catch (error) {
    console.error('Error fetching shops:', error);
    return [];
  }
}

// For backward compatibility
export const getAllShops = getShops;
export { Shop };

// Simple function to subscribe to shops (stub for type errors)
export function subscribeToShops(callback: (shops: Shop[]) => void) {
  // Get initial shops
  getShops().then(shops => {
    callback(shops);
  });
  
  // Return unsubscribe function
  return () => {
    // Cleanup if needed
  };
}
