
import { Bell, Search, LogOut, Settings, User } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const DashboardHeader = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();

  return (
    <header className="border-b bg-white p-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4 w-full max-w-md">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-haluna-text-light" />
          </div>
          <input
            type="text"
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary transition"
            placeholder="Search products, orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <button className="relative p-2 rounded-full hover:bg-haluna-primary-light transition-colors">
              <Bell className="h-5 w-5 text-haluna-text" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-haluna-primary rounded-full"></span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0">
            <div className="p-3 border-b font-medium">Notifications</div>
            <div className="max-h-80 overflow-y-auto">
              <div className="p-4 text-center text-haluna-text-light">
                No new notifications
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <Popover>
          <PopoverTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-haluna-primary to-emerald-600 flex items-center justify-center text-white shadow-sm">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-medium">{user?.name || 'Business Owner'}</div>
                <div className="text-xs text-haluna-text-light">Business Owner</div>
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-0" align="end">
            <div className="p-3 border-b">
              <p className="font-medium">{user?.name}</p>
              <p className="text-xs text-haluna-text-light">{user?.email}</p>
            </div>
            <div className="p-2">
              <Link to="/dashboard/settings" className="flex items-center gap-2 w-full text-left p-2 rounded-md hover:bg-haluna-primary-light">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
              <Link to="/dashboard/profile" className="flex items-center gap-2 w-full text-left p-2 rounded-md hover:bg-haluna-primary-light">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
              <button 
                onClick={logout}
                className="flex items-center gap-2 w-full text-left p-2 rounded-md hover:bg-red-50 text-red-500"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};

export default DashboardHeader;
