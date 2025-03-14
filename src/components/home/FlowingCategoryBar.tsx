
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { getCategoryIcon } from '@/components/icons/CategoryIcons';
import { Link } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
}

interface FlowingCategoryBarProps {
  categories: Category[];
}

const FlowingCategoryBar: React.FC<FlowingCategoryBarProps> = ({ categories }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const [isScrolling, setIsScrolling] = useState(false);
  
  // Automatic scrolling effect
  useEffect(() => {
    if (!containerRef.current || categories.length === 0) return;
    
    const container = containerRef.current;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    
    // Only activate auto-scroll if content overflows
    if (scrollWidth <= clientWidth) return;
    
    let animationId: number;
    let scrollPos = 0;
    const scrollSpeed = 0.5; // pixels per frame
    
    const scroll = () => {
      if (!containerRef.current) return;
      
      scrollPos += scrollSpeed;
      
      // Reset scroll position when we've scrolled through all items
      if (scrollPos >= (scrollWidth - clientWidth)) {
        scrollPos = 0;
      }
      
      container.scrollLeft = scrollPos;
      animationId = requestAnimationFrame(scroll);
    };
    
    // Start/stop scrolling based on hover
    const startScrolling = () => {
      setIsScrolling(true);
      animationId = requestAnimationFrame(scroll);
    };
    
    const stopScrolling = () => {
      setIsScrolling(false);
      cancelAnimationFrame(animationId);
    };
    
    // Initial start after a short delay
    const timeoutId = setTimeout(startScrolling, 1000);
    
    // Pause on hover or touch
    container.addEventListener('mouseenter', stopScrolling);
    container.addEventListener('mouseleave', startScrolling);
    container.addEventListener('touchstart', stopScrolling);
    container.addEventListener('touchend', startScrolling);
    
    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationId);
      container.removeEventListener('mouseenter', stopScrolling);
      container.removeEventListener('mouseleave', startScrolling);
      container.removeEventListener('touchstart', stopScrolling);
      container.removeEventListener('touchend', startScrolling);
    };
  }, [categories]);
  
  return (
    <div className="relative overflow-hidden mx-auto max-w-screen-xl">
      <div
        ref={containerRef}
        className="flex space-x-4 py-3 overflow-x-auto scrollbar-none"
        style={{ scrollBehavior: 'smooth' }}
      >
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/browse?category=${encodeURIComponent(category.name)}`}
            className="flex-shrink-0"
          >
            <motion.div
              className={`flex flex-col items-center justify-center ${
                isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              } rounded-xl p-2 transition-colors`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div
                className={`w-14 h-14 flex items-center justify-center rounded-full mb-1 ${
                  isDark ? 'bg-gray-800' : 'bg-white'
                } shadow-sm`}
              >
                {getCategoryIcon(category.name, `w-7 h-7 ${isDark ? 'text-white' : 'text-green-600'}`)}
              </div>
              <span className="text-xs font-medium mt-1">{category.name}</span>
            </motion.div>
          </Link>
        ))}
      </div>
      
      {/* Gradient overlays for scroll indication */}
      <div className={`absolute top-0 left-0 h-full w-8 pointer-events-none ${isDark ? 'bg-gradient-to-r from-gray-900' : 'bg-gradient-to-r from-white'}`}></div>
      <div className={`absolute top-0 right-0 h-full w-8 pointer-events-none ${isDark ? 'bg-gradient-to-l from-gray-900' : 'bg-gradient-to-l from-white'}`}></div>
    </div>
  );
};

export default FlowingCategoryBar;
