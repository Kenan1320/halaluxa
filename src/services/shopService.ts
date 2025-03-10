
import { supabase } from '@/integrations/supabase/client';
import { Shop, ShopCategory, shopCategories } from '@/models/shop';
import { Product } from '@/models/product';
import { getRandomId } from '@/lib/utils';

// Helper function to map database shop to frontend model
function mapDbShopToModel(dbShop: any): Shop {
  return {
    id: dbShop.id,
    name: dbShop.name,
    description: dbShop.description,
    category: dbShop.category,
    location: dbShop.location,
    logo_url: dbShop.logo_url,
    owner_id: dbShop.owner_id,
    rating: dbShop.rating,
    review_count: dbShop.review_count,
    product_count: dbShop.product_count,
    latitude: dbShop.latitude,
    longitude: dbShop.longitude,
    address: dbShop.address,
    is_verified: dbShop.is_verified,
    cover_image: dbShop.cover_image,
    created_at: dbShop.created_at,
    updated_at: dbShop.updated_at
  };
}

// Shop Functions
export async function getShops(limit = 20): Promise<Shop[]> {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .limit(limit);
    
    if (error) {
      console.error('Error fetching shops:', error);
      return [];
    }
    
    return (data || []).map(mapDbShopToModel);
  } catch (error) {
    console.error('Error in getShops:', error);
    return [];
  }
}

export async function getFeaturedShops(limit = 5): Promise<Shop[]> {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('is_verified', true)
      .limit(limit);
    
    if (error) {
      console.error('Error fetching featured shops:', error);
      return [];
    }
    
    return (data || []).map(mapDbShopToModel);
  } catch (error) {
    console.error('Error in getFeaturedShops:', error);
    return [];
  }
}

export async function getShopById(id: string): Promise<Shop | null> {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching shop:', error);
      return null;
    }
    
    return mapDbShopToModel(data);
  } catch (error) {
    console.error('Error in getShopById:', error);
    return null;
  }
}

export async function getShopsByCategory(category: string, limit = 20): Promise<Shop[]> {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('category', category)
      .limit(limit);
    
    if (error) {
      console.error('Error fetching shops by category:', error);
      return [];
    }
    
    return (data || []).map(mapDbShopToModel);
  } catch (error) {
    console.error('Error in getShopsByCategory:', error);
    return [];
  }
}

export async function searchShops(query: string, limit = 20): Promise<Shop[]> {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(limit);
    
    if (error) {
      console.error('Error searching shops:', error);
      return [];
    }
    
    return (data || []).map(mapDbShopToModel);
  } catch (error) {
    console.error('Error in searchShops:', error);
    return [];
  }
}

export async function getNearbyShops(latitude?: number, longitude?: number, distance = 10): Promise<Shop[]> {
  try {
    // If no coordinates provided, return all shops for now
    if (!latitude || !longitude) {
      return getShops(10);
    }
    
    // For demo, just return all shops and simulate distance
    const shops = await getShops(10);
    
    // Add a simulated distance to each shop
    return shops.map(shop => ({
      ...shop,
      distance: Math.random() * distance,
    }));
    
    // In a real implementation, you would use PostGIS or similar to query by distance
  } catch (error) {
    console.error('Error in getNearbyShops:', error);
    return [];
  }
}

// Helper to map database product to frontend model
function mapDbProductToModel(dbProduct: any): Product {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    description: dbProduct.description,
    price: dbProduct.price,
    category: dbProduct.category,
    inStock: dbProduct.stock > 0,
    isHalalCertified: dbProduct.is_halal_certified,
    images: dbProduct.images || [],
    sellerId: dbProduct.shop_id,
    sellerName: dbProduct.shop_name,
    rating: dbProduct.rating,
    reviewCount: dbProduct.review_count,
    createdAt: dbProduct.created_at,
  };
}

export async function getShopProducts(shopId: string): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('shop_id', shopId);
    
    if (error) {
      console.error('Error fetching shop products:', error);
      return [];
    }
    
    return (data || []).map(mapDbProductToModel);
  } catch (error) {
    console.error('Error in getShopProducts:', error);
    return [];
  }
}

// Demo product functions for development
export function getDemoProduct(): Product {
  return {
    id: getRandomId(),
    name: 'Organic Fresh Dates',
    description: 'Premium quality organic fresh dates, perfect for health-conscious consumers.',
    price: 12.99,
    category: 'Grocery',
    inStock: true,
    isHalalCertified: true,
    images: ['https://placehold.co/600x400/png?text=Organic+Dates'],
    sellerId: 'demo-seller-id',
    sellerName: 'Green Earth Grocers',
    rating: 4.5,
    reviewCount: 23,
    createdAt: new Date().toISOString(),
  };
}

export function getDemoShop(): Shop {
  return {
    id: getRandomId(),
    name: 'Green Earth Grocers',
    description: 'Organic and halal certified groceries for the community.',
    category: 'Grocery',
    location: '123 Main St, New York, NY',
    logo_url: 'https://placehold.co/200x200/png?text=GEG',
    owner_id: 'demo-owner-id',
    rating: 4.7,
    review_count: 142,
    product_count: 57,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

// Setup a subscription to shops
export function subscribeToShops(callback: (shops: Shop[]) => void) {
  // For this demo, we'll just fetch shops once
  getShops(20).then(shops => {
    callback(shops);
  });
  
  // Return an unsubscribe function
  return () => {
    // Nothing to unsubscribe from in this demo
  };
}

// Function to upload a product image to Supabase storage
export async function uploadProductImage(file: File, progressCallback?: (progress: number) => void): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `product-images/${fileName}`;
    
    const { error: uploadError, data } = await supabase.storage
      .from('halvi-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });
    
    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return null;
    }
    
    // Return the public URL of the uploaded image
    const { data: { publicUrl } } = supabase.storage
      .from('halvi-images')
      .getPublicUrl(filePath);
    
    return publicUrl;
  } catch (error) {
    console.error('Error in uploadProductImage:', error);
    return null;
  }
}

// Function to get the main shop of a user
export async function getMainShop(): Promise<Shop | null> {
  try {
    // Get the main shop ID from localStorage
    const mainShopId = localStorage.getItem('mainShopId');
    
    if (!mainShopId) {
      return null;
    }
    
    return await getShopById(mainShopId);
  } catch (error) {
    console.error('Error getting main shop:', error);
    return null;
  }
}

// Export type Shop
export type { Shop, ShopCategory };
export { shopCategories };
