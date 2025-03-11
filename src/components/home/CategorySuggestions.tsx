
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ShoppingCart, Utensils, BookOpen, Shirt, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';

const localCategories = [
  {
    id: 'groceries',
    name: 'Groceries',
    icon: <ShoppingCart className="h-6 w-6" />,
    link: '/browse?category=groceries',
  },
  {
    id: 'restaurants',
    name: 'Restaurants',
    icon: <Utensils className="h-6 w-6" />,
    link: '/browse?category=restaurants',
  },
  {
    id: 'halal-items',
    name: 'Halal Items',
    icon: <ShoppingBag className="h-6 w-6" />,
    link: '/browse?category=halal-essentials',
  }
];

const onlineCategories = [
  {
    id: 'online-shops',
    name: 'Online Shops',
    icon: <ShoppingBag className="h-6 w-6" />,
    link: '/browse?category=online',
  },
  {
    id: 'clothing',
    name: 'Clothing',
    icon: <Shirt className="h-6 w-6" />,
    link: '/browse?category=clothing',
  },
  {
    id: 'learning',
    name: 'Learning',
    icon: <GraduationCap className="h-6 w-6" />,
    link: '/browse?category=learning',
  }
];

export default function CategorySuggestions() {
  const { mode } = useTheme();
  const [activeTab, setActiveTab] = useState<'nearby' | 'online'>('nearby');
  const categories = activeTab === 'nearby' ? localCategories : onlineCategories;

  return (
    <div className="py-4">
      <div className="flex justify-between items-center mb-4">
        <div className="inline-flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'nearby'
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-200'
            }`}
            onClick={() => setActiveTab('nearby')}
          >
            Shop Nearby
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'online'
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-200'
            }`}
            onClick={() => setActiveTab('online')}
          >
            Shop Online
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            className="group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <Link 
              to={category.link}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300
                ${mode === 'dark' 
                  ? 'bg-gray-800 hover:bg-gray-700 shadow-lg' 
                  : 'bg-white hover:shadow-md shadow-sm'}`}
            >
              <div className={`w-12 h-12 rounded-full ${
                mode === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
              } flex items-center justify-center ${
                mode === 'dark' ? 'text-white' : 'text-black'
              }`}>
                {category.icon}
              </div>
              <span className={`text-sm font-medium text-center ${
                mode === 'dark' ? 'text-white' : 'text-black'
              }`}>
                {category.name}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
