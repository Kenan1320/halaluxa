import { Database } from '@/types/supabase';
import { supabase } from '@/lib/supabaseClient';
import { Shop, ShopProduct, ShopFilterOptions } from '@/models/shop';
import { adaptDbProductToShopProduct } from './shopServiceHelpers';

type DbShop = Database['public']['Tables']['shops']['Row'];
type DbProduct = Database['public']['Tables']['products']['Row'];

export const getShopById = async (shopId: string): Promise<Shop | null> => {
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

    return shop as Shop;
  } catch (error) {
    console.error("Unexpected error fetching shop:", error);
    return null;
  }
};

export const getAllShops = async (): Promise<Shop[]> => {
  try {
    const { data: shops, error } = await supabase
      .from('shops')
      .select('*');

    if (error) {
      console.error("Error fetching shops:", error);
      return [];
    }

    return shops as Shop[];
  } catch (error) {
    console.error("Unexpected error fetching shops:", error);
    return [];
  }
};

export const getShopsByCategory = async (category: string): Promise<Shop[]> => {
  try {
    const { data: shops, error } = await supabase
      .from('shops')
      .select('*')
      .eq('category', category);

    if (error) {
      console.error("Error fetching shops by category:", error);
      return [];
    }

    return shops as Shop[];
  } catch (error) {
    console.error("Unexpected error fetching shops by category:", error);
    return [];
  }
};

export const getFeaturedShops = async (): Promise<Shop[]> => {
  try {
    // This is a placeholder - replace with your actual logic
    const { data: shops, error } = await supabase
      .from('shops')
      .select('*')
      .limit(8);

    if (error) {
      console.error("Error fetching featured shops:", error);
      return [];
    }

    return shops as Shop[];
  } catch (error) {
    console.error("Unexpected error fetching featured shops:", error);
    return [];
  }
};

export const getNearbyShops = async (latitude: number, longitude: number, distance: number = 10): Promise<Shop[]> => {
  try {
    // This is a simplified example. You'll need to adapt it to your database setup.
    const { data: shops, error } = await supabase
      .from('shops')
      .select('*');

    if (error) {
      console.error("Error fetching nearby shops:", error);
      return [];
    }

    // Filter shops based on distance
    const nearbyShops = (shops as Shop[]).filter(shop => {
      if (shop.latitude && shop.longitude) {
        const shopDistance = calculateDistance(latitude, longitude, shop.latitude, shop.longitude);
        return shopDistance <= distance;
      }
      return false;
    });

    return nearbyShops;
  } catch (error) {
    console.error("Unexpected error fetching nearby shops:", error);
    return [];
  }
};

// Function to calculate distance between two coordinates in kilometers
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180)
}

export const getShopProducts = async (shopId: string): Promise<ShopProduct[]> => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('shop_id', shopId);

    if (error) {
      console.error("Error fetching shop products:", error);
      return [];
    }

    return (products as DbProduct[]).map(adaptDbProductToShopProduct);
  } catch (error) {
    console.error("Unexpected error fetching shop products:", error);
    return [];
  }
};

export const getShopReviews = async (shopId: string): Promise<any[]> => {
  try {
    // Implement the API call or database query
    // This is a mock implementation
    const reviews = [
      { id: '1', userId: '1', shopId: shopId, rating: 5, review: 'Great shop!', createdAt: '2023-07-30' },
      { id: '2', userId: '2', shopId: shopId, rating: 4, review: 'Good products.', createdAt: '2023-07-29' }
    ];
    return reviews;
  } catch (error) {
    console.error('Error fetching shop reviews:', error);
    return [];
  }
};

export const getShopsByFilter = async (options: ShopFilterOptions): Promise<Shop[]> => {
  try {
    // Implement the API call or database query
    // This is a mock implementation
    let shops = await getAllShops();

    // Apply filters
    if (options.category) {
      shops = shops.filter(shop => shop.category === options.category);
    }
    if (options.rating) {
      shops = shops.filter(shop => shop.rating >= options.rating);
    }
    if (options.distance && options.location) {
      shops = shops.filter(shop => {
        if (shop.latitude && shop.longitude) {
          const shopDistance = calculateDistance(
            options.location!.latitude,
            options.location!.longitude,
            shop.latitude,
            shop.longitude
          );
          return shopDistance <= options.distance!;
        }
        return false;
      });
    }
    if (options.isHalalCertified) {
      // Assuming there is a field is_halal_certified in the shop object
      shops = shops.filter(shop => shop.is_verified === true);
    }
    if (options.search) {
      shops = shops.filter(shop =>
        shop.name.toLowerCase().includes(options.search!.toLowerCase()) ||
        shop.description.toLowerCase().includes(options.search!.toLowerCase())
      );
    }

    return shops;
  } catch (error) {
    console.error('Error fetching shops by filter:', error);
    return [];
  }
};

// Add the missing function for updating user shop preferences
export const updateUserShopPreference = async (
  userId: string,
  shopId: string,
  isFavorite: boolean
): Promise<boolean> => {
  try {
    // Implement the API call or database update
    // This is a mock implementation
    console.log(`User ${userId} set shop ${shopId} as ${isFavorite ? 'favorite' : 'not favorite'}`);
    
    // In a real implementation, you would update the database
    return true;
  } catch (error) {
    console.error('Error updating user shop preference:', error);
    return false;
  }
};

export const getShopsByOwnerId = async (ownerId: string): Promise<Shop[]> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('owner_id', ownerId);

    if (error) {
      console.error("Error fetching shops by owner ID:", error);
      return [];
    }

    return (data as DbShop[]) as Shop[];
  } catch (error) {
    console.error("Unexpected error fetching shops by owner ID:", error);
    return [];
  }
};
