
import { motion } from 'framer-motion';
import { ShoppingBag, ShoppingCart, Utensils, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';

const categories = [
  {
    id: 'groceries',
    name: 'Groceries Near You',
    icon: <ShoppingCart className="h-6 w-6" />,
    link: '/browse?category=groceries',
    color: 'bg-green-500'
  },
  {
    id: 'online-shops',
    name: 'Online Shops',
    icon: <ShoppingBag className="h-6 w-6" />,
    link: '/browse?category=online',
    color: 'bg-blue-500'
  },
  {
    id: 'restaurants',
    name: 'Restaurants Near You',
    icon: <Utensils className="h-6 w-6" />,
    link: '/browse?category=restaurants',
    color: 'bg-red-500'
  },
  {
    id: 'essentials',
    name: 'Halal Essentials',
    icon: <Bookmark className="h-6 w-6" />,
    link: '/browse?category=essentials',
    color: 'bg-amber-500'
  }
];

export default function CategorySuggestions() {
  const { mode } = useTheme();

  return (
    <div className="py-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Shop By Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                  ? 'bg-gray-800 hover:bg-gray-700 shadow-[0_4px_12px_rgba(0,0,0,0.3)]' 
                  : 'bg-white hover:shadow-md shadow-sm'}`}
            >
              <div className={`w-12 h-12 rounded-full ${category.color} text-white flex items-center justify-center`}>
                {category.icon}
              </div>
              <span className={`text-sm font-medium text-center ${mode === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                {category.name}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
