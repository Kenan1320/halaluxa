
import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCategoryIcon } from '../icons/CategoryIcons';
import { productCategories } from '@/models/product';
import { useTheme } from '@/context/ThemeContext';

const CategoryScroll = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    
    let animationId: number;
    let scrollPosition = 0;
    let scrollDirection = 1;
    let isPaused = false;
    
    const autoScroll = () => {
      if (!scrollContainer || isPaused) {
        animationId = requestAnimationFrame(autoScroll);
        return;
      }
      
      scrollPosition += 0.5 * scrollDirection;
      scrollContainer.scrollLeft = scrollPosition;
      
      if (scrollPosition >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
        scrollDirection = -1;
      } else if (scrollPosition <= 0) {
        scrollDirection = 1;
      }
      
      animationId = requestAnimationFrame(autoScroll);
    };
    
    animationId = requestAnimationFrame(autoScroll);
    
    const handlePause = () => { isPaused = true; };
    const handleResume = () => { isPaused = false; };
    
    scrollContainer.addEventListener('mouseenter', handlePause);
    scrollContainer.addEventListener('mouseleave', handleResume);
    scrollContainer.addEventListener('touchstart', handlePause);
    scrollContainer.addEventListener('touchend', handleResume);
    
    return () => {
      cancelAnimationFrame(animationId);
      scrollContainer.removeEventListener('mouseenter', handlePause);
      scrollContainer.removeEventListener('mouseleave', handleResume);
      scrollContainer.removeEventListener('touchstart', handlePause);
      scrollContainer.removeEventListener('touchend', handleResume);
    };
  }, []);
  
  const handleCategoryClick = (category: string) => {
    navigate(`/browse?category=${encodeURIComponent(category)}`);
  };
  
  return (
    <div className="relative w-full my-2">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide py-2 space-x-5"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {productCategories.map((category, index) => (
          <motion.button
            key={index}
            className={`flex-shrink-0 flex flex-col items-center justify-center p-2 rounded-lg ${
              isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
            } shadow-sm`}
            style={{ minWidth: '70px', minHeight: '70px' }}
            whileHover={{ scale: 1.05, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCategoryClick(category)}
          >
            <div className="h-12 w-12 flex items-center justify-center">
              {getCategoryIcon(category, "h-11 w-11")}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default CategoryScroll;
