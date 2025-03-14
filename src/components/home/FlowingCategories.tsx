
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { getCategories, Category } from '@/services/categoryService';
import { getCategoryIcon } from '../icons/CategoryIcons';

const FlowingCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [visibleCategories, setVisibleCategories] = useState<Category[]>([]);
  const { mode } = useTheme();
  
  useEffect(() => {
    const loadCategories = async () => {
      const data = await getCategories();
      setCategories(data);
      // Initialize with some categories
      setVisibleCategories(data.slice(0, 6));
    };
    
    loadCategories();
    
    // Set up interval to rotate categories
    const interval = setInterval(() => {
      setVisibleCategories(prevCategories => {
        // Get random categories that are not currently visible
        const availableCategories = categories.filter(
          cat => !prevCategories.some(visibleCat => visibleCat.id === cat.id)
        );
        
        if (availableCategories.length === 0) return prevCategories;
        
        // Replace one random category
        const newCategories = [...prevCategories];
        const randomIndex = Math.floor(Math.random() * newCategories.length);
        const randomNewCategory = availableCategories[Math.floor(Math.random() * availableCategories.length)];
        
        newCategories[randomIndex] = randomNewCategory;
        return newCategories;
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, [categories]);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };
  
  return (
    <motion.div
      className="grid grid-cols-3 sm:grid-cols-6 gap-4 py-4 bg-white rounded-xl shadow-sm p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {visibleCategories.map((category) => (
        <motion.div
          key={category.id}
          className="flex flex-col items-center justify-center text-center"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to={`/browse?category=${encodeURIComponent(category.name)}`} className="w-full">
            <div 
              className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2 shadow-sm ${
                mode === 'dark' ? 'bg-gray-800' : 'bg-[#F8F9FB]'
              }`}
            >
              {getCategoryIcon(category.name, `w-8 h-8 ${mode === 'dark' ? 'text-gray-200' : 'text-[#29866B]'}`)}
            </div>
            <span className="text-xs font-medium block">
              {category.name}
            </span>
          </Link>
        </motion.div>
      ))}

      {/* Demo categories for UI testing */}
      {categories.length === 0 && (
        <>
          <motion.div variants={itemVariants}>
            <div className={`w-16 h-16 rounded-full ${mode === 'dark' ? 'bg-gray-800' : 'bg-[#F8F9FB]'} mx-auto flex items-center justify-center mb-2`}>
              {getCategoryIcon('Groceries', `w-8 h-8 ${mode === 'dark' ? 'text-gray-200' : 'text-[#29866B]'}`)}
            </div>
            <span className="text-xs font-medium block text-center">Groceries</span>
          </motion.div>
          <motion.div variants={itemVariants}>
            <div className={`w-16 h-16 rounded-full ${mode === 'dark' ? 'bg-gray-800' : 'bg-[#F8F9FB]'} mx-auto flex items-center justify-center mb-2`}>
              {getCategoryIcon('Restaurants', `w-8 h-8 ${mode === 'dark' ? 'text-gray-200' : 'text-[#29866B]'}`)}
            </div>
            <span className="text-xs font-medium block text-center">Restaurants</span>
          </motion.div>
          <motion.div variants={itemVariants}>
            <div className={`w-16 h-16 rounded-full ${mode === 'dark' ? 'bg-gray-800' : 'bg-[#F8F9FB]'} mx-auto flex items-center justify-center mb-2`}>
              {getCategoryIcon('Halal Meat', `w-8 h-8 ${mode === 'dark' ? 'text-gray-200' : 'text-[#29866B]'}`)}
            </div>
            <span className="text-xs font-medium block text-center">Halal Meat</span>
          </motion.div>
          <motion.div variants={itemVariants}>
            <div className={`w-16 h-16 rounded-full ${mode === 'dark' ? 'bg-gray-800' : 'bg-[#F8F9FB]'} mx-auto flex items-center justify-center mb-2`}>
              {getCategoryIcon('Coffee Shops', `w-8 h-8 ${mode === 'dark' ? 'text-gray-200' : 'text-[#29866B]'}`)}
            </div>
            <span className="text-xs font-medium block text-center">Coffee Shops</span>
          </motion.div>
          <motion.div variants={itemVariants}>
            <div className={`w-16 h-16 rounded-full ${mode === 'dark' ? 'bg-gray-800' : 'bg-[#F8F9FB]'} mx-auto flex items-center justify-center mb-2`}>
              {getCategoryIcon('Books', `w-8 h-8 ${mode === 'dark' ? 'text-gray-200' : 'text-[#29866B]'}`)}
            </div>
            <span className="text-xs font-medium block text-center">Books</span>
          </motion.div>
          <motion.div variants={itemVariants}>
            <div className={`w-16 h-16 rounded-full ${mode === 'dark' ? 'bg-gray-800' : 'bg-[#F8F9FB]'} mx-auto flex items-center justify-center mb-2`}>
              {getCategoryIcon('Thobes', `w-8 h-8 ${mode === 'dark' ? 'text-gray-200' : 'text-[#29866B]'}`)}
            </div>
            <span className="text-xs font-medium block text-center">Thobes</span>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default FlowingCategories;
