
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface Category {
  id: string;
  name: string;
  icon: string;
  link: string;
}

interface CategoryGridProps {
  categories: Category[];
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
  return (
    <div className="grid grid-cols-4 gap-3 mt-6">
      {categories.map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          whileHover={{ y: -5 }}
        >
          <Link 
            to={category.link} 
            className="flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-lg overflow-hidden mb-2">
              <img 
                src={category.icon} 
                alt={category.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs text-center font-medium">
              {category.name}
            </span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default CategoryGrid;
