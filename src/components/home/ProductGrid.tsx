
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getFeaturedProducts } from '@/services/productService';
import { Product } from '@/models/product';
import { Link } from 'react-router-dom';
import { ShoppingCart, Info, Heart, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const { cart, addToCart } = useCart();
  const { toast } = useToast();
  
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
      <div className="grid grid-cols-3 gap-4 my-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
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
  
  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };
  
  return (
    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-3 my-4">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          layout
          className={`relative ${expandedProduct === product.id ? 'col-span-2 row-span-2 z-10' : ''}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => handleCardClick(product.id)}
        >
          {expandedProduct === product.id ? (
            // Expanded product view
            <Card className="shadow-md overflow-hidden">
              <div className="h-48 relative">
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
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 text-white bg-black/30 hover:bg-black/50 p-1 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedProduct(null);
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-medium mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[#2A866A] font-bold">${product.price.toFixed(2)}</span>
                    {product.compareAtPrice && (
                      <span className="text-xs text-gray-500 line-through ml-2">
                        ${product.compareAtPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-[#FF7A45] hover:bg-[#e86a3a]"
                    onClick={(e) => handleAddToCart(product, e)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Add to Cart
                  </Button>
                </div>
                
                <Button 
                  variant="outline"
                  size="sm"
                  className="w-full mt-3 border-[#2A866A] text-[#2A866A] hover:bg-[#2A866A] hover:text-white"
                >
                  <Link to={`/product/${product.id}`} className="w-full h-full flex items-center justify-center">
                    View Details
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            // Collapsed product view - sleek and borderless
            <div className="group">
              <div className="relative h-32 sm:h-36 rounded-lg overflow-hidden mb-2">
                {product.images && product.images[0] ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
                
                <button
                  className="absolute top-2 right-2 text-white bg-black/30 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add to wishlist
                  }}
                >
                  <Heart className="h-3 w-3" />
                </button>
                
                {product.compareAtPrice && (
                  <div className="absolute top-2 left-2 bg-[#FF7A45] text-white text-xs px-1.5 py-0.5 rounded">
                    Sale
                  </div>
                )}
              </div>
              
              <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
              
              <div className="flex items-center justify-between mt-1">
                <div className="flex flex-col">
                  <span className="text-[#2A866A] font-bold text-sm">${product.price.toFixed(2)}</span>
                  {product.compareAtPrice && (
                    <span className="text-xs text-gray-500 line-through">
                      ${product.compareAtPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                
                <button
                  className="text-[#FF7A45] p-1 rounded-full hover:bg-[#FF7A45]/10 transition-colors"
                  onClick={(e) => handleAddToCart(product, e)}
                >
                  <ShoppingCart className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default ProductGrid;
