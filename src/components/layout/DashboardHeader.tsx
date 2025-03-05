
import { Bell, Search } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const DashboardHeader = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();

  return (
    <header className="border-b bg-white p-4 flex items-center justify-between">
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
        <button className="relative p-2 rounded-full hover:bg-haluna-primary-light">
          <Bell className="h-5 w-5 text-haluna-text" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-haluna-primary rounded-full"></span>
        </button>
        <div className="relative group">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-haluna-primary flex items-center justify-center text-white">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-medium">{user?.name || 'Business Owner'}</div>
              <div className="text-xs text-haluna-text-light">Business Owner</div>
            </div>
          </div>
          
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
            <div className="p-3 border-b">
              <p className="font-medium">{user?.name}</p>
              <p className="text-xs text-haluna-text-light">{user?.email}</p>
            </div>
            <div className="p-2">
              <button 
                onClick={logout}
                className="w-full text-left p-2 rounded-md flex items-center hover:bg-haluna-primary-light text-red-500"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
