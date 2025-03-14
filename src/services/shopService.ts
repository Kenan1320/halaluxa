
import { supabase } from '@/lib/supabase';
import { Product } from '@/models/product';
import { Shop } from '@/models/shop';

export interface ShopProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  shop_id: string;
  stock: number;
  isHalalCertified?: boolean;
  inStock?: boolean;
  rating?: number;
  created_at?: string;
  updated_at?: string;
}

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

    return adaptShopToModel(shop);
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

    return shops.map(adaptShopToModel);
  } catch (error) {
    console.error("Unexpected error fetching shops:", error);
    return [];
  }
};

// Alias for getShops to maintain compatibility
export const getAllShops = getShops;

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

    return shops.map(adaptShopToModel);
  } catch (error) {
    console.error("Unexpected error fetching shops by category:", error);
    return [];
  }
};

export const getFeaturedShops = async (): Promise<Shop[]> => {
  try {
    const { data: shops, error } = await supabase
      .from('shops')
      .select('*')
      .limit(8);

    if (error) {
      console.error("Error fetching featured shops:", error);
      return [];
    }

    return shops.map(adaptShopToModel);
  } catch (error) {
    console.error("Unexpected error fetching featured shops:", error);
    return [];
  }
};

export const getNearbyShops = async (latitude?: number, longitude?: number, distance = 10): Promise<Shop[]> => {
  try {
    // This is a simplified example. You'll need to adapt it to your database setup.
    const { data: shops, error } = await supabase
      .from('shops')
      .select('*');

    if (error) {
      console.error("Error fetching nearby shops:", error);
      return [];
    }

    if (!latitude || !longitude) {
      return shops.map(adaptShopToModel);
    }

    // Filter shops based on distance
    const nearbyShops = shops.filter((shop) => {
      if (shop.latitude && shop.longitude) {
        const shopDistance = calculateDistance(latitude, longitude, shop.latitude, shop.longitude);
        return shopDistance <= distance;
      }
      return false;
    });

    return nearbyShops.map(adaptShopToModel);
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
  return deg * (Math.PI / 180);
}

export const getShopProducts = async (shopId: string): Promise<Product[]> => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('shop_id', shopId);

    if (error) {
      console.error("Error fetching shop products:", error);
      return [];
    }

    return products.map(convertToModelProduct);
  } catch (error) {
    console.error("Unexpected error fetching shop products:", error);
    return [];
  }
};

// Convert DB product to our Model product
export const convertToModelProduct = (dbProduct: ShopProduct): Product => {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    description: dbProduct.description,
    price: dbProduct.price,
    images: dbProduct.images || [],
    category: dbProduct.category,
    shopId: dbProduct.shop_id,
    quantity: dbProduct.stock || 0,
    rating: dbProduct.rating || 0,
    isHalalCertified: dbProduct.isHalalCertified || false,
  };
};

// Adapt DB shop to our model Shop
function adaptShopToModel(dbShop: any): Shop {
  return {
    id: dbShop.id,
    name: dbShop.name,
    description: dbShop.description || '',
    logo: dbShop.logo_url || '',
    category: dbShop.category || '',
    location: dbShop.location || '',
    rating: dbShop.rating || 0,
    productCount: dbShop.product_count || 0,
    isVerified: dbShop.is_verified || false,
    ownerId: dbShop.owner_id || '',
    latitude: dbShop.latitude || 0,
    longitude: dbShop.longitude || 0,
    coverImage: dbShop.cover_image || '',
  };
}

export const getShopReviews = async (shopId: string) => {
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

export const getShopsByFilter = async (options: any) => {
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
            options.location.latitude, 
            options.location.longitude, 
            shop.latitude, 
            shop.longitude
          );
          return shopDistance <= options.distance;
        }
        return false;
      });
    }
    
    if (options.isHalalCertified) {
      // Assuming there is a field isVerified which corresponds to halal certification
      shops = shops.filter((shop) => shop.isVerified === true);
    }
    
    if (options.search) {
      shops = shops.filter((shop) => 
        shop.name.toLowerCase().includes(options.search.toLowerCase()) || 
        shop.description.toLowerCase().includes(options.search.toLowerCase())
      );
    }
    
    return shops;
  } catch (error) {
    console.error('Error fetching shops by filter:', error);
    return [];
  }
};

export const updateUserShopPreference = async (userId: string, shopId: string, isFavorite: boolean) => {
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

    return data.map(adaptShopToModel);
  } catch (error) {
    console.error("Unexpected error fetching shops by owner ID:", error);
    return [];
  }
};

// Create shop 
export const createShop = async (shopData: any) => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .insert([
        {
          name: shopData.name,
          description: shopData.description,
          logo_url: shopData.logo_url,
          category: shopData.category,
          location: shopData.location,
          rating: shopData.rating || 0,
          product_count: shopData.product_count || 0,
          is_verified: shopData.is_verified || false,
          owner_id: shopData.owner_id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating shop:", error);
      return null;
    }

    return adaptShopToModel(data);
  } catch (error) {
    console.error("Unexpected error creating shop:", error);
    return null;
  }
};

// Set up real-time subscription for shops
export const subscribeToShops = (callback: (shops: Shop[]) => void) => {
  return supabase
    .channel('shops')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'shops' }, (payload) => {
      getShops().then(callback);
    })
    .subscribe();
};
