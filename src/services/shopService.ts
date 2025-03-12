
import { createClient } from '@supabase/supabase-js';
import { Shop } from '@/types/database';

// Create a Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to calculate distance between two coordinates (haversine formula)
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
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

export const getAllShops = async (): Promise<Shop[]> => {
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching shops:', error);
    return [];
  }
  
  return data || [];
};

export const getOnlineShops = async (): Promise<Shop[]> => {
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .eq('display_mode', 'online')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching online shops:', error);
    return [];
  }
  
  return data || [];
};

export const getNearbyShops = async (latitude?: number, longitude?: number): Promise<Shop[]> => {
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching shops:', error);
    return [];
  }
  
  if (!data) return [];
  
  const shops = data as Shop[];
  
  // If location provided, calculate distances
  if (latitude && longitude) {
    return shops
      .map(shop => {
        if (shop.latitude && shop.longitude) {
          const distance = getDistance(
            latitude,
            longitude,
            shop.latitude,
            shop.longitude
          );
          return { ...shop, distance };
        }
        return shop;
      })
      .sort((a, b) => {
        if (a.distance === undefined) return 1;
        if (b.distance === undefined) return -1;
        return a.distance - b.distance;
      });
  }
  
  return shops;
};

export const getMainShop = async (): Promise<Shop | null> => {
  const mainShopId = localStorage.getItem('mainShop');
  if (!mainShopId) return null;
  
  try {
    return await getShopById(mainShopId);
  } catch (error) {
    console.error('Error fetching main shop:', error);
    return null;
  }
};

export const getShopById = async (id: string): Promise<Shop | null> => {
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Error fetching shop:', error);
    return null;
  }
  
  return data;
};

// Create a new shop
export const createShop = async (shopData: Omit<Shop, 'id'>): Promise<Shop | null> => {
  const { data, error } = await supabase
    .from('shops')
    .insert(shopData)
    .select()
    .single();
    
  if (error) {
    console.error('Error creating shop:', error);
    return null;
  }
  
  return data;
};

export const getShopProducts = async (shopId: string) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('shop_id', shopId);
    
  if (error) {
    console.error('Error fetching shop products:', error);
    return [];
  }
  
  return data || [];
};

export const convertToModelProduct = (dbProduct: any) => {
  // This is a placeholder to fix type errors
  return {
    ...dbProduct,
    in_stock: dbProduct.in_stock ?? true,
  };
};

// Explicitly export Shop type from database module
export { Shop };
