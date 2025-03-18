import { supabase } from '@/integrations/supabase/client';
import { Shop } from '@/types/shop';
import { Product } from '@/types/database';

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
      name: shopData.name || 'New Shop',
      description: shopData.description || 'Shop description',
      location: shopData.location || 'Unknown location',
      category: 'general',
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
  
  return data?.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    category: item.category,
    images: item.images || [],
    in_stock: item.is_published || false,
    seller_id: item.shop_id,
    seller_name: '',
    // Add any other required fields
  })) || [];
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

// Add shop to favorites - temporarily disabled due to table issues
export const addShopToFavorites = async (userId: string, shopId: string) => {
  // Simplified stub for now
  return { user_id: userId, shop_id: shopId };
};

// Remove shop from favorites
export const removeShopFromFavorites = async (userId: string, shopId: string) => {
  // Simplified stub for now
  return { success: true };
};

// Get user's favorite shops
export const getFavoriteShops = async (userId: string): Promise<Shop[]> => {
  // Simplified stub for now
  return [];
};

// Check if shop is favorited by user
export const isShopFavorited = async (userId: string, shopId: string): Promise<boolean> => {
  // Simplified stub for now
  return false;
};

// Added these functions for compatibility with imports
export const getShops = getAllShops;
export const getShopProducts = getProductsByShopId;
export const convertToModelProduct = (dbProduct: any): Product => {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    description: dbProduct.description,
    price: dbProduct.price,
    category: dbProduct.category,
    images: dbProduct.images || [],
    in_stock: dbProduct.is_published || false,
    seller_id: dbProduct.shop_id,
    seller_name: ''
  };
};

export const subscribeToShops = (callback: (shops: Shop[]) => void) => {
  getAllShops().then(shops => callback(shops));
  return () => {}; // Return unsubscribe function
};

export const getMainShop = async (userId: string): Promise<Shop | null> => {
  const shops = await getShopsByUserId(userId);
  return shops.length > 0 ? shops[0] : null;
};

export const updateProfile = async (userId: string, data: any) => {
  const { error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', userId);
    
  if (error) throw error;
  return { success: true };
};

export const getNearbyShops = async (latitude: number, longitude: number, radius: number = 10): Promise<Shop[]> => {
  return getShopsByLocation(latitude, longitude, radius);
};

export const getProducts = async (shopId: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('shop_id', shopId);
    
  if (error) throw error;
  
  return data?.map(product => ({
    ...product,
    shop_id: shopId,
    is_halal_certified: product.is_halal_certified || false,
    created_at: product.created_at || new Date().toISOString(),
    updated_at: product.updated_at || new Date().toISOString()
  })) || [];
};
