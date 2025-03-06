
import { motion } from 'framer-motion';
import { Product } from '@/models/product';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from 'react';
import { Button } from '../ui/button';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        whileHover={{ y: -5 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer"
        onClick={() => setShowDetails(true)}
      >
        <div className="aspect-square relative">
          <img
            src={product.images[0] || '/placeholder.svg'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-medium">Out of Stock</span>
            </div>
          )}
        </div>
        
        <div className="p-3">
          <p className={`text-lg font-bold ${product.stock > 0 ? 'text-haluna-primary' : 'text-gray-400'}`}>
            ${product.price.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600 truncate">{product.name}</p>
          {product.stock > 0 && (
            <Button
              size="sm"
              className="w-full mt-2"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          )}
        </div>
      </motion.div>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{product.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <img
              src={product.images[0] || '/placeholder.svg'}
              alt={product.name}
              className="w-full h-48 object-cover rounded-lg"
            />
            <p className="text-sm text-gray-600">{product.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-haluna-primary">
                ${product.price.toFixed(2)}
              </span>
              <Button asChild variant="outline">
                <Link to={`/product/${product.id}`}>
                  View Details
                </Link>
              </Button>
            </div>
            {product.stock > 0 ? (
              <Button className="w-full" onClick={handleAddToCart}>
                Add to Cart
              </Button>
            ) : (
              <Button className="w-full" disabled>
                Out of Stock
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductCard;
