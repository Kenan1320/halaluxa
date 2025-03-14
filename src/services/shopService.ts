
import { supabase } from '@/integrations/supabase/client';
import { Shop, adaptDbShopToModelShop, adaptModelShopToDBShop } from '@/models/shop';
import { UUID, DBShop, Category } from '@/models/types';
import { calculateDistance } from '@/utils/locationUtils';
import { filterShops } from './shopServiceHelpers';

// Export the Shop type for components that need it
export type { Shop } from '@/models/shop';

/**
 * Fetch all shops from the database
 */
export const getShops = async (filters?: any): Promise<Shop[]> => {
  try {
    let query = supabase
      .from('shops')
      .select('*')
      .order('name');
    
    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    
    if (filters?.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return (data || []).map((shop: DBShop) => adaptDbShopToModelShop(shop));
  } catch (error) {
    console.error('Error fetching shops:', error);
    return [];
  }
};

// Alias for getShops for backward compatibility
export const getAllShops = getShops;

/**
 * Fetch a shop by ID
 */
export const getShopById = async (id: UUID): Promise<Shop | null> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data ? adaptDbShopToModelShop(data as DBShop) : null;
  } catch (error) {
    console.error(`Error fetching shop with ID ${id}:`, error);
    return null;
  }
};

/**
 * Create a new shop
 */
export const createShop = async (shop: Omit<Shop, 'id' | 'createdAt' | 'updatedAt'>): Promise<Shop | null> => {
  try {
    const dbShop = adaptModelShopToDBShop({
      ...shop,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Shop);
    
    const { data, error } = await supabase
      .from('shops')
      .insert([dbShop])
      .select()
      .single();
    
    if (error) throw error;
    
    return data ? adaptDbShopToModelShop(data as DBShop) : null;
  } catch (error) {
    console.error('Error creating shop:', error);
    return null;
  }
};

/**
 * Update an existing shop
 */
export const updateShop = async (id: UUID, shop: Partial<Shop>): Promise<Shop | null> => {
  try {
    const dbShop = adaptModelShopToDBShop({
      ...shop,
      id,
      updatedAt: new Date().toISOString()
    } as Shop);
    
    const { data, error } = await supabase
      .from('shops')
      .update(dbShop)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data ? adaptDbShopToModelShop(data as DBShop) : null;
  } catch (error) {
    console.error(`Error updating shop with ID ${id}:`, error);
    return null;
  }
};

/**
 * Delete a shop
 */
export const deleteShop = async (id: UUID): Promise<boolean> => {
  try {
    const { error } = await supabase
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

/**
 * Get nearby shops based on coordinates
 */
export const getNearbyShops = async (
  latitude: number,
  longitude: number,
  maxDistance: number = 10,
  category?: string
): Promise<Shop[]> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*');
    
    if (error) throw error;
    
    const shops = (data || []).map((shop: DBShop) => {
      const shopObj = adaptDbShopToModelShop(shop);
      
      if (shopObj.latitude && shopObj.longitude) {
        shopObj.distance = calculateDistance(
          latitude, 
          longitude, 
          shopObj.latitude, 
          shopObj.longitude
        );
      }
      
      return shopObj;
    });
    
    // Filter shops by distance and optionally by category
    const nearbyShops = shops.filter(shop => {
      const distanceMatch = shop.distance !== null && shop.distance <= maxDistance;
      const categoryMatch = !category || shop.category === category;
      return distanceMatch && categoryMatch;
    });
    
    // Sort by distance
    return nearbyShops.sort((a, b) => {
      return (a.distance || Infinity) - (b.distance || Infinity);
    });
  } catch (error) {
    console.error('Error fetching nearby shops:', error);
    return [];
  }
};

/**
 * Get main shop from localStorage
 */
export const getMainShop = async (): Promise<Shop | null> => {
  const mainShopId = localStorage.getItem('mainShopId');
  
  if (!mainShopId) {
    return null;
  }
  
  return await getShopById(mainShopId);
};

/**
 * Real-time subscription to shops
 */
export const subscribeToShops = (callback: (shops: Shop[]) => void) => {
  const subscription = supabase
    .channel('shops-channel')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'shops' }, () => {
      getShops().then(shops => callback(shops));
    })
    .subscribe();
  
  // Initial fetch
  getShops().then(shops => callback(shops));
  
  return subscription;
};

/**
 * Get categories by group
 */
export const getCategoriesByGroup = async (group: string): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('group', group);
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error(`Error fetching categories for group ${group}:`, error);
    return [];
  }
};

/**
 * Get featured products from all shops
 */
export const getFeaturedProducts = async (limit: number = 10) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        shops:shop_id (
          id,
          name,
          logo_url
        )
      `)
      .eq('featured', true)
      .limit(limit);
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
};

/**
 * Get all categories
 */
export const getCategories = async (): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Fix all the filter shops issues
export { filterShops };
