
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Star, Store, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useLocation as useLocationContext } from '@/context/LocationContext';
import { useTheme } from '@/context/ThemeContext';
import { Shop, getAllShops } from '@/services/shopService';

const SelectShops = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShops, setSelectedShops] = useState<string[]>([]);
  const [mainShopId, setMainShopId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [locations, setLocations] = useState<Record<string, Shop[]>>({});
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { isLocationEnabled, location, getNearbyShops } = useLocationContext();
  const { mode } = useTheme();
  
  // Load shops on component mount
  useEffect(() => {
    const loadShops = async () => {
      setIsLoading(true);
      try {
        // Get all shops
        const allShops = await getAllShops();
        
        // Get nearby shops to prioritize them
        const nearbyShops = isLocationEnabled ? await getNearbyShops() : [];
        
        // Combine and deduplicate
        const nearbyIds = new Set(nearbyShops.map(shop => shop.id));
        const otherShops = allShops.filter(shop => !nearbyIds.has(shop.id));
        
        // Sort shops by location
        const locationMap: Record<string, Shop[]> = {};
        [...nearbyShops, ...otherShops].forEach(shop => {
          const location = shop.location || 'Other';
          if (!locationMap[location]) {
            locationMap[location] = [];
          }
          locationMap[location].push(shop);
        });
        
        setLocations(locationMap);
        setShops([...nearbyShops, ...otherShops]);
        
        // Load previously selected shops from localStorage
        const savedShops = localStorage.getItem('selectedShops');
        if (savedShops) {
          setSelectedShops(JSON.parse(savedShops));
        }
        
        // Load main shop from localStorage
        const savedMainShop = localStorage.getItem('mainShopId');
        if (savedMainShop) {
          setMainShopId(savedMainShop);
        }
      } catch (error) {
        console.error('Error loading shops:', error);
        toast({
          title: "Error",
          description: "Failed to load shops. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadShops();
  }, [isLocationEnabled, getNearbyShops, toast]);
  
  const toggleShopSelection = (shopId: string) => {
    setSelectedShops(prev => {
      if (prev.includes(shopId)) {
        // If removing the main shop, also clear main shop
        if (mainShopId === shopId) {
          setMainShopId(null);
        }
        return prev.filter(id => id !== shopId);
      } else {
        // If this is the first shop being selected, also make it the main shop
        if (prev.length === 0) {
          setMainShopId(shopId);
        }
        return [...prev, shopId];
      }
    });
  };
  
  const setAsMainShop = (shopId: string) => {
    // Ensure the shop is in the selected list
    if (!selectedShops.includes(shopId)) {
      setSelectedShops(prev => [...prev, shopId]);
    }
    setMainShopId(shopId);
    
    toast({
      title: "Main shop updated",
      description: "Your main shop has been successfully set.",
      className: "bg-white border border-gray-200 text-black shadow-lg",
      duration: 3000
    });
  };
  
  const saveSelections = () => {
    localStorage.setItem('selectedShops', JSON.stringify(selectedShops));
    
    if (mainShopId) {
      localStorage.setItem('mainShopId', mainShopId);
    } else if (selectedShops.length > 0) {
      // If no main shop is set but shops are selected, set the first one as main
      localStorage.setItem('mainShopId', selectedShops[0]);
    } else {
      localStorage.removeItem('mainShopId');
    }
    
    toast({
      title: "Preferences saved",
      description: "Your shop selection has been saved successfully.",
      className: "bg-white border border-gray-200 text-black shadow-lg",
      duration: 3000
    });
    
    navigate('/');
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 pb-20 bg-white dark:bg-black">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-col items-center justify-center py-10">
            <h1 className="text-xl font-serif font-medium mb-6 text-center">Loading shops...</h1>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="w-20 h-20 rounded-full animate-pulse bg-gray-100 dark:bg-gray-800" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-20 pb-20 bg-white dark:bg-black">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="max-w-4xl mx-auto">
          <header className="mb-6 text-center">
            <h1 className="text-xl font-serif font-medium mb-1">Your Shops</h1>
            <p className="max-w-md mx-auto text-xs text-gray-600 dark:text-gray-400">
              Select shops to follow and set your main shop
            </p>
          </header>
          
          {mainShopId && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                <h2 className="text-sm font-medium">Main Shop</h2>
              </div>
              
              <motion.div 
                className="flex items-center rounded-lg p-3 shadow-sm bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {shops.find(s => s.id === mainShopId)?.logo ? (
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100 dark:border-gray-700 mr-3">
                    <img 
                      src={shops.find(s => s.id === mainShopId)?.logo} 
                      alt="Main shop" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-300 mr-3">
                    {shops.find(s => s.id === mainShopId)?.name.charAt(0) || 'S'}
                  </div>
                )}
                <div>
                  <h3 className="font-medium text-sm">{shops.find(s => s.id === mainShopId)?.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{shops.find(s => s.id === mainShopId)?.location || 'No location'}</p>
                </div>
                <div className="ml-auto">
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </motion.div>
            </div>
          )}
          
          {/* Shops by location */}
          {Object.entries(locations).map(([location, locationShops]) => (
            <div key={location} className="mb-6">
              <h2 className="text-sm font-medium mb-3">{location}</h2>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {locationShops.map((shop) => (
                  <motion.div
                    key={shop.id}
                    className={`relative rounded-lg p-3 cursor-pointer transition-all border ${
                      selectedShops.includes(shop.id) 
                        ? 'border-black dark:border-white bg-black/5 dark:bg-white/10' 
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                    onClick={() => toggleShopSelection(shop.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Main shop indicator */}
                    {mainShopId === shop.id && (
                      <div className="absolute top-2 right-2">
                        <motion.div 
                          className="w-4 h-4 text-yellow-500"
                          animate={{
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                          }}
                        >
                          <Star className="w-full h-full fill-current" />
                        </motion.div>
                      </div>
                    )}
                    
                    {/* Shop logo */}
                    <div className="flex flex-col items-center">
                      <div className="mb-2 relative">
                        {shop.logo ? (
                          <img 
                            src={shop.logo} 
                            alt={shop.name} 
                            className="w-14 h-14 object-cover rounded-full border border-gray-200 dark:border-gray-700"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400">
                            <span className="text-lg font-medium">{shop.name.charAt(0)}</span>
                          </div>
                        )}
                        
                        {/* Selection indicator */}
                        <AnimatePresence>
                          {selectedShops.includes(shop.id) && (
                            <motion.div 
                              className="absolute -bottom-1 -right-1 bg-green-500 rounded-full border-2 border-white dark:border-black"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <CheckCircle className="w-4 h-4 text-white" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      
                      <h3 className="font-medium text-center text-xs">{shop.name}</h3>
                      
                      {selectedShops.includes(shop.id) && mainShopId !== shop.id && (
                        <motion.button 
                          className="mt-2 text-[10px] px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setAsMainShop(shop.id);
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Set as main
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
          
          <div className="mt-8 flex justify-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="text-xs h-9 px-3"
            >
              Cancel
            </Button>
            <Button 
              onClick={saveSelections}
              disabled={selectedShops.length === 0}
              className="text-xs h-9 px-3 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              Save Preferences
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectShops;
