
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getFeaturedProducts } from '@/services/productService';
import { Product } from '@/models/product';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { cart, addToCart } = useCart();
  
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const featuredProducts = await getFeaturedProducts();
        setProducts(featuredProducts);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, []);
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4 my-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-3 animate-pulse">
            <div className="h-40 bg-gray-200 rounded-md mb-3"></div>
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-3 gap-4 my-6">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          className="bg-white rounded-lg shadow-sm overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
        >
          <Link to={`/product/${product.id}`} className="block">
            <div className="h-40 overflow-hidden relative">
              {product.images && product.images[0] ? (
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
              
              {product.isHalalCertified && (
                <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                  Halal
                </div>
              )}
            </div>
            
            <div className="p-3">
              <h3 className="font-medium text-sm line-clamp-2 mb-1">{product.name}</h3>
              <div className="flex justify-between items-center">
                <span className="text-green-600 font-medium">${product.price.toFixed(2)}</span>
                
                <motion.button
                  className="text-orange-400 p-1 rounded-full hover:bg-orange-50"
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addToCart(product, 1);
                  }}
                >
                  <ShoppingCart className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default ProductGrid;
