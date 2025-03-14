
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { ShopProduct } from '@/models/shop';

interface SnoonuProductCardProps {
  product: ShopProduct;
  isPromo?: boolean;
}

const SnoonuProductCard: React.FC<SnoonuProductCardProps> = ({ 
  product, 
  isPromo = false 
}) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart(product, 1);
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="rounded-xl overflow-hidden bg-white shadow-sm relative"
    >
      {isPromo && (
        <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
          Promo
        </div>
      )}
      
      {product.is_halal_certified && (
        <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
          Halal
        </div>
      )}
      
      <Link to={`/product/${product.id}`}>
        <div className="h-36 overflow-hidden">
          <img 
            src={product.images[0] || '/placeholder-product.png'} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="p-3">
          <h3 className="font-medium text-sm line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
          
          <div className="flex items-center justify-between mt-2">
            <span className="font-bold text-lg text-red-600">
              {product.price.toFixed(2)} QR
            </span>
            
            <button
              onClick={handleAddToCart}
              className="bg-white border border-gray-200 text-black px-4 py-2 rounded-full font-medium hover:bg-gray-50 transition"
            >
              Add
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default SnoonuProductCard;
