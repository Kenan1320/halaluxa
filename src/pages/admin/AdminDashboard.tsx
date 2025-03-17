import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Briefcase, DollarSign, ShoppingBag, ShoppingCart, Star, Store, Users } from 'lucide-react';
import { getAdminStats, getDashboardUsers, getRecentOrders } from '@/services/adminService';
import { DatabaseProfile } from '@/types/database';
import { Button } from '@/components/ui/button';

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>({
    totalUsers: 0,
    totalShops: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingApprovals: 0,
    activeUsers: 0,
  });
  
  const [users, setUsers] = useState<DatabaseProfile[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch admin dashboard stats
        const dashboardStats = await getAdminStats();
        setStats(dashboardStats);
        
        // Fetch recent users
        const recentUsers = await getDashboardUsers();
        // Convert to the correct type explicitly
        setUsers(recentUsers as unknown as DatabaseProfile[]);
        
        // Fetch recent orders
        const recentOrders = await getRecentOrders();
        setOrders(recentOrders);
      } catch (error) {
        console.error("Error loading admin dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);
  
  const StatCard = ({ title, value, icon: Icon, color }: { title: string, value: number | string, icon: any, color: string }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`p-2 rounded-full ${color}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {/* Additional metric could go here */}
      </CardContent>
    </Card>
  );

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon={Users} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Total Shops" 
          value={stats.totalShops} 
          icon={Store} 
          color="bg-green-500" 
        />
        <StatCard 
          title="Total Orders" 
          value={stats.totalOrders} 
          icon={ShoppingCart} 
          color="bg-purple-500" 
        />
        <StatCard 
          title="Total Revenue" 
          value={`$${stats.totalRevenue}`} 
          icon={DollarSign} 
          color="bg-teal-500" 
        />
        <StatCard 
          title="Pending Approvals" 
          value={stats.pendingApprovals} 
          icon={Briefcase} 
          color="bg-orange-500" 
        />
        <StatCard 
          title="Active Users" 
          value={stats.activeUsers} 
          icon={Star} 
          color="bg-yellow-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>New users on the platform</CardDescription>
          </CardHeader>
          <CardContent className="overflow-auto">
            {loading ? (
              <div className="text-center py-4">Loading users...</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b">
                    <th className="h-12 font-medium text-left px-4 py-2">Name</th>
                    <th className="h-12 font-medium text-left px-4 py-2">Email</th>
                    <th className="h-12 font-medium text-left px-4 py-2">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="p-4">{user.name}</td>
                      <td className="p-4">{user.email}</td>
                      <td className="p-4">{user.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest orders placed</CardDescription>
          </CardHeader>
          <CardContent className="overflow-auto">
            {loading ? (
              <div className="text-center py-4">Loading orders...</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="[&_tr]:border-b">
                  <tr>
                    <th className="h-12 font-medium text-left px-4 py-2">Order ID</th>
                    <th className="h-12 font-medium text-left px-4 py-2">User ID</th>
                    <th className="h-12 font-medium text-left px-4 py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b">
                      <td className="p-4">{order.id}</td>
                      <td className="p-4">{order.user_id}</td>
                      <td className="p-4">${order.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
