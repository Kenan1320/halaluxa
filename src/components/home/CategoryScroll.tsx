import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, ShoppingBag, Home, BookOpen, Utensils, HeartPulse, Gift, Shirt, Laptop, Baby, Drumstick, Palette } from 'lucide-react';

const categories = [
  { id: 1, name: 'Groceries', icon: ShoppingCart, color: '#2A866A' },
  { id: 2, name: 'Food', icon: Utensils, color: '#2A866A' },
  { id: 3, name: 'Modest Clothing', icon: Shirt, color: '#2A866A' },
  { id: 4, name: 'Home', icon: Home, color: '#2A866A' },
  { id: 5, name: 'Electronics', icon: Laptop, color: '#2A866A' },
  { id: 6, name: 'Books', icon: BookOpen, color: '#2A866A' },
  { id: 7, name: 'Health', icon: HeartPulse, color: '#2A866A' },
  { id: 8, name: 'Toys', icon: Baby, color: '#2A866A' },
  { id: 9, name: 'Gifts', icon: Gift, color: '#2A866A' },
  { id: 10, name: 'Art', icon: Palette, color: '#2A866A' },
  { id: 11, name: 'Baby', icon: Baby, color: '#2A866A' },
  { id: 12, name: 'Halal Meat', icon: Drumstick, color: '#2A866A' }
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
    <div className="relative w-full my-2">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide py-2 space-x-3"
      >
        {categories.map((category) => (
          <motion.button
            key={category.id}
            className="flex-shrink-0 flex flex-col items-center justify-center bg-white rounded-lg shadow-sm p-2 border border-gray-100"
            style={{ minWidth: '70px', height: '70px' }}
            whileHover={{ scale: 1.05, backgroundColor: '#F8F8F8' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCategoryClick(category.name)}
          >
            <category.icon className="h-5 w-5 text-[#2A866A] mb-1" />
            <span className="text-gray-800 text-xs font-medium text-center">{category.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default CategoryScroll;
