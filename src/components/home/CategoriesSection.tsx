
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, Shirt, Home, Utensils, Apple, Heart 
} from 'lucide-react';

const categories = [
  { id: 'groceries', name: 'Groceries', icon: ShoppingCart, color: 'bg-green-100' },
  { id: 'clothing', name: 'Clothing', icon: Shirt, color: 'bg-blue-100' },
  { id: 'home', name: 'Home', icon: Home, color: 'bg-yellow-100' },
  { id: 'food', name: 'Food', icon: Utensils, color: 'bg-red-100' },
  { id: 'health', name: 'Health', icon: Heart, color: 'bg-purple-100' },
  { id: 'produce', name: 'Produce', icon: Apple, color: 'bg-emerald-100' }
];

const CategoriesSection = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {categories.map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
        >
          <Link
            to={`/browse?category=${category.id}`}
            className={`block ${category.color} rounded-xl p-6 text-center hover:shadow-md transition-shadow`}
          >
            <category.icon className="w-8 h-8 mx-auto mb-2 text-gray-700" />
            <span className="text-sm font-medium text-gray-700">
              {category.name}
            </span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default CategoriesSection;
