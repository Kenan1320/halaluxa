
import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Search, Filter, Plus, Check, X, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminProducts = () => {
  const { mode } = useTheme();
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Mock data for products
  const products = [
    {
      id: '1',
      name: 'Organic Halal Chicken',
      shop: 'Barakah Halal Meats',
      category: 'Meat',
      price: 12.99,
      stock: 45,
      halal_certified: true,
      status: 'Active',
      created: '2023-06-15'
    },
    {
      id: '2',
      name: 'Premium Hijab - Navy Blue',
      shop: 'Modest Fashion Boutique',
      category: 'Clothing',
      price: 24.99,
      stock: 78,
      halal_certified: true,
      status: 'Active',
      created: '2023-05-22'
    },
    {
      id: '3',
      name: 'Quran with Translation',
      shop: 'Islamic Books & More',
      category: 'Books',
      price: 35.50,
      stock: 12,
      halal_certified: true,
      status: 'Under Review',
      created: '2023-08-05'
    },
    {
      id: '4',
      name: 'Halal Gummy Bears',
      shop: 'Halal Grocery Express',
      category: 'Candy',
      price: 3.99,
      stock: 120,
      halal_certified: false,
      status: 'Flagged',
      created: '2023-07-11'
    },
    {
      id: '5',
      name: 'Lamb Kebab Mix',
      shop: 'Halal Street Food',
      category: 'Meat',
      price: 9.99,
      stock: 25,
      halal_certified: true,
      status: 'Active',
      created: '2023-06-30'
    },
  ];

  const getStatusBadgeClasses = (status: string) => {
    switch(status) {
      case 'Active':
        return mode === 'dark' ? 'bg-green-800/30 text-green-400' : 'bg-green-100 text-green-800';
      case 'Under Review':
        return mode === 'dark' ? 'bg-yellow-800/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800';
      case 'Flagged':
        return mode === 'dark' ? 'bg-red-800/30 text-red-400' : 'bg-red-100 text-red-800';
      default:
        return mode === 'dark' ? 'bg-gray-800/30 text-gray-400' : 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Products Management</h1>
        
        <Button className="flex items-center gap-2 bg-haluna-primary hover:bg-haluna-primary-dark">
          <Plus size={16} />
          Add New Product
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className={`relative flex-1 ${mode === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products..."
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
              <option value="review">Under Review</option>
              <option value="flagged">Flagged</option>
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
              <option value="meat">Meat</option>
              <option value="clothing">Clothing</option>
              <option value="books">Books</option>
              <option value="candy">Candy</option>
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              mode === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Halal Certification
            </label>
            <select className={`w-full p-2 rounded border ${
              mode === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}>
              <option value="">All Products</option>
              <option value="certified">Certified</option>
              <option value="not-certified">Not Certified</option>
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
                <th className="px-6 py-3 font-medium">Product Name</th>
                <th className="px-6 py-3 font-medium">Shop</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Price</th>
                <th className="px-6 py-3 font-medium">Stock</th>
                <th className="px-6 py-3 font-medium">Halal Certified</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {products.map((product) => (
                <tr key={product.id} className={
                  mode === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                }>
                  <td className="px-6 py-4 font-medium">{product.name}</td>
                  <td className="px-6 py-4">{product.shop}</td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4">{product.stock}</td>
                  <td className="px-6 py-4">
                    {product.halal_certified ? (
                      <Check size={18} className="text-green-500" />
                    ) : (
                      <X size={18} className="text-red-500" />
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      getStatusBadgeClasses(product.status)
                    }`}>
                      {product.status}
                    </span>
                  </td>
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
            Showing 5 of 85 products
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

export default AdminProducts;
