
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Settings, User, Menu, X, LogOut, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getAdminRole } from '@/services/adminService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/context/ThemeContext';

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const { mode } = useTheme();

  useEffect(() => {
    const fetchRole = async () => {
      const adminRole = await getAdminRole();
      setRole(adminRole);
    };

    fetchRole();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className={cn(
      "p-4 border-b flex items-center justify-between",
      mode === 'dark' ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-100'
    )}>
      <div className="flex items-center">
        <div className="flex items-center gap-1">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar_url || undefined} alt={user?.name || 'Admin'} />
            <AvatarFallback className="bg-violet-700 text-white">
              {user?.name?.charAt(0) || 'A'}
            </AvatarFallback>
          </Avatar>
          
          <div className="ml-2">
            <p className="text-sm font-medium">{user?.name || 'Admin'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {role ? `${role.charAt(0).toUpperCase() + role.slice(1)}` : 'Loading...'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-md mx-auto px-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className={cn(
              "w-full pl-10 pr-4 py-2 rounded-lg text-sm",
              mode === 'dark' 
                ? 'bg-gray-800 border-gray-700 text-white focus:border-violet-500 focus:ring-violet-500' 
                : 'bg-gray-50 border-gray-200 focus:border-violet-500 focus:ring-violet-500'
            )}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-2">
              <h3 className="font-medium text-lg">Notifications</h3>
              <div className="divide-y">
                <div className="py-2">
                  <p className="text-sm">No new notifications</p>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/admin/settings')}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/admin/profile')}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-500" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AdminHeader;
