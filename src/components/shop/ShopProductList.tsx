
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, ChevronDown } from 'lucide-react';
import { ShopProduct } from '@/models/shop';
import { Product as ModelProduct } from '@/models/product';
import SnoonuProductCard from './SnoonuProductCard';

interface ShopProductListProps {
  products: ShopProduct[];
  shopName: string;
}

const ShopProductList: React.FC<ShopProductListProps> = ({ products, shopName }) => {
  const [filterVisible, setFilterVisible] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high' | 'name'>('default');
  
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products available from {shopName} at the moment.</p>
      </div>
    );
  }
  
  const toggleFilter = () => {
    setFilterVisible(!filterVisible);
  };
  
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-low') {
      return a.price - b.price;
    } else if (sortBy === 'price-high') {
      return b.price - a.price;
    } else if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });
  
  // Convert ShopProduct to ModelProduct for compatibility with ProductCard
  const convertToModelProduct = (product: ShopProduct): ModelProduct => {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      images: product.images || [],
      category: product.category,
      shopId: product.shop_id || '',
      isHalalCertified: product.is_halal_certified || false,
      inStock: product.in_stock !== false,
      createdAt: product.created_at || new Date().toISOString(),
      shop_id: product.shop_id,
      in_stock: product.in_stock,
      is_halal_certified: product.is_halal_certified,
      created_at: product.created_at,
      updated_at: product.updated_at
    };
  };
  
  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Products</h2>
        <button 
          onClick={toggleFilter}
          className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full flex items-center text-sm"
        >
          <Filter className="h-4 w-4 mr-2" />
          Sort
          <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${filterVisible ? 'rotate-180' : ''}`} />
        </button>
      </div>
      
      {filterVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <button 
              className={`py-2 px-4 rounded-full text-sm ${sortBy === 'default' ? 'bg-black text-white' : 'bg-white'}`}
              onClick={() => setSortBy('default')}
            >
              Default
            </button>
            <button 
              className={`py-2 px-4 rounded-full text-sm ${sortBy === 'price-low' ? 'bg-black text-white' : 'bg-white'}`}
              onClick={() => setSortBy('price-low')}
            >
              Price: Low to High
            </button>
            <button 
              className={`py-2 px-4 rounded-full text-sm ${sortBy === 'price-high' ? 'bg-black text-white' : 'bg-white'}`}
              onClick={() => setSortBy('price-high')}
            >
              Price: High to Low
            </button>
            <button 
              className={`py-2 px-4 rounded-full text-sm ${sortBy === 'name' ? 'bg-black text-white' : 'bg-white'}`}
              onClick={() => setSortBy('name')}
            >
              Name
            </button>
          </div>
        </motion.div>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedProducts.map((product) => (
          <SnoonuProductCard 
            key={product.id} 
            product={product} 
          />
        ))}
      </div>
    </div>
  );
};

export default ShopProductList;
