
import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '@/models/product';
import { ProductCard } from '@/components/cards/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  emptyMessage?: string;
}

const ProductGrid = ({ products, isLoading, emptyMessage = 'No products available' }: ProductGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="w-full">
            <Skeleton className="w-full h-48 rounded-lg" />
            <Skeleton className="w-2/3 h-4 mt-2" />
            <Skeleton className="w-1/2 h-4 mt-2" />
          </div>
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {products.map((product) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.03 }}
          className="flex"
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </div>
  );
};

export default ProductGrid;
