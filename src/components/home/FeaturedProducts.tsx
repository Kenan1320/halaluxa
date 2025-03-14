
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getFeaturedProducts } from '@/services/shopService';
import ProductCard from '@/components/shop/ProductCard';
import { Product, adaptDatabaseProductToProduct } from '@/models/product';
import { useTheme } from '@/context/ThemeContext';
import { DBProduct } from '@/models/types';

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { mode } = useTheme();
  
  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        setIsLoading(true);
        const result = await getFeaturedProducts(8);
        
        // Convert database products to our frontend model
        if (result && Array.isArray(result)) {
          const formattedProducts = result.map(item => {
            // Handle potential missing properties
            const product: DBProduct = {
              id: item.id,
              name: item.name,
              description: item.description || '',
              price: item.price || 0,
              images: item.images || [],
              category: item.category || '',
              shop_id: item.shop_id,
              in_stock: item.in_stock !== undefined ? item.in_stock : true,
              is_halal_certified: item.is_halal_certified || false,
              created_at: item.created_at,
              shops: item.shops
            };
            
            return adaptDatabaseProductToProduct(product);
          });
          
          setProducts(formattedProducts);
        }
      } catch (error) {
        console.error('Error loading featured products:', error);
        toast({
          title: 'Error',
          description: 'Failed to load featured products',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedProducts();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div 
            key={i} 
            className={`h-80 rounded-lg animate-pulse ${mode === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}
          ></div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={`p-8 text-center rounded-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <p className={mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
          No featured products available at this time.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default FeaturedProducts;
