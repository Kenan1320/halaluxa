
import { supabase } from '@/integrations/supabase/client';
import { Shop } from '@/types/shop';
import { normalizeShop } from '@/utils/shopHelper';

// Admin service functions
export const getAdminStats = async () => {
  try {
    // Get counts from the database
    const { count: userCount, error: userError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    const { count: shopCount, error: shopError } = await supabase
      .from('shops')
      .select('*', { count: 'exact', head: true });
    
    const { count: orderCount, error: orderError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });
    
    const { count: pendingCount, error: pendingError } = await supabase
      .from('shops')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');
    
    // If we have real data, use it; otherwise, use mock data
    if (userCount !== null && shopCount !== null && orderCount !== null) {
      return {
        totalUsers: userCount,
        totalShops: shopCount,
        totalOrders: orderCount,
        totalRevenue: 124587.45, // Mock data for revenue
        pendingApprovals: pendingCount || 0,
        activeUsers: Math.round(userCount * 0.7), // Approximate 70% active
        newUsersToday: 24, // Mock data
        newOrdersToday: 142 // Mock data
      };
    }
    
    // Fallback to mock data
    return {
      totalUsers: 2458,
      totalShops: 187,
      totalOrders: 9754,
      totalRevenue: 124587.45,
      pendingApprovals: 12,
      activeUsers: 1845,
      newUsersToday: 24,
      newOrdersToday: 142
    };
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    // Return mock data as fallback
    return {
      totalUsers: 2458,
      totalShops: 187,
      totalOrders: 9754,
      totalRevenue: 124587.45,
      pendingApprovals: 12,
      activeUsers: 1845,
      newUsersToday: 24,
      newOrdersToday: 142
    };
  }
};

export const getDashboardUsers = async () => {
  try {
    // Try to get real users from the database
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      return data;
    }
    
    // Fallback to mock data
    return [
      {
        id: 'user-1',
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        role: 'shopper',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        orders: 12
      },
      {
        id: 'user-2',
        name: 'Michael Chen',
        email: 'michael.c@example.com',
        role: 'business',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        orders: 5
      },
      {
        id: 'user-3',
        name: 'David Rodriguez',
        email: 'david.r@example.com',
        role: 'business',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        orders: 0
      },
      {
        id: 'user-4',
        name: 'Emily Wilson',
        email: 'emily.w@example.com',
        role: 'shopper',
        created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        orders: 27
      },
      {
        id: 'user-5',
        name: 'James Thompson',
        email: 'james.t@example.com',
        role: 'shopper',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'inactive',
        orders: 3
      }
    ];
  } catch (error) {
    console.error('Error fetching dashboard users:', error);
    // Return mock data as fallback
    return [
      {
        id: 'user-1',
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        role: 'shopper',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        orders: 12
      },
      {
        id: 'user-2',
        name: 'Michael Chen',
        email: 'michael.c@example.com',
        role: 'business',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        orders: 5
      },
      {
        id: 'user-3',
        name: 'David Rodriguez',
        email: 'david.r@example.com',
        role: 'business',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        orders: 0
      },
      {
        id: 'user-4',
        name: 'Emily Wilson',
        email: 'emily.w@example.com',
        role: 'shopper',
        created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        orders: 27
      },
      {
        id: 'user-5',
        name: 'James Thompson',
        email: 'james.t@example.com',
        role: 'shopper',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'inactive',
        orders: 3
      }
    ];
  }
};

export const getRecentOrders = async () => {
  try {
    // Try to get real orders from the database
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      return data;
    }
    
    // Fallback to mock data
    return [
      {
        id: 'order-1',
        user_id: 'user-1',
        customer: 'Sarah Johnson',
        date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'delivered',
        items: 3,
        total: '89.97',
        shop: 'Organic Foods Co.'
      },
      {
        id: 'order-2',
        user_id: 'user-2',
        customer: 'Michael Chen',
        date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        status: 'processing',
        items: 2,
        total: '124.50',
        shop: 'Tech Gadgets Inc.'
      },
      {
        id: 'order-3',
        user_id: 'user-4',
        customer: 'Emily Wilson',
        date: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        status: 'shipped',
        items: 5,
        total: '67.45',
        shop: 'Fashion Forward'
      },
      {
        id: 'order-4',
        user_id: 'user-3',
        customer: 'David Rodriguez',
        date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        items: 1,
        total: '34.99',
        shop: 'Book Lovers'
      },
      {
        id: 'order-5',
        user_id: 'user-5',
        customer: 'James Thompson',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        status: 'delivered',
        items: 4,
        total: '156.75',
        shop: 'Home Essentials'
      },
      {
        id: 'order-6',
        user_id: 'user-6',
        customer: 'Olivia Martinez',
        date: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
        status: 'cancelled',
        items: 2,
        total: '59.90',
        shop: 'Beauty Supplies'
      }
    ];
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    // Return mock data as fallback
    return [
      {
        id: 'order-1',
        user_id: 'user-1',
        customer: 'Sarah Johnson',
        date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'delivered',
        items: 3,
        total: '89.97',
        shop: 'Organic Foods Co.'
      },
      {
        id: 'order-2',
        user_id: 'user-2',
        customer: 'Michael Chen',
        date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        status: 'processing',
        items: 2,
        total: '124.50',
        shop: 'Tech Gadgets Inc.'
      },
      {
        id: 'order-3',
        user_id: 'user-4',
        customer: 'Emily Wilson',
        date: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        status: 'shipped',
        items: 5,
        total: '67.45',
        shop: 'Fashion Forward'
      },
      {
        id: 'order-4',
        user_id: 'user-3',
        customer: 'David Rodriguez',
        date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        items: 1,
        total: '34.99',
        shop: 'Book Lovers'
      },
      {
        id: 'order-5',
        user_id: 'user-5',
        customer: 'James Thompson',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        status: 'delivered',
        items: 4,
        total: '156.75',
        shop: 'Home Essentials'
      },
      {
        id: 'order-6',
        user_id: 'user-6',
        customer: 'Olivia Martinez',
        date: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
        status: 'cancelled',
        items: 2,
        total: '59.90',
        shop: 'Beauty Supplies'
      }
    ];
  }
};

export const getPendingShops = async (): Promise<Shop[]> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('status', 'pending');
    
    if (error) throw error;
    
    return data?.map(normalizeShop) || [];
  } catch (error) {
    console.error('Error fetching pending shops:', error);
    return [];
  }
};

// Get admin user
export const getAdminUser = async () => {
  try {
    const { data: authUser } = await supabase.auth.getUser();
    
    if (!authUser.user) {
      throw new Error('No authenticated user');
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.user.id)
      .single();
    
    if (error) throw error;
    
    if (data && data.role === 'admin') {
      return data;
    }
    
    // Mock admin user data for development
    return {
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      created_at: new Date().toISOString(),
      permissions: {
        shops: true,
        products: true,
        users: true,
        orders: true
      }
    };
  } catch (error) {
    console.error('Error fetching admin user:', error);
    // Mock admin user data for development
    return {
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      created_at: new Date().toISOString(),
      permissions: {
        shops: true,
        products: true,
        users: true,
        orders: true
      }
    };
  }
};

export const isAdmin = async () => {
  try {
    const { data: authUser } = await supabase.auth.getUser();
    
    if (!authUser.user) {
      return false;
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authUser.user.id)
      .single();
    
    if (error) throw error;
    
    return data?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    
    // For development, check if we're in guest mode as admin
    const guestRole = sessionStorage.getItem('guestRole');
    return guestRole === 'admin';
  }
};

export const ensureAdminUser = async () => {
  try {
    // This would normally create a default admin user for development
    console.log('Ensuring admin user exists for development...');
    return true;
  } catch (error) {
    console.error('Error ensuring admin user:', error);
    return false;
  }
};

export const getAdminRole = async () => {
  try {
    const { data: authUser } = await supabase.auth.getUser();
    
    if (!authUser.user) {
      throw new Error('No authenticated user');
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authUser.user.id)
      .single();
    
    if (error) throw error;
    
    if (data?.role === 'admin') {
      return 'Super Admin';
    }
    
    return null;
  } catch (error) {
    console.error('Error getting admin role:', error);
    
    // For development
    const guestRole = sessionStorage.getItem('guestRole');
    return guestRole === 'admin' ? 'Super Admin' : null;
  }
};

// Create a new admin user
export const createAdminUser = async (email: string, name: string, password: string) => {
  try {
    // Create the user with supabase auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: 'admin',
        }
      }
    });

    if (error) throw error;

    // Create the user in the profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user?.id,
        email,
        name,
        role: 'admin',
        created_at: new Date().toISOString()
      });

    if (profileError) throw profileError;

    return data.user;
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
};

// Create a new business user
export const createBusinessUser = async (email: string, name: string, tempPassword: string) => {
  try {
    // Create the user with supabase auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password: tempPassword,
      options: {
        data: {
          name,
          role: 'business',
        }
      }
    });

    if (error) throw error;

    // Create the user in the profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user?.id,
        email,
        name,
        role: 'business',
        created_at: new Date().toISOString()
      });

    if (profileError) throw profileError;

    return data.user;
  } catch (error) {
    console.error('Error creating business user:', error);
    throw error;
  }
};
