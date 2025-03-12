
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { productCategories } from '@/models/product';
import { getShops, Shop, getShopProducts, convertToModelProduct } from '@/services/shopService';
import { useLocation } from '@/context/LocationContext';
import ShopCard from '@/components/shop/ShopCard';
import ShopProductList from '@/components/shop/ShopProductList';
import { Link } from 'react-router-dom';
import { getCategoryIcon } from '../icons/CategoryIcons';

// Mock data for demo products
const demoProducts = [
  { id: 'demo1', name: 'Demo Product 1', price: 19.99, images: ['/placeholder.svg'], description: 'A lovely demo product for your shop' },
  { id: 'demo2', name: 'Demo Product 2', price: 24.99, images: ['/placeholder.svg'], description: 'Another fantastic demo product' },
  { id: 'demo3', name: 'Demo Product 3', price: 15.99, images: ['/placeholder.svg'], description: 'A great demo product to showcase' },
  { id: 'demo4', name: 'Demo Product 4', price: 29.99, images: ['/placeholder.svg'], description: 'An excellent demo product sample' },
  { id: 'demo5', name: 'Demo Product 5', price: 9.99, images: ['/placeholder.svg'], description: 'A budget-friendly demo product' },
  { id: 'demo6', name: 'Demo Product 6', price: 34.99, images: ['/placeholder.svg'], description: 'A premium demo product example' },
];

const NearbyShops = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [shopCategories, setShopCategories] = useState<Record<string, string[]>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);
  const { isLocationEnabled, location, getNearbyShops } = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Initial load of shops
    const loadShops = async () => {
      try {
        setIsLoading(true);
        // Use getNearbyShops from the LocationContext
        const nearbyShops = await getNearbyShops();
        
        // Get categories for each shop
        const categoriesMap: Record<string, string[]> = {};
        nearbyShops.forEach(shop => {
          // For demonstration, assign random categories to each shop
          // In a real app, this would come from the shop data
          const randomCategories = getRandomCategories();
          categoriesMap[shop.id] = randomCategories;
        });
        
        setShopCategories(categoriesMap);
        setShops(nearbyShops);
      } catch (error) {
        console.error('Error loading nearby shops:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isLocationEnabled && location) {
      loadShops();
    } else {
      // Load anyway for demo purposes
      loadShops();
    }
  }, [isLocationEnabled, location, getNearbyShops]);
  
  // Helper function to get random categories for a shop
  const getRandomCategories = () => {
    const shuffled = [...productCategories].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.floor(Math.random() * 5) + 1);
  };
  
  // Filter shops by selected category
  const filteredShops = selectedCategory === 'All' 
    ? shops
    : shops.filter(shop => 
        shopCategories[shop.id] && shopCategories[shop.id].includes(selectedCategory)
      );
  
  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-lg">
        <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className="flex-shrink-0 w-64 h-40 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }
  
  if (!shops.length) {
    return null;
  }
  
  return (
    <div className="space-y-6">
      {/* Horizontal scrolling categories */}
      <div className="overflow-x-auto scrollbar-hide mb-4">
        <div className="flex space-x-2 py-1">
          <motion.button
            key="all-category"
            className={`flex-shrink-0 py-1.5 px-3 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'All' 
                ? 'bg-black text-white dark:bg-white dark:text-black' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory('All')}
          >
            All
          </motion.button>
          {productCategories.slice(0, 8).map((category) => (
            <motion.button
              key={category}
              className={`flex-shrink-0 py-1.5 px-3 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
                selectedCategory === category 
                  ? 'bg-black text-white dark:bg-white dark:text-black' 
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
            >
              <div className="w-4 h-4">
                {getCategoryIcon(category, "w-full h-full")}
              </div>
              {category}
            </motion.button>
          ))}
        </div>
      </div>
      
      {filteredShops.map((shop, index) => (
        <div key={shop.id} className="mb-6">
          {/* Shop header with name and logo - now animated and clickable */}
          <div className="flex items-center justify-between mb-3">
            <Link to={`/shop/${shop.id}`} className="group flex items-center gap-2">
              <motion.div 
                className="w-8 h-8 rounded-full overflow-hidden bg-white shadow-sm flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {shop.logo_url ? (
                  <img 
                    src={shop.logo_url} 
                    alt={`${shop.name} logo`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-haluna-primary-light flex items-center justify-center">
                    <span className="text-xs font-medium text-haluna-primary">
                      {shop.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
              </motion.div>
              <motion.h3 
                className="text-sm font-medium relative"
                whileHover={{ color: "#2A866A" }}
              >
                {shop.name}
                <motion.span
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#2A866A]"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.h3>
            </Link>
            <Link 
              to={`/shop/${shop.id}`} 
              className="text-xs font-medium text-[#29866B] hover:underline transition-colors duration-300"
            >
              View all
            </Link>
          </div>
          
          {/* Shop categories in horizontal scroll */}
          {shopCategories[shop.id] && shopCategories[shop.id].length > 0 && (
            <div className="mb-2 overflow-x-auto scrollbar-hide">
              <div className="flex space-x-2 py-1">
                {shopCategories[shop.id].map((category) => (
                  <Link
                    key={category}
                    to={`/browse?shopId=${shop.id}&category=${encodeURIComponent(category)}`}
                    className="flex-shrink-0 py-1 px-2 rounded-full text-xs font-medium bg-gray-50 dark:bg-gray-800 flex items-center gap-1"
                  >
                    <div className="w-4 h-4">
                      {getCategoryIcon(category, "w-full h-full")}
                    </div>
                    {category}
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          {/* Shop products in horizontal scroll with demo products if needed */}
          <ShopProductList 
            shopId={shop.id} 
            products={[]}
            demoProducts={shop.product_count === 0 ? demoProducts : undefined}
          />
        </div>
      ))}
    </div>
  );
};

export default NearbyShops;
