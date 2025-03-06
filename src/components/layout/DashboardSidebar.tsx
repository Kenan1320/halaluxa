
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Package, ShoppingBag, Users, Settings, 
  ChevronDown, CreditCard, BarChart, HelpCircle, PieChart
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
      'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
      isActive 
        ? 'bg-haluna-primary text-white shadow-sm' 
        : 'text-haluna-text hover:bg-haluna-primary-light hover:text-haluna-primary'
    )}
  >
    {icon}
    <span>{children}</span>
  </NavLink>
);

const DashboardSidebar = () => {
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  
  return (
    <aside className="w-64 bg-white h-screen fixed border-r shadow-sm overflow-y-auto">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <span className="text-xl font-serif font-bold text-haluna-primary">Haluna</span>
            <div className="relative ml-1">
              <div className="w-5 h-5 bg-gradient-to-br from-orange-300 to-orange-400 rounded-full shadow-sm"></div>
              <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-white rounded-full opacity-30"></div>
            </div>
          </div>
        </div>
        <h2 className="text-sm font-medium">Seller Dashboard</h2>
      </div>
      
      <nav className="px-3 py-4 space-y-1.5">
        <SidebarLink to="/dashboard" icon={<LayoutDashboard className="h-5 w-5" />} end>
          Overview
        </SidebarLink>
        
        <Collapsible 
          open={isProductsOpen} 
          onOpenChange={setIsProductsOpen}
          className="space-y-1.5"
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
                  "h-4 w-4 transition-transform duration-200", 
                  isProductsOpen && "transform rotate-180"
                )} 
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-8 space-y-1.5 animate-slideDown">
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
        
        <Collapsible 
          open={isAnalyticsOpen} 
          onOpenChange={setIsAnalyticsOpen}
          className="space-y-1.5"
        >
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full justify-between text-haluna-text hover:bg-haluna-primary-light hover:text-haluna-primary px-3 py-2 h-auto"
            >
              <div className="flex items-center gap-3">
                <BarChart className="h-5 w-5" />
                <span>Analytics</span>
              </div>
              <ChevronDown 
                className={cn(
                  "h-4 w-4 transition-transform duration-200", 
                  isAnalyticsOpen && "transform rotate-180"
                )} 
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-8 space-y-1.5 animate-slideDown">
            <SidebarLink to="/dashboard/analytics/sales" icon={<PieChart className="h-4 w-4" />}>
              Sales Reports
            </SidebarLink>
            <SidebarLink to="/dashboard/analytics/customers" icon={<Users className="h-4 w-4" />}>
              Customer Insights
            </SidebarLink>
          </CollapsibleContent>
        </Collapsible>
        
        <SidebarLink to="/dashboard/payment-account" icon={<CreditCard className="h-5 w-5" />}>
          Payment Account
        </SidebarLink>
        
        <SidebarLink to="/dashboard/settings" icon={<Settings className="h-5 w-5" />}>
          Settings
        </SidebarLink>
        
        <SidebarLink to="/dashboard/help" icon={<HelpCircle className="h-5 w-5" />}>
          Help & Support
        </SidebarLink>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
