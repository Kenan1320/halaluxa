
import { supabase } from '@/integrations/supabase/client';
import { Shop } from '@/types/shop';
import { Product } from '@/types/database';
import { normalizeShop, normalizeShopArray, normalizeProduct } from '@/lib/normalizeData';

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
  
  return data?.map(item => {
    const normalizedProduct = normalizeProduct(item);
    // Add default values for missing properties
    return {
      ...normalizedProduct,
      in_stock: normalizedProduct.in_stock !== undefined ? normalizedProduct.in_stock : true,
      delivery_mode: normalizedProduct.delivery_mode || 'pickup',
      pickup_options: normalizedProduct.pickup_options || { store: true, curbside: false }
    };
  }) || [];
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

// Alias for getAllShops for compatibility
export const getShops = getAllShops;
// Alias for getProductsByShopId for compatibility
export const getShopProducts = getProductsByShopId;

// Convert database product to model product
export const convertToModelProduct = (dbProduct: any): any => {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    description: dbProduct.description,
    price: dbProduct.price,
    category: dbProduct.category,
    images: dbProduct.images || [],
    in_stock: dbProduct.is_published || false,
    shop_id: dbProduct.shop_id,
    // Add model-specific fields
    seller_name: '',
    seller_id: ''
  };
};

export const subscribeToShops = (callback: (shops: Shop[]) => void) => {
  getAllShops().then(shops => callback(shops));
  // Return an unsubscribe function with the expected interface
  return function unsubscribe() {};
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

export const getNearbyShops = async (latitude?: number, longitude?: number, radius: number = 10): Promise<Shop[]> => {
  if (latitude && longitude) {
    return getShopsByLocation(latitude, longitude, radius);
  }
  return getAllShops();
};

export const getProducts = async (shopId: string): Promise<Product[]> => {
  return getProductsByShopId(shopId);
};

export { type Shop };
