
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAllShops, Shop } from '@/services/shopService';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Define the shop selection structure by location
interface ShopsByLocation {
  [location: string]: Shop[];
}

const SelectShops: React.FC = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [shopsByLocation, setShopsByLocation] = useState<ShopsByLocation>({});
  const [selectedShops, setSelectedShops] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShops = async () => {
      setIsLoading(true);
      try {
        const allShops = await getAllShops();
        setShops(allShops);
        
        // Group shops by location
        const groupedShops = allShops.reduce((acc: ShopsByLocation, shop) => {
          const location = shop.location || 'Other';
          if (!acc[location]) {
            acc[location] = [];
          }
          acc[location].push(shop);
          return acc;
        }, {});
        
        setShopsByLocation(groupedShops);
      } catch (error) {
        console.error('Failed to fetch shops:', error);
        toast({
          title: 'Error',
          description: 'Failed to load shops. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchShops();
  }, [toast]);

  const toggleShopSelection = (shopId: string) => {
    setSelectedShops(prev => 
      prev.includes(shopId) 
        ? prev.filter(id => id !== shopId) 
        : [...prev, shopId]
    );
  };

  const saveSelections = () => {
    // Save selected shops to localStorage
    localStorage.setItem('selectedShops', JSON.stringify(selectedShops));
    
    toast({
      title: 'Success',
      description: 'Your favorite shops have been saved!',
    });
    
    navigate('/');
  };

  // Animation variants for the shop logos
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Animation for the flowing shop logos
  const flowingContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const flowingItemVariants = {
    hidden: { x: 100, opacity: 0 },
    show: { x: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#F9F5EB]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-serif font-bold text-[#29866B] mb-2">Select Your Shops</h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Choose your favorite Muslim shops to create a personalized shopping experience
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-4 border-[#E4875E] border-t-transparent animate-spin"></div>
              <div className="absolute top-1 left-1 w-10 h-10 rounded-full border-4 border-[#29866B] border-b-transparent animate-spin"></div>
            </div>
          </div>
        ) : (
          <>
            {/* Shop selection by location */}
            <div className="mt-8 space-y-10">
              {Object.entries(shopsByLocation).map(([location, locationShops]) => (
                <motion.div
                  key={location}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-xl p-6 shadow-md"
                >
                  <h2 className="text-xl font-serif font-semibold text-[#29866B] mb-4">{location}</h2>
                  
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                  >
                    {locationShops.map(shop => (
                      <motion.div
                        key={shop.id}
                        variants={itemVariants}
                        onClick={() => toggleShopSelection(shop.id)}
                        className={`cursor-pointer relative flex flex-col items-center p-4 rounded-lg transition-all duration-300 ${
                          selectedShops.includes(shop.id)
                            ? 'bg-[#E5F4EF] shadow-md transform scale-105'
                            : 'bg-gray-50 hover:bg-[#E5F4EF]/50'
                        }`}
                      >
                        <div className="w-16 h-16 mb-2 rounded-full bg-white shadow-sm flex items-center justify-center overflow-hidden">
                          {shop.logo ? (
                            <img src={shop.logo} alt={shop.name} className="w-12 h-12 object-contain" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#F9F5EB] text-[#29866B] font-semibold text-xl">
                              {shop.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <span className="text-sm text-center font-medium text-gray-700 mt-1">
                          {shop.name}
                        </span>
                        
                        {selectedShops.includes(shop.id) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-6 h-6 bg-[#29866B] rounded-full flex items-center justify-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Animation preview - shops flowing horizontally */}
            {selectedShops.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-12 bg-white rounded-xl p-6 shadow-md overflow-hidden"
              >
                <h2 className="text-xl font-serif font-semibold text-[#29866B] mb-4">Your Selected Shops</h2>
                <p className="text-gray-600 text-sm mb-6">These shops will appear on your home screen</p>
                
                <div className="relative h-24 overflow-hidden">
                  <motion.div
                    className="flex absolute whitespace-nowrap"
                    animate={{
                      x: [0, -1000],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 20,
                      ease: "linear"
                    }}
                  >
                    {selectedShops.map(shopId => {
                      const shop = shops.find(s => s.id === shopId);
                      if (!shop) return null;
                      
                      return (
                        <motion.div
                          key={shop.id}
                          className="flex flex-col items-center mx-4"
                        >
                          <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center overflow-hidden">
                            {shop.logo ? (
                              <img src={shop.logo} alt={shop.name} className="w-10 h-10 object-contain" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-[#F9F5EB] text-[#29866B] font-semibold">
                                {shop.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-center mt-1">{shop.name}</span>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Save button */}
            <div className="mt-10 flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={saveSelections}
                disabled={selectedShops.length === 0}
                className={`py-3 px-8 rounded-full font-medium shadow-md transition-all ${
                  selectedShops.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#29866B] text-white hover:bg-[#29866B]/90'
                }`}
              >
                Save My Selections
              </motion.button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SelectShops;
