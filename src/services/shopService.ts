
import { supabase } from '@/lib/supabaseClient';
import { adaptDbProductToShopProduct } from './shopServiceHelpers';
import { adaptDbShopToModelShop } from '@/models/shop';
import { Shop } from '@/models/shop';
import { ShopProduct } from '@/models/product';
import { UUID } from '@/models/types';

export const getShopById = async (shopId: UUID): Promise<Shop | null> => {
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

export const getShops = async (): Promise<Shop[]> => {
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

export const getNearbyShops = async (latitude?: number, longitude?: number, radius: number = 50): Promise<Shop[]> => {
  try {
    // If location is provided, we can use it to filter shops by distance
    if (latitude && longitude) {
      // This is a placeholder implementation - in a real app, we would use PostGIS or similar
      // to calculate distances and filter by them
      const { data: shops, error } = await supabase
        .from('shops')
        .select('*');
        
      if (error) {
        console.error("Error fetching nearby shops:", error);
        return [];
      }
      
      // Calculate distances and sort by them
      const shopsWithDistances = shops.map(shop => {
        if (shop.latitude && shop.longitude && latitude && longitude) {
          // Very simple distance calculation - in production, use a proper geospatial formula
          const distance = Math.sqrt(
            Math.pow(shop.latitude - latitude, 2) + 
            Math.pow(shop.longitude - longitude, 2)
          ) * 111; // Rough conversion to kilometers
          
          return { ...shop, distance };
        }
        return { ...shop, distance: Number.MAX_VALUE };
      });
      
      // Filter by radius and sort by distance
      const nearbyShops = shopsWithDistances
        .filter(shop => shop.distance <= radius)
        .sort((a, b) => a.distance - b.distance);
        
      return nearbyShops.map(adaptDbShopToModelShop);
    } else {
      // If no location, just return all shops
      return getShops();
    }
  } catch (error) {
    console.error("Unexpected error fetching nearby shops:", error);
    return [];
  }
};

export const getShopProducts = async (shopId: UUID): Promise<ShopProduct[]> => {
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

export const getFeaturedShops = async (limit: number = 6): Promise<Shop[]> => {
  try {
    const { data: shops, error } = await supabase
      .from('shops')
      .select('*')
      .order('rating', { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error("Error fetching featured shops:", error);
      return [];
    }
    
    return shops.map(adaptDbShopToModelShop);
  } catch (error) {
    console.error("Unexpected error fetching featured shops:", error);
    return [];
  }
};

export const getFeaturedProducts = async (limit: number = 8): Promise<ShopProduct[]> => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*, shops(name, logo_url)')
      .eq('featured', true)
      .limit(limit);
      
    if (error) {
      console.error("Error fetching featured products:", error);
      return [];
    }
    
    return products.map((product) => {
      return adaptDbProductToShopProduct({
        ...product,
        shop_name: product.shops?.name,
        shop_logo: product.shops?.logo_url
      });
    });
  } catch (error) {
    console.error("Unexpected error fetching featured products:", error);
    return [];
  }
};

export const getMainShop = async (shopId: UUID): Promise<Shop | null> => {
  return getShopById(shopId);
};

export const createShop = async (shopData: any): Promise<Shop | null> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .insert([shopData])
      .select()
      .single();
      
    if (error) {
      console.error("Error creating shop:", error);
      return null;
    }
    
    return adaptDbShopToModelShop(data);
  } catch (error) {
    console.error("Unexpected error creating shop:", error);
    return null;
  }
};

export const updateShop = async (shopId: UUID, shopData: Partial<Shop>): Promise<Shop | null> => {
  try {
    // Convert to database format
    const dbShopData = {
      name: shopData.name,
      description: shopData.description,
      logo_url: shopData.logo,
      category: shopData.category,
      location: shopData.location,
      cover_image: shopData.coverImage,
      delivery_available: shopData.deliveryAvailable,
      pickup_available: shopData.pickupAvailable,
      is_halal_certified: shopData.isHalalCertified,
      latitude: shopData.latitude,
      longitude: shopData.longitude,
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('shops')
      .update(dbShopData)
      .eq('id', shopId)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating shop:", error);
      return null;
    }
    
    return adaptDbShopToModelShop(data);
  } catch (error) {
    console.error("Unexpected error updating shop:", error);
    return null;
  }
};

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
