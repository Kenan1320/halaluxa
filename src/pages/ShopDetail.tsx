import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ShopProductList from '@/components/shop/ShopProductList';
import ReviewList from '@/components/shop/ReviewList';
import { ShopHeader } from '@/components/shop/ShopHeader';
import { ShopDetails } from '@/types/shop';
import { getShopById } from '@/services/shopService';
import { getReviews } from '@/services/reviewService';

const ShopDetail = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const [shop, setShop] = useState<ShopDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('menu');
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchShopDetails = async () => {
      setIsLoading(true);
      try {
        if (shopId) {
          const shopData = await getShopById(shopId);
          
          if (shopData) {
            const shopDetails: ShopDetails = {
              ...shopData,
              products: 42,
              followers: 1240,
              reviews: 158,
              rating: { average: 4.7, count: 158 },
              deliveryInfo: {
                fee: 2.99,
                minOrder: 15.00,
                estimatedTime: '30-45 min'
              },
              isGroupOrderEnabled: true
            };
            
            setShop(shopDetails);
          }
        }
      } catch (error) {
        console.error('Error fetching shop details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShopDetails();
  }, [shopId]);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // In a real app, you would call an API to follow/unfollow
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse">
          <div className="h-48 md:h-64 bg-gray-200 mb-16"></div>
          <div className="h-8 bg-gray-200 mb-4 w-1/3"></div>
          <div className="h-4 bg-gray-200 mb-2 w-1/4"></div>
          <div className="h-4 bg-gray-200 mb-6 w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h2 className="text-2xl font-bold">Shop not found</h2>
        <p className="mt-2 text-gray-600">The shop you're looking for doesn't exist or has been removed.</p>
        <Link to="/shops">
          <Button className="mt-4">Browse Other Shops</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ShopHeader 
        shop={shop} 
        onFollow={handleFollow}
        isFollowing={isFollowing}
      />
      
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
          </TabsList>
          
          <TabsContent value="menu" className="space-y-6">
            <ShopProductList shopId={shop.id} />
          </TabsContent>
          
          <TabsContent value="reviews" className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold">Customer Reviews</h3>
                  <p className="text-gray-600">
                    {typeof shop.rating === 'object' ? 
                      `${shop.rating.average.toFixed(1)} out of 5 (${shop.rating.count} reviews)` : 
                      'No reviews yet'
                    }
                  </p>
                </div>
                <Button variant="outline">Write a Review</Button>
              </div>
              <ReviewList shopId={shop.id} />
            </div>
          </TabsContent>
          
          <TabsContent value="info" className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4">Shop Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Address</h4>
                  <p className="text-gray-600">{shop.address || shop.location}</p>
                  
                  <h4 className="font-medium text-gray-700 mb-2 mt-4">Delivery Information</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>Delivery Fee: ${shop.deliveryInfo.fee.toFixed(2)}</li>
                    <li>Minimum Order: ${shop.deliveryInfo.minOrder.toFixed(2)}</li>
                    <li>Estimated Delivery Time: {shop.deliveryInfo.estimatedTime}</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Shop Details</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>Category: {shop.category}</li>
                    <li>Verified: {shop.is_verified ? 'Yes' : 'No'}</li>
                    <li>Products: {shop.products}</li>
                    <li>Followers: {shop.followers}</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ShopDetail;
