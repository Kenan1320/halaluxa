
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getShopProducts, convertToModelProduct } from '@/services/shopService';
import { useToast } from '@/hooks/use-toast';
import { ProductCard } from '@/components/cards/ProductCard';
import { Product } from '@/models/product';
import { Skeleton } from '@/components/ui/skeleton';

export interface ShopProductListProps {
  shopId: string;
  products?: Product[]; // Make products optional
  isLoading?: boolean; // Add isLoading prop
  emptyMessage?: string; // Add emptyMessage prop
}

const ShopProductList = ({ shopId, products: externalProducts, isLoading: externalLoading, emptyMessage }: ShopProductListProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // If external products were provided, use those
    if (externalProducts) {
      setProducts(externalProducts);
      setIsLoading(false);
      return;
    }
    
    // Only load products if not provided externally
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const shopProducts = await getShopProducts(shopId);
        if (shopProducts && shopProducts.length > 0) {
          // Convert shop products to standard product model
          const standardProducts = shopProducts.map(p => convertToModelProduct(p));
          setProducts(standardProducts);
        }
      } catch (error) {
        console.error('Error loading shop products:', error);
        toast({
          title: 'Error',
          description: 'Failed to load products from this shop',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, [shopId, externalProducts, toast]);
  
  const displayLoading = externalLoading !== undefined ? externalLoading : isLoading;
  
  if (displayLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-full">
            <Skeleton className="w-full h-36 rounded-lg" />
            <Skeleton className="w-2/3 h-4 mt-2" />
            <Skeleton className="w-1/2 h-4 mt-2" />
          </div>
        ))}
      </div>
    );
  }
  
  if (!products.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">{emptyMessage || 'No products available from this shop yet.'}</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-hidden rounded-lg">
      <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
        {products.map((product) => (
          <motion.div 
            key={product.id} 
            className="flex-shrink-0 w-48"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ShopProductList;
