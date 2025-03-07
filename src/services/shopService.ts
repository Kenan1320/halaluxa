
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

// Type guard for business account
function isBusinessAccount(data: any): boolean {
  return data && 
         typeof data === 'object' && 
         data !== null &&
         'role' in data && 
         data.role === 'business';
}

// Map database shop to our model with safe property access
const mapDbShopToModel = (shop: any, productCount: number = 0): Shop => {
  if (!shop) return {} as Shop;
  
  return {
    id: shop.id || '',
    name: shop.name || '',
    description: shop.description || '',
    logo: shop.logo_url || '',
    coverImage: shop.cover_image || '', 
    location: shop.location || '',
    category: shop.category || '', 
    rating: shop.rating || 4.5,
    isVerified: shop.is_verified === true,
    productCount: productCount,
    owner_id: shop.owner_id || '',
    latitude: shop.latitude || Math.random() * 180 - 90,
    longitude: shop.longitude || Math.random() * 360 - 180
  };
};

// Create a shop subscription for real-time updates
export function subscribeToShopUpdates(onUpdate: (shops: Shop[]) => void) {
  return supabase.channel('shops-subscription')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'shops' },
      async () => {
        // Fetch the latest shops when any change happens
        const shops = await getShops();
        onUpdate(shops);
      }
    )
    .subscribe();
}

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
    // Get shops with proper error handling
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
    
    // Ensure we have valid data before filtering
    const validShops = data.filter(shop => {
      try {
        return shop && shop.profiles && isBusinessAccount(shop.profiles);
      } catch (e) {
        console.error('Error filtering shop:', e);
        return false;
      }
    });
    
    // For each shop, get the product count
    const shopsWithCounts = await Promise.all(
      validShops.map(async (shop) => {
        try {
          const { count, error: countError } = await supabase
            .from('products')
            .select('id', { count: 'exact', head: true })
            .eq('seller_id', shop.owner_id);
            
          if (countError) {
            console.error('Error counting products:', countError);
          }
          
          return mapDbShopToModel(shop, count || 0);
        } catch (e) {
          console.error('Error processing shop:', e);
          return mapDbShopToModel(shop, 0);
        }
      })
    );
    
    // Return all shops, even if they have no products (to show newly created shops)
    return shopsWithCounts;
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
    
    // Validate that it's a business account
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

// Subscribe to products of a specific shop
export function subscribeToShopProducts(shopId: string, onUpdate: (products: ShopProduct[]) => void) {
  return supabase.channel(`shop-products-${shopId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'products', filter: `seller_id=eq.${shopId}` },
      async () => {
        // Fetch the latest products when any change happens
        const products = await getShopProducts(shopId);
        onUpdate(products);
      }
    )
    .subscribe();
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

// Create a new shop - optimized with better error handling
export async function createShop(shopData: Partial<Shop>, userId: string): Promise<Shop | null> {
  try {
    if (!userId) {
      console.error('User ID is required to create a shop');
      return null;
    }
    
    const { data, error } = await supabase
      .from('shops')
      .upsert({
        id: userId, // Use the user ID as the shop ID
        name: shopData.name || 'New Shop',
        description: shopData.description || '',
        owner_id: userId,
        location: shopData.location || '',
        category: shopData.category || '',
        is_verified: true,
        logo_url: shopData.logo || null,
      }, { onConflict: 'id' })
      .select('*')
      .single();
    
    if (error) {
      console.error('Error creating shop:', error);
      return null;
    }
    
    // Also update the profile with shop details
    await supabase
      .from('profiles')
      .update({
        shop_name: shopData.name,
        shop_description: shopData.description,
        shop_category: shopData.category,
        shop_location: shopData.location,
        shop_logo: shopData.logo
      })
      .eq('id', userId);
    
    return mapDbShopToModel(data, 0);
  } catch (err) {
    console.error('Error in createShop:', err);
    return null;
  }
}

// Update an existing shop
export async function updateShop(shopData: Partial<Shop>): Promise<Shop | null> {
  try {
    if (!shopData.id) {
      console.error('Shop ID is required to update a shop');
      return null;
    }
    
    const { data, error } = await supabase
      .from('shops')
      .update({
        name: shopData.name,
        description: shopData.description,
        location: shopData.location,
        category: shopData.category,
        logo_url: shopData.logo
      })
      .eq('id', shopData.id)
      .select('*')
      .single();
    
    if (error) {
      console.error('Error updating shop:', error);
      return null;
    }
    
    // Also update the profile with shop details
    if (shopData.owner_id) {
      await supabase
        .from('profiles')
        .update({
          shop_name: shopData.name,
          shop_description: shopData.description,
          shop_category: shopData.category,
          shop_location: shopData.location,
          shop_logo: shopData.logo
        })
        .eq('id', shopData.owner_id);
    }
    
    return mapDbShopToModel(data, 0);
  } catch (err) {
    console.error('Error in updateShop:', err);
    return null;
  }
}
