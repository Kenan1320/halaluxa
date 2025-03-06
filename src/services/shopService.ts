
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/models/product';
import { Json } from '@/integrations/supabase/types';

// Define DbShop type separate from Shop to prevent circular reference
export interface DbShop {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  location?: string;
  rating?: number;
  product_count?: number;
  address?: string;
  owner_id: string;
  created_at: string;
}

// Define Shop interface for frontend use
export interface Shop {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  location?: string;
  rating?: number;
  productCount?: number;
  category?: string;
  isVerified?: boolean;
  distance?: number;
}

// Define shop display settings interface
export interface ShopDisplaySettings {
  id: string;
  shop_id: string;
  show_distance: boolean;
  show_rating: boolean;
  show_reviews: boolean;
  products_per_row: number;
  created_at: string;
  updated_at: string;
}

// Convert database shop to frontend shop
const convertDbShopToShop = (dbShop: DbShop): Shop => {
  return {
    id: dbShop.id,
    name: dbShop.name,
    description: dbShop.description || '',
    logo: dbShop.logo_url || '',
    location: dbShop.location || '',
    rating: dbShop.rating || 0,
    productCount: dbShop.product_count || 0,
    isVerified: false, // Placeholder
    category: 'General', // Placeholder
  };
};

// Create a new shop
export const createShop = async (shopData: Partial<Shop>): Promise<Shop | null> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      throw new Error('User not authenticated');
    }
    
    // Convert frontend shop data to database format
    const dbShopData = {
      name: shopData.name || '',
      description: shopData.description || '',
      logo_url: shopData.logo || '',
      location: shopData.location || '',
      owner_id: userData.user.id,
    };
    
    // Insert the shop
    const { data, error } = await supabase
      .from('shops')
      .insert(dbShopData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating shop:', error);
      throw error;
    }
    
    // Create default display settings for the shop
    await supabase
      .from('shop_display_settings')
      .insert({
        shop_id: data.id,
        show_distance: false,
        show_rating: true,
        show_reviews: true,
        products_per_row: 3
      });
    
    return convertDbShopToShop(data);
  } catch (error) {
    console.error('Error in createShop:', error);
    return null;
  }
};

// Get all shops
export const getAllShops = async (): Promise<Shop[]> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data.map(convertDbShopToShop);
  } catch (error) {
    console.error('Error fetching shops:', error);
    return [];
  }
};

// Export with alias to maintain backward compatibility for existing imports
export const getShops = getAllShops;

// Get shops with limited data for landing page
export const getShopsForLanding = async (): Promise<Shop[]> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('id, name, logo_url')
      .order('created_at', { ascending: false })
      .limit(6);
    
    if (error) {
      throw error;
    }
    
    return data.map(shop => ({
      id: shop.id,
      name: shop.name,
      logo: shop.logo_url || '',
    }));
  } catch (error) {
    console.error('Error fetching shops for landing:', error);
    return [];
  }
};

// Get shop by ID
export const getShopById = async (id: string): Promise<Shop | null> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      throw error;
    }
    
    return convertDbShopToShop(data);
  } catch (error) {
    console.error('Error fetching shop by ID:', error);
    return null;
  }
};

// Get shop by owner ID
export const getShopByOwnerId = async (ownerId: string): Promise<Shop | null> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('owner_id', ownerId)
      .single();
    
    if (error) {
      return null;
    }
    
    return convertDbShopToShop(data);
  } catch (error) {
    console.error('Error fetching shop by owner ID:', error);
    return null;
  }
};

// Get current user's shop
export const getCurrentUserShop = async (): Promise<Shop | null> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      return null;
    }
    
    return getShopByOwnerId(userData.user.id);
  } catch (error) {
    console.error('Error fetching current user shop:', error);
    return null;
  }
};

// Get products for a shop
export const getShopProducts = async (shopId: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', shopId);
    
    if (error) {
      throw error;
    }
    
    // Map database fields to Product model fields
    return data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      images: item.images,
      rating: item.rating,
      stock: item.stock,
      sellerId: item.seller_id,
      sellerName: item.seller_name,
      isHalalCertified: item.is_halal_certified,
      details: item.details,
      longDescription: item.long_description,
      createdAt: item.created_at
    }));
  } catch (error) {
    console.error('Error fetching shop products:', error);
    return [];
  }
};

// Export with alias to maintain backward compatibility for existing imports
export const getProductsForShop = getShopProducts;

// Update shop
export const updateShop = async (id: string, shopData: Partial<Shop>): Promise<Shop | null> => {
  try {
    // Convert frontend shop data to database format
    const dbShopData = {
      name: shopData.name,
      description: shopData.description,
      logo_url: shopData.logo,
      location: shopData.location,
    };
    
    const { data, error } = await supabase
      .from('shops')
      .update(dbShopData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return convertDbShopToShop(data);
  } catch (error) {
    console.error('Error updating shop:', error);
    return null;
  }
};

// Get shop display settings
export const getShopDisplaySettings = async (shopId: string): Promise<ShopDisplaySettings | null> => {
  try {
    const { data, error } = await supabase
      .from('shop_display_settings')
      .select('*')
      .eq('shop_id', shopId)
      .maybeSingle();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching shop display settings:', error);
    return null;
  }
};

// Update shop display settings
export const updateShopDisplaySettings = async (
  shopId: string, 
  settings: Partial<ShopDisplaySettings>
): Promise<ShopDisplaySettings | null> => {
  try {
    const { data, error } = await supabase
      .from('shop_display_settings')
      .update(settings)
      .eq('shop_id', shopId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error updating shop display settings:', error);
    return null;
  }
};
