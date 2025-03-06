
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, Shirt, Home, Utensils, Apple, Heart 
} from 'lucide-react';

const categories = [
  { id: 'groceries', name: 'Groceries', icon: ShoppingCart, color: 'bg-emerald-50 text-emerald-600' },
  { id: 'clothing', name: 'Clothing', icon: Shirt, color: 'bg-blue-50 text-blue-600' },
  { id: 'home', name: 'Home', icon: Home, color: 'bg-amber-50 text-amber-600' },
  { id: 'food', name: 'Food', icon: Utensils, color: 'bg-red-50 text-red-600' },
  { id: 'health', name: 'Health', icon: Heart, color: 'bg-purple-50 text-purple-600' },
  { id: 'produce', name: 'Produce', icon: Apple, color: 'bg-green-50 text-green-600' }
];

const CategoriesSection = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {categories.map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={{ scale: 1.03 }}
          className="group"
        >
          <Link
            to={`/browse?category=${category.id}`}
            className={`block ${category.color} rounded-xl p-6 text-center transition-all duration-200 hover:shadow-lg`}
          >
            <category.icon className="w-8 h-8 mx-auto mb-3" />
            <span className="text-sm font-medium">
              {category.name}
            </span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default CategoriesSection;
