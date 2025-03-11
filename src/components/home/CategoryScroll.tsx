
import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { categories } from '@/constants/categories';

const CategoryScroll = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    
    let animationId: number;
    let scrollPosition = 0;
    let isPaused = false;
    
    const autoScroll = () => {
      if (!scrollContainer || isPaused) {
        animationId = requestAnimationFrame(autoScroll);
        return;
      }
      
      // Increase scroll position (always scroll from right to left)
      scrollPosition += 0.5;
      scrollContainer.scrollLeft = scrollPosition;
      
      // Reset when reaching the end to create infinite loop effect
      if (scrollPosition >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
        // Jump back to start without animation for seamless looping
        scrollPosition = 0;
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
  
  const handleCategoryClick = (categoryName: string) => {
    navigate(`/browse?category=${encodeURIComponent(categoryName)}`);
  };
  
  const getBoxShadow = () => {
    if (theme === 'dark') return '0 0 12px rgba(209, 232, 226, 0.2)';
    if (theme === 'black') return '0 0 12px rgba(0, 200, 255, 0.2)';
    return '0 10px 15px rgba(0,0,0,0.1)';
  };
  
  const getCategoryButtonClasses = () => {
    const baseClasses = "flex-shrink-0 flex flex-col items-center justify-center rounded-lg shadow-sm p-1.5 border";
    
    if (theme === 'dark') {
      return `${baseClasses} bg-dark-card border-primary/10 shadow-md shadow-primary/5`;
    } else if (theme === 'black') {
      return `${baseClasses} bg-black/30 border-primary/10 shadow-md shadow-primary/5`;
    }
    
    return `${baseClasses} bg-card border-border`;
  };
  
  const getViewAllButtonClasses = () => {
    const baseClasses = "flex-shrink-0 flex flex-col items-center justify-center rounded-lg shadow-sm p-1.5 border";
    
    if (theme === 'dark') {
      return `${baseClasses} bg-primary/20 border-primary/10`;
    } else if (theme === 'black') {
      return `${baseClasses} bg-primary/20 border-primary/10`;
    }
    
    return `${baseClasses} bg-primary/10 border-border`;
  };
  
  return (
    <div className="relative w-full my-1">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide py-2 space-x-4"
      >
        {categories.map((category) => (
          <motion.button
            key={category.id}
            className={getCategoryButtonClasses()}
            style={{ minWidth: '80px', height: '80px' }}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: getBoxShadow()
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCategoryClick(category.name)}
          >
            <div className="h-10 w-10 mb-1 flex items-center justify-center">
              <img 
                src={category.iconSrc} 
                alt={category.name}
                className="h-8 w-8 object-contain"
              />
            </div>
            <span className="text-foreground text-xs font-medium text-center line-clamp-2">
              {category.displayName}
            </span>
          </motion.button>
        ))}
        
        <motion.button
          className={getViewAllButtonClasses()}
          style={{ minWidth: '80px', height: '80px' }}
          whileHover={{ 
            scale: 1.05, 
            boxShadow: getBoxShadow()
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/categories')}
        >
          <ShoppingBag className="h-8 w-8 text-primary mb-1" />
          <span className="text-foreground text-xs font-medium text-center">View All</span>
        </motion.button>
      </div>
    </div>
  );
};

export default CategoryScroll;
