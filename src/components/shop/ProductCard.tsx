
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/models/product';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <motion.div 
      className="group rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 bg-white dark:bg-gray-800"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-square overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <img 
              src={product.images[0]} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400">No image</span>
            </div>
          )}
        </div>
        
        <div className="p-3">
          <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1 mb-1">{product.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">{product.description}</p>
          
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-900 dark:text-white">
              {formatCurrency(product.price)}
            </span>
            
            {product.is_halal_certified && (
              <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                Halal
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
