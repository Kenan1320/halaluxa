
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { getShops, Shop, getShopProducts, convertToModelProduct } from '@/services/shopService';
import { useLocation } from '@/context/LocationContext';
import ShopCard from '@/components/shop/ShopCard';
import ShopProductList from '@/components/shop/ShopProductList';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { productCategories, isNearbyCategoryByDefault } from '@/models/product';
import { getCategoryIcon } from '../icons/CategoryIcons';

const NearbyShops = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [shopsByCategory, setShopsByCategory] = useState<Record<string, Shop[]>>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isLocationEnabled, location, getNearbyShops } = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  // Get only nearby categories
  const nearbyCategories = productCategories.filter(isNearbyCategoryByDefault).slice(0, 8);
  
  useEffect(() => {
    // Initial load of shops
    const loadShops = async () => {
      try {
        setIsLoading(true);
        // Use getNearbyShops from the LocationContext
        const nearbyShops = await getNearbyShops();
        setShops(nearbyShops);
        
        // Group shops by category
        const shopsByCat: Record<string, Shop[]> = {};
        nearbyCategories.forEach(category => {
          // Filter shops that have this category
          const categoryShops = nearbyShops.filter(
            shop => shop.category === category
          );
          if (categoryShops.length > 0) {
            shopsByCat[category] = categoryShops;
          }
        });
        
        setShopsByCategory(shopsByCat);
        
        // Set a default selected category
        if (Object.keys(shopsByCat).length > 0) {
          setSelectedCategory(Object.keys(shopsByCat)[0]);
        }
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
  
  const handleCategoryScroll = () => {
    if (!categoryRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = categoryRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };
  
  useEffect(() => {
    const scrollElement = categoryRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleCategoryScroll);
      return () => scrollElement.removeEventListener('scroll', handleCategoryScroll);
    }
  }, [nearbyCategories]);
  
  const scrollLeft = () => {
    if (categoryRef.current) {
      categoryRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    if (categoryRef.current) {
      categoryRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };
  
  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-lg">
        <div className="flex overflow-x-auto gap-4 py-2 mb-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div 
              key={i} 
              className="flex-shrink-0 w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse"
            />
          ))}
        </div>
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i}>
              <div className="h-4 w-32 bg-gray-100 dark:bg-gray-800 rounded mb-3 animate-pulse"></div>
              <div className="flex overflow-x-auto gap-4 pb-4">
                {[1, 2, 3, 4].map((j) => (
                  <div 
                    key={j} 
                    className="flex-shrink-0 w-40 h-48 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (!shops.length) {
    return null;
  }
  
  // Generate 6 demo products for shops with no products
  const generateDemoProducts = (shopId: string) => {
    return Array(6).fill(null).map((_, index) => ({
      id: `demo-${shopId}-${index}`,
      name: `Demo Product ${index + 1}`,
      description: 'This is a placeholder product until the shop owner adds real products.',
      price: 9.99 + index * 5,
      images: ['/placeholder.svg'],
      category: shopsByCategory[selectedCategory || '']?.[0]?.category || 'Uncategorized',
      shopId: shopId,
      isHalalCertified: true,
      inStock: true,
      createdAt: new Date().toISOString(),
      sellerId: shopsByCategory[selectedCategory || '']?.[0]?.ownerId,
      sellerName: shopsByCategory[selectedCategory || '']?.[0]?.name,
      rating: 4.5,
    }));
  };
  
  return (
    <div className="space-y-6">
      {/* Category scroller */}
      <div className="relative group mb-2">
        {/* Scroll controls */}
        {canScrollLeft && (
          <motion.button
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-800/90 rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={scrollLeft}
            initial={{ opacity: 0 }}
            animate={{ opacity: canScrollLeft ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronLeft className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          </motion.button>
        )}
        
        {canScrollRight && (
          <motion.button
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-800/90 rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={scrollRight}
            initial={{ opacity: 0 }}
            animate={{ opacity: canScrollRight ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          </motion.button>
        )}
        
        <div 
          ref={categoryRef} 
          className="flex overflow-x-auto gap-3 py-2 scrollbar-hide"
          onScroll={handleCategoryScroll}
        >
          {nearbyCategories.map((category) => (
            <motion.button
              key={category}
              className={`flex-shrink-0 flex flex-col items-center justify-center p-2 rounded-lg ${
                selectedCategory === category 
                  ? 'bg-gray-100 dark:bg-gray-800' 
                  : 'hover:bg-gray-50 dark:hover:bg-gray-900'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
            >
              <div className="h-12 w-12 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center mb-1">
                {getCategoryIcon(category, "h-7 w-7")}
              </div>
              <span className="text-[10px] font-medium text-center">
                {category}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Display shops from selected category */}
      {selectedCategory && shopsByCategory[selectedCategory] && (
        <div>
          {shopsByCategory[selectedCategory].map((shop) => (
            <div key={shop.id} className="mb-6">
              {/* Shop header with name and logo */}
              <div className="flex items-center justify-between mb-3">
                <Link to={`/shop/${shop.id}`} className="group flex items-center gap-2">
                  <motion.div 
                    className="w-8 h-8 rounded-full overflow-hidden bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {shop.logo ? (
                      <img 
                        src={shop.logo} 
                        alt={`${shop.name} logo`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
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
                  className="text-xs font-medium text-[#29866B] dark:text-green-400 hover:underline"
                >
                  View all
                </Link>
              </div>
              
              {/* Shop products in horizontal scroll or demo products */}
              {shop.productCount && shop.productCount > 0 ? (
                <ShopProductList shopId={shop.id} />
              ) : (
                <ShopProductList shopId={shop.id} products={generateDemoProducts(shop.id)} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NearbyShops;
