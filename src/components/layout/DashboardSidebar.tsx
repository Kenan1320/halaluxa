
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Package, ShoppingBag, Users, Settings, 
  ChevronDown, CreditCard, BarChart, HelpCircle, PieChart,
  Menu, X, Smartphone, Monitor, LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  end?: boolean;
  onClick?: () => void;
}

const SidebarLink = ({ to, icon, children, end = false, onClick }: SidebarLinkProps) => {
  const { mode } = useTheme();
  
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) => cn(
        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300',
        isActive 
          ? mode === 'dark'
            ? 'bg-gradient-to-r from-[#1A237E]/90 to-[#1A237E]/60 text-white shadow-md'
            : 'bg-gradient-to-r from-[#3949AB]/20 to-[#3949AB]/5 text-[#1A237E] shadow-sm border border-[#1A237E]/10' 
          : mode === 'dark'
            ? 'text-gray-300 hover:bg-gray-800/70 hover:text-white'
            : 'text-gray-700 hover:bg-[#0F1B44]/5 hover:text-[#0F1B44]'
      )}
    >
      <div className={cn(
        "flex items-center justify-center w-6 h-6 transition-all",
        mode === 'dark' ? 'text-blue-300' : 'text-[#3949AB]'
      )}>
        {icon}
      </div>
      <span className="flex-1">{children}</span>
    </NavLink>
  );
};

const DashboardSidebar = () => {
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>(
    localStorage.getItem('dashboardViewMode') as 'mobile' | 'desktop' || 'mobile'
  );
  
  const isMobile = useIsMobile();
  const { mode, toggleMode } = useTheme();
  const isGuest = sessionStorage.getItem('isGuestBusinessUser') === 'true';
  const guestUsername = sessionStorage.getItem('guestBusinessUsername');
  
  useEffect(() => {
    return () => {
      if (isMobile) {
        setIsMobileSidebarOpen(false);
      }
    };
  }, [isMobile]);
  
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
  
  const handleExitGuestMode = () => {
    sessionStorage.removeItem('isGuestBusinessUser');
    sessionStorage.removeItem('guestBusinessUsername');
    window.location.href = '/'; // Redirect to home page
  };
  
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
  
  const SidebarContent = () => (
    <aside className={cn(
      "transition-all duration-300 ease-in-out overflow-y-auto",
      mode === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100',
      "border-r",
      isMobile ? (
        isMobileSidebarOpen 
          ? "fixed inset-y-0 left-0 w-[280px] z-50 shadow-xl" 
          : "fixed inset-y-0 -left-[280px] w-[280px] z-50"
      ) : "w-[280px] h-screen fixed"
    )}>
      <div className={cn(
        "p-4 flex items-center justify-between border-b",
        mode === 'dark' ? 'border-gray-800' : 'border-gray-100'
      )}>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <span className={cn(
              "text-xl font-serif font-bold",
              mode === 'dark' ? 'text-white' : 'text-[#0F1B44]'
            )}>Haluna</span>
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
            onClick={toggleMode}
            title={mode === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
            className={cn(
              mode === 'dark' ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-[#0F1B44] hover:bg-gray-100'
            )}
          >
            {mode === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleViewMode}
            title={viewMode === 'mobile' ? "Switch to desktop view" : "Switch to mobile view"}
            className={cn(
              mode === 'dark' ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-[#0F1B44] hover:bg-gray-100'
            )}
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
              className={cn(
                "md:hidden",
                mode === 'dark' ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-[#0F1B44] hover:bg-gray-100'
              )}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
      
      {isGuest && (
        <div className={cn(
          "mx-3 my-3 p-3 rounded-lg text-sm",
          mode === 'dark' ? 'bg-amber-900/20 text-amber-300' : 'bg-amber-50 text-amber-700'
        )}>
          <p className="font-medium">Guest Mode: {guestUsername}</p>
          <p className="text-xs mt-1 opacity-80">Your changes will be saved for this session only.</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExitGuestMode}
            className={cn(
              "mt-2 w-full justify-center text-xs font-medium gap-1",
              mode === 'dark' ? 'hover:bg-amber-900/30 text-amber-300' : 'hover:bg-amber-100/70 text-amber-700'
            )}
          >
            <LogOut className="h-3.5 w-3.5" />
            Exit Guest Mode
          </Button>
        </div>
      )}
      
      <nav className={cn(
        "px-3 py-4 space-y-1.5",
        mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
      )}>
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
              className={cn(
                "w-full justify-between px-3 py-2 h-auto rounded-lg text-sm font-medium",
                mode === 'dark' 
                  ? 'text-gray-300 hover:bg-gray-800/70 hover:text-white' 
                  : 'text-gray-700 hover:bg-[#0F1B44]/5 hover:text-[#0F1B44]'
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex items-center justify-center w-6 h-6 transition-all",
                  mode === 'dark' ? 'text-blue-300' : 'text-[#3949AB]'
                )}>
                  <Package className="h-5 w-5" />
                </div>
                <span>Products</span>
              </div>
              <ChevronDown 
                className={cn(
                  "h-4 w-4 transition-transform duration-300", 
                  isProductsOpen && "transform rotate-180"
                )} 
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-9 space-y-1 animate-slideDown">
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
              className={cn(
                "w-full justify-between px-3 py-2 h-auto rounded-lg text-sm font-medium",
                mode === 'dark' 
                  ? 'text-gray-300 hover:bg-gray-800/70 hover:text-white' 
                  : 'text-gray-700 hover:bg-[#0F1B44]/5 hover:text-[#0F1B44]'
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex items-center justify-center w-6 h-6 transition-all",
                  mode === 'dark' ? 'text-blue-300' : 'text-[#3949AB]'
                )}>
                  <BarChart className="h-5 w-5" />
                </div>
                <span>Analytics</span>
              </div>
              <ChevronDown 
                className={cn(
                  "h-4 w-4 transition-transform duration-300", 
                  isAnalyticsOpen && "transform rotate-180"
                )} 
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-9 space-y-1 animate-slideDown">
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
      
      <div className={cn(
        "mt-auto p-4 border-t",
        mode === 'dark' ? 'border-gray-800' : 'border-gray-100'
      )}>
        <div className={cn(
          "rounded-lg p-3",
          mode === 'dark' ? 'bg-gray-800' : 'bg-[#0F1B44]/5'
        )}>
          <p className={cn(
            "text-xs font-medium",
            mode === 'dark' ? 'text-gray-300' : 'text-gray-700'
          )}>
            Need help with your shop?
          </p>
          <p className={cn(
            "text-xs mt-1 mb-2",
            mode === 'dark' ? 'text-gray-400' : 'text-gray-500'
          )}>
            Our support team is ready to assist you.
          </p>
          <Button
            size="sm"
            className={cn(
              "w-full text-xs font-medium rounded-md text-white",
              mode === 'dark' 
                ? 'bg-gradient-to-r from-[#1A237E] to-[#283593] hover:from-[#1A237E]/90 hover:to-[#283593]/90' 
                : 'bg-gradient-to-r from-[#0F1B44] to-[#3949AB] hover:from-[#0F1B44]/90 hover:to-[#3949AB]/90'
            )}
          >
            Contact Support
          </Button>
        </div>
      </div>
    </aside>
  );
  
  return (
    <>
      <MobileSidebarTrigger />
      <SidebarContent />
      
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
