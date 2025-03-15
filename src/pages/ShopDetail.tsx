import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getShopById } from '@/services/shopService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Clock, CheckCircle, Star, Store, ShoppingBag } from 'lucide-react';
import { ShopHeader } from '@/components/shop/ShopHeader';
import { Shop, ShopDetails, Category } from '@/types/shop';

const ShopDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState<ShopDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchShopDetails = async () => {
      if (!id) {
        navigate('/shops');
        return;
      }
      
      setIsLoading(true);
      try {
        const shopData = await getShopById(id);
        if (!shopData) {
          navigate('/shops');
          return;
        }
        
        const shopDetails: ShopDetails = {
          ...shopData,
          products: Math.floor(Math.random() * 100) + 20,
          followers: Math.floor(Math.random() * 1000) + 50,
          reviews: Math.floor(Math.random() * 500) + 10,
        };
        
        setShop(shopDetails);
      } catch (error) {
        console.error('Error fetching shop details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchShopDetails();
  }, [id, navigate]);
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse">
          <div className="h-48 bg-gray-200 rounded-xl mb-6"></div>
          <div className="h-8 bg-gray-200 w-1/4 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 w-1/2 rounded mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-64 bg-gray-200 rounded-xl"></div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!shop) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-semibold mb-4">Shop Not Found</h1>
        <p className="text-gray-500 mb-6">The shop you're looking for doesn't exist or may have been removed.</p>
        <Button onClick={() => navigate('/shops')}>Browse Shops</Button>
      </div>
    );
  }
  
  const shopCategories: Category[] = [
    { id: '1', name: 'Popular Items', group: 'popular', created_at: '', updated_at: '' },
    { id: '2', name: 'New Arrivals', group: 'featured', created_at: '', updated_at: '' },
    { id: '3', name: 'Discounted', group: 'featured', created_at: '', updated_at: '' },
    { id: '4', name: 'Seasonal', group: 'featured', created_at: '', updated_at: '' },
  ];
  
  return (
    <div className="container mx-auto py-8 px-4">
      <ShopHeader shop={shop} />
      
      <div className="mt-8">
        <Tabs defaultValue="products">
          <TabsList className="mb-6">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {shopCategories.map((category) => (
                <Card key={category.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-gray-100 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-4xl text-gray-300">
                      <ShoppingBag size={48} />
                    </div>
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <CardDescription>Browse all {category.name.toLowerCase()}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <Button variant="outline" className="w-full" onClick={() => navigate(`/shop/${shop.id}?category=${category.id}`)}>
                      View Products
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button onClick={() => navigate(`/shop/${shop.id}`)}>
                View All Products
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>About {shop.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Description</h3>
                  <p className="text-gray-700">{shop.description}</p>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
                      <div>
                        <h4 className="font-medium">Location</h4>
                        <p className="text-gray-600">{shop.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
                      <div>
                        <h4 className="font-medium">Joined</h4>
                        <p className="text-gray-600">
                          {new Date(shop.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Store className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
                      <div>
                        <h4 className="font-medium">Category</h4>
                        <p className="text-gray-600">{shop.category}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
                      <div>
                        <h4 className="font-medium">Verification</h4>
                        <div>
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Verified Shop</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Stats</h3>
                  <div className="grid grid-cols-3 md:grid-cols-3 gap-4 text-center">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-2xl font-bold text-primary">{shop.products}</p>
                      <p className="text-sm text-gray-500">Products</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-center">
                        <p className="text-2xl font-bold text-primary mr-1">{shop.rating?.toFixed(1) || "0.0"}</p>
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      </div>
                      <p className="text-sm text-gray-500">Rating</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-2xl font-bold text-primary">{shop.followers}</p>
                      <p className="text-sm text-gray-500">Followers</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
                <CardDescription>See what customers are saying about {shop.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No reviews yet. Be the first to review!</p>
                  <Button>Write a Review</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ShopDetail;
