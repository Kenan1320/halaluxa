
import { supabase } from '@/integrations/supabase/client';
import { Shop } from '@/types/shop';
import { Product } from '@/models/product';
import { normalizeShop } from '@/utils/shopHelper';

// Function to get shops by user id
export const getShopsByUserId = async (userId: string): Promise<Shop[]> => {
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .eq('owner_id', userId);
    
  if (error) throw error;
  return data?.map(shop => normalizeShop(shop)) || [];
};

// Function to get a shop by ID
export const getShopById = async (id: string): Promise<Shop | null> => {
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw error;
  }
  
  return data ? normalizeShop(data) : null;
};

// Function to create a new shop
export const createShop = async (shopData: Partial<Shop>, userId: string): Promise<Shop> => {
  const { data, error } = await supabase
    .from('shops')
    .insert({
      ...shopData,
      owner_id: userId,
      is_verified: false
    })
    .select()
    .single();
    
  if (error) throw error;
  return normalizeShop(data);
};

// Function to update a shop
export const updateShop = async (id: string, shopData: Partial<Shop>): Promise<Shop> => {
  const { data, error } = await supabase
    .from('shops')
    .update(shopData)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return normalizeShop(data);
};

// Function to get products by shop ID
export const getProductsByShopId = async (shopId: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('shop_id', shopId);
    
  if (error) throw error;
  return data || [];
};

// Function to get all shops
export const getAllShops = async (limit = 100): Promise<Shop[]> => {
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .eq('is_verified', true)
    .limit(limit);
    
  if (error) throw error;
  return data?.map(shop => normalizeShop(shop)) || [];
};

// Function to get shops by category
export const getShopsByCategory = async (category: string): Promise<Shop[]> => {
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .eq('category', category)
    .eq('is_verified', true);
    
  if (error) throw error;
  return data?.map(shop => normalizeShop(shop)) || [];
};

// Function to search shops
export const searchShops = async (query: string): Promise<Shop[]> => {
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .eq('is_verified', true)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%,category.ilike.%${query}%`);
    
  if (error) throw error;
  return data?.map(shop => normalizeShop(shop)) || [];
};

// Get shops by location
export const getShopsByLocation = async (latitude: number, longitude: number, radius: number = 10): Promise<Shop[]> => {
  // For demo purposes, we'll just return all shops
  // In a real application, you would use PostGIS or a third-party service
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .eq('is_verified', true);
    
  if (error) throw error;
  
  // Filter shops within radius using Haversine formula
  // This is just a simple example, in production you'd want to do this in the database
  const shops = data?.map(shop => normalizeShop(shop)) || [];
  
  return shops.filter(shop => {
    if (!shop.latitude || !shop.longitude) return false;
    
    // Simple radius check (very basic)
    const latDiff = Math.abs(shop.latitude - latitude);
    const lngDiff = Math.abs(shop.longitude - longitude);
    
    // Rough approximation (not accurate for large distances)
    return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111 <= radius;
  });
};

// Add shop to favorites
export const addShopToFavorites = async (userId: string, shopId: string) => {
  const { data, error } = await supabase
    .from('user_favorite_shops')
    .insert({ user_id: userId, shop_id: shopId })
    .select();
    
  if (error) throw error;
  return data;
};

// Remove shop from favorites
export const removeShopFromFavorites = async (userId: string, shopId: string) => {
  const { data, error } = await supabase
    .from('user_favorite_shops')
    .delete()
    .match({ user_id: userId, shop_id: shopId });
    
  if (error) throw error;
  return data;
};

// Get user's favorite shops
export const getFavoriteShops = async (userId: string): Promise<Shop[]> => {
  const { data, error } = await supabase
    .from('user_favorite_shops')
    .select('shop_id')
    .eq('user_id', userId);
    
  if (error) throw error;
  
  if (!data || data.length === 0) return [];
  
  const shopIds = data.map(fav => fav.shop_id);
  
  const { data: shops, error: shopsError } = await supabase
    .from('shops')
    .select('*')
    .in('id', shopIds);
    
  if (shopsError) throw shopsError;
  
  return shops?.map(shop => normalizeShop(shop)) || [];
};

// Check if shop is favorited by user
export const isShopFavorited = async (userId: string, shopId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('user_favorite_shops')
    .select('*')
    .match({ user_id: userId, shop_id: shopId });
    
  if (error) throw error;
  return data && data.length > 0;
};
