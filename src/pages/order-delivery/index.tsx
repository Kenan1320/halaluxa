
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from '@/context/LocationContext';
import { Shop } from '@/types/database';
import { Truck, Filter, Store } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const OrderDeliveryPage = () => {
  const { isLocationEnabled, requestLocation, getNearbyShops } = useLocation();
  const [deliveryShops, setDeliveryShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  
  // Mock categories for filtering
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'restaurant', name: 'Restaurants' },
    { id: 'grocery', name: 'Groceries' },
    { id: 'bakery', name: 'Bakeries' },
    { id: 'butcher', name: 'Butchers' },
    { id: 'cafe', name: 'Cafes' }
  ];
  
  useEffect(() => {
    const loadDeliveryShops = async () => {
      try {
        if (!isLocationEnabled) {
          await requestLocation();
        }
        
        const shops = await getNearbyShops();
        if (shops && shops.length > 0) {
          // Simulate filtering for shops that offer delivery
          // In a real app, this would be a property on the shop
          const deliveryEnabled = shops.filter((_, index) => index % 3 !== 0);
          setDeliveryShops(deliveryEnabled);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading delivery shops:', error);
        setIsLoading(false);
      }
    };
    
    loadDeliveryShops();
  }, [isLocationEnabled, getNearbyShops, requestLocation]);
  
  // Filter shops based on selected category
  const filteredShops = selectedFilter === 'all' 
    ? deliveryShops 
    : deliveryShops.filter(shop => {
        // Mock filtering by category - in real app would check shop.category
        const shopCategoryMap: Record<string, string[]> = {
          'restaurant': ['Restaurants'],
          'grocery': ['Groceries'],
          'bakery': ['Bakeries'],
          'butcher': ['Halal Meat'],
          'cafe': ['Coffee Shops']
        };
        
        return shopCategoryMap[selectedFilter]?.includes(shop.category);
      });

  return (
    <div className="min-h-screen pt-20 pb-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-serif font-bold mb-6 text-[#0F1B44] dark:text-white">
          Order Delivery
        </h1>
        
        {/* Category filters */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-[#0F1B44] dark:text-white" />
            <h2 className="text-lg font-medium text-[#0F1B44] dark:text-white">
              Filter by Category
            </h2>
          </div>
          
          <ToggleGroup 
            type="single" 
            value={selectedFilter}
            onValueChange={(value) => {
              if (value) setSelectedFilter(value);
            }}
            className="justify-start"
          >
            {categories.map(category => (
              <ToggleGroupItem 
                key={category.id} 
                value={category.id}
                variant="outline"
                className="px-4 py-2 rounded-full border-[#0F1B44] data-[state=on]:bg-[#0F1B44] data-[state=on]:text-white"
              >
                {category.name}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        
        {/* Shop list with delivery info */}
        <div className="mb-12">
          {isLoading ? (
            <div className="space-y-4">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse flex p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg mr-4"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredShops.length > 0 ? (
            <div className="space-y-4">
              {filteredShops.map((shop, index) => (
                <motion.div
                  key={shop.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-center p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden mr-4">
                    {shop.logo_url ? (
                      <img 
                        src={shop.logo_url} 
                        alt={shop.name} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <Store className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-lg mb-1">
                      {shop.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-1">
                      {shop.category} • {shop.distance ? `${shop.distance.toFixed(1)}km away` : 'Nearby'}
                    </p>
                    <div className="flex items-center text-sm text-[#0F1B44]">
                      <Truck className="h-4 w-4 mr-1" />
                      <span>Free delivery on orders over $20</span>
                    </div>
                  </div>
                  
                  <Link to={`/shop/${shop.id}`}>
                    <Button 
                      variant="default"
                      className="bg-[#0F1B44] hover:bg-[#183080]"
                    >
                      Order
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Truck className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No delivery shops found</h3>
              <p className="text-gray-500 mb-4">
                We couldn't find any shops that offer delivery for the selected category.
              </p>
              <Button 
                variant="default"
                className="bg-[#0F1B44] hover:bg-[#183080]"
                onClick={() => setSelectedFilter('all')}
              >
                View All Categories
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDeliveryPage;
