import { supabase } from '@/lib/supabaseClient';
import { adaptDbProductToShopProduct, adaptDbShopToModelShop } from './shopServiceHelpers';
import { Shop } from '@/models/shop';
import { ShopProduct } from '@/models/product';

export const getShopById = async (shopId: string) => {
  try {
    const { data: shop, error } = await supabase
      .from('shops')
      .select('*')
      .eq('id', shopId)
      .single();
      
    if (error) {
      console.error("Error fetching shop:", error);
      return null;
    }
    
    return adaptDbShopToModelShop(shop);
  } catch (error) {
    console.error("Unexpected error fetching shop:", error);
    return null;
  }
};

export const getShops = async () => {
  try {
    const { data: shops, error } = await supabase
      .from('shops')
      .select('*');
      
    if (error) {
      console.error("Error fetching shops:", error);
      return [];
    }
    
    return shops.map(adaptDbShopToModelShop);
  } catch (error) {
    console.error("Unexpected error fetching shops:", error);
    return [];
  }
};

export const getNearbyShops = async () => {
  try {
    // This is a placeholder implementation
    const { data: shops, error } = await supabase
      .from('shops')
      .select('*');
      
    if (error) {
      console.error("Error fetching nearby shops:", error);
      return [];
    }
    
    return shops.map(adaptDbShopToModelShop);
  } catch (error) {
    console.error("Unexpected error fetching nearby shops:", error);
    return [];
  }
};

export const getShopProducts = async (shopId: string) => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('shop_id', shopId);
      
    if (error) {
      console.error("Error fetching shop products:", error);
      return [];
    }
    
    return products.map(adaptDbProductToShopProduct);
  } catch (error) {
    console.error("Unexpected error fetching shop products:", error);
    return [];
  }
};

// Add the getMainShop function that was referenced in Navbar
export const getMainShop = async (shopId: string) => {
  return getShopById(shopId);
};

// Add subscription function
export const subscribeToShops = (callback: (shops: Shop[]) => void) => {
  const subscription = supabase
    .channel('shops')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'shops' }, 
      async () => {
        const shops = await getShops();
        callback(shops);
      }
    )
    .subscribe();
    
  return subscription;
};
