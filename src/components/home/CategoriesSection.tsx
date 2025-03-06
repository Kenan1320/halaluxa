
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, Shirt, Home, Utensils, Apple, Heart, Store, Gift, Book 
} from 'lucide-react';

const categories = [
  { id: 'groceries', name: 'Groceries', icon: ShoppingCart, color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  { id: 'clothing', name: 'Clothing', icon: Shirt, color: 'bg-blue-50 text-blue-600 border-blue-200' },
  { id: 'home', name: 'Home Goods', icon: Home, color: 'bg-amber-50 text-amber-600 border-amber-200' },
  { id: 'food', name: 'Restaurants', icon: Utensils, color: 'bg-red-50 text-red-600 border-red-200' },
  { id: 'health', name: 'Health & Beauty', icon: Heart, color: 'bg-purple-50 text-purple-600 border-purple-200' },
  { id: 'produce', name: 'Fresh Produce', icon: Apple, color: 'bg-green-50 text-green-600 border-green-200' },
  { id: 'retail', name: 'Retail Shops', icon: Store, color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
  { id: 'gifts', name: 'Gifts', icon: Gift, color: 'bg-pink-50 text-pink-600 border-pink-200' },
  { id: 'books', name: 'Books', icon: Book, color: 'bg-teal-50 text-teal-600 border-teal-200' }
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
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const iconVariants = {
    hover: { 
      scale: 1.1, 
      rotate: [0, 5, -5, 0],
      transition: { 
        duration: 0.6,
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      } 
    },
  };

  return (
    <motion.div 
      className="grid grid-cols-3 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {categories.map((category) => (
        <motion.div
          key={category.id}
          variants={itemVariants}
          whileHover="hover"
          className="group"
        >
          <Link
            to={`/browse?category=${category.id}`}
            className={`flex flex-col items-center justify-center p-5 rounded-xl ${category.color} transition-all duration-300 shadow-sm border hover:shadow-md`}
          >
            <motion.div
              variants={iconVariants}
              className="relative"
            >
              {/* Background glow effect */}
              <motion.div 
                className={`absolute inset-0 rounded-full ${category.color.split(' ')[0]} opacity-40 blur-md`}
                animate={{ 
                  scale: [1, 1.2, 1],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse" 
                }}
              />
              
              <category.icon className="w-9 h-9 mb-3 relative z-10" />
            </motion.div>
            
            <motion.span 
              className="text-sm font-medium text-center"
              whileHover={{ scale: 1.05 }}
            >
              {category.name}
            </motion.span>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default CategoriesSection;
