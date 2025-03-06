
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const categories = [
  { id: 1, name: 'Groceries', icon: '🛒' },
  { id: 2, name: 'Clothing', icon: '👚' },
  { id: 3, name: 'Home', icon: '🏠' },
  { id: 4, name: 'Beauty', icon: '✨' },
  { id: 5, name: 'Books', icon: '📚' },
  { id: 6, name: 'Health', icon: '💊' },
  { id: 7, name: 'Electronics', icon: '📱' },
  { id: 8, name: 'Toys', icon: '🧸' },
  { id: 9, name: 'Food', icon: '🍲' },
  { id: 10, name: 'Sports', icon: '🏓' },
  { id: 11, name: 'Gifts', icon: '🎁' },
  { id: 12, name: 'Art', icon: '🎨' }
];

const CategoryScroll = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 300;
      
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };
  
  const handleCategoryClick = (category: string) => {
    navigate(`/browse?category=${encodeURIComponent(category)}`);
  };
  
  return (
    <div className="relative w-full my-3 mt-4">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
        <button
          onClick={() => scroll('left')}
          className="p-1 bg-white/60 rounded-full shadow-sm backdrop-blur-sm"
        >
          <ChevronLeft className="h-5 w-5 text-gray-700" />
        </button>
      </div>
      
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide py-2 px-6 space-x-3"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category) => (
          <motion.button
            key={category.id}
            className="flex items-center space-x-2 whitespace-nowrap px-4 py-2 bg-[#2A866A]/10 rounded-full flex-shrink-0"
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(42, 134, 106, 0.2)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCategoryClick(category.name)}
          >
            <span>{category.icon}</span>
            <span className="text-[#2A866A]">{category.name}</span>
          </motion.button>
        ))}
      </div>
      
      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
        <button
          onClick={() => scroll('right')}
          className="p-1 bg-white/60 rounded-full shadow-sm backdrop-blur-sm"
        >
          <ChevronRight className="h-5 w-5 text-gray-700" />
        </button>
      </div>
    </div>
  );
};

export default CategoryScroll;
