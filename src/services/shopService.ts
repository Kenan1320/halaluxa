
import { supabase } from '@/integrations/supabase/client';
import { Shop, ShopProduct } from '@/models/shop';

// Function to create a new shop
export const createShop = async (shopData: Partial<Shop>): Promise<Shop | null> => {
  try {
    // Get the current authenticated user
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    // Insert the shop data
    const { data, error } = await supabase
      .from('shops')
      .insert({
        name: shopData.name,
        description: shopData.description,
        owner_id: userId,
        location: shopData.location,
        latitude: shopData.latitude,
        longitude: shopData.longitude,
        category: shopData.category,
        logo: shopData.logo,
        cover_image: shopData.coverImage,
        verified: shopData.isVerified || false
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating shop:', error);
      throw error;
    }
    
    // Also update the business_profile to include the shop name
    const { error: updateError } = await supabase
      .from('business_profiles')
      .update({
        shop_name: shopData.name,
        shop_description: shopData.description,
        shop_logo: shopData.logo,
        shop_category: shopData.category,
        shop_location: shopData.location
      })
      .eq('id', userId);
    
    if (updateError) {
      console.error('Error updating business profile:', updateError);
      // Don't throw here, the shop was created successfully
    }
    
    // Map the response to the Shop interface
    const shop: Shop = {
      id: data.id,
      name: data.name,
      description: data.description || '',
      location: data.location || '',
      rating: 0, // Default rating for new shop
      productCount: 0, // No products initially
      isVerified: data.verified || false,
      category: data.category || '',
      logo: data.logo || null,
      coverImage: data.cover_image || null,
      ownerId: data.owner_id,
      latitude: data.latitude || null,
      longitude: data.longitude || null
    };
    
    return shop;
  } catch (error) {
    console.error('Failed to create shop:', error);
    return null;
  }
};

// Function to get a shop by ID
export const getShopById = async (shopId: string): Promise<Shop | null> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('id', shopId)
      .single();
    
    if (error) {
      throw error;
    }
    
    if (!data) {
      return null;
    }
    
    // Get product count for this shop
    const { count: productCount, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('shop_id', shopId);
    
    // Map the response to the Shop interface
    const shop: Shop = {
      id: data.id,
      name: data.name,
      description: data.description || '',
      location: data.location || '',
      rating: 0, // Default rating, would be calculated from reviews
      productCount: productCount || 0,
      isVerified: data.verified || false,
      category: data.category || '',
      logo: data.logo || null,
      coverImage: data.cover_image || null,
      ownerId: data.owner_id,
      latitude: data.latitude || null,
      longitude: data.longitude || null
    };
    
    return shop;
  } catch (error) {
    console.error('Failed to get shop by ID:', error);
    return null;
  }
};

// Function to get all shops
export const getAllShops = async (): Promise<Shop[]> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    // Map the response to Shop interface
    const shops: Shop[] = data.map(shop => ({
      id: shop.id,
      name: shop.name,
      description: shop.description || '',
      location: shop.location || '',
      rating: 0, // Would be calculated from reviews
      productCount: 0, // Would be queried or calculated
      isVerified: shop.verified || false,
      category: shop.category || '',
      logo: shop.logo || null,
      coverImage: shop.cover_image || null,
      ownerId: shop.owner_id,
      latitude: shop.latitude || null,
      longitude: shop.longitude || null
    }));
    
    return shops;
  } catch (error) {
    console.error('Failed to get all shops:', error);
    return [];
  }
};

// Function to get shops by user
export const getShopsByUser = async (userId?: string): Promise<Shop[]> => {
  try {
    // If no userId is provided, get the current user
    let ownerId = userId;
    if (!ownerId) {
      const { data: userData } = await supabase.auth.getUser();
      ownerId = userData.user?.id;
      
      if (!ownerId) {
        throw new Error('User not authenticated');
      }
    }
    
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('owner_id', ownerId);
    
    if (error) {
      throw error;
    }
    
    // Map the response to Shop interface
    const shops: Shop[] = data.map(shop => ({
      id: shop.id,
      name: shop.name,
      description: shop.description || '',
      location: shop.location || '',
      rating: 0, // Would be calculated from reviews
      productCount: 0, // Would be queried or calculated
      isVerified: shop.verified || false,
      category: shop.category || '',
      logo: shop.logo || null,
      coverImage: shop.cover_image || null,
      ownerId: shop.owner_id,
      latitude: shop.latitude || null,
      longitude: shop.longitude || null
    }));
    
    return shops;
  } catch (error) {
    console.error('Failed to get shops by user:', error);
    return [];
  }
};

// Function to update a shop
export const updateShop = async (shopId: string, updates: Partial<Shop>): Promise<Shop | null> => {
  try {
    // Get current user
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    // Verify ownership of the shop
    const { data: shopData, error: shopError } = await supabase
      .from('shops')
      .select('*')
      .eq('id', shopId)
      .eq('owner_id', userId)
      .single();
    
    if (shopError || !shopData) {
      throw new Error('Shop not found or not owned by current user');
    }
    
    // Prepare the update data
    const updateData = {
      name: updates.name,
      description: updates.description,
      location: updates.location,
      category: updates.category,
      logo: updates.logo,
      cover_image: updates.coverImage,
      latitude: updates.latitude,
      longitude: updates.longitude,
      verified: updates.isVerified
    };
    
    // Filter out undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof typeof updateData] === undefined) {
        delete updateData[key as keyof typeof updateData];
      }
    });
    
    // Update the shop
    const { data, error } = await supabase
      .from('shops')
      .update(updateData)
      .eq('id', shopId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Also update the business_profile if needed
    if (updates.name || updates.description || updates.logo || updates.category || updates.location) {
      const profileUpdates: any = {};
      if (updates.name) profileUpdates.shop_name = updates.name;
      if (updates.description) profileUpdates.shop_description = updates.description;
      if (updates.logo) profileUpdates.shop_logo = updates.logo;
      if (updates.category) profileUpdates.shop_category = updates.category;
      if (updates.location) profileUpdates.shop_location = updates.location;
      
      const { error: updateError } = await supabase
        .from('business_profiles')
        .update(profileUpdates)
        .eq('id', userId);
      
      if (updateError) {
        console.error('Error updating business profile:', updateError);
        // Don't throw here, the shop was updated successfully
      }
    }
    
    // Map the response to the Shop interface
    const shop: Shop = {
      id: data.id,
      name: data.name,
      description: data.description || '',
      location: data.location || '',
      rating: 0, // Would be calculated from reviews
      productCount: 0, // Would be queried or calculated
      isVerified: data.verified || false,
      category: data.category || '',
      logo: data.logo || null,
      coverImage: data.cover_image || null,
      ownerId: data.owner_id,
      latitude: data.latitude || null,
      longitude: data.longitude || null
    };
    
    return shop;
  } catch (error) {
    console.error('Failed to update shop:', error);
    return null;
  }
};

// Function to delete a shop
export const deleteShop = async (shopId: string): Promise<boolean> => {
  try {
    // Get current user
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    // Verify ownership of the shop
    const { data: shopData, error: shopError } = await supabase
      .from('shops')
      .select('*')
      .eq('id', shopId)
      .eq('owner_id', userId)
      .single();
    
    if (shopError || !shopData) {
      throw new Error('Shop not found or not owned by current user');
    }
    
    // Delete the shop
    const { error } = await supabase
      .from('shops')
      .delete()
      .eq('id', shopId);
    
    if (error) {
      throw error;
    }
    
    // Also clear the shop name from business_profile
    const { error: updateError } = await supabase
      .from('business_profiles')
      .update({
        shop_name: null,
        shop_description: null,
        shop_logo: null,
        shop_category: null,
        shop_location: null
      })
      .eq('id', userId);
    
    if (updateError) {
      console.error('Error updating business profile:', updateError);
      // Don't throw here, the shop was deleted successfully
    }
    
    return true;
  } catch (error) {
    console.error('Failed to delete shop:', error);
    return false;
  }
};

// Function to get products for a shop
export const getShopProducts = async (shopId: string): Promise<ShopProduct[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        shops:shop_id (
          name,
          owner_id
        )
      `)
      .eq('shop_id', shopId)
      .eq('is_published', true);
    
    if (error) {
      console.error(`Error fetching products for shop ${shopId}:`, error);
      throw error;
    }
    
    // Map the response to ShopProduct interface
    const products: ShopProduct[] = data.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category || '',
      images: product.images || [],
      sellerId: product.shops?.owner_id || '',
      sellerName: product.shops?.name || ''
    }));
    
    return products;
  } catch (error) {
    console.error('Failed to get shop products:', error);
    return [];
  }
};

// Function to get nearby shops based on lat/long
export const getNearbyShops = async (
  latitude: number, 
  longitude: number, 
  radiusKm: number = 10
): Promise<Shop[]> => {
  try {
    // Direct SQL query would be more efficient, but we'll use what's available
    const { data, error } = await supabase
      .from('shops')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    // Calculate distance for each shop and filter by radius
    const nearbyShops: Shop[] = data
      .map(shop => {
        // Skip shops without coordinates
        if (!shop.latitude || !shop.longitude) {
          return null;
        }
        
        // Calculate distance using Haversine formula
        const distance = calculateDistance(
          latitude, 
          longitude, 
          shop.latitude, 
          shop.longitude
        );
        
        return {
          id: shop.id,
          name: shop.name,
          description: shop.description || '',
          location: shop.location || '',
          rating: 0, // Would be calculated from reviews
          productCount: 0, // Would be queried or calculated
          isVerified: shop.verified || false,
          category: shop.category || '',
          logo: shop.logo || null,
          coverImage: shop.cover_image || null,
          ownerId: shop.owner_id,
          latitude: shop.latitude,
          longitude: shop.longitude,
          distance: distance
        };
      })
      .filter(shop => shop !== null && shop.distance !== undefined && shop.distance <= radiusKm)
      .sort((a, b) => (a!.distance || 0) - (b!.distance || 0)) as Shop[];
    
    return nearbyShops;
  } catch (error) {
    console.error('Failed to get nearby shops:', error);
    return [];
  }
};

// Helper function to calculate distance between two coordinates using Haversine formula
const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  const R = 6371; // Radius of Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return parseFloat(distance.toFixed(2));
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

// Get popular shops based on product count or other metrics
export const getPopularShops = async (limit: number = 5): Promise<Shop[]> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .limit(limit);
    
    if (error) {
      throw error;
    }
    
    // Map the response to Shop interface
    const shops: Shop[] = data.map(shop => ({
      id: shop.id,
      name: shop.name,
      description: shop.description || '',
      location: shop.location || '',
      rating: 0, // Would be calculated from reviews
      productCount: 0, // Would be queried or calculated
      isVerified: shop.verified || false,
      category: shop.category || '',
      logo: shop.logo || null,
      coverImage: shop.cover_image || null,
      ownerId: shop.owner_id,
      latitude: shop.latitude || null,
      longitude: shop.longitude || null
    }));
    
    return shops;
  } catch (error) {
    console.error('Failed to get popular shops:', error);
    return [];
  }
};
