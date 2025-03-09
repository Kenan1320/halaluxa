
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/models/product';

// Export Shop and related types
export interface Shop {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  category: string;
  logo_url?: string;
  cover_image?: string;
  address?: string;
  location: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  is_verified?: boolean;
  created_at?: string;
  updated_at?: string;
  distance?: number;
  product_count?: number;
}

export type ShopProduct = Product;

export interface ShopFilter {
  radius?: number;
  category?: string;
  rating?: number;
  tags?: string[];
  orderBy?: 'distance' | 'rating' | 'newest';
}

export type ShopFilterBy = 'nearby' | 'featured' | 'popular' | 'new';

export interface CreateShopInput {
  name: string;
  description: string;
  category: string;
  logo_url?: string;
  cover_image?: string;
  address?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdateShopInput {
  name?: string;
  description?: string;
  category?: string;
  logo_url?: string;
  cover_image?: string;
  address?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
}

export interface ShopPaymentMethod {
  id: string;
  shopId: string; // Camel case for TypeScript
  methodType: string;
  accountName?: string;
  accountNumber?: string;
  bankName?: string;
  paypalEmail?: string;
  stripeAccountId?: string;
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export const fetchShops = async (filter?: ShopFilter): Promise<Shop[]> => {
  let query = supabase
    .from('shops')
    .select('*');

  if (filter?.radius) {
    // This is a placeholder for a more complex geospatial query
    console.warn('Radius filtering is not yet implemented.');
  }

  if (filter?.category) {
    query = query.eq('category', filter.category);
  }

  if (filter?.rating) {
    query = query.gte('rating', filter.rating);
  }

  if (filter?.tags) {
    console.warn('Tag filtering is not yet implemented.');
  }

  if (filter?.orderBy === 'distance') {
    console.warn('Distance ordering is not yet implemented.');
  } else if (filter?.orderBy === 'rating') {
    query = query.order('rating', { ascending: false });
  } else if (filter?.orderBy === 'newest') {
    query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching shops:', error);
    throw error;
  }

  return data || [];
};

export const fetchShopById = async (id: string): Promise<Shop | null> => {
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching shop by ID:', error);
    throw error;
  }

  return data;
};

export const createShop = async (shop: CreateShopInput, owner_id: string): Promise<Shop> => {
  const { data, error } = await supabase
    .from('shops')
    .insert([{ ...shop, owner_id }])
    .select()
    .single();

  if (error) {
    console.error('Error creating shop:', error);
    throw error;
  }

  return data;
};

export const updateShop = async (id: string, shop: UpdateShopInput): Promise<Shop> => {
  const { data, error } = await supabase
    .from('shops')
    .update(shop)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating shop:', error);
    throw error;
  }

  return data;
};

export const deleteShop = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('shops')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting shop:', error);
    throw error;
  }
};

export const getShopPaymentMethods = async (shopId: string): Promise<ShopPaymentMethod[]> => {
  const { data, error } = await supabase
    .from('shop_payment_methods')
    .select('*')
    .eq('shop_id', shopId);

  if (error) {
    console.error('Error fetching shop payment methods:', error);
    throw error;
  }

  return (data || []).map(item => ({
    id: item.id,
    shopId: item.shop_id,
    methodType: item.method_type,
    accountName: item.account_name,
    accountNumber: item.account_number,
    bankName: item.bank_name,
    paypalEmail: item.paypal_email,
    stripeAccountId: item.stripe_account_id,
    isActive: item.is_active,
    isDefault: item.is_default,
    createdAt: item.created_at,
    updatedAt: item.updated_at
  }));
};

export const addShopPaymentMethod = async (method: Omit<Partial<ShopPaymentMethod>, 'id' | 'createdAt' | 'updatedAt'>): Promise<ShopPaymentMethod> => {
  // Convert from camelCase to snake_case for the database
  const dbMethod = {
    shop_id: method.shopId,
    method_type: method.methodType,
    account_name: method.accountName,
    account_number: method.accountNumber,
    bank_name: method.bankName,
    paypal_email: method.paypalEmail,
    stripe_account_id: method.stripeAccountId,
    is_active: method.isActive,
    is_default: method.isDefault
  };

  const { data, error } = await supabase
    .from('shop_payment_methods')
    .insert(dbMethod)
    .select()
    .single();

  if (error) {
    console.error('Error adding payment method:', error);
    throw error;
  }

  return {
    id: data.id,
    shopId: data.shop_id,
    methodType: data.method_type,
    accountName: data.account_name,
    accountNumber: data.account_number,
    bankName: data.bank_name,
    paypalEmail: data.paypal_email,
    stripeAccountId: data.stripe_account_id,
    isActive: data.is_active,
    isDefault: data.is_default,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

export const updateShopPaymentMethod = async (
  methodId: string,
  method: Partial<Omit<ShopPaymentMethod, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<ShopPaymentMethod> => {
  // Convert from camelCase to snake_case for the database
  const dbMethod = {
    method_type: method.methodType,
    account_name: method.accountName,
    account_number: method.accountNumber,
    bank_name: method.bankName,
    paypal_email: method.paypalEmail,
    stripe_account_id: method.stripeAccountId,
    is_active: method.isActive,
    is_default: method.isDefault
  };

  const { data, error } = await supabase
    .from('shop_payment_methods')
    .update(dbMethod)
    .eq('id', methodId)
    .select()
    .single();

  if (error) {
    console.error('Error updating payment method:', error);
    throw error;
  }

  return {
    id: data.id,
    shopId: data.shop_id,
    methodType: data.method_type,
    accountName: data.account_name,
    accountNumber: data.account_number,
    bankName: data.bank_name,
    paypalEmail: data.paypal_email,
    stripeAccountId: data.stripe_account_id,
    isActive: data.is_active,
    isDefault: data.is_default,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

export const deleteShopPaymentMethod = async (methodId: string): Promise<void> => {
  const { error } = await supabase
    .from('shop_payment_methods')
    .delete()
    .eq('id', methodId);

  if (error) {
    console.error('Error deleting payment method:', error);
    throw error;
  }
};

export const setDefaultPaymentMethod = async (
  shopId: string,
  methodId: string,
  methodType: string
): Promise<void> => {
  // First, unset any current default
  const { error: updateError } = await supabase
    .from('shop_payment_methods')
    .update({ is_default: false })
    .eq('shop_id', shopId)
    .eq('method_type', methodType);

  if (updateError) {
    console.error('Error unsetting default payment methods:', updateError);
    throw updateError;
  }

  // Then set the new default
  const { error } = await supabase
    .from('shop_payment_methods')
    .update({ is_default: true })
    .eq('id', methodId);

  if (error) {
    console.error('Error setting default payment method:', error);
    throw error;
  }
};

export const fetchNearbyShops = async (radius: number): Promise<Shop[]> => {
  console.warn('Nearby shops filtering is not yet implemented.');
  const { data, error } = await supabase
    .from('shops')
    .select('*');

  if (error) {
    console.error('Error fetching shops:', error);
    throw error;
  }

  return data || [];
};

export const fetchShopsByCategory = async (category: string): Promise<Shop[]> => {
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .eq('category', category);

  if (error) {
    console.error('Error fetching shops by category:', error);
    throw error;
  }

  return data || [];
};

export const getProductsByShop = async (shopId: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, shops(name)')
      .eq('shop_id', shopId);

    if (error) throw error;
    
    return (data || []).map(item => ({
      ...item,
      sellerId: item.shop_id,
      sellerName: item.shops?.name || 'Unknown Seller'
    }));
  } catch (error) {
    console.error('Error fetching products by shop:', error);
    throw error;
  }
};

export const getShopProducts = async (shopId: string): Promise<ShopProduct[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, shops(name)')
      .eq('shop_id', shopId);

    if (error) throw error;
    
    return (data || []).map(item => ({
      ...item,
      sellerId: item.shop_id,
      sellerName: item.shops?.name || 'Unknown Seller'
    }));
  } catch (error) {
    console.error('Error fetching shop products:', error);
    throw error;
  }
};

export const fetchShopsByFilter = async (filterBy: ShopFilterBy): Promise<Shop[]> => {
  let query = supabase.from('shops').select('*');

  switch (filterBy) {
    case 'nearby':
      console.warn('Nearby shops filtering is not yet implemented.');
      break;
    case 'featured':
      query = query.order('rating', { ascending: false });
      break;
    case 'popular':
      console.warn('Popular shops filtering is not yet implemented.');
      break;
    case 'new':
      query = query.order('created_at', { ascending: false });
      break;
    default:
      break;
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching shops:', error);
    throw error;
  }

  return data || [];
};

// Alias functions to support existing code
export const getShops = fetchShops;
export const getShopById = fetchShopById;
export const getAllShops = async () => fetchShops();
export const getMainShop = async (userId: string) => {
  // Implement this based on user preferences
  const { data, error } = await supabase.rpc('get_user_shop_preferences', { user_id_param: userId });
  if (error) throw error;
  
  // Find the main shop
  const mainShopPref = data?.find(pref => pref.is_main_shop);
  if (!mainShopPref) return null;
  
  return fetchShopById(mainShopPref.shop_id);
};

export const getCurrentUserShop = async (userId: string) => {
  if (!userId) return null;
  
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .eq('owner_id', userId)
    .single();
    
  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
};

// Mock function for database setup
export const setupDatabaseTables = async (): Promise<void> => {
  console.log('Database tables setup complete');
};

// Helper function to convert DB products to model products
export const convertToModelProduct = (dbProduct: any): Product => {
  return {
    ...dbProduct,
    sellerId: dbProduct.shop_id,
    sellerName: dbProduct.shops?.name || 'Unknown Seller'
  };
};
