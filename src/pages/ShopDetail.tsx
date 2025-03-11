
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getShopById } from '@/services/shopService';
import { ShopDetails } from '@/types/shop';
import { ShopHeader } from '@/components/shop/ShopHeader';
import ShopProductList from '@/components/shop/ShopProductList';
import { Skeleton } from '@/components/ui/skeleton';
import { Menu, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ShopDetail() {
  const { shopId } = useParams<{ shopId: string }>();
  const [shopDetails, setShopDetails] = useState<ShopDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const loadShopDetails = async () => {
      setIsLoading(true);
      if (shopId) {
        const shop = await getShopById(shopId);
        if (shop) {
          // TODO: This is temporary until we update the backend
          const shopDetails: ShopDetails = {
            ...shop,
            categories: [
              {
                id: 'featured',
                name: 'Featured Items',
                products: []
              },
              {
                id: 'best-sellers',
                name: 'Best Sellers',
                products: []
              },
              {
                id: 'deals',
                name: 'Deals & Discounts',
                products: []
              },
              {
                id: 'halal-certified',
                name: 'Halal Certified',
                products: []
              }
            ],
            deliveryInfo: {
              isDeliveryAvailable: true,
              isPickupAvailable: true,
              deliveryFee: 1.49,
              estimatedTime: '10-15 min',
            },
            workingHours: {
              open: '10:30 AM',
              close: '10:00 PM',
            },
            isGroupOrderEnabled: true,
            rating: {
              average: 4.5,
              count: 500
            }
          };
          setShopDetails(shopDetails);
          
          // Set first category as active by default
          if (shopDetails.categories.length > 0) {
            setActiveCategory(shopDetails.categories[0].id);
          }
        }
      }
      setIsLoading(false);
    };

    loadShopDetails();
  }, [shopId]);

  const scrollToCategory = (categoryId: string) => {
    if (categoryRefs.current[categoryId]) {
      categoryRefs.current[categoryId]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      setCategoryMenuOpen(false);
      setActiveCategory(categoryId);
    }
  };

  const handleScroll = () => {
    if (!shopDetails) return;
    
    // Determine which category is most visible in the viewport
    let currentCategory = activeCategory;
    let maxVisibility = 0;
    
    shopDetails.categories.forEach(category => {
      const element = categoryRefs.current[category.id];
      if (element) {
        const rect = element.getBoundingClientRect();
        const visibility = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
        
        if (visibility > maxVisibility) {
          maxVisibility = visibility;
          currentCategory = category.id;
        }
      }
    });
    
    if (currentCategory !== activeCategory) {
      setActiveCategory(currentCategory);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [shopDetails, activeCategory]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background dark:bg-gray-900">
        <Skeleton className="w-full h-48" />
        <div className="p-4">
          <Skeleton className="w-40 h-8 mb-2 mx-auto" />
          <Skeleton className="w-24 h-4 mb-4 mx-auto" />
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
        </div>
      </div>
    );
  }

  if (!shopDetails) {
    return (
      <div className="min-h-screen bg-background dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Shop not found</h2>
          <p className="text-muted-foreground">The shop you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      <ShopHeader shop={shopDetails} />
      
      {/* Category Menu Drawer */}
      <AnimatePresence>
        {categoryMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-50 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCategoryMenuOpen(false)}
          >
            <motion.div 
              className="absolute left-0 top-0 bottom-0 w-3/4 max-w-xs bg-background dark:bg-gray-800 overflow-y-auto"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b">
                <h2 className="text-xl font-bold">{shopDetails.name}</h2>
              </div>
              
              <ul className="py-2">
                {shopDetails.categories.map((category) => (
                  <li 
                    key={category.id}
                    className={`px-4 py-3 flex justify-between items-center hover:bg-secondary/50 cursor-pointer transition-colors ${
                      activeCategory === category.id ? 'border-l-4 border-primary' : ''
                    }`}
                    onClick={() => scrollToCategory(category.id)}
                  >
                    <span className={activeCategory === category.id ? 'font-medium text-primary' : ''}>{category.name}</span>
                    <ChevronRight className="h-4 w-4" />
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main Content with Categories */}
      <main className="container mx-auto px-4 py-6">
        <div className="sticky top-0 z-10 bg-background dark:bg-gray-900 py-2 flex items-center justify-between">
          <button 
            className="flex items-center gap-2 text-foreground dark:text-white font-medium"
            onClick={() => setCategoryMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span>{activeCategory ? shopDetails.categories.find(c => c.id === activeCategory)?.name : 'Menu'}</span>
          </button>
        </div>
        
        <div className="space-y-8">
          {shopDetails.categories.map((category) => (
            <section 
              key={category.id} 
              ref={el => categoryRefs.current[category.id] = el}
              className="mb-8 scroll-mt-16"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{category.name}</h2>
                <button className="text-sm text-primary">
                  View all
                </button>
              </div>
              <ShopProductList shopId={shopId} products={category.products} />
            </section>
          ))}
        </div>
        
        {shopDetails.categories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">This shop hasn't added any products yet.</p>
          </div>
        )}
      </main>
      
      {/* Floating "View Cart" Button */}
      <div className="fixed bottom-4 inset-x-0 flex justify-center z-40 pointer-events-none">
        <motion.button 
          className="bg-primary text-white px-8 py-3 rounded-full font-medium shadow-lg pointer-events-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          View cart
        </motion.button>
      </div>
    </div>
  );
}
