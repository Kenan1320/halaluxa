
import { supabase } from '@/integrations/supabase/client';
import { Shop } from '@/types/shop';
import { normalizeShop } from '@/utils/shopHelper';
import { DatabaseProfile } from '@/types/database';

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
export const createShopWithOwner = async (shopInput: Partial<Shop>, ownerEmail: string, temporaryPassword: string) => {
  // First create a user
  const { data: userData, error: userError } = await supabase.auth.admin.createUser({
    email: ownerEmail,
    password: temporaryPassword,
    email_confirm: true,
    user_metadata: { role: 'business' }
  });
  
  if (userError) throw userError;
  
  // Then create the shop with proper typing to avoid TypeScript errors
  const { data: createdShop, error: shopError } = await supabase
    .from('shops')
    .insert({
      name: shopInput.name || '',
      description: shopInput.description || '',
      location: shopInput.location || '',
      category: shopInput.category || '',
      logo_url: shopInput.logo_url || '',
      owner_id: userData.user.id,
      status: 'approved',
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

// Add missing functions that are referenced in the admin components

// Function to get admin stats
export const getAdminStats = async () => {
  // Get total users count
  const { count: totalUsers, error: usersError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  if (usersError) throw usersError;

  // Get total shops count
  const { count: totalShops, error: shopsError } = await supabase
    .from('shops')
    .select('*', { count: 'exact', head: true });

  if (shopsError) throw shopsError;

  // For demo purposes, provide some mock data for other stats
  return {
    totalUsers: totalUsers || 0,
    totalShops: totalShops || 0,
    totalOrders: 25, // Mock data
    totalRevenue: 5247.80, // Mock data
    pendingApprovals: 4, // Will be updated by actual count
    activeUsers: 18, // Mock data
  };
};

// Function to get dashboard users
export const getDashboardUsers = async (): Promise<DatabaseProfile[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) throw error;
  return data || [];
};

// Function to get recent orders (mock data for now)
export const getRecentOrders = async () => {
  // Mock data for orders
  return [
    {
      id: 'ord_001',
      user_id: 'usr_123',
      total: 124.99,
      status: 'delivered',
      created_at: new Date().toISOString(),
    },
    {
      id: 'ord_002',
      user_id: 'usr_456',
      total: 89.50,
      status: 'processing',
      created_at: new Date().toISOString(),
    },
    {
      id: 'ord_003',
      user_id: 'usr_789',
      total: 35.25,
      status: 'shipped',
      created_at: new Date().toISOString(),
    },
    {
      id: 'ord_004',
      user_id: 'usr_101',
      total: 210.75,
      status: 'pending',
      created_at: new Date().toISOString(),
    },
    {
      id: 'ord_005',
      user_id: 'usr_202',
      total: 49.99,
      status: 'cancelled',
      created_at: new Date().toISOString(),
    },
  ];
};

// Function to check if a user is an admin
export const isAdmin = async (userId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (error) return false;
  return data?.role === 'admin';
};

// Function to ensure the current user is an admin
export const ensureAdminUser = async (userId: string): Promise<boolean> => {
  return await isAdmin(userId);
};

// Function to get admin user details
export const getAdminUser = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .eq('role', 'admin')
    .single();

  if (error) throw error;
  return data;
};

// Function to get admin role
export const getAdminRole = async (userId: string): Promise<string> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (error) return 'none';
  return data?.role || 'none';
};
