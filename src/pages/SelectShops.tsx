import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Button, 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { toast } from 'sonner';
import { ShopCard } from '@/components/shop/ShopCard';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Shop, UserShopPreference } from '@/models/shop';
import { fetchShopsByCategory, fetchNearbyShops } from '@/services/shopService';

// Helper components to keep SelectShops.tsx more manageable
const EmptyState = () => (
  <div className="py-12 text-center">
    <h3 className="text-lg font-medium mb-2">No shops available</h3>
    <p className="text-gray-500 mb-4">Please try a different category or check back later.</p>
  </div>
);

const ShopSelectionHeader = () => (
  <div className="py-6 md:py-10 px-4 max-w-4xl mx-auto text-center">
    <h1 className="text-3xl font-bold mb-4">Select Your Shops</h1>
    <p className="text-gray-600 mb-6">
      Choose the shops you want to follow. You can select one as your main shop for quicker access.
    </p>
  </div>
);

const CategorySelector = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: { 
  categories: string[], 
  selectedCategory: string, 
  onSelectCategory: (category: string) => void 
}) => (
  <div className="flex flex-wrap justify-center gap-2 mb-8">
    <Button
      variant={selectedCategory === 'all' ? 'default' : 'outline'}
      onClick={() => onSelectCategory('all')}
      className="rounded-full"
    >
      All
    </Button>
    {categories.map(category => (
      <Button
        key={category}
        variant={selectedCategory === category ? 'default' : 'outline'}
        onClick={() => onSelectCategory(category)}
        className="rounded-full"
      >
        {category}
      </Button>
    ))}
  </div>
);

const SelectShops = () => {
  const { user, profile, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShops, setSelectedShops] = useState<{[key: string]: boolean}>({});
  const [mainShopId, setMainShopId] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [userPreferences, setUserPreferences] = useState<UserShopPreference[]>([]);

  // Fetch user preferences
  const fetchUserPreferences = async () => {
    try {
      if (!user?.id) return;
      
      // Use RPC function to get user preferences with shop details
      const { data, error } = await supabase
        .rpc('get_user_shop_preferences', { user_id_param: user.id });
      
      if (error) {
        console.error('Error fetching user preferences:', error);
        return;
      }
      
      if (data) {
        const mappedPreferences = data.map((pref: any) => ({
          id: pref.id,
          user_id: pref.user_id,
          shop_id: pref.shop_id,
          is_following: pref.is_following,
          is_favorite: pref.is_favorite,
          is_main_shop: pref.is_main_shop,
          shop: pref.shop
        }));
        
        setUserPreferences(mappedPreferences);
        
        // Set selected shops based on preferences
        const newSelectedShops: {[key: string]: boolean} = {};
        mappedPreferences.forEach((pref: UserShopPreference) => {
          if (pref.is_following) {
            newSelectedShops[pref.shop_id] = true;
          }
          if (pref.is_main_shop) {
            setMainShopId(pref.shop_id);
          }
        });
        setSelectedShops(newSelectedShops);
      }
    } catch (error) {
      console.error('Error in fetchUserPreferences:', error);
      toast.error('Failed to load your shop preferences');
    }
  };

  // Fetch shops by category or all shops if category is 'all'
  const fetchShops = async () => {
    setLoading(true);
    try {
      let fetchedShops;
      if (selectedCategory === 'all') {
        fetchedShops = await fetchNearbyShops(100); // Get all shops within 100 km
      } else {
        fetchedShops = await fetchShopsByCategory(selectedCategory);
      }
      
      setShops(fetchedShops);
    } catch (error) {
      console.error('Error fetching shops:', error);
      toast.error('Failed to load shops');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all available categories
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('category')
        .order('category', { ascending: true });
      
      if (error) throw error;
      
      const uniqueCategories = Array.from(new Set(data.map(shop => shop.category)));
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchUserPreferences();
  }, [user?.id]);

  useEffect(() => {
    fetchShops();
  }, [selectedCategory]);

  const handleToggleShop = (shopId: string) => {
    setSelectedShops(prev => ({
      ...prev,
      [shopId]: !prev[shopId]
    }));
  };

  const handleSetMainShop = (shopId: string) => {
    setMainShopId(shopId);
  };

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSavePreferences = async () => {
    try {
      if (!user?.id) {
        toast.error('You must be logged in to save preferences');
        return;
      }

      setLoading(true);

      // Update profile with main shop ID
      if (profile && mainShopId) {
        await updateProfile({
          ...profile,
          main_shop_id: mainShopId
        });
      }

      // Get all selected shop IDs
      const selectedShopIds = Object.entries(selectedShops)
        .filter(([_, isSelected]) => isSelected)
        .map(([shopId]) => shopId);

      // First, handle preferences that should be inserted or updated
      for (const shopId of selectedShopIds) {
        const existingPref = userPreferences.find(p => p.shop_id === shopId);
        
        if (existingPref) {
          // Update existing preference
          const { error } = await supabase
            .rpc('update_user_shop_preference', {
              p_user_id: user.id,
              p_shop_id: shopId,
              p_is_following: true,
              p_is_favorite: existingPref.is_favorite || false,
              p_is_main_shop: mainShopId === shopId
            });
          
          if (error) throw error;
        } else {
          // Insert new preference
          const { error } = await supabase
            .rpc('insert_user_shop_preference', {
              p_user_id: user.id,
              p_shop_id: shopId,
              p_is_following: true,
              p_is_favorite: false,
              p_is_main_shop: mainShopId === shopId
            });
          
          if (error) throw error;
        }
      }

      // Handle preferences that should be removed or updated as not following
      for (const pref of userPreferences) {
        if (!selectedShopIds.includes(pref.shop_id)) {
          // Update as not following
          const { error } = await supabase
            .rpc('update_user_shop_preference', {
              p_user_id: user.id,
              p_shop_id: pref.shop_id,
              p_is_following: false,
              p_is_favorite: pref.is_favorite || false,
              p_is_main_shop: false
            });
          
          if (error) throw error;
        }
      }

      toast.success('Your shop preferences have been saved');
      navigate('/');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save your preferences');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 pb-16">
      <ShopSelectionHeader />
      
      <CategorySelector 
        categories={categories} 
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />
      
      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : shops.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {shops.map(shop => (
              <ShopCard
                key={shop.id}
                shop={shop}
                isSelected={!!selectedShops[shop.id]}
                isMainShop={mainShopId === shop.id}
                onSelect={() => handleToggleShop(shop.id)}
                onSetMain={() => handleSetMainShop(shop.id)}
                showControls={true}
              />
            ))}
          </div>
          
          <div className="flex justify-center mt-8">
            <Button 
              className="px-8 py-2"
              onClick={handleSavePreferences}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Preferences'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default SelectShops;
