
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import HomescreenPrompt from '../onboarding/HomescreenPrompt';
import { useIsMobile } from '@/hooks/use-mobile';
import { ComingSoon } from '@/components/ui/ComingSoon';

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
  
  const isPageUnderConstruction = (pathname: string) => {
    const incompletePaths = [
      '/services', 
      '/dashboard/analytics', 
      '/become-seller', 
      '/help',
      '/settings/account',
      '/settings/orders',
      '/settings/security'
    ];
    return incompletePaths.some(path => pathname === path);
  };
  
  const pathname = window.location.pathname;
  const isIncomplete = isPageUnderConstruction(pathname);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      {showHeader && <Navbar />}
      
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
            {isIncomplete ? (
              <ComingSoon 
                title={`${pathname.substring(1).charAt(0).toUpperCase() + pathname.substring(1).slice(1).replace('/', ' ')} Coming Soon`}
                description="We're working hard to bring you this feature. Check back soon!"
                showHomeButton={true}
              />
            ) : (
              children
            )}
          </motion.div>
        </AnimatePresence>
      </main>
      
      <HomescreenPrompt />
      
      {showFooter && <Footer />}
    </div>
  );
};

export default PageLayout;
