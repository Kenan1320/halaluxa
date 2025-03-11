
import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { shopCategories, getCategoryIcon } from '@/models/shop';

// Map to the categories data structure with icons
const categories = shopCategories.map((name, index) => ({
  id: index + 1,
  name,
  icon: getCategoryIcon(name),
  color: '#2A866A'
}));

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
        className="flex overflow-x-auto scrollbar-hide py-1 space-x-3"
      >
        {categories.map((category) => (
          <motion.button
            key={category.id}
            className="flex-shrink-0 flex flex-col items-center justify-center bg-white rounded-lg shadow-sm p-1 border border-gray-100"
            style={{ minWidth: '70px', height: '70px' }}
            whileHover={{ scale: 1.05, backgroundColor: '#F8F8F8' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCategoryClick(category.name)}
          >
            <img 
              src={category.icon} 
              alt={category.name}
              className="h-7 w-7 mb-1"
            />
            <span className="text-gray-800 text-xs font-medium text-center line-clamp-1 px-1">
              {category.name.split(' ')[0]}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default CategoryScroll;
