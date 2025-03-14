
import { supabase } from '@/lib/supabaseClient';
import { DBShop, UUID } from '@/models/types';
import { Product } from '@/models/product';

// Get all products for a specific shop
export const getShopProducts = async (shopId: UUID): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('shop_id', shopId);

    if (error) {
      console.error('Error fetching shop products:', error);
      return [];
    }

    return (data || []) as Product[];
  } catch (error) {
    console.error('Error in getShopProducts:', error);
    return [];
  }
};

// Get featured products for a shop
export const getFeaturedShopProducts = async (shopId: UUID, limit = 8): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching featured shop products:', error);
      return [];
    }

    return (data || []) as Product[];
  } catch (error) {
    console.error('Error in getFeaturedShopProducts:', error);
    return [];
  }
};

// Convert DB shop to frontend shop model
export const convertDBShopToShop = (dbShop: DBShop) => {
  return {
    id: dbShop.id,
    name: dbShop.name,
    description: dbShop.description,
    category: dbShop.category,
    location: dbShop.location,
    rating: dbShop.rating,
    productCount: dbShop.product_count,
    isVerified: dbShop.is_verified,
    logo: dbShop.logo_url,
    coverImage: dbShop.cover_image,
    ownerId: dbShop.owner_id,
    latitude: dbShop.latitude,
    longitude: dbShop.longitude,
    distance: dbShop.distance,
    address: dbShop.address,
    deliveryAvailable: dbShop.delivery_available,
    pickupAvailable: dbShop.pickup_available,
    isHalalCertified: dbShop.is_halal_certified,
    displayMode: dbShop.display_mode,
    logo_url: dbShop.logo_url, // For backwards compatibility
    cover_image: dbShop.cover_image, // For backwards compatibility
    product_count: dbShop.product_count, // For backwards compatibility
    is_verified: dbShop.is_verified, // For backwards compatibility
    owner_id: dbShop.owner_id, // For backwards compatibility
    delivery_available: dbShop.delivery_available, // For backwards compatibility
    pickup_available: dbShop.pickup_available, // For backwards compatibility
    is_halal_certified: dbShop.is_halal_certified // For backwards compatibility
  };
};
