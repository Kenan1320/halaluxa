
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Menu, X, Bell, Search, ChevronDown, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardHeaderProps {
  toggleSidebar: () => void;
}

const DashboardHeader = ({ toggleSidebar }: DashboardHeaderProps) => {
  const { user, businessProfile, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-white border-b border-gray-200 z-30 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center">
        {/* Mobile menu toggle */}
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2 md:hidden">
          <Menu size={24} />
        </Button>

        {/* Logo and shop name */}
        <div className="flex items-center">
          <Link to="/dashboard" className="flex items-center">
            <img src="/logo-base.svg" alt="Haluna" className="h-8 w-8 mr-2" />
            <span className="font-semibold text-lg text-haluna-primary hidden md:inline">
              {businessProfile?.shopName || "Dashboard"}
            </span>
          </Link>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Search Bar */}
        <div className="hidden md:flex relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 rounded-full bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-haluna-primary focus:bg-white w-64"
          />
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
        </Button>

        {/* User Menu */}
        <div className="relative flex items-center">
          <Button variant="ghost" className="flex items-center space-x-2 p-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-haluna-primary to-purple-600 flex items-center justify-center text-white">
              {user?.avatar ? (
                <img src={user.avatar} alt={user?.name || 'User'} className="w-full h-full rounded-full object-cover" />
              ) : (
                <User size={16} />
              )}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500">{businessProfile?.shopName || 'Business'}</p>
            </div>
            <ChevronDown size={16} className="hidden md:block" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
