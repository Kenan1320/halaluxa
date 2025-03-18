import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HalviHeader from './HalviHeader';
import Footer from './Footer';
import HomescreenPrompt from '../onboarding/HomescreenPrompt';
import { useIsMobile } from '@/hooks/use-mobile';
import { ComingSoon } from '@/components/ui/ComingSoon';
import AdvancedBottomNav from './AdvancedBottomNav';

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
  const isDashboardOrAdmin = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      {showHeader && !isDashboardOrAdmin && <HalviHeader />}
      {showHeader && isDashboardOrAdmin && <Navbar />}
      
      <main className={`flex-1 ${!isDashboardOrAdmin ? 'pb-24' : ''} md:pb-6`}>
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
      {!isDashboardOrAdmin && <AdvancedBottomNav />}
    </div>
  );
};

export default PageLayout;

const Navbar = () => {
  // This is the original navbar for dashboard/admin pages
  return <div className="bg-[#0F1B44]">
    <nav className="text-white">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left side - Logo and menu */}
          <div className="flex items-center space-x-4">
            <Sheet>
              <SheetTrigger asChild>
                <button className="text-white hover:text-white/80 focus:outline-none">
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] bg-white dark:bg-[#0F1B44] text-black dark:text-white border-r border-gray-200 dark:border-gray-800">
                <SheetHeader>
                  <SheetTitle className="text-black dark:text-white">Halvi</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-6">
                  {/* Dark mode toggle in menu */}
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-[#132054] rounded-lg">
                    <span>Dark Mode</span>
                    <ThemeToggle />
                  </div>
                  
                  <button onClick={() => handleSheetItemClick('/shops')} className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-[#132054] transition-colors text-left">
                    <span className="text-lg">Select Your Shops</span>
                  </button>
                  
                  <button onClick={() => handleSheetItemClick('/explore')} className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-[#132054] transition-colors text-left">
                    <span className="text-lg">Explore</span>
                  </button>
                  
                  <button onClick={() => handleSheetItemClick('/digital-mall')} className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-[#132054] transition-colors text-left">
                    <span className="text-lg">Digital Mall</span>
                  </button>
                  
                  <button onClick={() => handleSheetItemClick('/nearby')} className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-[#132054] transition-colors text-left">
                    <span className="text-lg">Nearby Shops</span>
                  </button>
                  
                  <button onClick={() => handleSheetItemClick('/admin')} className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-[#132054] transition-colors text-left text-purple-600 dark:text-purple-400">
                    <span className="text-lg">Admin Portal</span>
                  </button>
                  
                  {/* Guest sign in options */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                    <h3 className="px-4 text-sm font-medium mb-2">Quick Access Options:</h3>
                    <button onClick={() => handleGuestAccess('business')} className="flex items-center w-full px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#132054] transition-colors text-blue-600 dark:text-blue-400 text-left">
                      <span>Business Dashboard (Guest)</span>
                    </button>
                    <button onClick={() => handleGuestAccess('admin')} className="flex items-center w-full px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#132054] transition-colors text-purple-600 dark:text-purple-400 text-left">
                      <span>Admin Portal (Guest)</span>
                    </button>
                    <button onClick={() => handleGuestAccess('shopper')} className="flex items-center w-full px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#132054] transition-colors text-green-600 dark:text-green-400 text-left">
                      <span>Shop as Guest</span>
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            <Link to="/" className="flex items-center">
              <div className="relative">
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-white font-serif relative z-10 tracking-wide">
                  Halvi<span className="text-orange-400 absolute -right-2.5 top-0">.</span>
                </span>
                <div className="absolute -inset-1 blur-sm bg-gradient-to-r from-transparent via-blue-400/20 to-transparent opacity-50 rounded-full"></div>
              </div>
            </Link>
          </div>
          
          {/* Center - Location */}
          <div className="hidden md:flex items-center">
            <button className="flex items-center text-white hover:text-white/80">
              <MapPin className="h-5 w-5 mr-1" />
              <span className="text-sm">New York</span>
              <ChevronDown className="h-4 w-4 ml-1" />
            </button>
          </div>

          {/* Right side - Main Shop, Cart and Auth */}
          <div className="flex items-center space-x-4">
            {/* Dark mode toggle button */}
            <ThemeToggle className="hidden md:flex" />
            
            {/* Main Shop - Don't auto-select, show empty shop icon with red pulse */}
            <Link 
              to="/shops"
              className="relative flex items-center justify-center"
            >
              {currentShop ? (
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
                  {currentShop.logo || currentShop.cover_image ? (
                    <img 
                      src={currentShop.logo || currentShop.cover_image} 
                      alt={currentShop.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold">
                      {currentShop.name.charAt(0)}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center relative">
                  <Store className="h-6 w-6 text-gray-700" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></span>
                </div>
              )}
            </Link>
            
            {/* Cart icon with orange background */}
            <Link 
              to="/cart" 
              className="relative flex items-center justify-center w-10 h-10 bg-orange-500 rounded-full text-white hover:bg-orange-600 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">3</span>
            </Link>
            
            {isAuthenticated ? (
              <Link to="/profile" className="flex items-center justify-center">
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                  {user && user.avatar_url ? (
                    <Avatar className="h-10 w-10 border border-white/20">
                      <AvatarImage src={user.avatar_url} alt={user.name || 'Avatar'} />
                      <AvatarFallback>{user.name?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <User className="h-6 w-6 text-white" />
                  )}
                </div>
              </Link>
            ) : (
              <Link 
                to="/login"
                className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white"
              >
                <User className="h-6 w-6" />
              </Link>
            )}
          </div>
        </div>
      </nav>
  </div>;
};
