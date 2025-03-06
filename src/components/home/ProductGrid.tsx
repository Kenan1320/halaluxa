
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getFeaturedProducts } from '@/services/productService';
import { Product } from '@/models/product';
import { Link } from 'react-router-dom';
import { ShoppingCart, Info, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
            className="h-full overflow-hidden hover:shadow-md transition-shadow"
            onClick={() => handleCardClick(product.id)}
          >
            <div className={`relative ${expandedProduct === product.id ? 'h-48' : 'h-36'}`}>
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
              
              <motion.button
                className="absolute top-2 right-2 text-[#FF7A45] p-1.5 rounded-full hover:bg-white/80"
                whileTap={{ scale: 0.9 }}
              >
                <Heart className="h-4 w-4" />
              </motion.button>
            </div>
            
            <CardContent className="p-3">
              <h3 className="font-medium text-sm line-clamp-2 mb-1">
                {product.name}
              </h3>
              
              <div className="flex justify-between items-center mt-1">
                <span className="text-[#2A866A] font-bold">${product.price.toFixed(2)}</span>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#FF7A45] p-1.5 hover:bg-orange-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product, 1);
                  }}
                >
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </div>
              
              {expandedProduct === product.id && (
                <Button 
                  variant="default"
                  size="sm"
                  className="w-full mt-3"
                  asChild
                >
                  <Link to={`/product/${product.id}`}>View Details</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default ProductGrid;
