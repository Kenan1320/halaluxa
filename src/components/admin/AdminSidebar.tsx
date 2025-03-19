
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  FileText, 
  CreditCard, 
  Settings,
  ChevronRight,
  BarChart3,
  Home
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface AdminSidebarProps {
  expanded: boolean;
  onExpand: () => void;
}

export const AdminSidebar = ({ expanded, onExpand }: AdminSidebarProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const isActive = (path: string) => {
    return currentPath === path || currentPath.startsWith(`${path}/`);
  };
  
  // Menu items for admin navigation
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin', exact: true },
    { icon: <ShoppingBag size={20} />, label: 'Products', path: '/admin/products' },
    { icon: <Users size={20} />, label: 'Customers', path: '/admin/customers' },
    { icon: <FileText size={20} />, label: 'Orders', path: '/admin/orders' },
    { icon: <CreditCard size={20} />, label: 'Payments', path: '/admin/payments' },
    { icon: <BarChart3 size={20} />, label: 'Analytics', path: '/admin/analytics' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/admin/settings' },
  ];
  
  return (
    <div className={cn(
      "h-screen bg-[#0F1B44] text-white flex flex-col transition-all duration-300 border-r border-white/10",
      expanded ? "w-64" : "w-20"
    )}>
      {/* Top Section with Logo and Toggle */}
      <div className={cn(
        "p-4 flex items-center border-b border-white/10",
        expanded ? "justify-between" : "justify-center"
      )}>
        {expanded ? (
          <Link to="/admin" className="text-xl font-bold flex items-center">
            <span className="text-white">Halvi</span>
            <span className="text-orange-400">.</span>
            <span className="text-gray-300 text-sm ml-1 font-light">Admin</span>
          </Link>
        ) : (
          <Link to="/admin" className="text-xl font-bold">
            <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center">
              <span className="text-white text-sm">H</span>
            </div>
          </Link>
        )}
        
        <button 
          onClick={onExpand}
          className={cn(
            "h-6 w-6 rounded-full bg-white/10 flex items-center justify-center",
            expanded ? "block" : "hidden"
          )}
        >
          <ChevronRight size={14} />
        </button>
      </div>
      
      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-3 py-3 rounded-lg transition-colors",
                isActive(item.path) 
                  ? "bg-white/10" 
                  : "hover:bg-white/5",
                expanded ? "" : "justify-center"
              )}
            >
              <div className={isActive(item.path) ? "text-purple-400" : "text-gray-300"}>
                {item.icon}
              </div>
              {expanded && (
                <span className={cn(
                  "ml-3 font-medium",
                  isActive(item.path) ? "text-white" : "text-gray-300"
                )}>
                  {item.label}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>
      
      {/* Footer with Theme Toggle and Back to Site */}
      <div className={cn(
        "p-4 border-t border-white/10",
        expanded ? "block" : "flex flex-col items-center"
      )}>
        <div className={cn(
          "flex items-center space-x-2 mb-4",
          expanded ? "" : "justify-center"
        )}>
          <ThemeToggle className="bg-white/10 hover:bg-white/20" />
          {expanded && <span className="text-sm text-gray-300">Theme</span>}
        </div>
        
        <Link 
          to="/" 
          className={cn(
            "flex items-center text-gray-300 hover:text-white transition-colors",
            expanded ? "" : "justify-center"
          )}
        >
          <Home size={18} className="mr-2" />
          {expanded && <span className="text-sm">Back to Site</span>}
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;
