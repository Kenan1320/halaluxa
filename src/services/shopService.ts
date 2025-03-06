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
  isVerified: boolean;
}

// Mapping function for shop data
function mapDbShopToModel(dbShop: any): Shop {
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
    isVerified: dbShop.is_verified || false
  };
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
    
    return data.map(mapDbShopToModel);
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
    
    return mapDbShopToModel(data);
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
    const dbShop = {
      name: shop.name,
      description: shop.description,
      logo_url: shop.logo,
      cover_image: shop.coverImage,
      location: shop.location,
      is_verified: shop.isVerified
    };
    
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
    
    return mapDbShopToModel(data);
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
    
    return data.map(mapDbShopToModel);
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
      isVerified: true
    },
    // ... other mock shops
  ];
}
