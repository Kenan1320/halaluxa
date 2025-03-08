
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { getCurrentUserShop } from '@/services/shopService';
import { Shop } from '@/models/shop';

const DashboardLayout = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>(
    localStorage.getItem('dashboardViewMode') as 'mobile' | 'desktop' || 'desktop'
  );
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [currentShop, setCurrentShop] = useState<Shop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch current user's shop
  useEffect(() => {
    const fetchShop = async () => {
      setIsLoading(true);
      const shop = await getCurrentUserShop();
      setCurrentShop(shop);
      setIsLoading(false);
    };
    
    fetchShop();
  }, []);
  
  useEffect(() => {
    // Save sidebar state to localStorage
    localStorage.setItem('dashboardViewMode', viewMode);
  }, [viewMode]);
  
  useEffect(() => {
    // Close sidebar on mobile when navigating
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);
  
  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
    setViewMode(prev => prev === 'mobile' ? 'desktop' : 'mobile');
  };
  
  useEffect(() => {
    // Update sidebar state based on screen size
    if (isMobile && viewMode === 'desktop') {
      setViewMode('mobile');
      setSidebarOpen(false);
    }
  }, [isMobile, viewMode]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="h-12 w-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.div
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn(
              "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200",
              isMobile ? "md:relative" : "relative"
            )}
          >
            <DashboardSidebar shop={currentShop} onClose={() => setSidebarOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main content */}
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300",
        sidebarOpen ? (isMobile ? "ml-0" : "ml-64") : "ml-0"
      )}>
        <DashboardHeader 
          toggleSidebar={toggleSidebar} 
          sidebarOpen={sidebarOpen}
          shop={currentShop}
        />
        
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto"
          >
            <Outlet context={{ shop: currentShop }} />
          </motion.div>
        </main>
      </div>
      
      {/* Mobile overlay for sidebar */}
      {sidebarOpen && isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
