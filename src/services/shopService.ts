import { supabase } from '@/integrations/supabase/client';
import { Shop, Product } from '@/types/database';

// Function to subscribe to real-time updates for shops
export const subscribeToShops = (callback: (shops: Shop[]) => void) => {
  return supabase
    .channel('public:shops')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'shops' },
      (payload) => {
        // Fetch all shops to ensure the data is up-to-date
        getAllShops().then((shops) => {
          callback(shops);
        });
      }
    )
    .subscribe();
};

// Function to get all shops
export const getAllShops = async (): Promise<Shop[]> => {
  try {
    const { data: shops, error } = await supabase
      .from('shops')
      .select('*');

    if (error) {
      throw error;
    }

    return shops || [];
  } catch (error) {
    console.error('Error fetching shops:', error);
    return [];
  }
};

// Function to get a shop by ID
export const getShopById = async (id: string): Promise<Shop | null> => {
  try {
    const { data: shop, error } = await supabase
      .from('shops')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return shop || null;
  } catch (error) {
    console.error(`Error fetching shop with ID ${id}:`, error);
    return null;
  }
};

// Function to get nearby shops based on user's location
export const getNearbyShops = async (latitude?: number, longitude?: number): Promise<Shop[]> => {
  try {
    // Use passed coordinates or default to a fallback if not provided
    const userLatitude = latitude || 37.7749;  // Default latitude
    const userLongitude = longitude || -122.4194; // Default longitude

    const { data: shops, error } = await supabase.rpc('nearby_shops', {
      user_latitude: userLatitude,
      user_longitude: userLongitude,
      max_distance: 10000, // 10km
    });

    if (error) {
      throw error;
    }

    return shops as Shop[];
  } catch (error) {
    console.error('Error fetching nearby shops:', error);
    return [];
  }
};

// Function to get the main shop ID from localStorage
export const getMainShopId = (): string | null => {
  if (typeof localStorage === 'undefined') {
    return null;
  }
  return localStorage.getItem('mainShopId');
};

// Function to get the main shop
export const getMainShop = async (): Promise<Shop | null> => {
  const mainShopId = getMainShopId();
  if (!mainShopId) {
    return null;
  }
  return getShopById(mainShopId);
};

// Export Shop type
export type { Shop };

// Function to get shops for a specific seller
export const getShopsForSeller = async (sellerId: string): Promise<Shop[]> => {
  try {
    // Use direct shop query instead of seller_accounts
    const { data: shops, error } = await supabase
      .from('shops')
      .select('*')
      .eq('owner_id', sellerId);
    
    if (error) throw error;
    return shops as Shop[];
  } catch (error) {
    console.error('Error fetching shops for seller:', error);
    return [];
  }
};

// Function to get products for a specific shop
export const getProductsForShop = async (shopId: string): Promise<Product[]> => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('shop_id', shopId);

    if (error) {
      throw error;
    }

    return products as Product[];
  } catch (error) {
    console.error(`Error fetching products for shop with ID ${shopId}:`, error);
    return [];
  }
};

// Function to get featured products for a specific shop
export const getFeaturedProductsForShop = async (shopId: string): Promise<Product[]> => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('shop_id', shopId)
      .eq('is_featured', true);

    if (error) {
      throw error;
    }

    return products as Product[];
  } catch (error) {
    console.error(`Error fetching featured products for shop with ID ${shopId}:`, error);
    return [];
  }
};

// Function to get all products with shop details
export const getAllProductsWithShopDetails = async (): Promise<Product[]> => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        shops (
          name,
          location
        )
      `);

    if (error) {
      throw error;
    }

    // Process shop products to match the required Product interface
    if (!products) return [];
    return processShopProducts(products as ShopProductResult[]);
  } catch (error) {
    console.error('Error fetching all products with shop details:', error);
    return [];
  }
};

// Function to get products for a specific category
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category);

    if (error) {
      throw error;
    }

    return products as Product[];
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    return [];
  }
};

// Function to create a new shop
export const createShop = async (shop: Omit<Shop, 'id'>): Promise<Shop | null> => {
  try {
    const { data: newShop, error } = await supabase
      .from('shops')
      .insert([shop])
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return newShop as Shop;
  } catch (error) {
    console.error('Error creating shop:', error);
    return null;
  }
};

// Function to update an existing shop
export const updateShop = async (id: string, updates: Partial<Shop>): Promise<Shop | null> => {
  try {
    const { data: updatedShop, error } = await supabase
      .from('shops')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return updatedShop as Shop;
  } catch (error) {
    console.error(`Error updating shop with ID ${id}:`, error);
    return null;
  }
};

// Function to delete a shop
export const deleteShop = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('shops')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error(`Error deleting shop with ID ${id}:`, error);
    return false;
  }
};

// Fix any Product type references
interface ShopProductResult {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  shop_id: string;
  is_featured: boolean;
  is_halal_certified: boolean;
  created_at: string;
  updated_at: string;
  seller_id?: string;
  seller_name?: string;
}

// Process shop products to match the required Product interface
const processShopProducts = (products: ShopProductResult[]): Product[] => {
  return products.map(product => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    images: product.images,
    category: product.category,
    shopId: product.shop_id,
    inStock: true, // Assume true if not provided
    isHalalCertified: product.is_halal_certified,
    createdAt: product.created_at,
    // Add any other required fields with default values
  }));
};
