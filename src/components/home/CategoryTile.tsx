
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, Shirt, Home, Heart, Coffee 
} from 'lucide-react';

interface CategoryTileProps {
  category: string;
  index: number;
}

const CategoryTile = ({ category, index }: CategoryTileProps) => {
  const getIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'groceries':
        return <ShoppingCart className="w-6 h-6" />;
      case 'clothing':
        return <Shirt className="w-6 h-6" />;
      case 'home essentials':
        return <Home className="w-6 h-6" />;
      case 'health & beauty':
        return <Heart className="w-6 h-6" />;
      default:
        return <Coffee className="w-6 h-6" />;
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      className="relative w-full"
    >
      <Link 
        to={`/browse?category=${category}`}
        className="block bg-white rounded-xl shadow-sm p-4 flex flex-col items-center justify-center aspect-square"
      >
        <div className="w-12 h-12 bg-haluna-primary-light rounded-full flex items-center justify-center mb-3">
          {getIcon(category)}
        </div>
        <span className="text-center text-sm font-medium">{category}</span>
      </Link>
    </motion.div>
  );
};

export default CategoryTile;
