
import { useEffect, useState } from 'react';
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
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      
      // Make header visible when scrolling up or at the top
      setVisible((prevScrollPos > currentScrollPos) || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      {/* Header - appears on scroll up or at top */}
      {showHeader && (
        <AnimatePresence>
          {visible && (
            <motion.div 
              className="sticky top-0 z-50"
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Navbar />
            </motion.div>
          )}
        </AnimatePresence>
      )}
      
      {/* Page content */}
      <main className="flex-1 pt-2 md:pt-4 pb-24 md:pb-6">
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
      
      {/* Footer (hidden on mobile) */}
      {showFooter && !isMobile && <Footer />}
    </div>
  );
};

export default PageLayout;
