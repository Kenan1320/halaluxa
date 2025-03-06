
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getShopProducts } from '@/services/shopService';
import { Product } from '@/models/product';
import { useCart } from '@/context/CartContext';

interface ShopProductListProps {
  shopId: string;
}

const ShopProductList = ({ shopId }: ShopProductListProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();
  
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const shopProducts = await getShopProducts(shopId);
        setProducts(shopProducts);
      } catch (error) {
        console.error('Error loading shop products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, [shopId]);
  
  if (isLoading) {
    return (
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 pb-4">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i}
              className="flex-shrink-0 w-40 h-48 bg-gray-100 rounded-md animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }
  
  if (!products.length) {
    return (
      <div className="text-center py-6 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No products available from this shop yet</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
      <div className="flex gap-4 pb-4">
        {products.map((product) => (
          <motion.div 
            key={product.id}
            className="flex-shrink-0 w-40 bg-white rounded-md border border-gray-200 overflow-hidden"
            whileHover={{ y: -5 }}
          >
            {/* Product image */}
            <div className="h-40 relative">
              <img 
                src={product.images[0] || '/placeholder.svg'} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <button 
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center"
                aria-label="Add to favorites"
              >
                <Heart className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            {/* Product details */}
            <div className="p-3">
              <h4 className="font-medium text-sm line-clamp-2 mb-1">{product.name}</h4>
              
              {/* Price with discount if applicable */}
              <div className="mb-2">
                <div className="font-bold text-lg">${product.price.toFixed(2)}</div>
                {product.price < 20 && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs line-through text-gray-500">
                      ${(product.price * 1.2).toFixed(2)}
                    </span>
                    <span className="text-xs font-medium text-green-600">
                      {Math.round(20)}% off
                    </span>
                  </div>
                )}
              </div>
              
              {/* Buttons */}
              <div className="space-y-2">
                <Button 
                  variant="default"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => addToCart(product, 1)}
                >
                  Add to cart
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  to={`/product/${product.id}`}
                >
                  Options
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ShopProductList;
