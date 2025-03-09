
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Shop, UserShopPreference } from '@/models/shop';
import ShopCard from '@/components/shop/ShopCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

interface ShopCardProps {
  shop: Shop;
  isSelected?: boolean;
  isMainShop?: boolean;
  onSelect?: () => void;
  onSetMain?: () => void;
  showControls?: boolean;
}

const SelectShops = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShops, setSelectedShops] = useState<string[]>([]);
  const [mainShop, setMainShop] = useState<string | null>(null);
  const [userShopPreferences, setUserShopPreferences] = useState<UserShopPreference[]>([]);

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

        try {
          // Try to fetch user shop preferences directly
          const { data: prefsData, error: prefsError } = await supabase
            .from('user_shop_preferences')
            .select(`
              id, 
              user_id, 
              shop_id, 
              is_following, 
              is_favorite, 
              is_main_shop,
              shops:shop_id (
                id, 
                name, 
                description, 
                category, 
                logo_url
              )
            `)
            .eq('user_id', user.id);
            
          if (prefsError) {
            console.error("Error fetching preferences:", prefsError);
            return;
          }
          
          if (prefsData) {
            const formattedPrefs = prefsData.map(pref => ({
              id: pref.id,
              user_id: pref.user_id,
              shop_id: pref.shop_id,
              is_following: pref.is_following,
              is_favorite: pref.is_favorite,
              is_main_shop: pref.is_main_shop,
              shop: pref.shops
            }));
            
            setUserShopPreferences(formattedPrefs);
            
            // Set selected shops based on preferences
            const selectedShopIds = formattedPrefs.map(pref => pref.shop_id);
            setSelectedShops(selectedShopIds);
            
            // Set main shop
            const mainShopPref = formattedPrefs.find(pref => pref.is_main_shop);
            if (mainShopPref) {
              setMainShop(mainShopPref.shop_id);
            }
          }
        } catch (error) {
          console.error("Error in preferences fetch:", error);
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
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ main_shop_id: mainShop })
          .eq('id', user.id);
          
        if (profileError) {
          console.error('Error updating profile:', profileError);
        }
      }

      // Delete existing preferences
      const { error: deleteError } = await supabase
        .from('user_shop_preferences')
        .delete()
        .eq('user_id', user.id);
        
      if (deleteError) {
        console.error('Error deleting preferences:', deleteError);
      }
      
      // Only proceed if there are selected shops
      if (selectedShops.length > 0) {
        // Create preferences array for insertion
        const preferencesToInsert = selectedShops.map(shopId => ({
          user_id: user.id,
          shop_id: shopId,
          is_following: true,
          is_favorite: true,
          is_main_shop: shopId === mainShop
        }));
        
        // Insert new preferences
        for (const pref of preferencesToInsert) {
          const { error: insertError } = await supabase
            .from('user_shop_preferences')
            .insert(pref);
            
          if (insertError) {
            console.error('Error inserting preference:', insertError);
          }
        }
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
                    isSelected={selectedShops.includes(shop.id)}
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
                        isSelected={true}
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
