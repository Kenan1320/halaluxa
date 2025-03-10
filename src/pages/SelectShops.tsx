
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { getShops, setMainShop } from '@/services/shopService';
import { Store, Star, Check, Heart, ShoppingBag, Clock, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const SelectShops = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  
  const { data: allShops, isLoading, error } = useQuery({
    queryKey: ['shops'],
    queryFn: getShops
  });
  
  // Filter shops based on the current user's ID
  const userShops = allShops?.filter(shop => shop.owner_id === user?.id) || [];
  
  // Load the main shop ID from localStorage
  useEffect(() => {
    const mainShopId = localStorage.getItem('mainShopId');
    if (mainShopId) {
      setSelectedShopId(mainShopId);
    }
  }, []);
  
  // Set the selected shop as the main shop
  const handleSetMainShop = async (shopId: string) => {
    try {
      await setMainShop(shopId);
      setSelectedShopId(shopId);
      toast({
        title: "Main shop updated",
        description: "Your main shop has been successfully updated.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error setting main shop:', error);
      toast({
        title: "Failed to update",
        description: "There was an error updating your main shop.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pt-20 pb-10">
        <div className="flex justify-center items-center h-40">
          <div className="flex space-x-2">
            <div className="h-3 w-3 bg-[#2A866A] dark:bg-[#4ECBA5] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-3 w-3 bg-[#2A866A] dark:bg-[#4ECBA5] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-3 w-3 bg-[#2A866A] dark:bg-[#4ECBA5] rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 pt-20 pb-10">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-600 dark:text-red-400">
          <p>Error: {error instanceof Error ? error.message : 'Failed to load shops.'}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 pt-20 pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-[#2A866A] dark:text-[#4ECBA5] mb-2">Your Shops</h1>
        <p className="text-gray-600 dark:text-gray-400">Select your main shop to display in the navigation bar</p>
      </div>
      
      {userShops.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-[#E4F5F0] dark:bg-[#2A866A]/20 p-10 rounded-xl max-w-md mx-auto">
            <Store className="h-12 w-12 text-[#2A866A] dark:text-[#4ECBA5] mx-auto mb-4" />
            <h2 className="text-xl font-medium mb-2">No shops found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">You haven't created any shops yet. Create your first shop to get started.</p>
            <Button asChild>
              <Link to="/dashboard/settings">
                <Plus className="h-4 w-4 mr-2" /> Create Shop
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userShops.map((shop) => (
            <motion.div
              key={shop.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className={cn(
                "overflow-hidden hover:shadow-md transition-all duration-300",
                selectedShopId === shop.id && "ring-2 ring-[#2A866A] dark:ring-[#4ECBA5]"
              )}>
                <div className="aspect-video relative bg-gray-100 dark:bg-gray-800">
                  {shop.cover_image ? (
                    <img 
                      src={shop.cover_image} 
                      alt={shop.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-[#E4F5F0] dark:bg-[#2A866A]/20">
                      <ShoppingBag className="h-12 w-12 text-[#2A866A] dark:text-[#4ECBA5]" />
                    </div>
                  )}
                  {shop.is_verified && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                      <Check className="h-3 w-3 mr-1" /> Verified
                    </div>
                  )}
                </div>
                
                <CardHeader className="pt-4 pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      {shop.logo_url ? (
                        <div className="h-10 w-10 rounded-full overflow-hidden mr-3 border border-gray-200 dark:border-gray-700">
                          <img src={shop.logo_url} alt={shop.name} className="h-full w-full object-cover" />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-full overflow-hidden mr-3 bg-[#E4F5F0] dark:bg-[#2A866A]/20 flex items-center justify-center">
                          <Store className="h-5 w-5 text-[#2A866A] dark:text-[#4ECBA5]" />
                        </div>
                      )}
                      <CardTitle className="text-xl">{shop.name}</CardTitle>
                    </div>
                    {shop.rating && (
                      <div className="flex items-center text-amber-500 text-sm">
                        <Star className="h-4 w-4 fill-current mr-1" />
                        <span>{shop.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  <CardDescription className="text-sm mt-1">
                    {shop.category}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pb-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {shop.description || "No description available."}
                  </p>
                  
                  <div className="flex items-center mt-3 text-xs text-gray-500 dark:text-gray-400 space-x-4">
                    <div className="flex items-center">
                      <Heart className="h-3.5 w-3.5 mr-1" />
                      <span>{shop.review_count || 0} reviews</span>
                    </div>
                    <div className="flex items-center">
                      <ShoppingBag className="h-3.5 w-3.5 mr-1" />
                      <span>{shop.product_count || 0} products</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      <span>Since {new Date(shop.created_at || Date.now()).getFullYear()}</span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-2">
                  <div className="flex gap-2 w-full">
                    <Button 
                      variant={selectedShopId === shop.id ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => handleSetMainShop(shop.id)}
                    >
                      {selectedShopId === shop.id ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Main Shop
                        </>
                      ) : (
                        "Set as Main"
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      asChild
                      className="flex-1"
                    >
                      <Link to={`/shop/${shop.id}`}>
                        View Shop
                      </Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectShops;
