
import { supabase } from '@/integrations/supabase/client';

// Custom event for shop updates
const SHOP_UPDATE_EVENT = 'haluna-shop-updated';

// Listen for shop updates and invalidate cache
window.addEventListener(SHOP_UPDATE_EVENT, () => {
  invalidateShopCache();
});

// Cache management
let cachedShops = null;
let lastFetchTime = 0;
const CACHE_DURATION = 1000; // 1 second cache duration

// Helper method to calculate product count for shops
const calculateProductCountForShop = async (shopId) => {
  try {
    const { count, error } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('seller_id', shopId);
    
    if (error) {
      console.error('Error calculating product count:', error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error('Error calculating product count:', error);
    return 0;
  }
};

// Get all shops from Supabase
export const getShops = async () => {
  const currentTime = Date.now();
  
  // Use cache if it's recent enough
  if (cachedShops && currentTime - lastFetchTime < CACHE_DURATION) {
    return cachedShops;
  }
  
  try {
    const { data: shops, error } = await supabase
      .from('shops')
      .select('*');
    
    if (error) {
      console.error('Failed to fetch shops data:', error);
      return [];
    }
    
    // Calculate product count for each shop
    const updatedShops = await Promise.all(shops.map(async (shop) => {
      return {
        ...shop,
        productCount: await calculateProductCountForShop(shop.id)
      };
    }));
    
    // Update cache
    cachedShops = updatedShops;
    lastFetchTime = currentTime;
    
    return updatedShops;
  } catch (error) {
    console.error('Failed to fetch shops data:', error);
    return [];
  }
};

// Invalidate the shop cache to force fresh data
export const invalidateShopCache = () => {
  cachedShops = null;
  lastFetchTime = 0;
};

// Trigger shop update event to refresh data across components
export const notifyShopUpdate = () => {
  window.dispatchEvent(new Event(SHOP_UPDATE_EVENT));
};

// Get a shop by ID
export const getShopById = async (shopId) => {
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
    
    return data;
  } catch (error) {
    console.error('Error fetching shop:', error);
    return null;
  }
};

// Get products for a specific shop
export const getProductsForShop = async (shopId) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', shopId);
    
    if (error) {
      console.error('Error fetching shop products:', error);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching shop products:', error);
    return [];
  }
};

// Update shop details
export const updateShop = async (shopId, shopData) => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .update(shopData)
      .eq('id', shopId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating shop:', error);
      return null;
    }
    
    // Invalidate cache and notify components
    notifyShopUpdate();
    
    return data;
  } catch (error) {
    console.error('Error updating shop:', error);
    return null;
  }
};

// Create a new shop
export const createShop = async (shopData) => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .insert({
        name: shopData.name,
        description: shopData.description || '',
        owner_id: shopData.ownerId,
        logo_url: shopData.logo || null,
        location: shopData.location || null,
        rating: shopData.rating || 0
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating shop:', error);
      return null;
    }
    
    // Invalidate cache and notify components
    notifyShopUpdate();
    
    return data;
  } catch (error) {
    console.error('Error creating shop:', error);
    return null;
  }
};

// Update shop product count (called after product operations)
export const updateShopProductCount = async (shopId) => {
  try {
    const productCount = await calculateProductCountForShop(shopId);
    
    const { data, error } = await supabase
      .from('shops')
      .update({ product_count: productCount })
      .eq('id', shopId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating shop product count:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error updating shop product count:', error);
    return null;
  }
};

// Delete a shop (for admin purposes)
export const deleteShop = async (shopId) => {
  try {
    const { error } = await supabase
      .from('shops')
      .delete()
      .eq('id', shopId);
    
    if (error) {
      console.error('Error deleting shop:', error);
      return false;
    }
    
    // Invalidate cache and notify components
    notifyShopUpdate();
    
    return true;
  } catch (error) {
    console.error('Error deleting shop:', error);
    return false;
  }
};
