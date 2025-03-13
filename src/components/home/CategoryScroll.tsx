
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { getCategoryIcon } from '../icons/CategoryIcons';
import { Category, getCategories } from '@/services/categoryService';

const CategoryScroll = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const { mode } = useTheme();
  
  // Only display these top categories
  const topCategoryNames = ['Online Shops', 'Restaurants', 'Groceries', 'Halal Meat', 'Clothing'];
  
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const allCategories = await getCategories();
        
        // Filter to only show the specified top categories
        const filteredCategories = allCategories.filter(cat => 
          topCategoryNames.includes(cat.name)
        );
        
        // Sort them in the order specified in topCategoryNames
        const sortedCategories = [...filteredCategories].sort((a, b) => {
          return topCategoryNames.indexOf(a.name) - topCategoryNames.indexOf(b.name);
        });
        
        setCategories(sortedCategories);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    
    loadCategories();
  }, []);
  
  return (
    <div className="overflow-x-auto scrollbar-none">
      <div className="flex space-x-6 pb-1 pt-1">
        {categories.map((category) => (
          <Link 
            key={category.id}
            to={`/browse?category=${encodeURIComponent(category.name)}`}
            className="flex-shrink-0"
          >
            <motion.div
              className="w-12 h-12 flex items-center justify-center"
              whileHover={{ 
                scale: 1.1, 
                rotateY: 10,
                rotateX: 10
              }}
              style={{ 
                transformStyle: "preserve-3d", 
                perspective: "500px" 
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {getCategoryIcon(category.name, `w-10 h-10 ${mode === 'dark' ? 'text-white' : 'text-[#2A866A]'}`)}
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryScroll;
