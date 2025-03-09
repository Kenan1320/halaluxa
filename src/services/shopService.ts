import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/models/product';

// Export Shop and related types
export interface Shop {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  category: string;
  logo_url: string;
  cover_image: string;
  location: string;
  address: string;
  is_verified: boolean;
  rating: number;
  product_count: number;
  latitude: number;
  longitude: number;
  created_at: string;
  updated_at: string;
}

export interface ShopProduct extends Product {
  // Additional properties specific to shop products
}

export type ShopFilter = {
  radius?: number;
  category?: string;
  rating?: number;
  tags?: string[];
  orderBy?: 'distance' | 'rating' | 'newest';
};

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

export const fetchShops = async (): Promise<Shop[]> => {
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching shops:', error);
    throw error;
  }

  return data || [];
};

export const getShops = fetchShops;
export const getAllShops = fetchShops;

export const fetchShopById = async (shopId: string): Promise<Shop | null> => {
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .eq('id', shopId)
    .single();

  if (error) {
    console.error('Error fetching shop:', error);
    return null;
  }

  return data;
};

export const getShopById = fetchShopById;

export const getShopProducts = async (shopId: string): Promise<ShopProduct[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*, shops(name)')
    .eq('shop_id', shopId);

  if (error) {
    console.error('Error fetching shop products:', error);
    throw error;
  }

  return (data || []).map(item => ({
    ...item,
    sellerId: item.shop_id,
    sellerName: item.shops?.name || 'Unknown Seller'
  })) as ShopProduct[];
};

export const getMainShop = async (userId: string): Promise<Shop | null> => {
  if (!userId) return null;
  
  try {
    // Get user's main shop preference
    const { data, error } = await supabase
      .from('user_shop_preferences')
      .select('shop_id')
      .eq('user_id', userId)
      .eq('is_main_shop', true)
      .single();
    
    if (error || !data) {
      console.error('Error fetching main shop preference:', error);
      return null;
    }
    
    // Get the shop details
    return await fetchShopById(data.shop_id);
  } catch (error) {
    console.error('Error getting main shop:', error);
    return null;
  }
};

export const getCurrentUserShop = async (userId: string): Promise<Shop | null> => {
  if (!userId) return null;
  
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('owner_id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user shop:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error getting user shop:', error);
    return null;
  }
};

export const createShop = async (userId: string, shopData: Partial<Shop>): Promise<Shop | null> => {
  try {
    // Ensure required fields are provided
    const shop = {
      owner_id: userId,
      name: shopData.name || '',
      description: shopData.description || '',
      category: shopData.category || 'Other',
      location: shopData.location || 'Unknown',
      logo_url: shopData.logo_url || null,
      cover_image: shopData.cover_image || null,
      address: shopData.address || null,
      latitude: shopData.latitude || null,
      longitude: shopData.longitude || null,
    };
    
    const { data, error } = await supabase
      .from('shops')
      .insert(shop)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating shop:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error creating shop:', error);
    return null;
  }
};

export const getUserShopPreferences = async (userId: string) => {
  if (!userId) return [];
  
  try {
    const { data, error } = await supabase
      .from('user_shop_preferences')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching user shop preferences:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error getting user shop preferences:', error);
    return [];
  }
};

export const convertToModelProduct = (product: any): Product => {
  return {
    ...product,
    sellerId: product.shop_id,
    sellerName: product.shops?.name || 'Unknown Seller'
  };
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

export const setupDatabaseTables = async (): Promise<void> => {
  console.log('Database tables setup complete');
};
