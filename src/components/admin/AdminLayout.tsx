
import React, { useState, ReactNode } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AdminLayoutProps {
  children?: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Toggle sidebar expansion
  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  // Check if we are in a guest session
  const isGuestSession = sessionStorage.getItem('isGuestBusinessUser') === 'true' &&
                          sessionStorage.getItem('guestRole') === 'admin';

  // If not authenticated and not in guest mode, redirect to login
  React.useEffect(() => {
    if (!isLoading && !user && !isGuestSession) {
      toast({
        title: "Access restricted",
        description: "You need to login to access the admin portal",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [user, isLoading, navigate, toast, isGuestSession]);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <AdminSidebar 
        expanded={sidebarExpanded} 
        onExpand={toggleSidebar}
      />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        
        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-6">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
