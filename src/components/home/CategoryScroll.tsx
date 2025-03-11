
import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, ShoppingBag, Home, BookOpen, Utensils, HeartPulse, Gift, Shirt, Laptop, Baby, Drumstick, Palette, Camera, Briefcase, Car, Coffee, Cog, Dumbbell, Plane, MapPin } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

// Ensure these categories match exactly with those in Categories.tsx
const categories = [
  { id: 1, name: 'Groceries', icon: ShoppingCart },
  { id: 2, name: 'Food', icon: Utensils },
  { id: 3, name: 'Modest Clothing', icon: Shirt },
  { id: 4, name: 'Home', icon: Home },
  { id: 5, name: 'Electronics', icon: Laptop },
  { id: 6, name: 'Books', icon: BookOpen },
  { id: 7, name: 'Health', icon: HeartPulse },
  { id: 8, name: 'Baby', icon: Baby },
  { id: 9, name: 'Gifts', icon: Gift },
  { id: 10, name: 'Art', icon: Palette },
  { id: 11, name: 'Halal Meat', icon: Drumstick },
  { id: 12, name: 'Photography', icon: Camera },
  { id: 13, name: 'Business', icon: Briefcase },
  { id: 14, name: 'Automotive', icon: Car },
  { id: 15, name: 'Cafe', icon: Coffee },
  { id: 16, name: 'Technology', icon: Cog },
  { id: 17, name: 'Fitness', icon: Dumbbell },
  { id: 18, name: 'Travel', icon: Plane },
  { id: 19, name: 'Pick Up Halal Food Nearby', icon: MapPin }
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
    let isPaused = false;
    const scrollDirection = 1; // Always scroll in one direction (left to right)
    
    const autoScroll = () => {
      if (!scrollContainer || isPaused) {
        animationId = requestAnimationFrame(autoScroll);
        return;
      }
      
      scrollPosition += 0.5 * scrollDirection;
      scrollContainer.scrollLeft = scrollPosition;
      
      // Reset when reaching the end to create infinite loop
      if (scrollPosition >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
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
  
  const handleCategoryClick = (category: string) => {
    navigate(`/browse?category=${encodeURIComponent(category)}`);
  };
  
  const getBoxShadow = () => {
    if (theme === 'dark') return '0 0 12px rgba(209, 232, 226, 0.2)';
    if (theme === 'black') return '0 0 12px rgba(0, 200, 255, 0.2)';
    return '0 10px 15px rgba(0,0,0,0.1)';
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
            className={`flex-shrink-0 flex flex-col items-center justify-center rounded-lg shadow-sm p-1.5 border
              ${theme === 'dark' 
                ? 'bg-dark-card border-primary/10 shadow-md shadow-primary/5' 
                : theme === 'black'
                  ? 'bg-black/30 border-primary/10 shadow-md shadow-primary/5'
                  : 'bg-card border-border'
              }`}
            style={{ minWidth: '64px', height: '64px' }}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: getBoxShadow()
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCategoryClick(category.name)}
          >
            <category.icon className="h-5 w-5 text-primary mb-1" />
            <span className="text-foreground text-xs font-medium text-center line-clamp-1">{category.name}</span>
          </motion.button>
        ))}
        
        <motion.button
          className={`flex-shrink-0 flex flex-col items-center justify-center rounded-lg shadow-sm p-1.5 border
            ${theme === 'dark'
              ? 'bg-primary/20 border-primary/10'
              : theme === 'black'
                ? 'bg-primary/20 border-primary/10'
                : 'bg-primary/10 border-border'
            }`}
          style={{ minWidth: '64px', height: '64px' }}
          whileHover={{ 
            scale: 1.05, 
            boxShadow: getBoxShadow()
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/categories')}
        >
          <ShoppingBag className="h-5 w-5 text-primary mb-1" />
          <span className="text-foreground text-xs font-medium text-center line-clamp-1">View All</span>
        </motion.button>
      </div>
    </div>
  );
};

export default CategoryScroll;
