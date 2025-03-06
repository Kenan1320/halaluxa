
import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const categories = [
  { id: 1, name: 'Groceries', color: '#4F46E5' },
  { id: 2, name: 'Modest Clothing', color: '#EC4899' },
  { id: 3, name: 'Home', color: '#10B981' },
  { id: 4, name: 'Electronics', color: '#F59E0B' },
  { id: 5, name: 'Books', color: '#8B5CF6' },
  { id: 6, name: 'Health', color: '#06B6D4' },
  { id: 7, name: 'Food', color: '#EF4444' },
  { id: 8, name: 'Toys', color: '#3B82F6' },
  { id: 9, name: 'Gifts', color: '#F97316' },
  { id: 10, name: 'Art', color: '#14B8A6' },
  { id: 11, name: 'Baby', color: '#A855F7' },
  { id: 12, name: 'Halal Meat', color: '#D946EF' }
];

const CategoryScroll = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Auto-scroll functionality
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    
    let animationId: number;
    let scrollPosition = 0;
    let scrollDirection = 1; // 1 for right, -1 for left
    let isPaused = false;
    
    const autoScroll = () => {
      if (!scrollContainer || isPaused) {
        animationId = requestAnimationFrame(autoScroll);
        return;
      }
      
      scrollPosition += 0.5 * scrollDirection;
      scrollContainer.scrollLeft = scrollPosition;
      
      // Change direction when reaching ends
      if (scrollPosition >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
        scrollDirection = -1;
      } else if (scrollPosition <= 0) {
        scrollDirection = 1;
      }
      
      animationId = requestAnimationFrame(autoScroll);
    };
    
    // Start auto-scrolling
    animationId = requestAnimationFrame(autoScroll);
    
    // Pause on hover/touch
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
        className="flex overflow-x-auto scrollbar-hide py-2 space-x-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category) => (
          <motion.button
            key={category.id}
            className="flex-shrink-0 px-4 py-1.5 rounded-full shadow-sm border border-white/10"
            style={{ 
              background: `linear-gradient(135deg, ${category.color}, ${category.color}CC)`,
              minWidth: 'max-content' 
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCategoryClick(category.name)}
          >
            <span className="text-white text-sm font-medium">{category.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default CategoryScroll;
