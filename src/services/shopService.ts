
import { supabase } from '@/integrations/supabase/client';
import { Product, mapDbProductToModel } from '@/models/product';

// Interface for shop data
export interface Shop {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  logo?: string;
  coverImage?: string;
  location: string;
  rating: number;
  productCount: number;
  isVerified?: boolean;
  latitude?: number;
  longitude?: number;
  distance?: number;
  category?: string;
}

// Database representation of shop data - completely separate to avoid circular references
interface DbShop {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  logo_url?: string;
  cover_image?: string;
  location?: string;
  rating?: number;
  product_count?: number;
  is_verified?: boolean;
  latitude?: number;
  longitude?: number;
  category?: string;
}

// Mapping function for shop data
function mapDbShopToModel(dbShop: DbShop): Shop {
  return {
    id: dbShop.id,
    name: dbShop.name,
    description: dbShop.description || '',
    ownerId: dbShop.owner_id,
    logo: dbShop.logo_url,
    coverImage: dbShop.cover_image,
    location: dbShop.location || 'Online',
    rating: dbShop.rating || 5.0,
    productCount: dbShop.product_count || 0,
    isVerified: dbShop.is_verified || false,
    category: dbShop.category || 'General',
    latitude: dbShop.latitude,
    longitude: dbShop.longitude
  };
}

// Helper function to map from model to DB format
function mapModelToDbShop(shop: Partial<Shop>): Partial<DbShop> {
  const dbShop: Partial<DbShop> = {};
  
  if (shop.name !== undefined) dbShop.name = shop.name;
  if (shop.description !== undefined) dbShop.description = shop.description;
  if (shop.ownerId !== undefined) dbShop.owner_id = shop.ownerId;
  if (shop.logo !== undefined) dbShop.logo_url = shop.logo;
  if (shop.coverImage !== undefined) dbShop.cover_image = shop.coverImage;
  if (shop.location !== undefined) dbShop.location = shop.location;
  if (shop.rating !== undefined) dbShop.rating = shop.rating;
  if (shop.productCount !== undefined) dbShop.product_count = shop.productCount;
  if (shop.isVerified !== undefined) dbShop.is_verified = shop.isVerified;
  if (shop.category !== undefined) dbShop.category = shop.category;
  
  return dbShop;
}

// Get all shops
export async function getShops(): Promise<Shop[]> {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching shops:', error);
      return [];
    }
    
    return data.map(shop => mapDbShopToModel(shop as DbShop));
  } catch (err) {
    console.error('Error in getShops:', err);
    return [];
  }
}

// Get a single shop by ID
export async function getShopById(id: string): Promise<Shop | undefined> {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching shop with id ${id}:`, error);
      return undefined;
    }
    
    return mapDbShopToModel(data as DbShop);
  } catch (err) {
    console.error(`Error in getShopById for ${id}:`, err);
    return undefined;
  }
}

// Get all products for a specific shop
export async function getProductsForShop(shopId: string): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', shopId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error(`Error fetching products for shop ${shopId}:`, error);
      return [];
    }
    
    return data.map(mapDbProductToModel);
  } catch (err) {
    console.error(`Error in getProductsForShop for ${shopId}:`, err);
    return [];
  }
}

// Update shop details
export async function updateShop(shop: Partial<Shop>): Promise<Shop | undefined> {
  try {
    if (!shop.id) {
      console.error('Cannot update shop without id');
      return undefined;
    }
    
    // Use the helper function to convert to DB format
    const dbShop = mapModelToDbShop(shop);
    
    const { data, error } = await supabase
      .from('shops')
      .update(dbShop)
      .eq('id', shop.id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating shop ${shop.id}:`, error);
      return undefined;
    }
    
    return mapDbShopToModel(data as DbShop);
  } catch (err) {
    console.error(`Error in updateShop for ${shop.id}:`, err);
    return undefined;
  }
}

// Get featured shops (for home page)
export async function getFeaturedShops(): Promise<Shop[]> {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('is_verified', true)
      .order('rating', { ascending: false })
      .limit(4);
    
    if (error) {
      console.error('Error fetching featured shops:', error);
      return [];
    }
    
    return data.map(shop => mapDbShopToModel(shop as DbShop));
  } catch (err) {
    console.error('Error in getFeaturedShops:', err);
    return [];
  }
}

// Mock function for backward compatibility
export function getMockShops(): Shop[] {
  return [
    {
      id: "shop1",
      name: "Halal Meats & More",
      description: "Premium halal meats and grocery items for your everyday needs.",
      ownerId: "user1",
      logo: "/lovable-uploads/8d386384-3944-48e3-922c-2edb81fa1631.png",
      coverImage: "/lovable-uploads/d4ab324c-23f0-4fcc-9069-0afbc77d1c3e.png",
      location: "New York",
      rating: 4.9,
      productCount: 24,
      isVerified: true,
      category: "Food & Groceries",
      latitude: 40.7128,
      longitude: -74.0060
    }
  ];
}
