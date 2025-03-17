
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Search, Eye, Edit, Lock, Unlock, UserCheck, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminUsers = () => {
  const { mode } = useTheme();
  
  // Mock data for users
  const users = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      role: 'Customer',
      status: 'Active',
      verified: true,
      orders: 8,
      registered: '2023-05-18'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      role: 'Customer',
      status: 'Active',
      verified: true,
      orders: 15,
      registered: '2023-02-05'
    },
    {
      id: '3',
      name: 'Ahmed Khalid',
      email: 'ahmed.k@example.com',
      role: 'Business Owner',
      status: 'Active',
      verified: true,
      orders: 0,
      registered: '2023-07-22'
    },
    {
      id: '4',
      name: 'Maria Garcia',
      email: 'maria.g@example.com',
      role: 'Customer',
      status: 'Suspended',
      verified: true,
      orders: 3,
      registered: '2023-04-10'
    },
    {
      id: '5',
      name: 'Ali Hassan',
      email: 'ali.h@example.com',
      role: 'Business Owner',
      status: 'Pending',
      verified: false,
      orders: 0,
      registered: '2023-08-02'
    },
  ];

  const getStatusBadgeClasses = (status: string) => {
    switch(status) {
      case 'Active':
        return mode === 'dark' ? 'bg-green-800/30 text-green-400' : 'bg-green-100 text-green-800';
      case 'Pending':
        return mode === 'dark' ? 'bg-yellow-800/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800';
      case 'Suspended':
        return mode === 'dark' ? 'bg-red-800/30 text-red-400' : 'bg-red-100 text-red-800';
      default:
        return mode === 'dark' ? 'bg-gray-800/30 text-gray-400' : 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleBadgeClasses = (role: string) => {
    if (role === 'Business Owner') {
      return mode === 'dark' ? 'bg-blue-800/30 text-blue-400' : 'bg-blue-100 text-blue-800';
    } else {
      return mode === 'dark' ? 'bg-purple-800/30 text-purple-400' : 'bg-purple-100 text-purple-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Users Management</h1>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className={`relative flex-1 ${mode === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search users..."
            className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
              mode === 'dark'
                ? 'bg-gray-700 border-gray-600 focus:ring-blue-600'
                : 'bg-white border-gray-200 focus:ring-blue-400'
            }`}
          />
        </div>
        
        <div className="flex gap-2">
          <Button className="bg-haluna-primary hover:bg-haluna-primary-dark">
            All Users
          </Button>
          <Button variant="outline" className={
            mode === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }>
            Customers
          </Button>
          <Button variant="outline" className={
            mode === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }>
            Business Owners
          </Button>
        </div>
      </div>
      
      <div className={`rounded-xl border overflow-hidden ${
        mode === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`text-left ${
                mode === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-600'
              }`}>
                <th className="px-6 py-3 font-medium">User</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Role</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Verified</th>
                <th className="px-6 py-3 font-medium">Orders</th>
                <th className="px-6 py-3 font-medium">Registered</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => (
                <tr key={user.id} className={
                  mode === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                }>
                  <td className="px-6 py-4 font-medium">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      getRoleBadgeClasses(user.role)
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      getStatusBadgeClasses(user.status)
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.verified ? (
                      <UserCheck size={18} className="text-green-500" />
                    ) : (
                      <UserX size={18} className="text-yellow-500" />
                    )}
                  </td>
                  <td className="px-6 py-4">{user.orders}</td>
                  <td className="px-6 py-4">{user.registered}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className={`p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        mode === 'dark' ? 'text-blue-400' : 'text-blue-600'
                      }`}>
                        <Eye size={16} />
                      </button>
                      <button className={`p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        mode === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                      }`}>
                        <Edit size={16} />
                      </button>
                      {user.status === 'Suspended' ? (
                        <button className={`p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          mode === 'dark' ? 'text-green-400' : 'text-green-600'
                        }`}>
                          <Unlock size={16} />
                        </button>
                      ) : (
                        <button className={`p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          mode === 'dark' ? 'text-red-400' : 'text-red-600'
                        }`}>
                          <Lock size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className={`px-6 py-4 flex items-center justify-between border-t ${
          mode === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className={mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
            Showing 5 of 247 users
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled className={
              mode === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }>
              Previous
            </Button>
            <Button variant="outline" size="sm" className={
              mode === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
