
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bell, Menu, X, Settings, Search, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getAdminUser } from '@/services/adminService';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const AdminHeader = () => {
  const [admin, setAdmin] = useState<any>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadAdmin = async () => {
      const adminData = await getAdminUser();
      setAdmin(adminData);
    };
    
    loadAdmin();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    toast({
      title: "Logged out",
      description: "You have been logged out of the admin portal",
    });
  };

  return (
    <header className="bg-haluna-primary/95 backdrop-blur-sm border-b border-white/10 sticky top-0 z-30 shadow-md">
      <div className="px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            className="lg:hidden text-white hover:bg-white/20"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
          
          <Link to="/admin" className="flex items-center">
            <h1 className="text-xl font-bold tracking-tight text-white">
              <span className="hidden md:inline">Haluna</span> 
              <span className="font-light ml-1">Admin</span>
            </h1>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center max-w-md flex-1 mx-6">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/50" />
            <Input 
              type="search" 
              placeholder="Search..." 
              className="pl-8 bg-white/10 border-white/10 text-white placeholder:text-white/50 focus-visible:ring-white/30"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="relative text-white hover:bg-white/20"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="py-2 px-4 text-sm text-gray-500">
                No new notifications
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/admin/settings" className="flex w-full">Admin Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/admin/permissions" className="flex w-full">User Permissions</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="gap-2 text-white hover:bg-white/20"
              >
                <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                  {user?.avatar_url ? (
                    <img 
                      src={user.avatar_url} 
                      alt={user?.name || 'User'} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </div>
                <span className="hidden md:inline text-sm font-medium">
                  {admin?.role === 'super_admin' ? 'Super Admin' : 
                   admin?.role === 'admin' ? 'Admin' : 
                   admin?.role === 'moderator' ? 'Moderator' : 'Administrator'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {user?.name || 'Administrator'}
                <div className="text-xs font-normal text-gray-500">
                  {user?.email || admin?.role || 'Administrator'}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/profile" className="flex w-full">My Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Mobile search bar (only visible on small screens) */}
      <div className={cn(
        "md:hidden px-4 pb-3", 
        showMobileMenu ? "block" : "hidden"
      )}>
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/50" />
          <Input 
            type="search" 
            placeholder="Search..." 
            className="pl-8 bg-white/10 border-white/10 text-white placeholder:text-white/50 focus-visible:ring-white/30"
          />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
