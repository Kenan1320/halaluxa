
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { getCategoryIcon } from '@/components/icons/CategoryIcons';

interface CategoryButtonProps {
  name: string;
  to: string;
  active?: boolean;
  onClick?: () => void;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({ 
  name, 
  to, 
  active = false,
  onClick 
}) => {
  const { mode } = useTheme();
  
  const handleClick = () => {
    if (onClick) onClick();
  };
  
  return (
    <Link to={to} onClick={handleClick}>
      <motion.div
        className={`flex flex-col items-center justify-center p-2 ${
          active
            ? (mode === 'dark' 
                ? 'bg-gray-800 text-white' 
                : 'bg-gray-200 text-gray-900')
            : (mode === 'dark' 
                ? 'text-gray-300 hover:bg-gray-800' 
                : 'text-gray-500 hover:bg-gray-100')
        } rounded-xl transition-colors`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className={`w-12 h-12 flex items-center justify-center rounded-full mb-2 ${
          active
            ? (mode === 'dark' 
                ? 'bg-gray-700' 
                : 'bg-gray-300')
            : (mode === 'dark' 
                ? 'bg-gray-800' 
                : 'bg-gray-100')
        }`}>
          {getCategoryIcon(name, 'w-6 h-6')}
        </div>
        <span className="text-xs font-medium">{name}</span>
      </motion.div>
    </Link>
  );
};

export default CategoryButton;
