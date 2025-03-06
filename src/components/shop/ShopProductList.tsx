
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getShopProducts } from '@/services/shopService';
import { Product } from '@/models/product';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface ShopProductListProps {
  shopId: string;
}

const ShopProductList = ({ shopId }: ShopProductListProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  
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
  
  const handleAddToCart = (product: Product, e?: React.MouseEvent) => {
    e?.stopPropagation();
    addToCart(product, 1);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };
  
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
    <div className="overflow-x-auto scrollbar-hide -mx-4 px-4" ref={scrollRef}>
      <div className="flex gap-4 pb-4">
        {products.map((product) => (
          <motion.div 
            key={product.id}
            className={`flex-shrink-0 w-32 bg-white rounded-md overflow-hidden ${
              selectedProduct === product.id ? 'scale-105 shadow-md' : ''
            }`}
            onClick={() => setSelectedProduct(
              selectedProduct === product.id ? null : product.id
            )}
            whileHover={{ y: -5 }}
            layout
          >
            {selectedProduct === product.id ? (
              // Expanded product card with details
              <div className="w-56">
                <div className="h-36 relative">
                  <img 
                    src={product.images[0] || '/placeholder.svg'} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <button 
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProduct(null);
                    }}
                  >
                    <Heart className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                
                <div className="p-3">
                  <Link to={`/product/${product.id}`}>
                    <h4 className="font-medium text-sm mb-1">{product.name}</h4>
                  </Link>
                  <p className="text-xs text-gray-500 mb-2 line-clamp-2">{product.description}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-[#2A866A]">${product.price.toFixed(2)}</span>
                  </div>
                  
                  <Button 
                    variant="default"
                    size="sm"
                    className="w-full bg-[#29866B] hover:bg-[#1e5c4a] text-white text-xs h-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                  >
                    <ShoppingCart className="w-3 h-3 mr-1" />
                    Add to cart
                  </Button>
                </div>
              </div>
            ) : (
              // Minimalist product card
              <div>
                {/* Product image */}
                <div className="h-32 relative">
                  <img 
                    src={product.images[0] || '/placeholder.svg'} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                    <button 
                      className="bg-white p-2 rounded-full shadow-sm transform translate-y-4 hover:translate-y-0 transition-transform"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product, e);
                      }}
                    >
                      <ShoppingCart className="w-3 h-3 text-[#2A866A]" />
                    </button>
                  </div>
                </div>
                
                {/* Product details */}
                <div className="p-2">
                  <h4 className="font-medium text-xs line-clamp-1">{product.name}</h4>
                  <div className="mt-1">
                    <span className="font-bold text-xs text-[#2A866A]">${product.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ShopProductList;
