
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, Star, ShoppingBag, Store, MapPin, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useLocation as useLocationContext } from '@/context/LocationContext';
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
      description: "Your selected shops have been saved.",
    });
    
    navigate('/');
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center py-10">
            <h1 className="text-2xl font-bold mb-8">Loading shops...</h1>
            <div className="flex flex-wrap gap-4 justify-center">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="w-24 h-24 bg-gray-100 rounded-md animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-24 pb-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8 text-center">
            <h1 className="text-2xl font-serif font-bold mb-2">Select Your Shops</h1>
            <p className="text-gray-600 max-w-md mx-auto text-sm">
              Choose the shops you want to follow. These will appear on your home screen for quick access.
            </p>
          </header>
          
          <div className="bg-[#E4F5F0]/40 rounded-lg p-4 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <Store className="w-5 h-5 text-[#29866B]" />
              <h2 className="font-medium">Your Main Shop</h2>
            </div>
            
            {mainShopId ? (
              <div className="flex items-center bg-white rounded-lg p-3 shadow-sm">
                {shops.find(s => s.id === mainShopId)?.logo ? (
                  <img 
                    src={shops.find(s => s.id === mainShopId)?.logo} 
                    alt="Main shop" 
                    className="w-10 h-10 object-cover rounded-full mr-3"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#29866B] flex items-center justify-center text-white mr-3">
                    {shops.find(s => s.id === mainShopId)?.name.charAt(0) || 'S'}
                  </div>
                )}
                <div>
                  <h3 className="font-medium">{shops.find(s => s.id === mainShopId)?.name}</h3>
                  <p className="text-xs text-gray-500">{shops.find(s => s.id === mainShopId)?.location || 'Location not specified'}</p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-gray-500 text-sm">No main shop selected. Select one from the list below.</p>
              </div>
            )}
          </div>
          
          {/* Shops by location */}
          {Object.entries(locations).map(([location, locationShops]) => (
            <div key={location} className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-[#29866B]" />
                <h2 className="text-lg font-medium">{location}</h2>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {locationShops.map((shop) => (
                  <motion.div
                    key={shop.id}
                    className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedShops.includes(shop.id) 
                        ? 'border-[#29866B] bg-[#E4F5F0]/20' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleShopSelection(shop.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Selection indicator */}
                    {selectedShops.includes(shop.id) && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-[#29866B] rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    
                    {/* Main shop indicator */}
                    {mainShopId === shop.id && (
                      <div className="absolute top-2 left-2">
                        <motion.div 
                          className="w-5 h-5 bg-[#E4875E] rounded-full flex items-center justify-center"
                          animate={{
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                        >
                          <Star className="w-3 h-3 text-white" />
                        </motion.div>
                      </div>
                    )}
                    
                    {/* Shop logo */}
                    <div className="flex flex-col items-center">
                      {shop.logo ? (
                        <img 
                          src={shop.logo} 
                          alt={shop.name} 
                          className="w-16 h-16 object-cover rounded-full mb-3"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-[#F9F5EB] flex items-center justify-center text-[#29866B] mb-3">
                          <span className="text-lg font-bold">{shop.name.charAt(0)}</span>
                        </div>
                      )}
                      
                      <h3 className="font-medium text-center text-sm">{shop.name}</h3>
                      
                      {selectedShops.includes(shop.id) && mainShopId !== shop.id && (
                        <button 
                          className="mt-3 text-xs px-3 py-1 bg-white border border-[#29866B] text-[#29866B] rounded-full hover:bg-[#29866B] hover:text-white transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setAsMainShop(shop.id);
                          }}
                        >
                          Set as main
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
          
          <div className="mt-10 flex justify-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
            >
              Cancel
            </Button>
            <Button 
              onClick={saveSelections}
              disabled={selectedShops.length === 0}
              className="bg-[#29866B] hover:bg-[#1e5c4a]"
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
