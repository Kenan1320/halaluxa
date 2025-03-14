import { supabase } from '@/integrations/supabase/client';
import type { Shop } from '@/types/database';
import { 
  setupDatabaseTables,
  getShops,
  getShopProducts,
  convertToModelProduct,
  uploadProductImage,
  mapShopToModel
} from './shopServiceHelpers';

// Export types and helper functions from shopServiceHelpers
export type { Shop };
export { 
  setupDatabaseTables,
  getShops,
  getShopProducts,
  convertToModelProduct,
  uploadProductImage,
  mapShopToModel
};

// Function to subscribe to real-time updates for shops
export const subscribeToShops = (callback: (shops: Shop[]) => void) => {
  return supabase
    .channel('public:shops')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'shops' },
      (payload) => {
        // Fetch all shops to ensure the data is up-to-date
        getAllShops().then((shops) => {
          callback(shops);
        });
      }
    )
    .subscribe();
};

// Function to get all shops
export const getAllShops = async (): Promise<Shop[]> => {
  try {
    const { data: shops, error } = await supabase
      .from('shops')
      .select('*');

    if (error) {
      throw error;
    }

    return shops || [];
  } catch (error) {
    console.error('Error fetching shops:', error);
    return [];
  }
};

// Function to get a shop by ID
export const getShopById = async (id: string): Promise<Shop | null> => {
  try {
    const { data: shop, error } = await supabase
      .from('shops')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return shop || null;
  } catch (error) {
    console.error(`Error fetching shop with ID ${id}:`, error);
    return null;
  }
};

// Function to get nearby shops based on user's location
export const getNearbyShops = async (latitude?: number, longitude?: number): Promise<Shop[]> => {
  try {
    // Use passed coordinates or default to a fallback if not provided
    const userLatitude = latitude || 37.7749;  // Default latitude
    const userLongitude = longitude || -122.4194; // Default longitude

    // For now, return all shops as a mock
    const { data: shops, error } = await supabase
      .from('shops')
      .select('*');

    if (error) {
      throw error;
    }

    return shops as Shop[];
  } catch (error) {
    console.error('Error fetching nearby shops:', error);
    return [];
  }
};

// Function to get the main shop ID from localStorage
export const getMainShopId = (): string | null => {
  if (typeof localStorage === 'undefined') {
    return null;
  }
  return localStorage.getItem('mainShopId');
};

// Function to get the main shop
export const getMainShop = async (): Promise<Shop | null> => {
  const mainShopId = getMainShopId();
  if (!mainShopId) {
    return null;
  }
  return getShopById(mainShopId);
};

// Function to get shops for a specific seller
export const getShopsForSeller = async (sellerId: string): Promise<Shop[]> => {
  try {
    // Use direct shop query instead of seller_accounts
    const { data: shops, error } = await supabase
      .from('shops')
      .select('*')
      .eq('owner_id', sellerId);
    
    if (error) throw error;
    return shops as Shop[];
  } catch (error) {
    console.error('Error fetching shops for seller:', error);
    return [];
  }
};

// Function to create a new shop
export const createShop = async (shop: Omit<Shop, 'id'>): Promise<Shop | null> => {
  try {
    const { data: newShop, error } = await supabase
      .from('shops')
      .insert([{
        name: shop.name,
        description: shop.description,
        location: shop.location,
        category: shop.category,
        logo_url: shop.logo_url, // Use snake_case for database
        cover_image: shop.cover_image, // Use snake_case for database
        rating: shop.rating || 0,
        product_count: shop.product_count || 0,
        is_verified: shop.is_verified || false,
        owner_id: shop.owner_id,
        latitude: shop.latitude,
        longitude: shop.longitude
      }])
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return newShop as Shop;
  } catch (error) {
    console.error('Error creating shop:', error);
    return null;
  }
};

// Function to update an existing shop
export const updateShop = async (id: string, updates: Partial<Shop>): Promise<Shop | null> => {
  try {
    // Convert frontend property names to database column names
    const dbUpdates: any = {};
    
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.location !== undefined) dbUpdates.location = updates.location;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.logo_url !== undefined) dbUpdates.logo_url = updates.logo_url;
    if (updates.cover_image !== undefined) dbUpdates.cover_image = updates.cover_image;
    if (updates.rating !== undefined) dbUpdates.rating = updates.rating;
    if (updates.product_count !== undefined) dbUpdates.product_count = updates.product_count;
    if (updates.is_verified !== undefined) dbUpdates.is_verified = updates.is_verified;
    if (updates.owner_id !== undefined) dbUpdates.owner_id = updates.owner_id;
    if (updates.latitude !== undefined) dbUpdates.latitude = updates.latitude;
    if (updates.longitude !== undefined) dbUpdates.longitude = updates.longitude;
    
    const { data: updatedShop, error } = await supabase
      .from('shops')
      .update(dbUpdates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return updatedShop as Shop;
  } catch (error) {
    console.error(`Error updating shop with ID ${id}:`, error);
    return null;
  }
};

// Function to delete a shop
export const deleteShop = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('shops')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error(`Error deleting shop with ID ${id}:`, error);
    return false;
  }
};

// Mock implementation for updateUserShopPreference
export const updateUserShopPreference = async (
  shopId: string,
  userId: string,
  preferences: { is_favorite?: boolean; is_following?: boolean; is_main_shop?: boolean }
): Promise<{ data: { is_favorite: boolean; is_following: boolean } | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('user_shop_preferences')
      .upsert(
        {
          user_id: userId,
          shop_id: shopId,
          ...(preferences.is_favorite !== undefined && { is_favorite: preferences.is_favorite }),
          ...(preferences.is_following !== undefined && { is_following: preferences.is_following }),
          ...(preferences.is_main_shop !== undefined && { is_main_shop: preferences.is_main_shop }),
          updated_at: new Date().toISOString()
        },
        { onConflict: 'user_id,shop_id' }
      )
      .select()
      .single();

    if (error) {
      console.error('Error updating shop preferences:', error);
      return { data: null, error };
    }

    return { 
      data: { 
        is_favorite: data.is_favorite, 
        is_following: data.is_following 
      }, 
      error: null 
    };
  } catch (error) {
    console.error('Error in updateUserShopPreference:', error);
    return { data: null, error };
  }
};
