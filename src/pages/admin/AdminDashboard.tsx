
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, ShoppingBag, Store, Package, 
  TrendingUp, AlertCircle, CheckCircle,
  Clock, ArrowUpRight, DollarSign
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const StatCard = ({ 
  title, 
  value, 
  icon, 
  change, 
  changeType = 'positive',
  isLoading = false 
}: { 
  title: string; 
  value: string | number; 
  icon: React.ReactNode; 
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  isLoading?: boolean;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          {isLoading ? (
            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-1"></div>
          ) : (
            <h3 className="text-2xl font-bold mt-1 dark:text-white">{value}</h3>
          )}
          {change && (
            <p className={`text-xs mt-2 flex items-center ${
              changeType === 'positive' ? 'text-green-600 dark:text-green-400' : 
              changeType === 'negative' ? 'text-red-600 dark:text-red-400' : 
              'text-gray-500 dark:text-gray-400'
            }`}>
              {changeType === 'positive' ? '↑' : changeType === 'negative' ? '↓' : '•'} {change}
            </p>
          )}
        </div>
        <div className="p-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
          <div className="text-violet-600 dark:text-violet-400">
            {icon}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const RecentActivity = ({ isLoading = false }) => {
  const activities = [
    { 
      id: 1, 
      title: 'New shop registered', 
      description: 'Halal Fresh Market has requested approval',
      time: '5 minutes ago',
      status: 'pending'
    },
    { 
      id: 2, 
      title: 'Order #12345 completed', 
      description: 'Order from Halal Meats was delivered successfully',
      time: '1 hour ago',
      status: 'completed'
    },
    { 
      id: 3, 
      title: 'New product added', 
      description: 'Islamic Bookstore added "Essential Fiqh Guide"',
      time: '3 hours ago',
      status: 'normal'
    },
    { 
      id: 4, 
      title: 'User support request', 
      description: 'Customer requested help with order refund',
      time: 'Yesterday',
      status: 'alert'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"
    >
      <h3 className="text-lg font-semibold mb-4 dark:text-white">Recent Activity</h3>
      
      {isLoading ? (
        Array(4).fill(0).map((_, i) => (
          <div key={i} className="mb-4">
            <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-2"></div>
            <div className="h-3 w-1/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-2"></div>
          </div>
        ))
      ) : (
        <div className="space-y-4">
          {activities.map(activity => (
            <div key={activity.id} className="flex items-start gap-3 pb-4 border-b dark:border-gray-700 last:border-0 last:pb-0">
              <div className={`mt-0.5 p-1.5 rounded-full ${
                activity.status === 'pending' ? 'bg-amber-100 dark:bg-amber-900/30' : 
                activity.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30' :
                activity.status === 'alert' ? 'bg-red-100 dark:bg-red-900/30' :
                'bg-blue-100 dark:bg-blue-900/30'
              }`}>
                {activity.status === 'pending' ? (
                  <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                ) : activity.status === 'completed' ? (
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                ) : activity.status === 'alert' ? (
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                ) : (
                  <ArrowUpRight className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium dark:text-white">{activity.title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{activity.description}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <button className="mt-4 text-sm text-violet-600 dark:text-violet-400 font-medium hover:text-violet-700 dark:hover:text-violet-300 transition-colors">
        View all activity
      </button>
    </motion.div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalShops: '...',
    pendingShops: '...',
    totalProducts: '...',
    totalUsers: '...',
    totalOrders: '...',
    revenue: '...'
  });
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would fetch actual data from Supabase
        // For now, we'll simulate a delay and use mock data
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock data
        setStats({
          totalShops: '236',
          pendingShops: '12',
          totalProducts: '1,893',
          totalUsers: '5,428',
          totalOrders: '843',
          revenue: '$24,389'
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-white">Admin Dashboard</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Total Shops" 
          value={stats.totalShops} 
          icon={<Store className="h-5 w-5" />}
          change="12% this month"
          isLoading={isLoading}
        />
        <StatCard 
          title="Products" 
          value={stats.totalProducts} 
          icon={<Package className="h-5 w-5" />}
          change="8% this month"
          isLoading={isLoading}
        />
        <StatCard 
          title="Shops Pending" 
          value={stats.pendingShops} 
          icon={<Clock className="h-5 w-5" />}
          isLoading={isLoading}
        />
        <StatCard 
          title="Registered Users" 
          value={stats.totalUsers} 
          icon={<Users className="h-5 w-5" />}
          change="4% this month"
          isLoading={isLoading}
        />
        <StatCard 
          title="Total Orders" 
          value={stats.totalOrders} 
          icon={<ShoppingBag className="h-5 w-5" />}
          change="9% this month"
          isLoading={isLoading}
        />
        <StatCard 
          title="Total Revenue" 
          value={stats.revenue} 
          icon={<DollarSign className="h-5 w-5" />}
          change="15% this month"
          isLoading={isLoading}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 h-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold dark:text-white">Revenue Overview</h3>
              <select className="text-sm border rounded-md px-2 py-1 bg-transparent dark:border-gray-700 dark:text-white">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
            
            {isLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="w-12 h-12 border-t-4 border-b-4 border-violet-500 rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="h-16 w-16 mx-auto text-violet-500 opacity-20" />
                  <p className="mt-4 text-gray-500 dark:text-gray-400">
                    Revenue chart will be displayed here
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
        
        <RecentActivity isLoading={isLoading} />
      </div>
    </div>
  );
};

export default AdminDashboard;
