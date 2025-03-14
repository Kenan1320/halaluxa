
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { productCategories } from '@/models/product';
import { motion } from 'framer-motion';

const CategoryScroll = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Check scroll position to show/hide arrows
  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  // Set up scroll event listener
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScrollPosition);
      // Initial check
      checkScrollPosition();
    }
    
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', checkScrollPosition);
      }
    };
  }, []);

  // Scroll left or right
  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const scrollAmount = 200;
    const currentScroll = scrollContainerRef.current.scrollLeft;
    
    scrollContainerRef.current.scrollTo({
      left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
      behavior: 'smooth'
    });
  };

  // Handle category selection
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    navigate(`/browse?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="relative">
      {/* Left scroll arrow */}
      {showLeftArrow && (
        <button 
          onClick={() => handleScroll('left')}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 rounded-full p-1 shadow-sm text-gray-800 dark:text-white"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      
      {/* Scrollable container */}
      <div 
        ref={scrollContainerRef}
        className="overflow-x-auto scrollbar-none py-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex space-x-2 min-w-max px-1">
          {productCategories.map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCategoryClick(category)}
                className={cn(
                  "whitespace-nowrap rounded-full px-4 py-1 text-xs font-medium transition-colors",
                  selectedCategory === category 
                    ? "bg-white text-[#0F1B44] hover:bg-white/90" 
                    : "bg-white/10 text-white hover:bg-white/20"
                )}
              >
                {category}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Right scroll arrow */}
      {showRightArrow && (
        <button 
          onClick={() => handleScroll('right')}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 rounded-full p-1 shadow-sm text-gray-800 dark:text-white"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default CategoryScroll;
