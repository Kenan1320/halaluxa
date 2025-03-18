
import { supabase } from '@/integrations/supabase/client';
import { Shop } from '@/types/shop';
import { normalizeShop } from '@/utils/shopHelper';
import { DatabaseProfile } from '@/types/database';

// Function to approve a shop
export const approveShop = async (shopId: string) => {
  const { data, error } = await supabase
    .from('shops')
    .update({ is_verified: true })
    .eq('id', shopId);
    
  if (error) throw error;
  return data;
};

// Function to reject a shop
export const rejectShop = async (shopId: string) => {
  const { data, error } = await supabase
    .from('shops')
    .update({ is_verified: false })
    .eq('id', shopId);
    
  if (error) throw error;
  return data;
};

// Function to get pending shops
export const getPendingShops = async (): Promise<Shop[]> => {
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .eq('is_verified', false);
    
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
export const createShopWithOwner = async (shopInput: Partial<Shop>, ownerEmail: string, temporaryPassword: string) => {
  // First create a user
  const { data: userData, error: userError } = await supabase.auth.admin.createUser({
    email: ownerEmail,
    password: temporaryPassword,
    email_confirm: true,
    user_metadata: { role: 'business' }
  });
  
  if (userError) throw userError;
  
  // Then create the shop
  const { data: createdShop, error: shopError } = await supabase
    .from('shops')
    .insert({
      ...shopInput,
      owner_id: userData.user.id,
      is_verified: true
    })
    .select();
    
  if (shopError) throw shopError;
  
  return { user: userData, shop: createdShop };
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

// Get all users with admin role
export const getAdminUsers = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'admin');
    
  if (error) throw error;
  return data as DatabaseProfile[];
};

// Create new admin user
export const createAdminUser = async (email: string, password: string, userData: Partial<DatabaseProfile>) => {
  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: 'admin' }
  });
  
  if (authError) throw authError;
  
  // Create profile
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: authData.user.id,
      email,
      role: 'admin',
      ...userData
    })
    .select();
    
  if (profileError) throw profileError;
  
  return { user: authData, profile: profileData };
};

// Admin for testing in development
export const ensureAdminUser = async () => {
  if (import.meta.env.DEV) {
    return true;
  }
  
  // In production, check if user has admin role
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
    
  return profile?.role === 'admin';
};
