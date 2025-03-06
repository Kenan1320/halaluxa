
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getFeaturedProducts } from '@/services/productService';
import { Product } from '@/models/product';
import { Link } from 'react-router-dom';
import { ShoppingCart, Info } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Card, CardContent } from '@/components/ui/card';

const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
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
  
  const handleCardClick = (productId: string) => {
    if (expandedProduct === productId) {
      setExpandedProduct(null);
    } else {
      setExpandedProduct(productId);
    }
  };
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 my-6">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          layout
          className={`${expandedProduct === product.id ? 'col-span-2 row-span-2 z-10' : ''}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card 
            className="h-full overflow-hidden hover:shadow-md transition-shadow duration-200"
            onClick={() => handleCardClick(product.id)}
          >
            <div className={`relative ${expandedProduct === product.id ? 'h-48' : 'h-36'} overflow-hidden`}>
              {product.images && product.images[0] ? (
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
              
              {product.isHalalCertified && (
                <div className="absolute top-2 right-2 bg-[#2A866A]/10 text-[#2A866A] text-xs font-medium px-2 py-0.5 rounded-full">
                  Halal
                </div>
              )}
            </div>
            
            <CardContent className={`p-3 ${expandedProduct === product.id ? 'pb-4' : 'pb-2'}`}>
              <h3 className={`font-medium ${expandedProduct === product.id ? 'text-base' : 'text-sm'} line-clamp-2 mb-1`}>
                {product.name}
              </h3>
              
              {expandedProduct === product.id && (
                <p className="text-xs text-gray-600 mb-2 line-clamp-3">{product.description}</p>
              )}
              
              <div className="flex justify-between items-center mt-1">
                <span className="text-[#2A866A] font-medium text-sm">${product.price.toFixed(2)}</span>
                
                <motion.button
                  className="text-[#FF7A45] p-1.5 rounded-full hover:bg-orange-50"
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product, 1);
                  }}
                >
                  <ShoppingCart className="h-4 w-4" />
                </motion.button>
              </div>
              
              {expandedProduct === product.id && (
                <div className="mt-3 pt-2 border-t border-gray-100">
                  <Link 
                    to={`/product/${product.id}`} 
                    className="flex items-center justify-center text-xs text-[#2A866A] hover:underline"
                  >
                    <Info className="h-3 w-3 mr-1" />
                    View details
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default ProductGrid;
