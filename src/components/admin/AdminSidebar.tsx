import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingBag, Users, Settings, 
  CreditCard, Store, HelpCircle, ChevronRight,
  Menu as MenuIcon, X, PieChart, Package
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

// Navigation items with icons, labels, and routes
const navItems = [
  {
    icon: <LayoutDashboard className="w-5 h-5" />,
    label: 'Dashboard',
    route: '/admin',
    color: 'text-blue-500'
  },
  {
    icon: <Store className="w-5 h-5" />,
    label: 'Shops',
    route: '/admin/shops',
    color: 'text-purple-500'
  },
  {
    icon: <Users className="w-5 h-5" />,
    label: 'Users',
    route: '/admin/users',
    color: 'text-orange-500'
  },
  {
    icon: <ShoppingBag className="w-5 h-5" />,
    label: 'Orders',
    route: '/admin/orders',
    color: 'text-teal-500'
  },
  {
    icon: <Package className="w-5 h-5" />,
    label: 'Products',
    route: '/admin/products',
    color: 'text-green-500'
  },
  {
    icon: <CreditCard className="w-5 h-5" />,
    label: 'Payments',
    route: '/admin/payments',
    color: 'text-red-500'
  },
  {
    icon: <PieChart className="w-5 h-5" />,
    label: 'Analytics',
    route: '/admin/analytics',
    color: 'text-indigo-500'
  },
  {
    icon: <Settings className="w-5 h-5" />,
    label: 'Settings',
    route: '/admin/settings',
    color: 'text-gray-500'
  },
  {
    icon: <HelpCircle className="w-5 h-5" />,
    label: 'Help & Support',
    route: '/admin/support',
    color: 'text-blue-400'
  }
];

const AdminSidebar = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // Close sidebar when window resizes from mobile to desktop
  useEffect(() => {
    if (!isMobile) {
      setIsMobileSidebarOpen(false);
    }
  }, [isMobile]);
  
  const closeSidebar = () => {
    if (isMobile) {
      setIsMobileSidebarOpen(false);
    }
  };
  
  const handleToggleSidebar = (event: React.MouseEvent) => {
    if (isMobile) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    }
  };
  
  // Render the desktop sidebar
  const renderDesktopSidebar = () => (
    <div className="w-64 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">Admin Portal</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your platform</p>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.route}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                  isActive 
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
                end={item.route === '/admin'}
              >
                <span className={cn("flex-shrink-0", item.color)}>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <X className="w-4 h-4 mr-2" />
          Exit Admin Mode
        </Button>
      </div>
    </div>
  );
  
  // Render the mobile sidebar (with overlay)
  const renderMobileSidebar = () => (
    <>
      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggleSidebar}
        className="fixed top-4 left-4 z-50 md:hidden"
      >
        <MenuIcon className="h-6 w-6" />
      </Button>
      
      {/* Mobile sidebar with overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50" 
            onClick={closeSidebar}
          />
          
          {/* Sidebar */}
          <div className="fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-gray-900 overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">Admin Portal</h1>
              <Button variant="ghost" size="icon" onClick={closeSidebar}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <nav className="py-4">
              <ul className="space-y-1 px-2">
                {navItems.map((item, index) => (
                  <li key={index}>
                    <NavLink
                      to={item.route}
                      className={({ isActive }) => cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                        isActive 
                          ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      )}
                      end={item.route === '/admin'}
                      onClick={closeSidebar}
                    >
                      <span className={cn("flex-shrink-0", item.color)}>{item.icon}</span>
                      <span>{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
            
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <X className="w-4 h-4 mr-2" />
                Exit Admin Mode
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
  
  return (
    <>
      {/* Desktop sidebar (hidden on mobile) */}
      <div className="hidden md:block">
        {renderDesktopSidebar()}
      </div>
      
      {/* Mobile sidebar with toggle */}
      <div className="md:hidden">
        {renderMobileSidebar()}
      </div>
    </>
  );
};

export default AdminSidebar;
