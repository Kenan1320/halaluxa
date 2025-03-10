
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Product } from '@/models/product';
import { getShopProducts } from '@/services/shopService';
import EmptyProductCard from './EmptyProductCard';

interface ShopProductListProps {
  shopId: string;
  initialProducts?: Product[]; // Optional products passed in from parent
  horizontal?: boolean; // Control layout - horizontal or grid
}

const ShopProductList = ({ shopId, initialProducts, horizontal = true }: ShopProductListProps) => {
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [isLoading, setIsLoading] = useState(!initialProducts);
  const navigate = useNavigate();

  useEffect(() => {
    // If products were passed as props, use them instead of fetching
    if (initialProducts) {
      setProducts(initialProducts);
      setIsLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const shopProducts = await getShopProducts(shopId);
        setProducts(shopProducts);
      } catch (error) {
        console.error('Error fetching shop products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [shopId, initialProducts]);

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  if (isLoading) {
    return (
      <div className={`${horizontal ? 'flex overflow-x-auto scrollbar-hide' : 'grid grid-cols-2 md:grid-cols-3 gap-4'} pb-4`}>
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className={`${horizontal ? 'flex-shrink-0 w-48 md:w-56 mr-4' : ''} h-48 md:h-64 bg-muted rounded-lg animate-pulse`} 
          />
        ))}
      </div>
    );
  }

  // If no products are available, show empty product cards
  if (products.length === 0) {
    return (
      <div className={`${horizontal ? 'flex overflow-x-auto scrollbar-hide' : 'grid grid-cols-2 md:grid-cols-3 gap-4'} pb-4`}>
        {[...Array(5)].map((_, index) => (
          <div className={`${horizontal ? 'flex-shrink-0 w-48 md:w-56 mr-4' : ''}`} key={index}>
            <EmptyProductCard index={index} />
          </div>
        ))}
      </div>
    );
  }

  // If products exist, display them
  return (
    <div className={`${horizontal ? 'flex overflow-x-auto scrollbar-hide' : 'grid grid-cols-2 md:grid-cols-3 gap-4'} pb-4`}>
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          className={`bg-card rounded-lg shadow-sm overflow-hidden cursor-pointer relative ${
            horizontal ? 'flex-shrink-0 w-48 md:w-56 mr-4' : ''
          } h-48 md:h-64`}
          whileHover={{ y: -5, boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }}
          onClick={() => handleProductClick(product.id)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <div className="h-2/3 overflow-hidden">
            <img
              src={product.images[0] || '/placeholder.svg'}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="p-3">
            <p className="font-medium text-sm line-clamp-1">{product.name}</p>
            <div className="flex justify-between items-center mt-1">
              <span className="text-primary font-bold">${product.price.toFixed(2)}</span>
              {product.isHalalCertified && (
                <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">Halal</span>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ShopProductList;
