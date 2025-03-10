
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Product } from '@/models/product';
import { getShopProducts } from '@/services/shopService';
import EmptyProductCard from './EmptyProductCard';

interface ShopProductListProps {
  shopId: string;
}

const ShopProductList = ({ shopId }: ShopProductListProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
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
  }, [shopId]);

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-48 md:h-64 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {products.length > 0 ? (
        products.map((product, index) => (
          <motion.div
            key={product.id}
            className="bg-card rounded-lg shadow-sm overflow-hidden cursor-pointer h-48 md:h-64 relative"
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
        ))
      ) : (
        // Display empty product cards when no products are available
        [...Array(6)].map((_, index) => (
          <EmptyProductCard key={index} index={index} />
        ))
      )}
    </div>
  );
};

export default ShopProductList;
