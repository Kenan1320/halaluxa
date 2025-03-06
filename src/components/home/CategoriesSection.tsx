
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
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="grid grid-cols-3 gap-3"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {categories.map((category) => (
        <motion.div
          key={category.id}
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          className="group"
          transition={{ duration: 0.3 }}
        >
          <Link
            to={`/browse?category=${category.id}`}
            className={`flex flex-col items-center justify-center p-4 rounded-lg ${category.color} transition-all duration-200 shadow-sm`}
          >
            <category.icon className="w-8 h-8 mb-2" />
            <span className="text-xs font-medium text-center">
              {category.name}
            </span>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default CategoriesSection;
