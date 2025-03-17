
import { supabase } from '@/lib/supabase';

// Admin service functions
export const getAdminStats = async () => {
  try {
    // In a real app, this would fetch from Supabase
    // For now, return mock data
    return {
      totalUsers: 2458,
      totalShops: 187,
      totalOrders: 9754,
      totalRevenue: 124587.45,
      newUsersToday: 24,
      newOrdersToday: 142
    };
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    throw error;
  }
};

export const getDashboardUsers = async () => {
  try {
    // Mock data for users
    return [
      {
        id: 'user-1',
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        orders: 12
      },
      {
        id: 'user-2',
        name: 'Michael Chen',
        email: 'michael.c@example.com',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        orders: 5
      },
      {
        id: 'user-3',
        name: 'David Rodriguez',
        email: 'david.r@example.com',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        orders: 0
      },
      {
        id: 'user-4',
        name: 'Emily Wilson',
        email: 'emily.w@example.com',
        created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        orders: 27
      },
      {
        id: 'user-5',
        name: 'James Thompson',
        email: 'james.t@example.com',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'inactive',
        orders: 3
      }
    ];
  } catch (error) {
    console.error('Error fetching dashboard users:', error);
    throw error;
  }
};

export const getRecentOrders = async () => {
  try {
    // Mock data for recent orders
    return [
      {
        id: 'order-1',
        customer: 'Sarah Johnson',
        date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'delivered',
        items: 3,
        total: 89.97,
        shop: 'Organic Foods Co.'
      },
      {
        id: 'order-2',
        customer: 'Michael Chen',
        date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        status: 'processing',
        items: 2,
        total: 124.50,
        shop: 'Tech Gadgets Inc.'
      },
      {
        id: 'order-3',
        customer: 'Emily Wilson',
        date: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        status: 'shipped',
        items: 5,
        total: 67.45,
        shop: 'Fashion Forward'
      },
      {
        id: 'order-4',
        customer: 'David Rodriguez',
        date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        items: 1,
        total: 34.99,
        shop: 'Book Lovers'
      },
      {
        id: 'order-5',
        customer: 'James Thompson',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        status: 'delivered',
        items: 4,
        total: 156.75,
        shop: 'Home Essentials'
      },
      {
        id: 'order-6',
        customer: 'Olivia Martinez',
        date: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
        status: 'cancelled',
        items: 2,
        total: 59.90,
        shop: 'Beauty Supplies'
      }
    ].map(order => ({
      ...order,
      // Convert the total to a string to fix the TypeScript error
      total: order.total.toString()
    }));
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    throw error;
  }
};
