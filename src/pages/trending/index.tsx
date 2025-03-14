
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getShops } from '@/services/shopService';
import { Shop } from '@/types/database';
import { TrendingUp, Store } from 'lucide-react';
import { motion } from 'framer-motion';
import { ProductGrid } from '@/components/home/ProductGrid';

const TrendingPage = () => {
  const [trendingShops, setTrendingShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadTrendingShops = async () => {
      try {
        const shops = await getShops();
        // Sort by product count (as a proxy for popularity)
        const sortedShops = [...shops].sort((a, b) => 
          (b.product_count || 0) - (a.product_count || 0)
        );
        setTrendingShops(sortedShops.slice(0, 8)); // Get top 8
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading trending shops:', error);
        setIsLoading(false);
      }
    };
    
    loadTrendingShops();
  }, []);

  return (
    <div className="min-h-screen pt-20 pb-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-serif font-bold mb-6 text-[#0F1B44] dark:text-white">
          Trending Online Shops
        </h1>
        
        {/* Trending shops grid - 2 rows of 4 */}
        <div className="mb-12">
          {isLoading ? (
            <div className="grid grid-cols-4 gap-4">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-1"></div>
                  <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-16"></div>
                </div>
              ))}
            </div>
          ) : trendingShops.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {trendingShops.map((shop, index) => (
                <motion.div
                  key={shop.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex flex-col items-center"
                >
                  <Link to={`/shop/${shop.id}`} className="group">
                    <div className="relative w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden mb-2 group-hover:shadow-lg transition-all">
                      {shop.logo_url ? (
                        <img 
                          src={shop.logo_url} 
                          alt={shop.name} 
                          className="w-16 h-16 object-cover group-hover:scale-110 transition-transform" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#F9F5EB] text-[#0F1B44]">
                          <Store className="h-8 w-8" />
                        </div>
                      )}
                      
                      {/* Trending indicator */}
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {index + 1}
                      </div>
                    </div>
                    <h3 className="text-center font-medium text-sm mb-1 group-hover:text-[#0F1B44] transition-colors">
                      {shop.name}
                    </h3>
                    <p className="text-center text-xs text-gray-500">
                      {shop.product_count} products
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <TrendingUp className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No trending shops found</h3>
              <p className="text-gray-500">
                We couldn't find any trending shops at the moment. Please check back later.
              </p>
            </div>
          )}
        </div>
        
        {/* Trending products */}
        <div className="mt-8">
          <h2 className="text-xl font-serif font-bold mb-6 text-[#0F1B44] dark:text-white">
            Trending Products
          </h2>
          <ProductGrid />
        </div>
      </div>
    </div>
  );
};

export default TrendingPage;
