
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { Category } from '@/models/types';

interface CategoryScrollMenuProps {
  categories: Category[];
}

const CategoryScrollMenu: React.FC<CategoryScrollMenuProps> = ({ categories }) => {
  const navigate = useNavigate();
  const { mode } = useTheme();
  
  // Create doubled array for continuous flow
  const doubledCategories = [...categories, ...categories];
  
  const handleCategoryClick = (category: Category) => {
    navigate(`/browse?category=${encodeURIComponent(category.name)}`);
  };
  
  return (
    <div className="w-full overflow-hidden py-2">
      <motion.div
        className="flex space-x-4 overflow-x-auto scrollbar-hide"
        initial={{ x: 0 }}
        animate={{ x: [0, -2000] }}
        transition={{ 
          repeat: Infinity, 
          duration: 60, 
          repeatType: "loop",
          ease: "linear"
        }}
      >
        {doubledCategories.map((category, index) => (
          <motion.div
            key={`${category.id}-${index}`}
            className={`flex-shrink-0 px-4 py-2 rounded-full cursor-pointer 
              ${mode === 'dark' 
                ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                : 'bg-white hover:bg-gray-50 text-gray-900 shadow-sm border border-gray-200'}
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCategoryClick(category)}
          >
            <div className="flex items-center space-x-2 whitespace-nowrap">
              {category.icon && (
                <span className="text-green-600 dark:text-green-400">{category.icon}</span>
              )}
              <span className="text-sm font-medium">{category.name}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default CategoryScrollMenu;
