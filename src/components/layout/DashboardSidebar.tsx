
import { Home, Package, Users, ShoppingBag, Settings, LogOut, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
}

const NavItem = ({ icon: Icon, label, href, active }: NavItemProps) => (
  <Link
    to={href}
    className={cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
      active ? "bg-haluna-primary text-white" : "text-haluna-text hover:bg-haluna-primary-light"
    )}
  >
    <Icon className="h-5 w-5" />
    <span>{label}</span>
  </Link>
);

const DashboardSidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
  const navItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Package, label: "Products", href: "/dashboard/products" },
    { icon: ShoppingBag, label: "Orders", href: "/dashboard/orders" },
    { icon: Users, label: "Customers", href: "/dashboard/customers" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <div className={cn(
      "h-screen fixed left-0 top-0 z-30 flex flex-col border-r bg-white transition-all duration-300",
      collapsed ? "w-20" : "w-64"
    )}>
      <div className="flex items-center justify-between border-b p-4">
        {!collapsed && (
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-serif font-bold text-haluna-primary">Haluna</span>
            <span className="text-xs bg-haluna-primary text-white px-1 rounded">Seller</span>
          </Link>
        )}
        <button 
          className="p-2 rounded-lg hover:bg-haluna-primary-light text-haluna-text"
          onClick={() => setCollapsed(!collapsed)}
        >
          <Menu size={20} />
        </button>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              icon={item.icon}
              label={collapsed ? "" : item.label}
              href={item.href}
              active={location.pathname === item.href}
            />
          ))}
        </nav>
      </div>
      
      <div className="border-t p-4">
        <NavItem
          icon={LogOut}
          label={collapsed ? "" : "Sign Out"}
          href="/"
        />
      </div>
    </div>
  );
};

export default DashboardSidebar;
