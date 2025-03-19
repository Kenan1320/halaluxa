
import React from 'react';
import { Link } from 'react-router-dom';
import { getCategoryIcon } from '@/components/icons/CategoryIcons';
import { motion } from 'framer-motion';

// Standard categories to be used across the platform
const categories = [
  { id: 'groceries', name: 'Groceries' },
  { id: 'halal-meat', name: 'Halal Meat' },
  { id: 'restaurants', name: 'Restaurants' },
  { id: 'thobes', name: 'Thobes' },
  { id: 'abayas', name: 'Abayas' },
  { id: 'hijabs', name: 'Hijabs' },
  { id: 'furniture', name: 'Furniture' },
  { id: 'decorations', name: 'Decorations' },
  { id: 'books', name: 'Books' }
];

// Only show a subset of categories in the suggestions
const displayCategories = categories.slice(0, 6);

const CategorySuggestions = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="my-6">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-3 gap-3"
      >
        {displayCategories.map((category, index) => (
          <motion.div key={category.id} variants={item}>
            <Link
              to={`/category/${category.id}`}
              className="flex flex-col items-center bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-xl p-4 transition-all"
            >
              <div className="text-gray-600 dark:text-gray-300">
                {getCategoryIcon(category.name)}
              </div>
              <span className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                {category.name}
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default CategorySuggestions;
