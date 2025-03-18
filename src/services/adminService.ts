
import { supabase } from '@/integrations/supabase/client';
import { Shop } from '@/types/shop';
import { normalizeShop } from '@/utils/shopHelper';

// Function to approve a shop
export const approveShop = async (shopId: string) => {
  const { data, error } = await supabase
    .from('shops')
    .update({ status: 'approved', is_verified: true })
    .eq('id', shopId);
    
  if (error) throw error;
  return data;
};

// Function to reject a shop
export const rejectShop = async (shopId: string) => {
  const { data, error } = await supabase
    .from('shops')
    .update({ status: 'rejected' })
    .eq('id', shopId);
    
  if (error) throw error;
  return data;
};

// Function to get pending shops
export const getPendingShops = async (): Promise<Shop[]> => {
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .eq('status', 'pending');
    
  if (error) throw error;
  return data?.map(shop => normalizeShop(shop)) || [];
};

// Function to get all shops
export const getAllShops = async (): Promise<Shop[]> => {
  const { data, error } = await supabase
    .from('shops')
    .select('*');
    
  if (error) throw error;
  return data?.map(shop => normalizeShop(shop)) || [];
};

// Function to delete a shop
export const deleteShop = async (shopId: string) => {
  const { data, error } = await supabase
    .from('shops')
    .delete()
    .eq('id', shopId);
    
  if (error) throw error;
  return data;
};

// Function to get shop details
export const getShopDetails = async (shopId: string): Promise<Shop | null> => {
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .eq('id', shopId)
    .single();
    
  if (error) throw error;
  return data ? normalizeShop(data) : null;
};

// Function to create a shop with an owner
export const createShopWithOwner = async (shopData: Partial<Shop>, ownerEmail: string, temporaryPassword: string) => {
  // First create a user
  const { data: userData, error: userError } = await supabase.auth.admin.createUser({
    email: ownerEmail,
    password: temporaryPassword,
    email_confirm: true,
    user_metadata: { role: 'business' }
  });
  
  if (userError) throw userError;
  
  // Then create the shop
  const { data: shopData, error: shopError } = await supabase
    .from('shops')
    .insert({
      ...shopData,
      owner_id: userData.user.id,
      status: 'approved',
      is_verified: true
    })
    .select();
    
  if (shopError) throw shopError;
  
  return { user: userData, shop: shopData };
};

// Function to update shop owner
export const updateShopOwner = async (shopId: string, newOwnerId: string) => {
  const { data, error } = await supabase
    .from('shops')
    .update({ owner_id: newOwnerId })
    .eq('id', shopId);
    
  if (error) throw error;
  return data;
};
