
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Users, Store, ShoppingBag, DollarSign, ArrowUp, ArrowDown } from 'lucide-react';

const AdminOverview = () => {
  const { mode } = useTheme();
  
  const stats = [
    { 
      title: 'Total Users', 
      value: '1,234', 
      change: '+12%', 
      trend: 'up',
      icon: <Users size={24} />
    },
    { 
      title: 'Active Shops', 
      value: '86', 
      change: '+8%', 
      trend: 'up',
      icon: <Store size={24} />
    },
    { 
      title: 'Total Products', 
      value: '3,549', 
      change: '+24%', 
      trend: 'up',
      icon: <ShoppingBag size={24} />
    },
    { 
      title: 'Total Revenue', 
      value: '$45,678', 
      change: '-3%', 
      trend: 'down',
      icon: <DollarSign size={24} />
    },
  ];

  const recentActions = [
    { id: 1, action: 'New shop registered', time: '3 minutes ago', status: 'Pending Approval' },
    { id: 2, action: 'New product added', time: '15 minutes ago', status: 'Pending Review' },
    { id: 3, action: 'Customer dispute filed', time: '1 hour ago', status: 'Needs Attention' },
    { id: 4, action: 'Shop verification request', time: '2 hours ago', status: 'In Progress' },
    { id: 5, action: 'Payout request submitted', time: '3 hours ago', status: 'Pending Approval' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className={`p-6 rounded-xl border ${
              mode === 'dark' 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className={`text-sm ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-full ${
                mode === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                {stat.icon}
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {stat.trend === 'up' ? (
                <ArrowUp size={16} className="text-green-500 mr-1" />
              ) : (
                <ArrowDown size={16} className="text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${
                stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
              }`}>
                {stat.change} this month
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className={`p-6 rounded-xl border ${
        mode === 'dark' 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <h2 className="text-xl font-bold mb-4">Recent Actions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`text-left border-b ${
                mode === 'dark' ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'
              }`}>
                <th className="pb-3 font-medium">Action</th>
                <th className="pb-3 font-medium">Time</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentActions.map((item) => (
                <tr key={item.id} className={`border-b ${
                  mode === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <td className="py-4">{item.action}</td>
                  <td className="py-4 text-sm">{item.time}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      item.status === 'Pending Approval' || item.status === 'Pending Review'
                        ? mode === 'dark' ? 'bg-yellow-800/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800'
                        : item.status === 'Needs Attention'
                          ? mode === 'dark' ? 'bg-red-800/30 text-red-400' : 'bg-red-100 text-red-800' 
                          : mode === 'dark' ? 'bg-blue-800/30 text-blue-400' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <button className={`text-sm font-medium ${
                      mode === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                    }`}>
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
