
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Settings,
  CreditCard,
  LogOut,
  X,
} from 'lucide-react';

interface DashboardSidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const DashboardSidebar = ({ isOpen, closeSidebar }: DashboardSidebarProps) => {
  const { logout, businessProfile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Navigation items
  const navItems = [
    {
      name: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      path: '/dashboard',
    },
    {
      name: 'Products',
      icon: <ShoppingBag size={20} />,
      path: '/dashboard/products',
    },
    {
      name: 'Orders',
      icon: <CreditCard size={20} />,
      path: '/dashboard/orders',
    },
    {
      name: 'Customers',
      icon: <Users size={20} />,
      path: '/dashboard/customers',
    },
    {
      name: 'Settings',
      icon: <Settings size={20} />,
      path: '/dashboard/settings',
    },
  ];

  return (
    <>
      {/* Mobile Sidebar Background Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 pt-16 flex flex-col transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:z-0`}
      >
        {/* Close button for mobile */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={closeSidebar} 
          className="absolute top-4 right-4 md:hidden"
        >
          <X size={24} />
        </Button>

        {/* Shop Info */}
        <div className="px-4 py-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-haluna-text truncate">
            {businessProfile?.shopName || 'Your Shop'}
          </h2>
          <p className="text-sm text-gray-500 mt-1 truncate">
            {businessProfile?.shopDescription || 'Manage your business'}
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-haluna-primary-light text-haluna-primary font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                  onClick={closeSidebar}
                >
                  <div className="flex-shrink-0">{item.icon}</div>
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="ghost"
            className="w-full flex items-center justify-start text-gray-700 hover:bg-gray-100 py-2"
            onClick={handleLogout}
          >
            <LogOut size={20} className="mr-3" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
