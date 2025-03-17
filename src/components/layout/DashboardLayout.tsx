
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import { Outlet } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const DashboardLayout = () => {
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>(
    localStorage.getItem('dashboardViewMode') as 'mobile' | 'desktop' || 'mobile'
  );
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(true);
  
  useEffect(() => {
    const handleStorageChange = () => {
      setViewMode(localStorage.getItem('dashboardViewMode') as 'mobile' | 'desktop' || 'mobile');
    };
    
    window.addEventListener('storage', handleStorageChange);
    
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

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar />
      
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
          <DashboardHeader />
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

export default DashboardLayout;
