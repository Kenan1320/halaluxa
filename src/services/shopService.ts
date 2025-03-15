import { supabase } from '@/integrations/supabase/client';
import type { Shop } from '@/types/database';
import { 
  setupDatabaseTables,
  getShops,
  getShopProducts,
  convertToModelProduct,
  uploadProductImage,
  dbShopToModel
} from './shopServiceHelpers';
import { Category } from '@/types/shop';
import { productCategories } from '@/models/product';

// Export types and helper functions from shopServiceHelpers
export type { Shop };
export { 
  setupDatabaseTables,
  getShops,
  getShopProducts,
  convertToModelProduct,
  uploadProductImage,
  dbShopToModel
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
    let query = supabase.from('shops').select('*');
    
    // If coordinates are provided, we can calculate distance
    // This would usually be done with a database function
    // but for simplicity, we'll just fetch all shops and calculate distance client-side
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    let shops = data as Shop[];
    
    if (latitude && longitude) {
      // Calculate distance for each shop
      shops = shops.map(shop => {
        if (shop.latitude && shop.longitude) {
          const distance = calculateDistance(
            latitude, 
            longitude, 
            shop.latitude, 
            shop.longitude
          );
          return {
            ...shop,
            distance
          };
        }
        return shop;
      });
      
      // Sort by distance
      shops = shops.sort((a, b) => {
        return (a.distance || Infinity) - (b.distance || Infinity);
      });
    }
    
    return shops;
  } catch (error) {
    console.error('Error fetching nearby shops:', error);
    return [];
  }
};

// Helper function to calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
}

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

// Function to get categories
export const getCategories = async (): Promise<Category[]> => {
  try {
    // If needed, fetch categories from database
    // For now, we'll use the static productCategories array to create Category objects
    return productCategories.map((name, index) => ({
      id: index.toString(),
      name
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};
