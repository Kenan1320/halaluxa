
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Store, 
  MapPin, 
  TrendingUp, 
  Search, 
  Truck, 
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface NavButton {
  id: string;
  label: string;
  icon: JSX.Element;
  path: string;
  isNew?: boolean;
}

const ScrollableNavigation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [showLoader, setShowLoader] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const navButtons: NavButton[] = [
    {
      id: 'your-shops',
      label: 'Your Shops',
      icon: <Store className="h-4 w-4" />,
      path: '/select-shops'
    },
    {
      id: 'nearby',
      label: 'Nearby',
      icon: <MapPin className="h-4 w-4" />,
      path: '/nearby',
      isNew: true
    },
    {
      id: 'trending-online',
      label: 'Trending Online',
      icon: <TrendingUp className="h-4 w-4" />,
      path: '/trending',
      isNew: true
    },
    {
      id: 'popular-searches',
      label: 'Popular Searches',
      icon: <Search className="h-4 w-4" />,
      path: '/popular-searches',
      isNew: true
    },
    {
      id: 'order-delivery',
      label: 'Order Delivery',
      icon: <Truck className="h-4 w-4" />,
      path: '/order-delivery',
      isNew: true
    },
    {
      id: 'affiliate',
      label: 'Become an Affiliate',
      icon: <Users className="h-4 w-4" />,
      path: '/affiliate',
      isNew: true
    }
  ];

  // Handle horizontal scrolling with arrow buttons
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = 200;
      const newPosition = direction === 'left' 
        ? Math.max(scrollPosition - scrollAmount, 0)
        : Math.min(scrollPosition + scrollAmount, container.scrollWidth - container.clientWidth);
      
      container.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      setScrollPosition(newPosition);
    }
  };

  // Handle button click with loading animation
  const handleButtonClick = (button: NavButton) => {
    setActiveButton(button.id);
    setShowLoader(true);
    
    // Show the loader for 1 second before navigating
    setTimeout(() => {
      setShowLoader(false);
      navigate(button.path);
      
      // If it's a new feature, show a toast notification
      if (button.isNew) {
        toast({
          title: `New Feature: ${button.label}`,
          description: "We're excited to introduce this new feature to enhance your experience.",
          variant: "default",
        });
      }
    }, 1000);
  };

  // Update scroll position when container is scrolled
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const handleScroll = () => {
      setScrollPosition(container.scrollLeft);
    };
    
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative w-full">
      {/* Main navigation row */}
      <div className="flex items-center relative">
        {/* Scroll container for all buttons */}
        <div className="relative flex-1 overflow-hidden">
          {/* Left scroll button - only shown when not at start */}
          {scrollPosition > 0 && (
            <motion.button 
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 rounded-full p-1.5 shadow-sm"
              onClick={() => scroll('left')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
          )}
          
          {/* Scrollable container for buttons */}
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto hide-scrollbar py-2 pl-0 pr-8"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex space-x-3">
              {navButtons.map((button) => (
                <motion.button
                  key={button.id}
                  className={`flex items-center px-4 py-2.5 rounded-full whitespace-nowrap ${
                    activeButton === button.id
                      ? 'bg-[#0F1B44] text-white'
                      : 'bg-gray-100 text-[#0F1B44] hover:bg-gray-200'
                  } transition-all shadow-sm relative`}
                  whileHover={{ y: -2, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleButtonClick(button)}
                >
                  <span className="flex items-center">
                    {button.icon}
                    <span className="ml-2 font-medium text-sm">{button.label}</span>
                  </span>
                  
                  {/* New label for new features */}
                  {button.isNew && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                      NEW
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
          
          {/* Right scroll button - only shown when not at end */}
          <motion.button 
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 rounded-full p-1.5 shadow-sm"
            onClick={() => scroll('right')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
      </div>
      
      {/* Page transition loader */}
      {showLoader && (
        <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-t-[#0F1B44] border-r-[#0F1B44]/70 border-b-[#0F1B44]/40 border-l-[#0F1B44]/10 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[#0F1B44] font-bold text-sm">Halvi</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Style for hiding scrollbar */}
      <style>
        {`.hide-scrollbar::-webkit-scrollbar {
          display: none;
        }`}
      </style>
    </div>
  );
};

export default ScrollableNavigation;
