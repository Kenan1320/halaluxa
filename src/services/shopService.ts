import { supabase } from '@/integrations/supabase/client';
import { Shop } from '@/types/database';
import { Category } from '@/types/shop';

export interface Shop {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  category: string;
  location: string;
  cover_image?: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
  is_verified: boolean;
  product_count?: number;
  rating?: number;
  latitude?: number;
  longitude?: number;
  distance?: number;
  address?: string;
  // For product display mode
  display_mode?: 'online' | 'local_pickup' | 'local_delivery';
  pickup_options?: {
    store: boolean;
    curbside: boolean;
  };
  // Frontend aliases
  logo?: string;
  coverImage?: string;
  ownerId?: string;
  productCount?: number;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const getAllShops = async (): Promise<Shop[]> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching shops:', error);
      return [];
    }

    return data as Shop[];
  } catch (error) {
    console.error('Error in getAllShops:', error);
    return [];
  }
};

export const getShopById = async (id: string): Promise<Shop | null> => {
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

    return data as Shop;
  } catch (error) {
    console.error('Error in getShopById:', error);
    return null;
  }
};

export const getShopsByOwnerId = async (ownerId: string): Promise<Shop[]> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching shops by owner ID:', error);
      return [];
    }

    return data as Shop[];
  } catch (error) {
    console.error('Error in getShopsByOwnerId:', error);
    return [];
  }
};

export const createShop = async (shopData: Partial<Shop>): Promise<Shop | null> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .insert(shopData)
      .select()
      .single();

    if (error) {
      console.error('Error creating shop:', error);
      return null;
    }

    return data as Shop;
  } catch (error) {
    console.error('Error in createShop:', error);
    return null;
  }
};

export const updateShop = async (id: string, updates: Partial<Shop>): Promise<Shop | null> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating shop:', error);
      return null;
    }

    return data as Shop;
  } catch (error) {
    console.error('Error in updateShop:', error);
    return null;
  }
};

export const deleteShop = async (id: string): Promise<boolean> => {
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
    console.error('Error in deleteShop:', error);
    return false;
  }
};

export const searchShops = async (query: string): Promise<Shop[]> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching shops:', error);
      return [];
    }

    return data as Shop[];
  } catch (error) {
    console.error('Error in searchShops:', error);
    return [];
  }
};

export const getShopsByCategory = async (category: string): Promise<Shop[]> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching shops by category:', error);
      return [];
    }

    return data as Shop[];
  } catch (error) {
    console.error('Error in getShopsByCategory:', error);
    return [];
  }
};

export const getShopProducts = async (shopId: string) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching shop products:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Error in getShopProducts:', error);
    return [];
  }
};

export const getShops = async () => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching shops:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Error in getShops:', error);
    return [];
  }
};

export const convertToModelProduct = (product: any) => {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    shop_id: product.shop_id,
    shopId: product.shop_id,
    category: product.category,
    images: product.images || [],
    is_halal_certified: product.is_halal_certified,
    isHalalCertified: product.is_halal_certified,
    in_stock: product.in_stock !== undefined ? product.in_stock : true,
    inStock: product.in_stock !== undefined ? product.in_stock : true,
    created_at: product.created_at,
    createdAt: product.created_at,
    updated_at: product.updated_at,
    updatedAt: product.updated_at,
    seller_id: product.seller_id || product.shop_id,
    sellerId: product.seller_id || product.shop_id,
    sellerName: product.shop_name || '', // This would typically come from a join
    rating: product.rating || 0, // Default rating
    details: product.details || {}
  };
};

export const getCategories = async (): Promise<Category[]> => {
  try {
    // Mocked categories for now
    return [
      { id: '1', name: 'Groceries' },
      { id: '2', name: 'Clothing' },
      { id: '3', name: 'Home' },
      { id: '4', name: 'Electronics' },
      { id: '5', name: 'Books' },
      { id: '6', name: 'Toys' },
      { id: '7', name: 'Beauty' },
      { id: '8', name: 'Health' },
    ];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};
