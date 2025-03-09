import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ShopCard } from '@/components/shop/ShopCard';
import { Shop, fetchShops } from '@/services/shopService';
import { useNavigate } from 'react-router-dom';

interface ShopPreference {
  id: string;
  user_id: string;
  shop_id: string;
  is_following: boolean;
  is_favorite: boolean;
  is_main_shop: boolean;
  shop?: Shop;
}

const SelectShops = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShops, setSelectedShops] = useState<Set<string>>(new Set());
  const [mainShopId, setMainShopId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedPreferences, setSavedPreferences] = useState<ShopPreference[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllShops = async () => {
      try {
        setLoading(true);
        const shopsData = await fetchShops();
        setShops(shopsData);
        
        if (user) {
          await fetchUserPreferences();
        }
      } catch (err) {
        console.error('Error fetching shops:', err);
        setError('Failed to load shops. Please try again.');
        toast({
          title: 'Error',
          description: 'Failed to load shops. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAllShops();
  }, [user]);

  const fetchUserPreferences = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_shop_preferences')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error fetching user preferences:', error);
        return;
      }
      
      if (data && Array.isArray(data)) {
        const newSelectedShops = new Set<string>();
        let mainShop: string | null = null;
        
        data.forEach((pref: ShopPreference) => {
          if (pref.is_following) {
            newSelectedShops.add(pref.shop_id);
          }
          if (pref.is_main_shop) {
            mainShop = pref.shop_id;
          }
        });
        
        setSavedPreferences(data);
        setSelectedShops(newSelectedShops);
        setMainShopId(mainShop);
      }
    } catch (err) {
      console.error('Error fetching user shop preferences:', err);
    }
  };

  const handleSelectShop = (shopId: string) => {
    setSelectedShops(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(shopId)) {
        newSelection.delete(shopId);
        if (mainShopId === shopId) {
          setMainShopId(null);
        }
      } else {
        newSelection.add(shopId);
        if (newSelection.size === 1) {
          setMainShopId(shopId);
        }
      }
      return newSelection;
    });
  };

  const handleSetMainShop = (shopId: string) => {
    setMainShopId(shopId);
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to save shop preferences.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      
      const updatePromises = Array.from(selectedShops).map(async (shopId) => {
        const isMainShop = shopId === mainShopId;
        const existingPref = savedPreferences.find(p => p.shop_id === shopId);
        
        if (existingPref) {
          return supabase
            .from('user_shop_preferences')
            .update({
              is_following: true,
              is_favorite: existingPref.is_favorite,
              is_main_shop: isMainShop,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id)
            .eq('shop_id', shopId);
        } else {
          return supabase
            .from('user_shop_preferences')
            .insert({
              user_id: user.id,
              shop_id: shopId,
              is_following: true,
              is_favorite: false,
              is_main_shop: isMainShop
            });
        }
      });
      
      for (const pref of savedPreferences) {
        if (!selectedShops.has(pref.shop_id)) {
          await supabase
            .from('user_shop_preferences')
            .update({
              is_following: false,
              is_favorite: pref.is_favorite,
              is_main_shop: false,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id)
            .eq('shop_id', pref.shop_id);
        }
      }
      
      await Promise.all(updatePromises);
      
      toast({
        title: 'Success',
        description: 'Your shop preferences have been saved.',
      });
      
      navigate('/');
    } catch (err) {
      console.error('Error saving shop preferences:', err);
      toast({
        title: 'Error',
        description: 'Failed to save your preferences. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading shops...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Select Your Favorite Shops</h1>
        <p className="text-gray-600 mb-8">Choose shops you'd like to follow and set your main shop.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {shops.map((shop) => (
            <ShopCard
              key={shop.id}
              shop={shop}
              isSelected={selectedShops.has(shop.id)}
              isMainShop={mainShopId === shop.id}
              onSelect={() => handleSelectShop(shop.id)}
              onSetMain={() => handleSetMainShop(shop.id)}
              showControls={true}
            />
          ))}
        </div>
        
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={() => navigate('/')}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={loading || selectedShops.size === 0}
          >
            {loading ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SelectShops;
