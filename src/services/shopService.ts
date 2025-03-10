
import { supabase } from '@/integrations/supabase/client';
import { Shop, ShopProduct, mapDatabaseShopToModel, mapModelToDatabase } from '@/models/shop';
import { Product } from '@/models/product';

// Create a new shop
export async function createShop(shopData: Partial<Shop>): Promise<Shop | null> {
  try {
    const dbShop = mapModelToDatabase(shopData);
    
    const { data, error } = await supabase
      .from('shops')
      .insert(dbShop)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating shop:', error);
      return null;
    }
    
    return mapDatabaseShopToModel(data);
  } catch (error) {
    console.error('Error creating shop:', error);
    return null;
  }
}

// Get shop by ID
export async function getShopById(id: string): Promise<Shop | null> {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      console.error('Error fetching shop:', error);
      return null;
    }
    
    return mapDatabaseShopToModel(data);
  } catch (error) {
    console.error('Error fetching shop:', error);
    return null;
  }
}

// Get shops owned by a user
export async function getShopsByUser(userId: string): Promise<Shop[]> {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('owner_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching user shops:', error);
      return [];
    }
    
    return data.map(mapDatabaseShopToModel);
  } catch (error) {
    console.error('Error fetching user shops:', error);
    return [];
  }
}

// Update an existing shop
export async function updateShop(id: string, shopData: Partial<Shop>): Promise<Shop | null> {
  try {
    const dbShop = mapModelToDatabase(shopData);
    
    const { data, error } = await supabase
      .from('shops')
      .update(dbShop)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating shop:', error);
      return null;
    }
    
    return mapDatabaseShopToModel(data);
  } catch (error) {
    console.error('Error updating shop:', error);
    return null;
  }
}

// Delete a shop
export async function deleteShop(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('shops')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting shop:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting shop:', error);
    return false;
  }
}

// Get products from a specific shop
export async function getShopProducts(shopId: string): Promise<ShopProduct[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('shop_id', shopId)
      .eq('is_published', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching shop products:', error);
      return [];
    }
    
    return data.map((product: any) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      images: product.images,
      sellerId: product.shop_id,
      sellerName: '', // This would typically be populated from a join with the shops table
      rating: product.rating
    }));
  } catch (error) {
    console.error('Error fetching shop products:', error);
    return [];
  }
}

// Get nearby shops based on coordinates
export async function getNearbyShops(lat: number, lng: number, radius: number = 10): Promise<Shop[]> {
  try {
    // Using PostGIS to find shops within a radius
    const { data, error } = await supabase.rpc('nearby_shops', {
      lat,
      lng,
      distance_km: radius
    });
    
    if (error) {
      console.error('Error fetching nearby shops:', error);
      return [];
    }
    
    return data.map(mapDatabaseShopToModel);
  } catch (error) {
    console.error('Error fetching nearby shops:', error);
    return [];
  }
}

// Get popular shops based on rating
export async function getPopularShops(limit: number = 10): Promise<Shop[]> {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .order('rating', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching popular shops:', error);
      return [];
    }
    
    return data.map(mapDatabaseShopToModel);
  } catch (error) {
    console.error('Error fetching popular shops:', error);
    return [];
  }
}

// Get main shop (user's preferred shop)
export async function getMainShop(userId: string): Promise<Shop | null> {
  try {
    const { data, error } = await supabase
      .from('user_shop_preferences')
      .select('shops(*)')
      .eq('user_id', userId)
      .eq('is_main_shop', true)
      .single();
    
    if (error || !data || !data.shops) {
      return null;
    }
    
    return mapDatabaseShopToModel(data.shops);
  } catch (error) {
    console.error('Error fetching main shop:', error);
    return null;
  }
}

// Convert database product to model product
export function convertToModelProduct(dbProduct: any): Product {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    description: dbProduct.description,
    longDescription: dbProduct.long_description || '',
    price: dbProduct.price,
    category: dbProduct.category,
    images: dbProduct.images || [],
    isHalalCertified: dbProduct.is_halal_certified || false,
    rating: dbProduct.rating || 0,
    stock: dbProduct.stock || 0,
    details: dbProduct.details || {},
    shopId: dbProduct.shop_id,
    createdAt: dbProduct.created_at,
    updatedAt: dbProduct.updated_at
  };
}

// Upload product image to Supabase storage
export async function uploadProductImage(file: File, shopId: string): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const filePath = `products/${shopId}/${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('shop-images')
      .upload(filePath, file);
    
    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('shop-images')
      .getPublicUrl(data.path);
    
    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

// Get all shops
export async function getShops(): Promise<Shop[]> {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching shops:', error);
      return [];
    }
    
    return data.map(mapDatabaseShopToModel);
  } catch (error) {
    console.error('Error fetching shops:', error);
    return [];
  }
}
