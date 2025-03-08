
import { supabase } from '@/integrations/supabase/client';
import { Shop, ShopProduct } from '@/models/shop';

// Function to upload product image to Supabase storage
export const uploadProductImage = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadProductImage:', error);
    return null;
  }
};

// Function to get a shop by ID
export const getShopById = async (shopId: string): Promise<Shop | null> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('id', shopId)
      .single();

    if (error) {
      console.error('Error fetching shop:', error);
      return null;
    }

    return data as Shop;
  } catch (error) {
    console.error('Error in getShopById:', error);
    return null;
  }
};

// Function to get the main shop for a user
export const getMainShop = async (userId: string): Promise<Shop | null> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('ownerId', userId)
      .eq('isMain', true)
      .single();

    if (error) {
      // If no main shop is found, try to get the first shop owned by the user
      if (error.code === 'PGRST116') {
        const { data: firstShop, error: firstShopError } = await supabase
          .from('shops')
          .select('*')
          .eq('ownerId', userId)
          .limit(1)
          .single();

        if (firstShopError) {
          console.error('Error fetching first shop:', firstShopError);
          return null;
        }

        return firstShop as Shop;
      }

      console.error('Error fetching main shop:', error);
      return null;
    }

    return data as Shop;
  } catch (error) {
    console.error('Error in getMainShop:', error);
    return null;
  }
};

// Get products for a specific shop
export const getShopProducts = async (shopId: string): Promise<ShopProduct[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('shop_id', shopId);

    if (error) {
      console.error('Error fetching shop products:', error);
      return [];
    }

    return data as ShopProduct[];
  } catch (error) {
    console.error('Error in getShopProducts:', error);
    return [];
  }
};

// Create a new shop
export const createShop = async (shop: Partial<Shop>): Promise<Shop | null> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .insert(shop)
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
};

// Update a shop
export const updateShop = async (shopId: string, updates: Partial<Shop>): Promise<Shop | null> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .update(updates)
      .eq('id', shopId)
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
};

// Set a shop as the main shop for a user
export const setMainShop = async (shopId: string, userId: string): Promise<boolean> => {
  try {
    // First, unset any existing main shop
    const { error: resetError } = await supabase
      .from('shops')
      .update({ isMain: false })
      .eq('ownerId', userId);

    if (resetError) {
      console.error('Error resetting main shop:', resetError);
      return false;
    }

    // Then set the selected shop as main
    const { error } = await supabase
      .from('shops')
      .update({ isMain: true })
      .eq('id', shopId)
      .eq('ownerId', userId);

    if (error) {
      console.error('Error setting main shop:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in setMainShop:', error);
    return false;
  }
};

// Get all shops for the marketplace
export const getAllShops = async (): Promise<Shop[]> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching all shops:', error);
      return [];
    }

    return data as Shop[];
  } catch (error) {
    console.error('Error in getAllShops:', error);
    return [];
  }
};

// Get shops owned by a user
export const getUserShops = async (userId: string): Promise<Shop[]> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('ownerId', userId)
      .order('name');

    if (error) {
      console.error('Error fetching user shops:', error);
      return [];
    }

    return data as Shop[];
  } catch (error) {
    console.error('Error in getUserShops:', error);
    return [];
  }
};

// Delete a shop
export const deleteShop = async (shopId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('shops')
      .delete()
      .eq('id', shopId);

    if (error) {
      console.error('Error deleting shop:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteShop:', error);
    return false;
  }
};

// Get nearby shops based on location
export const getNearbyShops = async (
  latitude: number, 
  longitude: number, 
  radiusInKm: number = 10
): Promise<Shop[]> => {
  try {
    // This would ideally use a PostGIS function to calculate distance
    // For now, we'll return all shops and sort by distance client-side
    const { data, error } = await supabase
      .from('shops')
      .select('*');

    if (error) {
      console.error('Error fetching nearby shops:', error);
      return [];
    }

    // Calculate distance for each shop (simplified version)
    const shopsWithDistance = data.map((shop: any) => {
      if (shop.latitude && shop.longitude) {
        // Simple distance calculation (not accurate for long distances)
        const distance = calculateDistance(
          latitude, 
          longitude, 
          shop.latitude, 
          shop.longitude
        );
        return {
          ...shop,
          distance
        } as Shop;
      }
      return shop as Shop;
    });

    // Filter shops by distance and sort by closest
    return shopsWithDistance
      .filter((shop: Shop) => shop.distance !== undefined && shop.distance <= radiusInKm)
      .sort((a: Shop, b: Shop) => (a.distance || 0) - (b.distance || 0));
  } catch (error) {
    console.error('Error in getNearbyShops:', error);
    return [];
  }
};

// Helper function to calculate distance between two coordinates
const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};
