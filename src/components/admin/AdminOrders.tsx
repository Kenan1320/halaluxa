
import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Search, Filter, Eye, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminOrders = () => {
  const { mode } = useTheme();
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Mock data for orders
  const orders = [
    {
      id: 'ORD-1234',
      customer: 'John Smith',
      shop: 'Halal Grocery Express',
      amount: 78.50,
      items: 5,
      date: '2023-08-15',
      status: 'Completed',
      paymentStatus: 'Paid'
    },
    {
      id: 'ORD-1235',
      customer: 'Sarah Johnson',
      shop: 'Modest Fashion Boutique',
      amount: 129.99,
      items: 2,
      date: '2023-08-14',
      status: 'Processing',
      paymentStatus: 'Paid'
    },
    {
      id: 'ORD-1236',
      customer: 'Ali Hassan',
      shop: 'Islamic Books & More',
      amount: 45.75,
      items: 3,
      date: '2023-08-14',
      status: 'Shipped',
      paymentStatus: 'Paid'
    },
    {
      id: 'ORD-1237',
      customer: 'Maria Garcia',
      shop: 'Barakah Halal Meats',
      amount: 96.20,
      items: 4,
      date: '2023-08-13',
      status: 'Disputed',
      paymentStatus: 'Refund Pending'
    },
    {
      id: 'ORD-1238',
      customer: 'Ahmed Khalid',
      shop: 'Halal Street Food',
      amount: 32.45,
      items: 2,
      date: '2023-08-12',
      status: 'Delivered',
      paymentStatus: 'Paid'
    },
  ];

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Completed':
      case 'Delivered':
        return <CheckCircle2 size={16} className="text-green-500" />;
      case 'Processing':
      case 'Shipped':
        return <Clock size={16} className="text-blue-500" />;
      case 'Disputed':
        return <AlertTriangle size={16} className="text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadgeClasses = (status: string) => {
    switch(status) {
      case 'Completed':
      case 'Delivered':
        return mode === 'dark' ? 'bg-green-800/30 text-green-400' : 'bg-green-100 text-green-800';
      case 'Processing':
      case 'Shipped':
        return mode === 'dark' ? 'bg-blue-800/30 text-blue-400' : 'bg-blue-100 text-blue-800';
      case 'Disputed':
        return mode === 'dark' ? 'bg-red-800/30 text-red-400' : 'bg-red-100 text-red-800';
      default:
        return mode === 'dark' ? 'bg-gray-800/30 text-gray-400' : 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusBadgeClasses = (status: string) => {
    if (status === 'Paid') {
      return mode === 'dark' ? 'bg-green-800/30 text-green-400' : 'bg-green-100 text-green-800';
    } else if (status.includes('Refund')) {
      return mode === 'dark' ? 'bg-orange-800/30 text-orange-400' : 'bg-orange-100 text-orange-800';
    } else {
      return mode === 'dark' ? 'bg-yellow-800/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Orders Management</h1>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className={`relative flex-1 ${mode === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search orders..."
            className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
              mode === 'dark'
                ? 'bg-gray-700 border-gray-600 focus:ring-blue-600'
                : 'bg-white border-gray-200 focus:ring-blue-400'
            }`}
          />
        </div>
        
        <Button 
          variant="outline"
          onClick={() => setFilterOpen(!filterOpen)}
          className={`flex items-center gap-2 ${
            mode === 'dark' 
              ? 'border-gray-700 text-gray-300' 
              : 'border-gray-200 text-gray-700'
          }`}
        >
          <Filter size={16} />
          Filters
        </Button>
      </div>
      
      {filterOpen && (
        <div className={`p-4 rounded-lg border grid grid-cols-1 md:grid-cols-3 gap-4 ${
          mode === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              mode === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Status
            </label>
            <select className={`w-full p-2 rounded border ${
              mode === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}>
              <option value="">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="disputed">Disputed</option>
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              mode === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Payment Status
            </label>
            <select className={`w-full p-2 rounded border ${
              mode === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}>
              <option value="">All Payment Statuses</option>
              <option value="paid">Paid</option>
              <option value="refund">Refund Pending</option>
              <option value="pending">Payment Pending</option>
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              mode === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Date Range
            </label>
            <select className={`w-full p-2 rounded border ${
              mode === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}>
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
        </div>
      )}
      
      <div className={`rounded-xl border overflow-hidden ${
        mode === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`text-left ${
                mode === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-600'
              }`}>
                <th className="px-6 py-3 font-medium">Order ID</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Shop</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Items</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Payment</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {orders.map((order) => (
                <tr key={order.id} className={
                  mode === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                }>
                  <td className="px-6 py-4 font-medium">{order.id}</td>
                  <td className="px-6 py-4">{order.customer}</td>
                  <td className="px-6 py-4">{order.shop}</td>
                  <td className="px-6 py-4">${order.amount.toFixed(2)}</td>
                  <td className="px-6 py-4">{order.items}</td>
                  <td className="px-6 py-4">{order.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                      getStatusBadgeClasses(order.status)
                    }`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      getPaymentStatusBadgeClasses(order.paymentStatus)
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className={`p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      mode === 'dark' ? 'text-blue-400' : 'text-blue-600'
                    }`}>
                      <Eye size={16} />
                    </button>
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
            Showing 5 of 124 orders
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

export default AdminOrders;
