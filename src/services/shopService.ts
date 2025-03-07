
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/models/product';

export interface Shop {
  id: string;
  name: string;
  description: string;
  logo?: string;
  coverImage?: string;
  location?: string;
  category?: string;
  rating?: number;
  isVerified?: boolean;
  distance?: number;
  productCount?: number;
  owner_id?: string;
  latitude?: number;
  longitude?: number;
}

export interface ShopProduct extends Product {
  // ShopProduct already inherits all the required properties from Product
}

// Safely check if profiles data indicates this is a business account
const isBusinessAccount = (profilesData: any): boolean => {
  if (!profilesData) return false;
  if (typeof profilesData !== 'object') return false;
  if (profilesData === null) return false;
  
  // Properly check if role exists and is a business account
  return typeof profilesData === 'object' && 
         'role' in profilesData && 
         profilesData.role === 'business';
};

// Map database shop to our model
const mapDbShopToModel = (shop: any, productCount: number = 0): Shop => {
  if (!shop) return {} as Shop;
  
  return {
    id: shop.id,
    name: shop.name,
    description: shop.description,
    logo: shop.logo_url,
    coverImage: shop.cover_image || '', 
    location: shop.location,
    category: shop.category || '', 
    rating: shop.rating || 4.5,
    isVerified: shop.is_verified || false,
    productCount: productCount,
    owner_id: shop.owner_id,
    latitude: shop.latitude || Math.random() * 180 - 90, // Use real coordinates if available
    longitude: shop.longitude || Math.random() * 360 - 180
  };
};

// Convert shop product to model product
export function convertToModelProduct(shopProduct: ShopProduct): Product {
  return {
    id: shopProduct.id,
    name: shopProduct.name,
    description: shopProduct.description,
    price: shopProduct.price,
    inStock: shopProduct.inStock,
    category: shopProduct.category,
    isHalalCertified: shopProduct.isHalalCertified,
    createdAt: shopProduct.createdAt,
    sellerId: shopProduct.sellerId,
    sellerName: shopProduct.sellerName || '',
    images: shopProduct.images || [],
    rating: shopProduct.rating || 5.0,
    details: shopProduct.details || {},
    variants: shopProduct.variants || [],
    tags: shopProduct.tags || []
  };
}

// Get all shops with real business accounts
export async function getShops(): Promise<Shop[]> {
  try {
    // Get only shops from business profiles
    const { data, error } = await supabase
      .from('shops')
      .select(`
        *,
        profiles:owner_id(role)
      `)
      .order('name');
    
    if (error || !data) {
      console.error('Error fetching shops:', error);
      return [];
    }
    
    // Filter to include only real business accounts with proper null checks
    const validShops = data.filter(shop => shop.profiles && isBusinessAccount(shop.profiles));
    
    // For each shop, get the product count
    const shopsWithCounts = await Promise.all(
      validShops.map(async (shop) => {
        const { count, error: countError } = await supabase
          .from('products')
          .select('id', { count: 'exact', head: true })
          .eq('seller_id', shop.owner_id);
          
        return mapDbShopToModel(shop, count || 0);
      })
    );
    
    return shopsWithCounts.filter(shop => shop.productCount && shop.productCount > 0);
  } catch (err) {
    console.error('Error in getShops:', err);
    return [];
  }
}

// Alias for getAllShops
export const getAllShops = getShops;

// Get shop by ID
export async function getShopById(id: string): Promise<Shop | null> {
  try {
    // Get shop details including owner profile
    const { data, error } = await supabase
      .from('shops')
      .select(`
        *,
        profiles:owner_id(role)
      `)
      .eq('id', id)
      .single();
    
    if (error || !data) {
      console.error('Error fetching shop:', error);
      return null;
    }
    
    // Only return if it's a business account with proper null checks
    if (!data.profiles || !isBusinessAccount(data.profiles)) {
      console.error('Shop is not a valid business account');
      return null;
    }
    
    // Get product count
    const { count, error: countError } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('seller_id', data.owner_id);
      
    if (countError) {
      console.error('Error counting products:', countError);
    }
    
    return mapDbShopToModel(data, count || 0);
  } catch (err) {
    console.error('Error in getShopById:', err);
    return null;
  }
}

// Get main shop from localStorage
export async function getMainShop(): Promise<Shop | null> {
  try {
    const mainShopId = localStorage.getItem('mainShopId');
    if (!mainShopId) {
      return null;
    }
    
    return await getShopById(mainShopId);
  } catch (err) {
    console.error('Error getting main shop:', err);
    return null;
  }
}

// Get products for a shop
export async function getShopProducts(shopId: string): Promise<ShopProduct[]> {
  try {
    // First verify the shop is a valid business account
    const shop = await getShopById(shopId);
    if (!shop) {
      console.error('Invalid shop or not a business account');
      return [];
    }
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', shop.owner_id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching shop products:', error);
      return [];
    }
    
    return data.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      inStock: product.stock > 0,
      category: product.category,
      images: product.images || [],
      sellerId: product.seller_id,
      sellerName: shop.name,
      isHalalCertified: product.is_halal_certified,
      createdAt: product.created_at,
      rating: product.rating || 4.5,
      details: typeof product.details === 'string' ? JSON.parse(product.details) : product.details || {},
    }));
  } catch (err) {
    console.error('Error in getShopProducts:', err);
    return [];
  }
}
