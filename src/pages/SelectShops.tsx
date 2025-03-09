import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getShops, Shop, getMainShop } from '@/services/shopService';
import { useAuth } from '@/context/AuthContext';

const SelectShops = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShops, setSelectedShops] = useState<string[]>([]);
  const [mainShop, setMainShop] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      setIsLoading(true);
      const allShops = await getShops();
      setShops(allShops);
      
      // Get user's main shop
      const userMainShop = await getMainShop();
      if (userMainShop) {
        setMainShop(userMainShop.id);
        setSelectedShops(prev => [...prev, userMainShop.id]);
      }
      
      // Get user's followed shops
      if (user) {
        const { data } = await supabase
          .from('user_shop_follows')
          .select('shop_id')
          .eq('user_id', user.id);
        
        if (data && data.length > 0) {
          const followedShopIds = data.map(item => item.shop_id);
          setSelectedShops(prev => [...new Set([...prev, ...followedShopIds])]);
        }
      }
    } catch (error) {
      console.error('Error fetching shops:', error);
      toast({
        title: 'Error',
        description: 'Failed to load shops. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShopSelect = (shopId: string) => {
    setSelectedShops(prev => {
      if (prev.includes(shopId)) {
        // If this is the main shop, don't allow unselecting
        if (shopId === mainShop) {
          toast({
            title: 'Cannot Unselect Main Shop',
            description: 'Your main shop is always selected. You can change your main shop instead.',
            variant: 'default',
          });
          return prev;
        }
        return prev.filter(id => id !== shopId);
      } else {
        return [...prev, shopId];
      }
    });
  };

  const setAsMainShop = async (shopId: string) => {
    try {
      // Load current user profile
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;
      
      // Update the user's profile with the selected main shop
      const { error } = await supabase
        .from('profiles')
        .update({ main_shop_id: shopId })
        .eq('id', userData.user.id);
        
      if (error) {
        console.error('Error setting main shop:', error);
        toast({
          title: 'Error',
          description: 'Failed to set as main shop',
          variant: 'destructive',
        });
        return;
      }
      
      toast({
        title: 'Success',
        description: 'Main shop updated successfully',
      });
      
      // Refresh shops to show the updated state
      fetchShops();
    } catch (error) {
      console.error('Error setting main shop:', error);
    }
  };

  const saveSelections = async () => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to save your selections',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      // First, delete all existing follows
      await supabase
        .from('user_shop_follows')
        .delete()
        .eq('user_id', user.id);
      
      // Then insert new follows
      const followData = selectedShops.map(shopId => ({
        user_id: user.id,
        shop_id: shopId
      }));
      
      const { error } = await supabase
        .from('user_shop_follows')
        .insert(followData);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Success',
        description: 'Your shop selections have been saved',
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error saving shop selections:', error);
      toast({
        title: 'Error',
        description: 'Failed to save your selections. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 pb-10">
        <Container>
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-haluna-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading shops...</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-10">
      <Container>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-4">Select Your Favorite Shops</h1>
            <p className="text-gray-600">
              Choose the shops you want to follow. You'll see their products in your feed and get updates about their new items.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {shops.map(shop => (
              <motion.div
                key={shop.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`border rounded-lg p-4 ${
                  selectedShops.includes(shop.id) ? 'border-haluna-primary bg-haluna-primary-light/10' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                      {shop.logo_url ? (
                        <img 
                          src={shop.logo_url} 
                          alt={`${shop.name} logo`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-medium text-gray-500">
                          {shop.name.substring(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{shop.name}</h3>
                      <div className="flex items-center">
                        <Checkbox
                          id={`shop-${shop.id}`}
                          checked={selectedShops.includes(shop.id)}
                          onCheckedChange={() => handleShopSelect(shop.id)}
                          className="mr-2"
                        />
                        <Label htmlFor={`shop-${shop.id}`} className="text-sm">Follow</Label>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-1">{shop.description.substring(0, 100)}...</p>
                    
                    <div className="flex items-center mt-3">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full mr-2">
                        {shop.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {shop.product_count} products
                      </span>
                    </div>
                    
                    {selectedShops.includes(shop.id) && (
                      <div className="mt-3">
                        <Button
                          variant={mainShop === shop.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setAsMainShop(shop.id)}
                          disabled={mainShop === shop.id}
                          className="text-xs h-8"
                        >
                          {mainShop === shop.id ? '✓ Main Shop' : 'Set as Main Shop'}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="flex justify-between items-center mt-8">
            <p className="text-sm text-gray-600">
              {selectedShops.length} shops selected
            </p>
            
            <div className="space-x-4">
              <Button variant="outline" onClick={() => navigate('/')}>
                Skip
              </Button>
              <Button onClick={saveSelections}>
                Save Selections
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default SelectShops;
