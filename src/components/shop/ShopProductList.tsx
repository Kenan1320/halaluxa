
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SnoonuProductCard from './SnoonuProductCard';
import { getShopProducts } from '@/services/shopService';
import { ShopProduct } from '@/models/shop';

interface ShopProductListProps {
  shopId?: string;
  products?: ShopProduct[];
}

const ShopProductList: React.FC<ShopProductListProps> = ({ shopId, products: initialProducts }) => {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadProducts = async () => {
      if (initialProducts && initialProducts.length > 0) {
        setProducts(initialProducts);
        setIsLoading(false);
        return;
      }

      if (!shopId) {
        setIsLoading(false);
        return;
      }

      try {
        const shopProducts = await getShopProducts(shopId);
        setProducts(shopProducts);
      } catch (error) {
        console.error('Error loading shop products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [shopId, initialProducts]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = 300;
      
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg p-4 h-48 animate-pulse">
            <div className="w-full h-24 bg-gray-200 rounded-lg mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-6 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No products available from this shop yet.</p>
      </div>
    );
  }

  return (
    <div className="relative group">
      <div 
        ref={scrollContainerRef}
        className="flex space-x-4 overflow-x-auto scrollbar-none pb-4 snap-x"
      >
        {products.map((product) => (
          <div key={product.id} className="flex-none w-40 md:w-48 snap-start">
            <SnoonuProductCard product={product} />
          </div>
        ))}
      </div>
      
      {products.length > 3 && (
        <>
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
};

export default ShopProductList;
