
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/models/product';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart`,
    });
  };

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/product/${product.id}`} className="block relative h-48 overflow-hidden">
        <img
          src={product.images?.[0] || '/placeholder.svg'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <button className="bg-white p-2 rounded-full shadow-sm hover:bg-haluna-primary-light transition">
            <Heart className="h-4 w-4 text-haluna-text" />
          </button>
        </div>
        {product.is_halal_certified && (
          <div className="absolute top-3 left-3 bg-haluna-primary text-white text-xs px-2 py-1 rounded-full">
            Halal Certified
          </div>
        )}
      </Link>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <Link to={`/product/${product.id}`} className="font-medium text-haluna-text hover:text-haluna-primary transition-colors">
              {product.name}
            </Link>
            <p className="text-xs text-haluna-text-light">{product.category}</p>
          </div>
          <p className="font-bold text-haluna-primary">${product.price.toFixed(2)}</p>
        </div>
        
        <p className="text-sm text-haluna-text-light mb-2 line-clamp-2">
          {product.description}
        </p>
        
        <Link to={`/shop/${product.sellerId}`} className="text-xs text-haluna-primary hover:underline mb-3 inline-block">
          {product.sellerName || "Haluna Seller"}
        </Link>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < (product.rating || 5) ? 'fill-current' : ''}`} />
            ))}
            <span className="text-xs text-haluna-text-light ml-1">{product.rating || 5.0}</span>
          </div>
          
          <Button 
            size="sm"
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="transition-transform hover:scale-105"
          >
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
