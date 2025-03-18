import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingBag, Users, Settings, 
  ChevronDown, CreditCard, BarChart, HelpCircle,
  Menu, X, Smartphone, Monitor, LogOut, Store,
  Package, Lock, Bell, Eye, FileText, Clipboard,
  UserPlus, ShieldAlert, Activity, Shield, Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/context/ThemeContext';
import { getAdminRole } from '@/services/adminService';

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
            ? 'bg-gradient-to-r from-violet-900/90 to-violet-900/60 text-white shadow-md'
            : 'bg-gradient-to-r from-violet-500/20 to-violet-500/5 text-violet-900 shadow-sm border border-violet-900/10' 
          : mode === 'dark'
            ? 'text-gray-300 hover:bg-gray-800/70 hover:text-white'
            : 'text-gray-700 hover:bg-violet-900/5 hover:text-violet-900'
      )}
    >
      <div className={cn(
        "flex items-center justify-center w-6 h-6 transition-all",
        mode === 'dark' ? 'text-violet-300' : 'text-violet-700'
      )}>
        {icon}
      </div>
      <span className="flex-1">{children}</span>
    </NavLink>
  );
};

const AdminSidebar = () => {
  const [isShopsOpen, setIsShopsOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isUsersOpen, setIsUsersOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>(
    localStorage.getItem('adminViewMode') as 'mobile' | 'desktop' || 'mobile'
  );
  const [adminRole, setAdminRole] = useState<string | null>(null);
  
  const isMobile = useIsMobile();
  const { mode, toggleMode } = useTheme();
  
  useEffect(() => {
    const fetchRole = async () => {
      const role = await getAdminRole();
      setAdminRole(role);
    };
    
    fetchRole();
  }, []);
  
  useEffect(() => {
    return () => {
      if (isMobile) {
        setIsMobileSidebarOpen(false);
      }
    };
  }, [isMobile]);
  
  useEffect(() => {
    localStorage.setItem('adminViewMode', viewMode);
  }, [viewMode]);
  
  const toggleViewMode = () => {
    setViewMode(prev => prev === 'mobile' ? 'desktop' : 'mobile');
  };
  
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
  
  const MobileSidebarTrigger = () => (
    <Button
      variant="outline" 
      size="icon"
      onClick={() => setIsMobileSidebarOpen(true)}
      className="fixed top-16 left-4 z-50 rounded-full shadow-md bg-white dark:bg-gray-800 md:hidden"
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
              mode === 'dark' ? 'text-white' : 'text-violet-900'
            )}>Admin Portal</span>
            <div className="relative ml-1">
              <div className="w-5 h-5 bg-gradient-to-br from-purple-400 to-violet-500 rounded-full shadow-sm"></div>
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
              mode === 'dark' ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-violet-900 hover:bg-gray-100'
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
              mode === 'dark' ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-violet-900 hover:bg-gray-100'
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
                mode === 'dark' ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-violet-900 hover:bg-gray-100'
              )}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
      
      <div className={cn(
        "mx-3 my-3 p-3 rounded-lg text-sm",
        mode === 'dark' ? 'bg-purple-900/20 text-purple-300' : 'bg-purple-50 text-purple-700'
      )}>
        <p className="font-medium">Admin Role: {adminRole || 'Loading...'}</p>
        <p className="text-xs mt-1 opacity-80">You have full system access</p>
      </div>
      
      <nav className={cn(
        "px-3 py-4 space-y-1.5",
        mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
      )}>
        <SidebarLink 
          to="/admin" 
          icon={<LayoutDashboard className="h-5 w-5" />} 
          end
          onClick={closeSidebar}
        >
          Dashboard
        </SidebarLink>
        
        <Collapsible 
          open={isShopsOpen} 
          onOpenChange={setIsShopsOpen}
          className="space-y-1.5"
        >
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-between px-3 py-2 h-auto rounded-lg text-sm font-medium",
                mode === 'dark' 
                  ? 'text-gray-300 hover:bg-gray-800/70 hover:text-white' 
                  : 'text-gray-700 hover:bg-violet-900/5 hover:text-violet-900'
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex items-center justify-center w-6 h-6 transition-all",
                  mode === 'dark' ? 'text-violet-300' : 'text-violet-700'
                )}>
                  <Store className="h-5 w-5" />
                </div>
                <span>Shops</span>
              </div>
              <ChevronDown 
                className={cn(
                  "h-4 w-4 transition-transform duration-300", 
                  isShopsOpen && "transform rotate-180"
                )} 
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-9 space-y-1 animate-slideDown">
            <SidebarLink 
              to="/admin/shops" 
              icon={<Store className="h-4 w-4" />}
              onClick={closeSidebar}
            >
              All Shops
            </SidebarLink>
            <SidebarLink 
              to="/admin/shops/pending" 
              icon={<Clock className="h-4 w-4" />}
              onClick={closeSidebar}
            >
              Pending Approval
            </SidebarLink>
            <SidebarLink 
              to="/admin/shops/create" 
              icon={<UserPlus className="h-4 w-4" />}
              onClick={closeSidebar}
            >
              Create Shop
            </SidebarLink>
          </CollapsibleContent>
        </Collapsible>
        
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
                  : 'text-gray-700 hover:bg-violet-900/5 hover:text-violet-900'
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex items-center justify-center w-6 h-6 transition-all",
                  mode === 'dark' ? 'text-violet-300' : 'text-violet-700'
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
              to="/admin/products" 
              icon={<Package className="h-4 w-4" />}
              onClick={closeSidebar}
            >
              All Products
            </SidebarLink>
            <SidebarLink 
              to="/admin/products/moderation" 
              icon={<ShieldAlert className="h-4 w-4" />}
              onClick={closeSidebar}
            >
              Needs Moderation
            </SidebarLink>
          </CollapsibleContent>
        </Collapsible>
        
        <Collapsible 
          open={isUsersOpen} 
          onOpenChange={setIsUsersOpen}
          className="space-y-1.5"
        >
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-between px-3 py-2 h-auto rounded-lg text-sm font-medium",
                mode === 'dark' 
                  ? 'text-gray-300 hover:bg-gray-800/70 hover:text-white' 
                  : 'text-gray-700 hover:bg-violet-900/5 hover:text-violet-900'
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex items-center justify-center w-6 h-6 transition-all",
                  mode === 'dark' ? 'text-violet-300' : 'text-violet-700'
                )}>
                  <Users className="h-5 w-5" />
                </div>
                <span>Users</span>
              </div>
              <ChevronDown 
                className={cn(
                  "h-4 w-4 transition-transform duration-300", 
                  isUsersOpen && "transform rotate-180"
                )} 
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-9 space-y-1 animate-slideDown">
            <SidebarLink 
              to="/admin/users" 
              icon={<Users className="h-4 w-4" />}
              onClick={closeSidebar}
            >
              All Users
            </SidebarLink>
            <SidebarLink 
              to="/admin/users/business" 
              icon={<Store className="h-4 w-4" />}
              onClick={closeSidebar}
            >
              Business Owners
            </SidebarLink>
            <SidebarLink 
              to="/admin/users/shoppers" 
              icon={<ShoppingBag className="h-4 w-4" />}
              onClick={closeSidebar}
            >
              Shoppers
            </SidebarLink>
          </CollapsibleContent>
        </Collapsible>
        
        <SidebarLink 
          to="/admin/orders" 
          icon={<ShoppingBag className="h-5 w-5" />}
          onClick={closeSidebar}
        >
          Orders
        </SidebarLink>
        
        <SidebarLink 
          to="/admin/notifications" 
          icon={<Bell className="h-5 w-5" />}
          onClick={closeSidebar}
        >
          Notifications
        </SidebarLink>
        
        <SidebarLink 
          to="/admin/analytics" 
          icon={<BarChart className="h-5 w-5" />}
          onClick={closeSidebar}
        >
          Analytics
        </SidebarLink>
        
        <SidebarLink 
          to="/admin/permissions" 
          icon={<Lock className="h-5 w-5" />}
          onClick={closeSidebar}
        >
          Access Control
        </SidebarLink>
        
        <SidebarLink 
          to="/admin/reports" 
          icon={<FileText className="h-5 w-5" />}
          onClick={closeSidebar}
        >
          Reports
        </SidebarLink>
        
        <SidebarLink 
          to="/admin/activity" 
          icon={<Activity className="h-5 w-5" />}
          onClick={closeSidebar}
        >
          Activity Log
        </SidebarLink>
        
        <SidebarLink 
          to="/admin/settings" 
          icon={<Settings className="h-5 w-5" />}
          onClick={closeSidebar}
        >
          Settings
        </SidebarLink>
      </nav>
      
      <div className={cn(
        "mt-auto p-4 border-t",
        mode === 'dark' ? 'border-gray-800' : 'border-gray-100'
      )}>
        <div className={cn(
          "rounded-lg p-3",
          mode === 'dark' ? 'bg-gray-800' : 'bg-violet-50'
        )}>
          <p className={cn(
            "text-xs font-medium",
            mode === 'dark' ? 'text-gray-300' : 'text-gray-700'
          )}>
            Admin Support
          </p>
          <p className={cn(
            "text-xs mt-1 mb-2",
            mode === 'dark' ? 'text-gray-400' : 'text-gray-500'
          )}>
            Need technical assistance?
          </p>
          <Button
            size="sm"
            className={cn(
              "w-full text-xs font-medium rounded-md text-white",
              mode === 'dark' 
                ? 'bg-gradient-to-r from-violet-800 to-purple-700 hover:from-violet-800/90 hover:to-purple-700/90' 
                : 'bg-gradient-to-r from-violet-800 to-purple-600 hover:from-violet-800/90 hover:to-purple-600/90'
            )}
          >
            Contact IT Support
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

export default AdminSidebar;
