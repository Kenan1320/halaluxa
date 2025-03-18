import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart, Settings, Users, Store, Plus, Tag, Package, Truck, MessageSquare, HelpCircle, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const AdminSidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 w-64">
      <div className="px-6 py-4">
        <Link to="/" className="flex items-center text-xl font-bold text-gray-900 dark:text-white">
          <Store className="mr-2 h-6 w-6" />
          Halvi
        </Link>
      </div>

      <div className="flex-grow p-4">
        <ul className="space-y-2">
          <li>
            <Link to="/admin" className={`flex items-center px-4 py-3 rounded-md ${isActive('/admin') ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'} transition-colors`}>
              <Home className="mr-2 h-5 w-5" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/admin/analytics" className={`flex items-center px-4 py-3 rounded-md ${isActive('/admin/analytics') ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'} transition-colors`}>
              <BarChart className="mr-2 h-5 w-5" />
              Analytics
            </Link>
          </li>
          <li>
            <Link to="/admin/shops" className={`flex items-center px-4 py-3 rounded-md ${isActive('/admin/shops') ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'} transition-colors`}>
              <Store className="mr-2 h-5 w-5" />
              Shops
            </Link>
          </li>
          <li>
            <Link to="/admin/users" className={`flex items-center px-4 py-3 rounded-md ${isActive('/admin/users') ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'} transition-colors`}>
              <Users className="mr-2 h-5 w-5" />
              Users
            </Link>
          </li>
          <li>
            <Link to="/admin/products" className={`flex items-center px-4 py-3 rounded-md ${isActive('/admin/products') ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'} transition-colors`}>
              <Package className="mr-2 h-5 w-5" />
              Products
            </Link>
          </li>
          <li>
            <Link to="/admin/categories" className={`flex items-center px-4 py-3 rounded-md ${isActive('/admin/categories') ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'} transition-colors`}>
              <Tag className="mr-2 h-5 w-5" />
              Categories
            </Link>
          </li>
          <li>
            <Link to="/admin/orders" className={`flex items-center px-4 py-3 rounded-md ${isActive('/admin/orders') ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'} transition-colors`}>
              <Truck className="mr-2 h-5 w-5" />
              Orders
            </Link>
          </li>
          <li>
            <Link to="/admin/messages" className={`flex items-center px-4 py-3 rounded-md ${isActive('/admin/messages') ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'} transition-colors`}>
              <MessageSquare className="mr-2 h-5 w-5" />
              Messages
            </Link>
          </li>
          <li>
            <Link to="/admin/help" className={`flex items-center px-4 py-3 rounded-md ${isActive('/admin/help') ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'} transition-colors`}>
              <HelpCircle className="mr-2 h-5 w-5" />
              Help & Support
            </Link>
          </li>
        </ul>
      </div>

      <div className="p-4">
        <div className="px-3 py-2">
          <ThemeToggle showLabel={true} />
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center px-4 py-3 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
        >
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
