
import { supabase } from '@/lib/supabaseClient';
import { Shop, ShopProduct } from '@/models/shop';
import { adaptDbShopToShop, adaptDbProductToShopProduct, DbShop } from './shopServiceHelpers';

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

    return adaptDbShopToShop(shop as DbShop);
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

    return shops.map(shop => adaptDbShopToShop(shop as DbShop));
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

    return shops.map(shop => adaptDbShopToShop(shop as DbShop));
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

    return shops.map(shop => adaptDbShopToShop(shop as DbShop));
  } catch (error) {
    console.error("Unexpected error fetching featured shops:", error);
    return [];
  }
};

export const getNearbyShops = async (latitude: number, longitude: number, distance = 10): Promise<Shop[]> => {
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
    const nearbyShops = shops.filter((shop) => {
      if (shop.latitude && shop.longitude) {
        const shopDistance = calculateDistance(latitude, longitude, shop.latitude, shop.longitude);
        return shopDistance <= distance;
      }
      return false;
    });

    return nearbyShops.map(shop => adaptDbShopToShop(shop as DbShop));
  } catch (error) {
    console.error("Unexpected error fetching nearby shops:", error);
    return [];
  }
};

// Function to calculate distance between two coordinates in kilometers
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
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

    return products.map(product => adaptDbProductToShopProduct(product));
  } catch (error) {
    console.error("Unexpected error fetching shop products:", error);
    return [];
  }
};

export interface Review {
  id: string;
  userId: string;
  shopId: string;
  rating: number;
  review: string;
  createdAt: string;
}

export const getShopReviews = async (shopId: string): Promise<Review[]> => {
  try {
    // Implement the API call or database query
    // This is a mock implementation
    const reviews = [
      {
        id: '1',
        userId: '1',
        shopId: shopId,
        rating: 5,
        review: 'Great shop!',
        createdAt: '2023-07-30'
      },
      {
        id: '2',
        userId: '2',
        shopId: shopId,
        rating: 4,
        review: 'Good products.',
        createdAt: '2023-07-29'
      }
    ];
    return reviews;
  } catch (error) {
    console.error('Error fetching shop reviews:', error);
    return [];
  }
};

export interface ShopFilterOptions {
  category?: string;
  rating?: number;
  location?: {
    latitude: number;
    longitude: number;
  };
  distance?: number;
  isHalalCertified?: boolean;
  search?: string;
}

export const getShopsByFilter = async (options: ShopFilterOptions): Promise<Shop[]> => {
  try {
    // Implement the API call or database query
    // This is a mock implementation
    let shops = await getShops();

    // Apply filters
    if (options.category) {
      shops = shops.filter((shop) => shop.category === options.category);
    }

    if (options.rating) {
      shops = shops.filter((shop) => shop.rating >= options.rating);
    }

    if (options.distance && options.location) {
      shops = shops.filter((shop) => {
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
      shops = shops.filter((shop) => shop.isVerified === true);
    }

    if (options.search) {
      shops = shops.filter(
        (shop) =>
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
export const updateUserShopPreference = async (userId: string, shopId: string, isFavorite: boolean): Promise<boolean> => {
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

    return data.map(shop => adaptDbShopToShop(shop as DbShop));
  } catch (error) {
    console.error("Unexpected error fetching shops by owner ID:", error);
    return [];
  }
};

export const createShop = async (shopData: Partial<Shop>): Promise<Shop | null> => {
  try {
    // Convert from our Shop model to DB format
    const dbShopData = {
      name: shopData.name,
      description: shopData.description,
      location: shopData.location,
      owner_id: shopData.ownerId,
      category: shopData.category,
      is_verified: shopData.isVerified || false,
      logo_url: shopData.logo || null,
      cover_image: shopData.coverImage || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      rating: shopData.rating || 0,
      product_count: shopData.productCount || 0,
      latitude: shopData.latitude || null,
      longitude: shopData.longitude || null
    };

    const { data, error } = await supabase
      .from('shops')
      .insert([dbShopData])
      .select()
      .single();

    if (error) {
      console.error("Error creating shop:", error);
      return null;
    }

    return adaptDbShopToShop(data as DbShop);
  } catch (error) {
    console.error("Unexpected error creating shop:", error);
    return null;
  }
};

// Subscribe to real-time changes for shops
export const subscribeToShops = (callback: (shops: Shop[]) => void) => {
  const subscription = supabase
    .channel('shops-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'shops' },
      (payload) => {
        // When there's a change, fetch all shops
        getShops().then(shops => {
          callback(shops);
        });
      }
    )
    .subscribe();

  return subscription;
};

// Get the main shop from localStorage
export const getMainShop = async (): Promise<Shop | null> => {
  const mainShopId = localStorage.getItem('mainShopId');
  if (!mainShopId) return null;
  
  return await getShopById(mainShopId);
};
