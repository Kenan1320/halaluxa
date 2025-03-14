
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { Category } from '@/models/types';

interface FlowingCategoryBarProps {
  categories: Category[];
}

const FlowingCategoryBar: React.FC<FlowingCategoryBarProps> = ({ categories }) => {
  const navigate = useNavigate();
  const { mode } = useTheme();
  
  const handleCategoryClick = (category: Category) => {
    navigate(`/browse?category=${encodeURIComponent(category.name)}`);
  };

  // Duplicate categories to create flowing effect
  const repeatedCategories = [...categories, ...categories, ...categories];

  return (
    <div className="w-full overflow-hidden py-2">
      <div className="relative">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ 
            repeat: Infinity,
            repeatType: "loop",
            duration: 30,
            ease: "linear"
          }}
        >
          {repeatedCategories.map((category, index) => (
            <motion.div
              key={`${category.id}-${index}`}
              className={`inline-block mx-2 px-4 py-2 rounded-full cursor-pointer
                ${mode === 'dark' 
                  ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700' 
                  : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 shadow-sm'}
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCategoryClick(category)}
            >
              <div className="flex items-center space-x-2">
                {category.icon && (
                  <span className="text-green-600 dark:text-green-400">{category.icon}</span>
                )}
                <span className="text-sm font-medium">{category.name}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default FlowingCategoryBar;
