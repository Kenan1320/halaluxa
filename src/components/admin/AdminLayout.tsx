
import { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { ensureAdminUser } from '@/services/adminService';
import { useToast } from '@/hooks/use-toast';

const AdminLayout = () => {
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>(
    localStorage.getItem('adminViewMode') as 'mobile' | 'desktop' || 'mobile'
  );
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const checkAccess = async () => {
      setLoading(true);
      
      // For development, always grant access
      if (import.meta.env.DEV) {
        setHasAccess(true);
        setLoading(false);
        return;
      }
      
      const adminAccess = await ensureAdminUser();
      setHasAccess(adminAccess);
      
      if (!adminAccess) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the admin area.",
          variant: "destructive"
        });
        navigate('/login');
      }
      
      setLoading(false);
    };
    
    checkAccess();
  }, [navigate, toast]);
  
  useEffect(() => {
    const handleStorageChange = () => {
      setViewMode(localStorage.getItem('adminViewMode') as 'mobile' | 'desktop' || 'mobile');
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    const interval = setInterval(() => {
      const currentViewMode = localStorage.getItem('adminViewMode') as 'mobile' | 'desktop' || 'mobile';
      if (currentViewMode !== viewMode) {
        setViewMode(currentViewMode);
      }
    }, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [viewMode]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle scroll to show/hide header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setHeaderVisible((prevScrollPos > currentScrollPos) || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // In development mode, always render the admin dashboard
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar />
      
      <div className={cn(
        "min-h-screen flex flex-col transition-all duration-300",
        isMobile || viewMode === 'mobile' ? "ml-0" : "ml-64"
      )}>
        <motion.div
          className="sticky top-0 z-30"
          initial={{ y: 0 }}
          animate={{ y: headerVisible ? 0 : -80 }}
          transition={{ duration: 0.3 }}
        >
          <AdminHeader />
        </motion.div>
        
        <motion.main 
          className="flex-1 p-4 md:p-6 transition-all"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default AdminLayout;
