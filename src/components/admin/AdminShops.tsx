
import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Search, Filter, Plus, Check, X, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminShops = () => {
  const { mode } = useTheme();
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Mock data for shops
  const shops = [
    {
      id: '1',
      name: 'Halal Grocery Express',
      owner: 'Ahmed Khan',
      category: 'Grocery',
      status: 'Active',
      verified: true,
      products: 120,
      rating: 4.8,
      created: '2023-05-12'
    },
    {
      id: '2',
      name: 'Modest Fashion Boutique',
      owner: 'Fatima Ali',
      category: 'Clothing',
      status: 'Active',
      verified: true,
      products: 89,
      rating: 4.5,
      created: '2023-06-03'
    },
    {
      id: '3',
      name: 'Barakah Halal Meats',
      owner: 'Omar Farooq',
      category: 'Butcher',
      status: 'Pending',
      verified: false,
      products: 45,
      rating: 0,
      created: '2023-08-15'
    },
    {
      id: '4',
      name: 'Islamic Books & More',
      owner: 'Aisha Malik',
      category: 'Books',
      status: 'Suspended',
      verified: true,
      products: 230,
      rating: 3.9,
      created: '2023-04-22'
    },
    {
      id: '5',
      name: 'Halal Street Food',
      owner: 'Yusuf Rahman',
      category: 'Restaurant',
      status: 'Active',
      verified: true,
      products: 35,
      rating: 4.7,
      created: '2023-07-08'
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Shops Management</h1>
        
        <Button className="flex items-center gap-2 bg-haluna-primary hover:bg-haluna-primary-dark">
          <Plus size={16} />
          Add New Shop
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className={`relative flex-1 ${mode === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search shops..."
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
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              mode === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Category
            </label>
            <select className={`w-full p-2 rounded border ${
              mode === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}>
              <option value="">All Categories</option>
              <option value="grocery">Grocery</option>
              <option value="restaurant">Restaurant</option>
              <option value="clothing">Clothing</option>
              <option value="butcher">Butcher</option>
              <option value="books">Books</option>
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              mode === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Verification
            </label>
            <select className={`w-full p-2 rounded border ${
              mode === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}>
              <option value="">All Shops</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
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
                <th className="px-6 py-3 font-medium">Shop Name</th>
                <th className="px-6 py-3 font-medium">Owner</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Verified</th>
                <th className="px-6 py-3 font-medium">Products</th>
                <th className="px-6 py-3 font-medium">Rating</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {shops.map((shop) => (
                <tr key={shop.id} className={
                  mode === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                }>
                  <td className="px-6 py-4 font-medium">{shop.name}</td>
                  <td className="px-6 py-4">{shop.owner}</td>
                  <td className="px-6 py-4">{shop.category}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      getStatusBadgeClasses(shop.status)
                    }`}>
                      {shop.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {shop.verified ? (
                      <Check size={18} className="text-green-500" />
                    ) : (
                      <X size={18} className="text-red-500" />
                    )}
                  </td>
                  <td className="px-6 py-4">{shop.products}</td>
                  <td className="px-6 py-4">{shop.rating > 0 ? shop.rating : 'N/A'}</td>
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
                      <button className={`p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        mode === 'dark' ? 'text-red-400' : 'text-red-600'
                      }`}>
                        <Trash2 size={16} />
                      </button>
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
            Showing 5 of 42 shops
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

export default AdminShops;
