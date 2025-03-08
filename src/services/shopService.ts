
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/models/product';

// Export Shop interface
export interface Shop {
  id: string;
  name: string;
  description: string;
  location: string;
  rating: number;
  productCount: number;
  isVerified: boolean;
  category: string;
  logo: string | null;
  coverImage: string | null;
  ownerId: string;
  latitude?: number | null;
  longitude?: number | null;
  distance?: number | null;
}

export interface ShopProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  sellerId: string;
  sellerName?: string;
  rating?: number;
}

// Get all shops
export const getShops = async (): Promise<Shop[]> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching shops:', error);
      return [];
    }
    
    // Map the database results to the Shop model
    return data.map(shop => ({
      id: shop.id,
      name: shop.name,
      description: shop.description || '',
      location: shop.location || 'Unknown location',
      rating: shop.rating || 5.0,
      productCount: shop.product_count || 0,
      isVerified: !!shop.is_verified,
      category: shop.category || 'General',
      logo: shop.logo_url,
      coverImage: shop.cover_image_url,
      ownerId: shop.owner_id,
      latitude: shop.latitude,
      longitude: shop.longitude
    }));
  } catch (error) {
    console.error('Error in getShops:', error);
    return [];
  }
};

// Alias for getShops to fix import errors in multiple files
export const getAllShops = getShops;

// Get a specific shop by ID
export const getShopById = async (shopId: string): Promise<Shop | null> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('id', shopId)
      .single();
    
    if (error) {
      console.error('Error fetching shop by ID:', error);
      return null;
    }
    
    if (!data) return null;
    
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      location: data.location || 'Unknown location',
      rating: data.rating || 5.0,
      productCount: data.product_count || 0,
      isVerified: !!data.is_verified,
      category: data.category || 'General',
      logo: data.logo_url,
      coverImage: data.cover_image_url,
      ownerId: data.owner_id,
      latitude: data.latitude,
      longitude: data.longitude
    };
  } catch (error) {
    console.error('Error in getShopById:', error);
    return null;
  }
};

// Get products for a specific shop
export const getShopProducts = async (shopId: string): Promise<ShopProduct[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, shops:seller_id(name)')
      .eq('seller_id', shopId)
      .order('name');
    
    if (error) {
      console.error('Error fetching shop products:', error);
      return [];
    }
    
    return data.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      images: product.images || [],
      sellerId: product.seller_id,
      sellerName: product.shops?.name || 'Unknown Shop',
      rating: product.rating
    }));
  } catch (error) {
    console.error('Error in getShopProducts:', error);
    return [];
  }
};

// Convert ShopProduct to Product model
export const convertToModelProduct = (shopProduct: ShopProduct): Product => {
  return {
    id: shopProduct.id,
    name: shopProduct.name,
    description: shopProduct.description,
    price: shopProduct.price,
    category: shopProduct.category,
    images: shopProduct.images || [],
    sellerId: shopProduct.sellerId,
    sellerName: shopProduct.sellerName || 'Unknown Seller',
    inStock: true,
    rating: shopProduct.rating || 5,
    isHalalCertified: true,
    createdAt: new Date().toISOString()
  };
};

// Create a new shop
export const createShop = async (shopData: Omit<Shop, 'id'>): Promise<Shop | null> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .insert({
        name: shopData.name,
        description: shopData.description,
        location: shopData.location,
        rating: shopData.rating || 0,
        product_count: shopData.productCount || 0,
        is_verified: shopData.isVerified || false,
        category: shopData.category || 'General',
        logo_url: shopData.logo || null,
        cover_image_url: shopData.coverImage || null,
        owner_id: shopData.ownerId,
        latitude: shopData.latitude || null,
        longitude: shopData.longitude || null
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating shop:', error);
      return null;
    }
    
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      location: data.location || 'Unknown location',
      rating: data.rating || 0,
      productCount: data.product_count || 0,
      isVerified: !!data.is_verified,
      category: data.category || 'General',
      logo: data.logo_url,
      coverImage: data.cover_image_url,
      ownerId: data.owner_id,
      latitude: data.latitude,
      longitude: data.longitude
    };
  } catch (error) {
    console.error('Error in createShop:', error);
    return null;
  }
};

// Upload product image to Supabase storage
export const uploadProductImage = async (file: File): Promise<string | null> => {
  try {
    const fileName = `${Math.random().toString(36).substring(2)}-${file.name}`;
    const filePath = `product-images/${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, file);
    
    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }
    
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(data.path);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadProductImage:', error);
    return null;
  }
};

// Subscribe to real-time updates to shops
export const subscribeToShops = (callback: (shops: Shop[]) => void) => {
  // For this demo, we'll just fetch the shops once and simulate a subscription
  getShops().then(shops => {
    callback(shops);
  });
  
  // In a real implementation, we would use Supabase's real-time subscriptions
  // return supabase
  //   .from('shops')
  //   .on('*', payload => {
  //     getShops().then(shops => callback(shops));
  //   })
  //   .subscribe();
  
  return {
    unsubscribe: () => {
      // Cleanup function for when subscription is no longer needed
      console.log('Unsubscribed from shops');
    }
  };
};

// Set a shop as the main shop
export const setMainShop = async (shopId: string, userId: string): Promise<boolean> => {
  try {
    // First, unset any existing main shops for this user
    try {
      await supabase
        .from('user_shop_preferences')
        .update({ is_main: false })
        .eq('user_id', userId);
    } catch (error) {
      console.error('Error unsetting previous main shop:', error);
    }
    
    // Then, set the new main shop
    try {
      await supabase
        .from('user_shop_preferences')
        .upsert({ 
          user_id: userId, 
          shop_id: shopId, 
          is_main: true 
        });
      
      return true;
    } catch (error) {
      console.error('Error setting main shop:', error);
      return false;
    }
  } catch (error) {
    console.error('Error in setMainShop:', error);
    return false;
  }
};

// Get the main shop for a user
export const getMainShop = async (userId: string): Promise<Shop | null> => {
  try {
    // First, get the main shop preference
    const { data: prefData, error: prefError } = await supabase
      .from('user_shop_preferences')
      .select('shop_id')
      .eq('user_id', userId)
      .eq('is_main', true)
      .single();
    
    if (prefError || !prefData) {
      return null;
    }
    
    // Then get the shop details
    return getShopById(prefData.shop_id);
  } catch (error) {
    console.error('Error in getMainShop:', error);
    return null;
  }
};

// Get nearby shops based on location
export const getNearbyShopsByCoordinates = async (
  latitude: number, 
  longitude: number, 
  radius: number = 20 // radius in km
): Promise<Shop[]> => {
  try {
    // In a real implementation, we would use PostGIS spatial queries to find shops within the radius
    // For this demo, we'll just return all shops and simulate distance
    const shops = await getShops();
    
    return shops.map(shop => {
      if (shop.latitude && shop.longitude) {
        // Calculate a simulated distance (just for demo purposes)
        const distance = Math.sqrt(
          Math.pow((shop.latitude - latitude) * 111, 2) + 
          Math.pow((shop.longitude - longitude) * 111 * Math.cos(latitude * Math.PI/180), 2)
        );
        return { ...shop, distance };
      }
      return { ...shop, distance: Math.random() * 20 }; // Random distance for shops without coordinates
    }).sort((a, b) => (a.distance || 100) - (b.distance || 100));
  } catch (error) {
    console.error('Error in getNearbyShopsByCoordinates:', error);
    return [];
  }
};
