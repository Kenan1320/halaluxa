
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, MapPin } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { getShops, Shop, setMainShop } from '@/services/shopService';

const SelectShops = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    const loadShops = async () => {
      setIsLoading(true);
      try {
        const shopsData = await getShops();
        setShops(shopsData);
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
  }, []);
  
  const handleShopSelect = (shopId: string) => {
    setSelectedShopId(shopId);
  };
  
  const handleSetMainShop = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to set a main shop.",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedShopId) {
      toast({
        title: "Error",
        description: "Please select a shop to set as your main shop.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await setMainShop(selectedShopId, user.id);
      if (success) {
        toast({
          title: "Success",
          description: "Main shop updated successfully!"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to set main shop. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error setting main shop:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Select Your Shops</h1>
      
      {isLoading ? (
        <div className="text-center">Loading shops...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shops.map((shop, index) => (
            <motion.div
              key={shop.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 cursor-pointer ${selectedShopId === shop.id ? 'border-2 border-green-500' : ''}`}
              onClick={() => handleShopSelect(shop.id)}
              whileHover={{ y: -5 }}
            >
              {shop.coverImage ? (
                <img src={shop.coverImage} alt={shop.name} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-500">No Cover Image</span>
                </div>
              )}
              
              <div className="p-4">
                <h2 className="text-lg font-semibold">{shop.name}</h2>
                <div className="flex items-center text-sm text-gray-600 mt-2">
                  <Star className="h-4 w-4 mr-1 text-yellow-500" />
                  <span>{shop.rating}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{shop.location}</span>
                </div>
                <p className="text-gray-700 mt-2">{shop.description}</p>
                
                {selectedShopId === shop.id && (
                  <div className="mt-4 flex items-center text-green-600">
                    <Check className="h-5 w-5 mr-1" />
                    <span>Selected</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      <div className="mt-6">
        <Button 
          onClick={handleSetMainShop}
          disabled={isLoading || !selectedShopId}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          {isLoading ? 'Setting Main Shop...' : 'Set as Main Shop'}
        </Button>
      </div>
    </div>
  );
};

export default SelectShops;
