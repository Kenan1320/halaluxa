
import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import CategoryButton from './CategoryButton';
import { productCategories } from '@/models/product';

const CategoryScrollMenu = () => {
  const { mode } = useTheme();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 200;
      
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center">
        <button
          onClick={() => scroll('left')}
          className={`p-2 rounded-full ${
            mode === 'dark' 
              ? 'bg-gray-800 text-white hover:bg-gray-700' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } mr-2 hidden md:flex`}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto pb-2 hide-scrollbar gap-3 flex-1"
        >
          {productCategories.map((category) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0"
            >
              <CategoryButton
                name={category}
                to={`/browse?category=${encodeURIComponent(category)}`}
              />
            </motion.div>
          ))}
        </div>
        
        <button
          onClick={() => scroll('right')}
          className={`p-2 rounded-full ${
            mode === 'dark' 
              ? 'bg-gray-800 text-white hover:bg-gray-700' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } ml-2 hidden md:flex`}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default CategoryScrollMenu;
