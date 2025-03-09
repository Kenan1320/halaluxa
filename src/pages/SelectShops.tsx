
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Shop } from '@/models/shop';
import { getShops } from '@/services/shopService';
import { Store, Heart, Star, MapPin } from 'lucide-react';

const SelectShops = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [followedShops, setFollowedShops] = useState<string[]>([]);
  const [mainShop, setMainShop] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadShops = async () => {
      try {
        setIsLoading(true);
        const allShops = await getShops();
        setShops(allShops);
        
        if (user) {
          // Get followed shops for current user
          const { data: followData } = await supabase
            .from('user_shop_preferences')
            .select('shop_id, is_main_shop')
            .eq('user_id', user.id);
            
          if (followData) {
            const followedIds = followData.map(item => item.shop_id);
            setFollowedShops(followedIds);
            
            // Find main shop
            const mainShopData = followData.find(item => item.is_main_shop);
            if (mainShopData) {
              setMainShop(mainShopData.shop_id);
            }
          }
        }
      } catch (error) {
        console.error('Error loading shops:', error);
        toast({
          title: 'Error',
          description: 'Failed to load shops. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadShops();
  }, [user, toast]);

  const handleFollowShop = async (shopId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const isFollowed = followedShops.includes(shopId);
      
      if (isFollowed) {
        // Unfollow shop
        await supabase
          .from('user_shop_preferences')
          .delete()
          .eq('user_id', user.id)
          .eq('shop_id', shopId);
          
        setFollowedShops(prev => prev.filter(id => id !== shopId));
        
        // If this was the main shop, reset main shop
        if (mainShop === shopId) {
          setMainShop(null);
          
          // Update user profile
          await supabase
            .from('profiles')
            .update({ 
              main_shop_id: null 
            })
            .eq('id', user.id);
        }
      } else {
        // Follow shop
        await supabase
          .from('user_shop_preferences')
          .insert([
            { 
              user_id: user.id, 
              shop_id: shopId,
              is_main_shop: !mainShop ? true : false 
            }
          ]);
          
        setFollowedShops(prev => [...prev, shopId]);
        
        // If no main shop set, make this the main shop
        if (!mainShop) {
          setMainShop(shopId);
          
          // Update user profile
          await supabase
            .from('profiles')
            .update({ 
              main_shop_id: shopId 
            })
            .eq('id', user.id);
        }
      }
      
      toast({
        title: isFollowed ? 'Shop unfollowed' : 'Shop followed',
        description: isFollowed ? 'Shop removed from your followed shops' : 'Shop added to your followed shops',
      });
    } catch (error) {
      console.error('Error following/unfollowing shop:', error);
      toast({
        title: 'Error',
        description: 'Failed to update shop preference. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSetMainShop = async (shopId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      // Update all shops to not be main
      await supabase
        .from('user_shop_preferences')
        .update({ is_main_shop: false })
        .eq('user_id', user.id);
        
      // Set selected shop as main
      await supabase
        .from('user_shop_preferences')
        .update({ is_main_shop: true })
        .eq('user_id', user.id)
        .eq('shop_id', shopId);
        
      // Update user profile
      await supabase
        .from('profiles')
        .update({ 
          main_shop_id: shopId 
        })
        .eq('id', user.id);
        
      setMainShop(shopId);
      
      toast({
        title: 'Main shop updated',
        description: 'Your main shop has been updated successfully',
      });
    } catch (error) {
      console.error('Error setting main shop:', error);
      toast({
        title: 'Error',
        description: 'Failed to update main shop. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <Container>
        <div className="py-6">
          <h1 className="text-3xl font-bold mb-2">Select Your Shops</h1>
          <p className="text-muted-foreground mb-8">
            Follow shops to see their products in your feed and select a main shop for quick access.
          </p>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="h-40 bg-muted"></CardHeader>
                  <CardContent className="pt-6">
                    <div className="h-6 w-3/4 bg-muted mb-2 rounded"></div>
                    <div className="h-4 bg-muted rounded mb-4"></div>
                    <div className="h-4 w-1/2 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shops.map((shop) => (
                <Card key={shop.id} className="overflow-hidden">
                  <div className="h-40 bg-muted relative">
                    {shop.cover_image ? (
                      <img
                        src={shop.cover_image}
                        alt={shop.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-haluna-primary-light to-haluna-primary/40">
                        <Store className="h-16 w-16 text-haluna-primary-dark/60" />
                      </div>
                    )}
                    
                    <button
                      onClick={() => handleFollowShop(shop.id)}
                      className={`absolute top-3 right-3 p-2 rounded-full ${
                        followedShops.includes(shop.id)
                          ? 'bg-rose-100 text-rose-500'
                          : 'bg-white/80 text-gray-500 hover:text-rose-500'
                      }`}
                    >
                      <Heart
                        className={followedShops.includes(shop.id) ? 'fill-rose-500' : ''}
                        size={20}
                      />
                    </button>
                    
                    {shop.is_verified && (
                      <div className="absolute top-3 left-3 bg-white/80 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>
                  
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl">{shop.name}</CardTitle>
                      {shop.rating && (
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          <span>{shop.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <CardDescription>{shop.category}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pb-0">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4" />
                      <span>{shop.location}</span>
                    </div>
                    
                    <p className="text-sm line-clamp-2 mb-4">{shop.description}</p>
                    
                    <Separator className="my-4" />
                  </CardContent>
                  
                  <CardFooter className="flex justify-between pt-0">
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/shop/${shop.id}`)}
                      className="w-[48%]"
                    >
                      View Shop
                    </Button>
                    
                    {followedShops.includes(shop.id) && (
                      <Button
                        variant={mainShop === shop.id ? "default" : "secondary"}
                        onClick={() => handleSetMainShop(shop.id)}
                        className="w-[48%]"
                        disabled={mainShop === shop.id}
                      >
                        {mainShop === shop.id ? "Main Shop" : "Set as Main"}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default SelectShops;
