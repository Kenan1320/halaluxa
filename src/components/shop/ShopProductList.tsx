
import React, { useState, useEffect, useRef } from 'react';
import { getShopProducts } from '@/services/shopService';
import { ShopProduct } from '@/models/product';
import ProductCard from '@/components/shop/ProductCard';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { UUID } from '@/models/types';

interface ShopProductListProps {
  shopId: UUID;
  products?: ShopProduct[];
}

const ShopProductList = ({ shopId, products: initialProducts }: ShopProductListProps) => {
  const [products, setProducts] = useState<ShopProduct[]>(initialProducts || []);
  const [isLoading, setIsLoading] = useState(!initialProducts);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showLeftControl, setShowLeftControl] = useState(false);
  const [showRightControl, setShowRightControl] = useState(true);
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (initialProducts) {
      setProducts(initialProducts);
      setIsLoading(false);
      return;
    }
    
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
  }, [shopId, initialProducts]);
  
  useEffect(() => {
    const checkScroll = () => {
      if (!containerRef.current) return;
      
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setScrollPosition(scrollLeft);
      setShowLeftControl(scrollLeft > 0);
      setShowRightControl(scrollLeft < scrollWidth - clientWidth - 10);
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      checkScroll();
      return () => container.removeEventListener('scroll', checkScroll);
    }
  }, [products]);
  
  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const scrollAmount = container.clientWidth * 0.8;
    const newPosition = direction === 'left' 
      ? Math.max(0, scrollPosition - scrollAmount)
      : Math.min(container.scrollWidth - container.clientWidth, scrollPosition + scrollAmount);
    
    container.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
  };
  
  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-lg">
        <div className="flex overflow-x-auto gap-3 pb-4 pt-2 scrollbar-hide">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-shrink-0 w-36 h-48 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }
  
  if (!products.length) {
    return (
      <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
        No products available from this shop yet.
      </div>
    );
  }
  
  return (
    <div className="relative group">
      {showLeftControl && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white/80 shadow-md -ml-4"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>
      )}
      
      <div 
        ref={containerRef}
        className="flex overflow-x-auto gap-3 pb-4 pt-2 scrollbar-hide"
      >
        {products.map((product) => (
          <div key={product.id} className="flex-shrink-0">
            <ProductCard 
              product={product}
              className="w-36 md:w-48"
            />
          </div>
        ))}
      </div>
      
      {showRightControl && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white/80 shadow-md -mr-4"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      )}
    </div>
  );
};

export default ShopProductList;
