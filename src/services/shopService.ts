import { supabase } from '@/integrations/supabase/client';
import { Shop } from '@/types/shop';
import { Product } from '@/types/database';
import { normalizeShop, normalizeShopArray } from '@/lib/normalizeData';

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
export const createShop = async (shopData: Partial<Shop>): Promise<Shop> => {
  const { data, error } = await supabase
    .from('shops')
    .insert({
      name: shopData.name || 'New Shop',
      description: shopData.description || 'Shop description',
      location: shopData.location || 'Unknown location',
      category: shopData.category || 'general',
      owner_id: shopData.owner_id,
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
    shop_id: item.shop_id,
    is_halal_certified: item.is_halal_certified || false,
    in_stock: item.is_published || false,
    created_at: item.created_at || new Date().toISOString(),
    updated_at: item.updated_at || new Date().toISOString(),
    long_description: item.long_description || '',
    stock: item.stock || 0,
    details: item.details || {},
    is_published: item.is_published || false,
    delivery_mode: item.delivery_mode || 'pickup',
    pickup_options: item.pickup_options || { store: true, curbside: false }
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
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .eq('is_verified', true);
    
  if (error) throw error;
  
  return data?.map(shop => normalizeShop(shop)) || [];
};

// Add shop to favorites - temporarily disabled due to table issues
export const addShopToFavorites = async (userId: string, shopId: string) => {
  return { user_id: userId, shop_id: shopId };
};

// Remove shop from favorites
export const removeShopFromFavorites = async (userId: string, shopId: string) => {
  return { success: true };
};

// Get user's favorite shops
export const getFavoriteShops = async (userId: string): Promise<Shop[]> => {
  return [];
};

// Check if shop is favorited by user
export const isShopFavorited = async (userId: string, shopId: string): Promise<boolean> => {
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
  const unsubscribe = () => {};
  getAllShops().then(shops => callback(shops));
  return unsubscribe;
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

export type { Shop };
export { getShops, getShopProducts, convertToModelProduct };
