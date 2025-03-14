
import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { getCategoryIcon } from '../icons/CategoryIcons';
import { Category, getCategoriesByGroup, getCategories } from '@/services/categoryService';

// Define our preferred order for categories - we'll use all categories
// but prioritize these ones to appear first
const PRIORITY_CATEGORIES = [
  'Groceries',
  'Online Stores',
  'Restaurants',
  'Coffee Shops',
  'Hoodies',
  'Halal Meat',
  'Thobes',
  'Abayas',
  'Books',
  'Kids',
  'Gifts',
  'Food Delivery'
];

interface CategoryItemProps {
  category: Category;
  isHighlighted: boolean;
  onClick?: () => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category, isHighlighted, onClick }) => {
  const { mode } = useTheme();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-10% 0px -10% 0px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.5 }
      });
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={controls}
      whileHover={{ 
        scale: 1.1,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.95 }}
      className={`flex flex-col items-center justify-center mx-3 group cursor-pointer transition-all duration-300 ${
        isHighlighted ? 'scale-105' : ''
      }`}
      onClick={onClick}
    >
      <motion.div 
        className={`w-14 h-14 rounded-full flex items-center justify-center 
          ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}
          shadow-sm ${isHighlighted ? 'shadow-md bg-[#e4f7f1] dark:bg-[#2A866A]/20' : ''}
          transition-all duration-300`}
        whileHover={{ 
          boxShadow: "0px 8px 15px rgba(0,0,0,0.1)",
          y: -5,
          rotateY: 10,
          rotateX: 10
        }}
        style={{ 
          transformStyle: "preserve-3d", 
          perspective: "500px" 
        }}
      >
        {getCategoryIcon(
          category.name, 
          `w-7 h-7 ${
            isHighlighted 
              ? 'text-[#2A866A] dark:text-[#5bbea7]' 
              : mode === 'dark' ? 'text-white' : 'text-gray-700'
          }`
        )}
      </motion.div>
      <span className={`text-xs font-bold mt-2 text-center transition-colors duration-300 whitespace-nowrap
        ${isHighlighted ? 'text-[#2A866A] dark:text-[#5bbea7]' : ''}`}
      >
        {category.name}
      </span>
    </motion.div>
  );
};

const FlowingCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [highlightedCategory, setHighlightedCategory] = useState<string | null>(null);
  const [duplicatedCategories, setDuplicatedCategories] = useState<Category[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { mode } = useTheme();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const allCategories = await getCategories();
        
        // Rename "Online Shops" to "Online Stores" if it exists
        const updatedCategories = allCategories.map(cat => 
          cat.name === 'Online Shops' ? { ...cat, name: 'Online Stores' } : cat
        );
        
        // Sort categories to prioritize our preferred ones first
        const sortedCategories = [...updatedCategories].sort((a, b) => {
          const indexA = PRIORITY_CATEGORIES.indexOf(a.name);
          const indexB = PRIORITY_CATEGORIES.indexOf(b.name);
          
          // If both are in our priority list, sort by their position in that list
          if (indexA >= 0 && indexB >= 0) {
            return indexA - indexB;
          }
          
          // If only one is in our priority list, prioritize it
          if (indexA >= 0) return -1;
          if (indexB >= 0) return 1;
          
          // If neither is in our priority list, sort alphabetically
          return a.name.localeCompare(b.name);
        });
        
        setCategories(sortedCategories);
        
        // Create a duplicated array for infinite scroll effect
        // We duplicate it multiple times to ensure it's long enough for any screen size
        setDuplicatedCategories([...sortedCategories, ...sortedCategories, ...sortedCategories]);
      } catch (error) {
        console.error('Error loading categories:', error);
        // Fallback categories with all required fields
        const fallbackCategories: Category[] = [
          { id: '1', name: 'Groceries', group: 'nearby', created_at: new Date().toISOString() },
          { id: '2', name: 'Online Stores', group: 'online', created_at: new Date().toISOString() },
          { id: '3', name: 'Restaurants', group: 'nearby', created_at: new Date().toISOString() },
          { id: '4', name: 'Coffee Shops', group: 'nearby', created_at: new Date().toISOString() },
          { id: '5', name: 'Hoodies', group: 'online', created_at: new Date().toISOString() },
          { id: '6', name: 'Halal Meat', group: 'nearby', created_at: new Date().toISOString() }
        ];
        setCategories(fallbackCategories);
        setDuplicatedCategories([...fallbackCategories, ...fallbackCategories, ...fallbackCategories]);
      }
    };
    
    loadCategories();
  }, []);

  // Automatic scrolling animation
  useEffect(() => {
    if (!containerRef.current || duplicatedCategories.length === 0) return;
    
    const container = containerRef.current;
    let animationFrameId: number;
    let scrollPosition = 0;
    const speed = 0.5; // pixels per frame
    
    const animate = () => {
      scrollPosition += speed;
      
      // If we've scrolled to the "second set" of categories, 
      // reset to the start to create an infinite loop
      if (scrollPosition >= container.scrollWidth / 3) {
        scrollPosition = 0;
      }
      
      container.scrollLeft = scrollPosition;
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    // Pause animation on hover/touch
    const handleInteractionStart = () => cancelAnimationFrame(animationFrameId);
    const handleInteractionEnd = () => {
      animationFrameId = requestAnimationFrame(animate);
    };
    
    container.addEventListener('mouseenter', handleInteractionStart);
    container.addEventListener('mouseleave', handleInteractionEnd);
    container.addEventListener('touchstart', handleInteractionStart);
    container.addEventListener('touchend', handleInteractionEnd);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mouseenter', handleInteractionStart);
      container.removeEventListener('mouseleave', handleInteractionEnd);
      container.removeEventListener('touchstart', handleInteractionStart);
      container.removeEventListener('touchend', handleInteractionEnd);
    };
  }, [duplicatedCategories]);

  const handleCategoryClick = (category: Category) => {
    setHighlightedCategory(category.id);
    
    // Navigate to the category page
    window.location.href = `/browse?category=${encodeURIComponent(category.name)}`;
  };

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="relative overflow-hidden py-4 border-b border-gray-200 dark:border-gray-800">
      {/* Left gradient fade */}
      <div className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none bg-gradient-to-r from-background to-transparent" />
      
      <div 
        ref={containerRef}
        className="flex overflow-x-auto scrollbar-none"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="flex">
          {duplicatedCategories.map((category, index) => (
            <CategoryItem 
              key={`${category.id}-${index}`} 
              category={category}
              isHighlighted={category.id === highlightedCategory}
              onClick={() => handleCategoryClick(category)}
            />
          ))}
        </div>
      </div>
      
      {/* Right gradient fade */}
      <div className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none bg-gradient-to-l from-background to-transparent" />
    </div>
  );
};

export default FlowingCategories;
