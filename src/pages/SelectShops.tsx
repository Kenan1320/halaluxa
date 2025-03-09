
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Shop, UserShopPreference } from '@/models/shop';
import { ShopCard } from '@/components/shop/ShopCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

interface MyShopPreference {
  id?: string;
  user_id: string;
  shop_id: string;
  is_following?: boolean;
  is_favorite?: boolean;
  is_main_shop?: boolean;
  shop?: Shop;
}

const SelectShops = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShops, setSelectedShops] = useState<string[]>([]);
  const [mainShop, setMainShop] = useState<string | null>(null);
  const [userShopPreferences, setUserShopPreferences] = useState<MyShopPreference[]>([]);

  useEffect(() => {
    if (!user) return;
    
    const fetchShops = async () => {
      setLoading(true);
      try {
        // Fetch all available shops
        const { data: shopsData, error: shopsError } = await supabase
          .from('shops')
          .select('*');

        if (shopsError) {
          throw shopsError;
        }

        setShops(shopsData || []);

        // Fetch user's shop preferences
        // We'll create a custom type with the SQL query to handle the user_shop_preferences table
        const { data: prefsData, error: prefsError } = await supabase
          .rpc('get_user_shop_preferences', { user_id_param: user.id });

        if (prefsError) {
          // If there's an error, try using direct join approach
          // This is a fallback if the RPC doesn't exist yet
          console.log("Using direct query approach instead of RPC");
          
          const { data: preferences, error: prefQueryError } = await supabase
            .from('shops')
            .select(`
              id,
              name,
              description,
              category,
              logo_url,
              user_shop_preferences!inner(
                id,
                user_id,
                shop_id,
                is_following,
                is_favorite,
                is_main_shop
              )
            `)
            .eq('user_shop_preferences.user_id', user.id);

          if (prefQueryError) {
            console.error("Error fetching preferences:", prefQueryError);
            // If both approaches fail, we'll just use an empty array
            setUserShopPreferences([]);
          } else {
            const userPrefs = preferences?.map(shop => {
              const pref = shop.user_shop_preferences[0];
              return {
                id: pref.id,
                user_id: pref.user_id,
                shop_id: shop.id,
                is_following: pref.is_following,
                is_favorite: pref.is_favorite,
                is_main_shop: pref.is_main_shop,
                shop: {
                  id: shop.id,
                  name: shop.name,
                  description: shop.description,
                  category: shop.category,
                  logo_url: shop.logo_url
                } as Shop
              };
            }) || [];
            
            setUserShopPreferences(userPrefs);
            
            // Set selected shops based on preferences
            const selectedShopIds = userPrefs.map(pref => pref.shop_id);
            setSelectedShops(selectedShopIds);
            
            // Set main shop
            const mainShopPref = userPrefs.find(pref => pref.is_main_shop);
            if (mainShopPref) {
              setMainShop(mainShopPref.shop_id);
            }
          }
        } else {
          // If the RPC exists and works
          setUserShopPreferences(prefsData || []);
          
          // Set selected shops based on preferences
          const selectedShopIds = (prefsData || []).map(pref => pref.shop_id);
          setSelectedShops(selectedShopIds);
          
          // Set main shop
          const mainShopPref = (prefsData || []).find(pref => pref.is_main_shop);
          if (mainShopPref) {
            setMainShop(mainShopPref.shop_id);
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
        setLoading(false);
      }
    };

    fetchShops();
  }, [user]);

  const toggleShopSelection = (shopId: string) => {
    setSelectedShops(prevSelected => {
      if (prevSelected.includes(shopId)) {
        // Removing a shop
        const newSelection = prevSelected.filter(id => id !== shopId);
        
        // If removing the main shop, set mainShop to null
        if (mainShop === shopId) {
          setMainShop(null);
        }
        
        return newSelection;
      } else {
        // Adding a shop
        return [...prevSelected, shopId];
      }
    });
  };

  const setAsMainShop = (shopId: string) => {
    // Make sure the shop is selected first
    if (!selectedShops.includes(shopId)) {
      toggleShopSelection(shopId);
    }
    
    setMainShop(shopId);
  };

  const savePreferences = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      // Update profile's main_shop_id
      if (mainShop) {
        await supabase
          .from('profiles')
          .update({ main_shop_id: mainShop })
          .eq('id', user.id);
      }

      // Handle existing preferences
      if (userShopPreferences.length > 0) {
        // Delete all existing preferences (we'll add back the selected ones)
        const { error: deleteError } = await supabase
          .from('user_shop_preferences')
          .delete()
          .eq('user_id', user.id);
          
        if (deleteError) throw deleteError;
      }
      
      // Only proceed if there are selected shops
      if (selectedShops.length > 0) {
        // Create new preferences for each selected shop
        const preferencesToInsert = selectedShops.map(shopId => ({
          user_id: user.id,
          shop_id: shopId,
          is_main_shop: shopId === mainShop
        }));
        
        // Insert the new preferences
        const { error: insertError } = await supabase
          .from('user_shop_preferences')
          .insert(preferencesToInsert);
          
        if (insertError) throw insertError;
      }

      toast({
        title: 'Success',
        description: 'Your shop preferences have been saved.',
      });
      
      // Navigate to the home page
      navigate('/');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to save preferences. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleMainShop = (shopId: string) => {
    if (mainShop === shopId) {
      setMainShop(null); // Unset as main shop
    } else {
      setAsMainShop(shopId); // Set as main shop
    }
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Select Your Favorite Shops</h1>
      
      <p className="text-gray-600 mb-8">
        Choose the shops you want to follow. You can set one as your main shop to see their products first.
      </p>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <Tabs defaultValue="all" className="mb-8">
            <TabsList>
              <TabsTrigger value="all">All Shops</TabsTrigger>
              <TabsTrigger value="selected">
                Selected ({selectedShops.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {shops.map((shop) => (
                  <ShopCard 
                    key={shop.id}
                    shop={shop}
                    selected={selectedShops.includes(shop.id)}
                    isMainShop={mainShop === shop.id}
                    onSelect={() => toggleShopSelection(shop.id)}
                    onSetMain={() => toggleMainShop(shop.id)}
                    showControls={true}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="selected" className="mt-6">
              {selectedShops.length === 0 ? (
                <div className="text-center p-8 border border-dashed rounded-lg">
                  <p>You haven't selected any shops yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {shops
                    .filter(shop => selectedShops.includes(shop.id))
                    .map(shop => (
                      <ShopCard 
                        key={shop.id}
                        shop={shop}
                        selected={true}
                        isMainShop={mainShop === shop.id}
                        onSelect={() => toggleShopSelection(shop.id)}
                        onSetMain={() => toggleMainShop(shop.id)}
                        showControls={true}
                      />
                    ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end mt-8">
            <Button
              variant="outline"
              className="mr-4"
              onClick={() => navigate('/')}
            >
              Skip
            </Button>
            <Button 
              onClick={savePreferences}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Preferences'
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default SelectShops;
