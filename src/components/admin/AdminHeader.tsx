
import { Bell, Search, LogOut, Settings, User, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const AdminHeader = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: 'Logout failed',
        description: 'There was an error logging out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <header className="border-b bg-white dark:bg-gray-900 p-4 flex items-center justify-between shadow-sm dark:border-gray-800">
      <div className="flex items-center gap-4 w-full max-w-md">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            placeholder="Search users, shops, products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/admin/analytics')}
          className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
        >
          <BarChart3 className="h-5 w-5" />
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-violet-500 rounded-full"></span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-3 border-b font-medium dark:border-gray-700">Notifications</div>
            <div className="max-h-80 overflow-y-auto">
              <div className="p-4 border-b dark:border-gray-700">
                <div className="text-sm font-medium">New shop approval request</div>
                <div className="text-xs text-gray-500 mt-1">Halal Meats Shop has requested approval</div>
                <div className="text-xs text-gray-400 mt-1">2 minutes ago</div>
              </div>
              <div className="p-4 border-b dark:border-gray-700">
                <div className="text-sm font-medium">System update completed</div>
                <div className="text-xs text-gray-500 mt-1">The system update has been successfully installed</div>
                <div className="text-xs text-gray-400 mt-1">1 hour ago</div>
              </div>
              <div className="p-4">
                <div className="text-sm font-medium">New user registered</div>
                <div className="text-xs text-gray-500 mt-1">john.doe@example.com has created an account</div>
                <div className="text-xs text-gray-400 mt-1">Yesterday at 3:45 PM</div>
              </div>
            </div>
            <div className="p-2 border-t dark:border-gray-700">
              <Button variant="ghost" size="sm" className="w-full justify-center text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-900/20">
                View all notifications
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        
        <Popover>
          <PopoverTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center text-white shadow-sm">
                A
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-medium dark:text-white">Admin</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Super Admin</div>
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-0" align="end">
            <div className="p-3 border-b dark:border-gray-700">
              <p className="font-medium dark:text-white">Administrator</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">admin@halvi.com</p>
            </div>
            <div className="p-2">
              <Button variant="ghost" size="sm" className="flex items-center gap-2 w-full text-left p-2 rounded-md hover:bg-violet-50 dark:hover:bg-violet-900/20">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-2 w-full text-left p-2 rounded-md hover:bg-violet-50 dark:hover:bg-violet-900/20">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Button>
              <Button 
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2 w-full text-left p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};

export default AdminHeader;
