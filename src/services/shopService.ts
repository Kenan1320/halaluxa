
import { db } from '@/integrations/supabase/client';
import { Shop } from '@/types/database';
import { normalizeShop } from '@/lib/utils';
import { getDistance } from 'geolib';
import { Product } from '@/models/product';
import { normalizeProduct } from '@/lib/productUtils';

export const getShops = async (): Promise<Shop[]> => {
  try {
    const { data, error } = await db
      .from('shops')
      .select('*');
    
    if (error) throw error;
    
    return data?.map(normalizeShop) || [];
  } catch (error) {
    console.error('Error fetching shops:', error);
    return [];
  }
};

// This is an alias for getShops to maintain compatibility
export const getAllShops = getShops;

export const getShopById = async (id: string): Promise<Shop | null> => {
  try {
    const { data, error } = await db
      .from('shops')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data ? normalizeShop(data) : null;
  } catch (error) {
    console.error(`Error fetching shop with ID ${id}:`, error);
    return null;
  }
};

export const getNearbyShops = async (
  latitude?: number,
  longitude?: number,
  radius = 10 // km
): Promise<Shop[]> => {
  try {
    // Get all shops if no location is provided
    const { data, error } = await db
      .from('shops')
      .select('*');
    
    if (error) throw error;
    
    if (!data) return [];
    
    // If no location is provided, return all shops without distance
    if (!latitude || !longitude) {
      return data.map(normalizeShop);
    }
    
    // Calculate distance for each shop
    const shopsWithDistance = data
      .filter(shop => shop.latitude && shop.longitude)
      .map(shop => {
        const distance = getDistance(
          { latitude, longitude },
          { latitude: shop.latitude!, longitude: shop.longitude! }
        ) / 1000; // Convert to km
        
        return {
          ...normalizeShop(shop),
          distance
        };
      })
      .filter(shop => shop.distance <= radius)
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
    
    return shopsWithDistance;
  } catch (error) {
    console.error('Error fetching nearby shops:', error);
    return [];
  }
};

export const createShop = async (shop: Partial<Shop>): Promise<Shop | null> => {
  try {
    // Ensure required fields are present
    if (!shop.name || !shop.description || !shop.category || !shop.location) {
      throw new Error('Missing required fields for shop creation');
    }

    const { data, error } = await db
      .from('shops')
      .insert({
        name: shop.name,
        description: shop.description,
        location: shop.location,
        category: shop.category,
        address: shop.address,
        logo_url: shop.logo_url,
        cover_image: shop.cover_image,
        owner_id: shop.owner_id,
        latitude: shop.latitude,
        longitude: shop.longitude,
        is_verified: shop.is_verified || false,
        rating: shop.rating || 0,
        product_count: shop.product_count || 0
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return data ? normalizeShop(data) : null;
  } catch (error) {
    console.error('Error creating shop:', error);
    return null;
  }
};

export const updateShop = async (id: string, updates: Partial<Shop>): Promise<Shop | null> => {
  try {
    const { data, error } = await db
      .from('shops')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data ? normalizeShop(data) : null;
  } catch (error) {
    console.error(`Error updating shop with ID ${id}:`, error);
    return null;
  }
};

export const deleteShop = async (id: string): Promise<boolean> => {
  try {
    const { error } = await db
      .from('shops')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Error deleting shop with ID ${id}:`, error);
    return false;
  }
};

// Function to get a user's main shop
export const getMainShop = async (): Promise<Shop | null> => {
  try {
    const mainShopId = localStorage.getItem('mainShopId');
    if (!mainShopId) return null;
    
    return await getShopById(mainShopId);
  } catch (error) {
    console.error('Error getting main shop:', error);
    return null;
  }
};

// Subscribe to shop updates
export const subscribeToShops = (callback: (shops: Shop[]) => void) => {
  // Set up initial fetch
  getShops().then(shops => {
    callback(shops);
  });
  
  // Set up realtime subscription
  const channel = db
    .channel('shops-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'shops' }, async () => {
      // Refetch shops when changes occur
      const shops = await getShops();
      callback(shops);
    })
    .subscribe();
  
  return channel;
};

// Function to get products from a specific shop
export const getShopProducts = async (shopId: string): Promise<Product[]> => {
  try {
    const { data, error } = await db
      .from('products')
      .select('*')
      .eq('shop_id', shopId)
      .eq('is_published', true);
    
    if (error) throw error;
    
    return data?.map(normalizeProduct) || [];
  } catch (error) {
    console.error(`Error fetching products for shop ${shopId}:`, error);
    return [];
  }
};

// Helper function to convert database product to model product
export const convertToModelProduct = normalizeProduct;
