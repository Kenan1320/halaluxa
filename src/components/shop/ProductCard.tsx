
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star } from 'lucide-react';
import { Product } from '@/models/product';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <motion.div 
      className={cn(
        "bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm group",
        className
      )}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-square overflow-hidden relative">
          {product.images && product.images.length > 0 ? (
            <img 
              src={product.images[0]} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400 dark:text-gray-500">No image</span>
            </div>
          )}
          
          {/* Top right actions */}
          <button 
            className="absolute top-2 right-2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toast({
                title: "Favorite",
                description: "Added to favorites",
              });
            }}
          >
            <Heart className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          </button>
          
          {/* Labels */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isHalalCertified && (
              <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/80 text-green-800 dark:text-green-100 rounded-md backdrop-blur-sm">
                Halal Certified
              </span>
            )}
            {product.inStock === false && (
              <span className="px-2 py-1 text-xs font-medium bg-red-100 dark:bg-red-900/80 text-red-800 dark:text-red-100 rounded-md backdrop-blur-sm">
                Out of Stock
              </span>
            )}
          </div>
        </div>
        
        <div className="p-3">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-1">
              {product.name}
            </h3>
            <p className="font-bold text-gray-900 dark:text-white text-sm">
              {formatCurrency(product.price)}
            </p>
          </div>
          
          {/* Rating & Category */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {product.category}
            </span>
            <div className="flex items-center">
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
              <span className="text-xs text-gray-600 dark:text-gray-300 ml-1">
                {product.rating || 5.0}
              </span>
            </div>
          </div>
          
          {/* Seller name and add to cart */}
          <div className="flex items-center justify-between">
            {'sellerName' in product && (
              <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                {product.sellerName || "Halvi Seller"}
              </span>
            )}
            
            <button
              onClick={handleAddToCart}
              disabled={product.inStock === false}
              className={cn(
                "p-2 rounded-lg text-white transition-colors",
                product.inStock !== false 
                  ? "bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600" 
                  : "bg-gray-300 dark:bg-gray-700 cursor-not-allowed opacity-60"
              )}
            >
              <ShoppingBag className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
