
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar />
      
      <div className="ml-64 min-h-screen flex flex-col">
        <DashboardHeader />
        
        <motion.main 
          className="flex-1 p-6 transition-all"
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
