
import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { getCurrentUserShop } from '@/services/shopService';
import { Shop } from '@/models/shop';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import { Menu } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DashboardLayout = () => {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [shop, setShop] = useState<Shop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  useEffect(() => {
    const fetchShopData = async () => {
      if (!isLoggedIn || !user) {
        navigate('/business/login');
        return;
      }
      
      try {
        const shopData = await getCurrentUserShop();
        if (!shopData) {
          navigate('/business/create-shop');
          return;
        }
        
        setShop(shopData);
      } catch (error) {
        console.error('Error fetching shop data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load shop data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchShopData();
  }, [isLoggedIn, user, navigate, toast]);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!shop) {
    return null; // Will redirect in the useEffect
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar */}
      <AnimatePresence>
        <motion.div
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transition-all lg:relative lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
          initial={{ x: '-100%' }}
          animate={{ x: sidebarOpen ? 0 : '-100%' }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', stiffness: 400, damping: 40 }}
        >
          <DashboardSidebar shop={shop} onClose={() => setSidebarOpen(false)} />
        </motion.div>
      </AnimatePresence>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader toggleSidebar={toggleSidebar} shop={shop} />
        
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet context={{ shop }} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
