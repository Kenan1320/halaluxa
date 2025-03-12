
import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCategoryIcon } from '../icons/CategoryIcons';

// Define categories array without the showcase images
const categories = [
  { id: 1, name: 'Restaurants' },
  { id: 2, name: 'Groceries' },
  { id: 3, name: 'Halal Meat' },
  { id: 4, name: 'Books' },
  { id: 5, name: 'Furniture' },
  { id: 6, name: 'Modest Clothing' },
  { id: 7, name: 'Hijab' },
  { id: 8, name: 'Thobes' },
  { id: 9, name: 'Abaya' },
  { id: 10, name: 'Gifts' },
  { id: 11, name: 'Decorations' },
  { id: 12, name: 'Arabic Language' },
  { id: 13, name: 'Arabic Calligraphy' },
  { id: 14, name: 'Online Shops' }
];

const CategoryScroll = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
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
    <div className="relative w-full my-1">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide py-1 space-x-4"
      >
        {categories.map((category) => (
          <motion.button
            key={category.id}
            className="flex-shrink-0 flex flex-col items-center justify-center p-1"
            style={{ minWidth: '55px' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCategoryClick(category.name)}
          >
            <div className="h-8 w-8 mb-1 flex items-center justify-center">
              {getCategoryIcon(category.name, "h-7 w-7")}
            </div>
            <span className="text-black dark:text-white text-xs font-medium text-center line-clamp-1">
              {category.name}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default CategoryScroll;
