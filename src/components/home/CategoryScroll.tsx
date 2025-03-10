
import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, ShoppingBag, Home, BookOpen, Utensils, HeartPulse, Gift, Shirt, Laptop, Baby, Drumstick, Palette } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const categories = [
  { id: 1, name: 'Groceries', icon: ShoppingCart },
  { id: 2, name: 'Food', icon: Utensils },
  { id: 3, name: 'Modest Clothing', icon: Shirt },
  { id: 4, name: 'Home', icon: Home },
  { id: 5, name: 'Electronics', icon: Laptop },
  { id: 6, name: 'Books', icon: BookOpen },
  { id: 7, name: 'Health', icon: HeartPulse },
  { id: 8, name: 'Toys', icon: Baby },
  { id: 9, name: 'Gifts', icon: Gift },
  { id: 10, name: 'Art', icon: Palette },
  { id: 11, name: 'Baby', icon: Baby },
  { id: 12, name: 'Halal Meat', icon: Drumstick }
];

const CategoryScroll = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { theme } = useTheme();
  
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
            className="flex-shrink-0 flex flex-col items-center justify-center bg-card rounded-lg shadow-sm p-1 border border-border dark:shadow-md dark:shadow-primary/5"
            style={{ minWidth: '62px', height: '62px' }}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: theme === 'dark' ? '0 0 10px rgba(209, 232, 226, 0.2)' : '0 10px 15px rgba(0,0,0,0.1)' 
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCategoryClick(category.name)}
          >
            <category.icon className="h-5 w-5 text-primary mb-1" />
            <span className="text-foreground text-xs font-medium text-center line-clamp-1">{category.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default CategoryScroll;
