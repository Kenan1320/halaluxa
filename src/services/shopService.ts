import { supabase } from '@/integrations/supabase/client';
import { Shop, ShopFilter, CreateShopInput, UpdateShopInput, ShopProduct, ShopPaymentMethod, ShopFilterBy } from '@/models/shop';
import { Product } from '@/models/product';
import { PaymentMethodData } from '@/models/payment';

export const fetchShops = async (filter?: ShopFilter): Promise<Shop[]> => {
  let query = supabase
    .from('shops')
    .select('*');

  if (filter?.radius) {
    // This is a placeholder for a more complex geospatial query
    // that would filter shops based on a radius from the user's location.
    // You would typically use PostGIS functions for this in a real-world scenario.
    console.warn('Radius filtering is not yet implemented.');
  }

  if (filter?.category) {
    query = query.eq('category', filter.category);
  }

  if (filter?.rating) {
    query = query.gte('rating', filter.rating);
  }

  if (filter?.tags) {
    // This is a placeholder for a more complex query that would filter
    // shops based on whether they have any of the specified tags.
    console.warn('Tag filtering is not yet implemented.');
  }

  if (filter?.orderBy === 'distance') {
    // This is a placeholder for a more complex geospatial ordering
    // that would order shops based on their distance from the user's location.
    // You would typically use PostGIS functions for this in a real-world scenario.
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
    .eq('shopId', shopId);

  if (error) {
    console.error('Error fetching shop payment methods:', error);
    throw error;
  }

  return data || [];
};

export const addShopPaymentMethod = async (method: Partial<ShopPaymentMethod>): Promise<ShopPaymentMethod> => {
  const { data, error } = await supabase
    .from('shop_payment_methods')
    .insert(method)
    .select()
    .single();

  if (error) {
    console.error('Error adding payment method:', error);
    throw error;
  }

  return data;
};

export const updateShopPaymentMethod = async (
  methodId: string,
  method: {
    methodType?: PaymentMethodData;
    accountName?: string;
    accountNumber?: string;
    bankName?: string;
    paypalEmail?: string;
    isActive?: boolean;
    isDefault?: boolean;
  }
): Promise<ShopPaymentMethod> => {
  const { data, error } = await supabase
    .from('shop_payment_methods')
    .update(method)
    .eq('id', methodId)
    .select()
    .single();

  if (error) {
    console.error('Error updating payment method:', error);
    throw error;
  }

  return data;
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
  methodType: PaymentMethodData
): Promise<void> => {
  // First, unset any current default
  const { error: updateError } = await supabase
    .from('shop_payment_methods')
    .update({ isDefault: false })
    .eq('shopId', shopId)
    .eq('methodType', methodType);

  if (updateError) {
    console.error('Error unsetting default payment methods:', updateError);
    throw updateError;
  }

  // Then set the new default
  const { error } = await supabase
    .from('shop_payment_methods')
    .update({ isDefault: true })
    .eq('id', methodId);

  if (error) {
    console.error('Error setting default payment method:', error);
    throw error;
  }
};

export const fetchNearbyShops = async (radius: number): Promise<Shop[]> => {
  // This is a placeholder for a more complex geospatial query
  // that would filter shops based on a radius from the user's location.
  // You would typically use PostGIS functions for this in a real-world scenario.
  console.warn('Nearby shops filtering is not yet implemented.');

  // For now, just return all shops
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
      .select('*')
      .eq('shop_id', shopId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching products by shop:', error);
    throw error;
  }
};

export const getShopProducts = async (shopId: string): Promise<ShopProduct[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('shop_id', shopId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching shop products:', error);
    throw error;
  }
};

export const fetchShopsByFilter = async (filterBy: ShopFilterBy): Promise<Shop[]> => {
  let query = supabase.from('shops').select('*');

  switch (filterBy) {
    case 'nearby':
      // Placeholder for geospatial query
      console.warn('Nearby shops filtering is not yet implemented.');
      break;
    case 'featured':
      query = query.order('rating', { ascending: false });
      break;
    case 'popular':
      // Placeholder for popularity-based filtering
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
