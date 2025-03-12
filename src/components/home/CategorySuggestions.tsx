
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { getCategoryIcon } from '../icons/CategoryIcons';

const localCategories = [
  {
    id: 'groceries',
    name: 'Groceries',
    link: '/browse?category=Groceries',
  },
  {
    id: 'restaurants',
    name: 'Restaurants',
    link: '/browse?category=Restaurants',
  },
  {
    id: 'halal-meat',
    name: 'Halal Meat',
    link: '/browse?category=Halal%20Meat',
  },
  {
    id: 'thobes',
    name: 'Thobes',
    link: '/browse?category=Thobes',
  },
  {
    id: 'furniture',
    name: 'Furniture',
    link: '/browse?category=Furniture',
  }
];

const onlineCategories = [
  {
    id: 'thobes',
    name: 'Thobes',
    link: '/browse?category=Thobes',
  },
  {
    id: 'books',
    name: 'Books',
    link: '/browse?category=Books',
  },
  {
    id: 'furniture',
    name: 'Furniture',
    link: '/browse?category=Furniture',
  },
  {
    id: 'gifts',
    name: 'Gifts',
    link: '/browse?category=Gifts',
  },
  {
    id: 'decorations',
    name: 'Decorations',
    link: '/browse?category=Decorations',
  }
];

export default function CategorySuggestions() {
  const { mode } = useTheme();
  const [activeTab, setActiveTab] = useState<'nearby' | 'online'>('nearby');
  const categories = activeTab === 'nearby' ? localCategories : onlineCategories;

  return (
    <div className="py-2">
      <div className="flex justify-between items-center mb-2">
        <div className="inline-flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 text-sm">
          <button
            className={`px-3 py-1 text-sm font-medium ${
              activeTab === 'nearby'
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'bg-white text-black dark:bg-gray-800 dark:text-white'
            }`}
            onClick={() => setActiveTab('nearby')}
          >
            Shop Nearby
          </button>
          <button
            className={`px-3 py-1 text-sm font-medium ${
              activeTab === 'online'
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'bg-white text-black dark:bg-gray-800 dark:text-white'
            }`}
            onClick={() => setActiveTab('online')}
          >
            Shop Online
          </button>
        </div>
      </div>

      <div className="flex overflow-x-auto scroll-smooth scrollbar-hide gap-3 pb-2">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            className="flex-shrink-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <Link 
              to={category.link}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-300`}
            >
              <div className="w-14 h-14 flex items-center justify-center">
                {getCategoryIcon(category.name, "w-12 h-12")}
              </div>
              <span className={`text-sm font-medium text-center mt-1 ${
                mode === 'dark' ? 'text-white' : 'text-black'
              }`}>
                {category.name}
              </span>
            </Link>
          </motion.div>
        ))}
        {/* This empty div shows part of the next item to indicate scrollability */}
        <div className="flex-shrink-0 w-3"></div>
      </div>
    </div>
  );
};
