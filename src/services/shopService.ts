import { db } from '@/integrations/supabase/client';
import { Shop } from '@/types/shop';
import { normalizeShop } from '@/lib/utils';
import { getDistance } from 'geolib';
import { Product } from '@/models/product';
import { normalizeProduct } from '@/lib/productUtils';
import { DatabaseProfile } from '@/types/database';

export type { Shop };

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
    const { data, error } = await db
      .from('shops')
      .select('*');
    
    if (error) throw error;
    
    if (!data) return [];
    
    if (!latitude || !longitude) {
      return data.map(normalizeShop);
    }
    
    const shopsWithDistance = data
      .filter(shop => shop.latitude && shop.longitude)
      .map(shop => {
        const distance = getDistance(
          { latitude, longitude },
          { latitude: shop.latitude!, longitude: shop.longitude! }
        ) / 1000;
        
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

export const subscribeToShops = (callback: (shops: Shop[]) => void) => {
  getShops().then(shops => {
    callback(shops);
  });
  
  const channel = db
    .channel('shops-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'shops' }, async () => {
      const shops = await getShops();
      callback(shops);
    })
    .subscribe();
  
  return channel;
};

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

export const convertToModelProduct = normalizeProduct;

// Function to get trending shops
export const getTrendingShops = async (): Promise<Shop[]> => {
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .eq('is_verified', true)
    .order('rating', { ascending: false })
    .limit(9);
    
  if (error) throw error;
  return data?.map(shop => normalizeShop(shop)) || [];
};

// Update user profile
export const updateProfile = async (userId: string, updates: Partial<DatabaseProfile>): Promise<boolean> => {
  try {
    const { data, error } = await db
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating profile:', error);
    return false;
  }
};
