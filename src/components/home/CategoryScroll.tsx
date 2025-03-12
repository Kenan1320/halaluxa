
import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCategoryIcon } from '../icons/CategoryIcons';
import { productCategories, isNearbyCategoryByDefault } from '@/models/product';

interface CategoryScrollProps {
  filter?: 'nearby' | 'online' | 'all';
}

const CategoryScroll = ({ filter = 'all' }: CategoryScrollProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [categories, setCategories] = useState<string[]>([]);
  
  useEffect(() => {
    // Filter categories based on the filter prop
    if (filter === 'all') {
      setCategories(productCategories);
    } else if (filter === 'nearby') {
      setCategories(productCategories.filter(isNearbyCategoryByDefault));
    } else {
      setCategories(productCategories.filter(category => !isNearbyCategoryByDefault(category)));
    }
  }, [filter]);
  
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
      if (scrollContainer) {
        scrollContainer.removeEventListener('mouseenter', handlePause);
        scrollContainer.removeEventListener('mouseleave', handleResume);
        scrollContainer.removeEventListener('touchstart', handlePause);
        scrollContainer.removeEventListener('touchend', handleResume);
      }
    };
  }, [categories]);
  
  const handleCategoryClick = (category: string) => {
    navigate(`/browse?category=${encodeURIComponent(category)}`);
  };
  
  return (
    <div className="relative w-full my-1">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide py-1 space-x-4"
      >
        {categories.map((category, index) => (
          <motion.button
            key={index}
            className="flex-shrink-0 flex flex-col items-center justify-center p-1"
            style={{ minWidth: '45px' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCategoryClick(category)}
          >
            <div className="h-7 w-7 mb-1 flex items-center justify-center">
              {getCategoryIcon(category, "h-6 w-6")}
            </div>
            <span className="text-black dark:text-white text-[10px] font-medium text-center line-clamp-1">
              {category}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default CategoryScroll;
