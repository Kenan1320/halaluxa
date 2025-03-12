import supabase from '@/integrations/supabase/client';
import { Shop } from '@/types/database';
import { getDistance } from '@/services/locationService';
import { mapShopFromDatabase } from './shopServiceHelpers';

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
