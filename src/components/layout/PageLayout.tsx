
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import BottomNavigation from './BottomNavigation';
import { useIsMobile } from '@/hooks/use-mobile';

interface PageLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
  showHeader?: boolean;
}

const PageLayout = ({ 
  children, 
  showFooter = true,
  showHeader = true
}: PageLayoutProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      {/* Header directly connected to content */}
      {showHeader && (
        <div className="sticky top-0 z-50">
          <Navbar />
        </div>
      )}
      
      {/* Main content area - no top padding */}
      <main className="flex-1 pb-24 md:pb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={window.location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      
      {/* Only use the Advanced Bottom Navigation, not both */}
      {/* Footer (hidden on mobile) */}
      {showFooter && !isMobile && <Footer />}
    </div>
  );
};

export default PageLayout;
