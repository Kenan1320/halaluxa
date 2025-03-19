
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCategoryIcon } from '@/components/icons/CategoryIcons';
import { Button } from '@/components/ui/button';

// Define the standardized categories
const categories = [
  { id: 'groceries', name: 'Groceries' },
  { id: 'halal-meat', name: 'Halal Meat' },
  { id: 'restaurants', name: 'Restaurants' },
  { id: 'thobes', name: 'Thobes' },
  { id: 'abayas', name: 'Abayas' },
  { id: 'hijabs', name: 'Hijabs' },
  { id: 'furniture', name: 'Furniture' },
  { id: 'decorations', name: 'Decorations' },
  { id: 'books', name: 'Books' },
  { id: 'arabic-language', name: 'Arabic Language' },
  { id: 'arabic-calligraphy', name: 'Arabic Calligraphy' },
  { id: 'muslim-therapists', name: 'Muslim Therapists' },
  { id: 'online-stores', name: 'Online Stores' },
  { id: 'gifts', name: 'Gifts' }
];

const CategoryScroll = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollTo = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollAmount = 200;
    if (direction === 'left') {
      container.scrollTo({
        left: container.scrollLeft - scrollAmount,
        behavior: 'smooth'
      });
    } else {
      container.scrollTo({
        left: container.scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative">
      {/* Scroll buttons - left */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => scrollTo('left')}
          className="bg-white/10 hover:bg-white/20 text-white rounded-full p-1 backdrop-blur-sm"
        >
          <ChevronLeft className="h-5 w-5" />
        </motion.button>
      </div>
      
      {/* Scrollable categories */}
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide py-2 pl-8 pr-8 space-x-3"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/category/${category.id}`}
            className="flex flex-col items-center px-3 py-1 min-w-[84px]"
          >
            <div className="bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors">
              {getCategoryIcon(category.name)}
            </div>
            <span className="text-white text-xs mt-2 whitespace-nowrap">{category.name}</span>
          </Link>
        ))}
      </div>
      
      {/* Scroll buttons - right */}
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => scrollTo('right')}
          className="bg-white/10 hover:bg-white/20 text-white rounded-full p-1 backdrop-blur-sm"
        >
          <ChevronRight className="h-5 w-5" />
        </motion.button>
      </div>
      
      {/* Hide scrollbar style */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default CategoryScroll;
