
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import { Outlet } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const DashboardLayout = () => {
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>(
    localStorage.getItem('dashboardViewMode') as 'mobile' | 'desktop' || 'mobile'
  );
  
  // Check for view mode changes
  useEffect(() => {
    const handleStorageChange = () => {
      setViewMode(localStorage.getItem('dashboardViewMode') as 'mobile' | 'desktop' || 'mobile');
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also poll for changes since localStorage events don't fire in the same window
    const interval = setInterval(() => {
      const currentViewMode = localStorage.getItem('dashboardViewMode') as 'mobile' | 'desktop' || 'mobile';
      if (currentViewMode !== viewMode) {
        setViewMode(currentViewMode);
      }
    }, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [viewMode]);
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar />
      
      <div className={cn(
        "min-h-screen flex flex-col transition-all duration-300",
        isMobile || viewMode === 'mobile' ? "ml-0" : "ml-64"
      )}>
        <DashboardHeader />
        
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

export default DashboardLayout;
