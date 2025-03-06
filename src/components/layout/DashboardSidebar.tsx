
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Package, ShoppingBag, Users, Settings, 
  ChevronDown, CreditCard, BarChart, HelpCircle, PieChart,
  Menu, X, Smartphone, Monitor
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  end?: boolean;
  onClick?: () => void;
}

const SidebarLink = ({ to, icon, children, end = false, onClick }: SidebarLinkProps) => (
  <NavLink
    to={to}
    end={end}
    onClick={onClick}
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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>(
    localStorage.getItem('dashboardViewMode') as 'mobile' | 'desktop' || 'mobile'
  );
  
  const isMobile = useIsMobile();
  
  // Close sidebar when route changes on mobile
  useEffect(() => {
    return () => {
      if (isMobile) {
        setIsMobileSidebarOpen(false);
      }
    };
  }, [isMobile]);
  
  // Save view mode preference
  useEffect(() => {
    localStorage.setItem('dashboardViewMode', viewMode);
  }, [viewMode]);
  
  const toggleViewMode = () => {
    setViewMode(prev => prev === 'mobile' ? 'desktop' : 'mobile');
  };
  
  const closeSidebar = () => {
    if (isMobile) {
      setIsMobileSidebarOpen(false);
    }
  };
  
  // Mobile sidebar trigger button that stays fixed on screen
  const MobileSidebarTrigger = () => (
    <Button
      variant="outline" 
      size="icon"
      onClick={() => setIsMobileSidebarOpen(true)}
      className="fixed top-16 left-4 z-50 rounded-full shadow-md bg-white md:hidden"
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
  
  // Actual sidebar content
  const SidebarContent = () => (
    <aside className={cn(
      "bg-white border-r shadow-sm overflow-y-auto transition-all duration-300 ease-in-out",
      isMobile ? (
        isMobileSidebarOpen 
          ? "fixed inset-y-0 left-0 w-64 z-50" 
          : "fixed inset-y-0 -left-64 w-64 z-50"
      ) : "w-64 h-screen fixed"
    )}>
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
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleViewMode}
            title={viewMode === 'mobile' ? "Switch to desktop view" : "Switch to mobile view"}
            className="text-haluna-text-light hover:text-haluna-primary"
          >
            {viewMode === 'mobile' 
              ? <Monitor className="h-4 w-4" /> 
              : <Smartphone className="h-4 w-4" />
            }
          </Button>
          
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMobileSidebarOpen(false)}
              className="md:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
      
      <nav className="px-3 py-4 space-y-1.5">
        <SidebarLink 
          to="/dashboard" 
          icon={<LayoutDashboard className="h-5 w-5" />} 
          end
          onClick={closeSidebar}
        >
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
            <SidebarLink 
              to="/dashboard/products" 
              icon={<Package className="h-4 w-4" />}
              onClick={closeSidebar}
            >
              All Products
            </SidebarLink>
            <SidebarLink 
              to="/dashboard/products/new" 
              icon={<Package className="h-4 w-4" />}
              onClick={closeSidebar}
            >
              Add New
            </SidebarLink>
          </CollapsibleContent>
        </Collapsible>
        
        <SidebarLink 
          to="/dashboard/orders" 
          icon={<ShoppingBag className="h-5 w-5" />}
          onClick={closeSidebar}
        >
          Orders
        </SidebarLink>
        
        <SidebarLink 
          to="/dashboard/customers" 
          icon={<Users className="h-5 w-5" />}
          onClick={closeSidebar}
        >
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
            <SidebarLink 
              to="/dashboard/analytics/sales" 
              icon={<PieChart className="h-4 w-4" />}
              onClick={closeSidebar}
            >
              Sales Reports
            </SidebarLink>
            <SidebarLink 
              to="/dashboard/analytics/customers" 
              icon={<Users className="h-4 w-4" />}
              onClick={closeSidebar}
            >
              Customer Insights
            </SidebarLink>
          </CollapsibleContent>
        </Collapsible>
        
        <SidebarLink 
          to="/dashboard/payment-account" 
          icon={<CreditCard className="h-5 w-5" />}
          onClick={closeSidebar}
        >
          Payment Account
        </SidebarLink>
        
        <SidebarLink 
          to="/dashboard/settings" 
          icon={<Settings className="h-5 w-5" />}
          onClick={closeSidebar}
        >
          Settings
        </SidebarLink>
        
        <SidebarLink 
          to="/dashboard/help" 
          icon={<HelpCircle className="h-5 w-5" />}
          onClick={closeSidebar}
        >
          Help & Support
        </SidebarLink>
      </nav>
    </aside>
  );
  
  return (
    <>
      <MobileSidebarTrigger />
      <SidebarContent />
      
      {/* Overlay for mobile sidebar */}
      {isMobile && isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default DashboardSidebar;
