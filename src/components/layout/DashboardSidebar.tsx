
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Package, ShoppingBag, Users, Settings, 
  ChevronDown, CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useState } from 'react';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  end?: boolean;
}

const SidebarLink = ({ to, icon, children, end = false }: SidebarLinkProps) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) => cn(
      'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
      isActive 
        ? 'bg-haluna-primary text-white' 
        : 'text-haluna-text hover:bg-haluna-primary-light hover:text-haluna-primary'
    )}
  >
    {icon}
    <span>{children}</span>
  </NavLink>
);

const DashboardSidebar = () => {
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  
  return (
    <aside className="w-64 bg-white h-full border-r shadow-sm">
      <div className="p-4">
        <h2 className="font-serif text-xl font-bold">Seller Dashboard</h2>
      </div>
      
      <nav className="px-3 py-2 space-y-1">
        <SidebarLink to="/dashboard" icon={<LayoutDashboard className="h-5 w-5" />} end>
          Overview
        </SidebarLink>
        
        <Collapsible 
          open={isProductsOpen} 
          onOpenChange={setIsProductsOpen}
          className="space-y-1"
        >
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full justify-between text-haluna-text hover:bg-haluna-primary-light hover:text-haluna-primary px-3 py-2 h-auto"
            >
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5" />
                <span>Products</span>
              </div>
              <ChevronDown 
                className={cn(
                  "h-4 w-4 transition-transform", 
                  isProductsOpen && "transform rotate-180"
                )} 
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-8 space-y-1">
            <SidebarLink to="/dashboard/products" icon={<Package className="h-4 w-4" />}>
              All Products
            </SidebarLink>
            <SidebarLink to="/dashboard/products/new" icon={<Package className="h-4 w-4" />}>
              Add New
            </SidebarLink>
          </CollapsibleContent>
        </Collapsible>
        
        <SidebarLink to="/dashboard/orders" icon={<ShoppingBag className="h-5 w-5" />}>
          Orders
        </SidebarLink>
        
        <SidebarLink to="/dashboard/customers" icon={<Users className="h-5 w-5" />}>
          Customers
        </SidebarLink>
        
        <SidebarLink to="/dashboard/payment-account" icon={<CreditCard className="h-5 w-5" />}>
          Payment Account
        </SidebarLink>
        
        <SidebarLink to="/dashboard/settings" icon={<Settings className="h-5 w-5" />}>
          Settings
        </SidebarLink>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
