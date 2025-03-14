
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getShopById, getShopProducts, getShopReviews, updateUserShopPreference } from '@/services/shopService';
import { Shop, ShopProduct } from '@/models/shop';
import ShopHeader from '@/components/shop/ShopHeader';
import ShopProductList from '@/components/shop/ShopProductList';
import ReviewList from '@/components/shop/ReviewList';
import AddReviewForm from '@/components/shop/AddReviewForm';
import MapComponent from '@/components/MapComponent';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Clock, Globe, CheckCircle, ShoppingBag, Star, Heart } from 'lucide-react';

const ShopDetail = () => {
  const { shopId } = useParams();
  const { user, isLoggedIn } = useAuth();
  const { toast } = useToast();
  
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  
  useEffect(() => {
    const fetchShopData = async () => {
      if (!shopId) return;
      
      setIsLoading(true);
      
      try {
        // Fetch shop details
        const shopData = await getShopById(shopId);
        if (!shopData) {
          toast({
            title: "Shop not found",
            description: "The shop you're looking for doesn't exist or has been removed.",
            variant: "destructive"
          });
          return;
        }
        
        setShop(shopData);
        
        // Fetch shop products
        const productsData = await getShopProducts(shopId);
        setProducts(productsData);
        
        // Fetch shop reviews
        const reviewsData = await getShopReviews(shopId);
        setReviews(reviewsData);
        
        // Check if shop is favorite (this would be a real API call in production)
        if (isLoggedIn && user) {
          // Mock implementation - replace with actual API call
          setIsFavorite(Math.random() > 0.5);
        }
      } catch (error) {
        console.error("Error fetching shop data:", error);
        toast({
          title: "Error",
          description: "Failed to load shop information. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchShopData();
  }, [shopId, isLoggedIn, user]);
  
  const handleToggleFavorite = async () => {
    if (!isLoggedIn || !user) {
      toast({
        title: "Login Required",
        description: "Please log in to save shops to your favorites.",
        variant: "default"
      });
      return;
    }
    
    if (!shop) return;
    
    try {
      // Call API to update favorite status
      const success = await updateUserShopPreference(user.id, shop.id, !isFavorite);
      
      if (success) {
        setIsFavorite(prev => !prev);
        toast({
          title: isFavorite ? "Removed from favorites" : "Added to favorites",
          description: isFavorite 
            ? `${shop.name} has been removed from your favorites.` 
            : `${shop.name} has been added to your favorites.`,
          variant: "default"
        });
      } else {
        throw new Error("Failed to update favorite status");
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
      toast({
        title: "Error",
        description: "Failed to update favorite status. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-haluna-primary"></div>
      </div>
    );
  }
  
  if (!shop) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Shop Not Found</h1>
        <p className="mb-8">The shop you're looking for may have been removed or doesn't exist.</p>
        <Link to="/shops">
          <Button>Browse Shops</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen pb-16 pt-20">
      {/* Shop Header */}
      <ShopHeader shop={shop} />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-6 relative z-10">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          {/* Actions Bar */}
          <div className="p-4 flex justify-between items-center border-b">
            <div className="flex items-center space-x-2">
              {shop.is_verified && (
                <div className="flex items-center text-green-600 text-sm">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span>Verified</span>
                </div>
              )}
              {shop.rating > 0 && (
                <div className="flex items-center text-yellow-500 text-sm">
                  <Star className="h-4 w-4 mr-1 fill-yellow-500" />
                  <span>{shop.rating.toFixed(1)}</span>
                </div>
              )}
              <div className="text-gray-500 text-sm">
                <ShoppingBag className="h-4 w-4 inline mr-1" />
                <span>{shop.product_count} products</span>
              </div>
            </div>
            
            <Button
              variant={isFavorite ? "destructive" : "outline"}
              size="sm"
              onClick={handleToggleFavorite}
              className="flex items-center"
            >
              <Heart className={`h-4 w-4 mr-1 ${isFavorite ? 'fill-white' : ''}`} />
              {isFavorite ? 'Saved' : 'Save'}
            </Button>
          </div>
          
          {/* Tabs Navigation */}
          <Tabs defaultValue="products" onValueChange={setActiveTab} className="w-full">
            <div className="border-b">
              <TabsList className="w-full bg-transparent border-b p-0 h-auto">
                <TabsTrigger 
                  value="products" 
                  className={`py-4 px-6 rounded-none border-b-2 ${
                    activeTab === 'products' ? 'border-haluna-primary text-haluna-primary' : 'border-transparent'
                  }`}
                >
                  Products
                </TabsTrigger>
                <TabsTrigger 
                  value="about" 
                  className={`py-4 px-6 rounded-none border-b-2 ${
                    activeTab === 'about' ? 'border-haluna-primary text-haluna-primary' : 'border-transparent'
                  }`}
                >
                  About
                </TabsTrigger>
                <TabsTrigger 
                  value="reviews" 
                  className={`py-4 px-6 rounded-none border-b-2 ${
                    activeTab === 'reviews' ? 'border-haluna-primary text-haluna-primary' : 'border-transparent'
                  }`}
                >
                  Reviews ({reviews.length})
                </TabsTrigger>
              </TabsList>
            </div>
            
            {/* Tab Contents */}
            <TabsContent value="products" className="p-0 mt-0">
              <ShopProductList products={products} />
            </TabsContent>
            
            <TabsContent value="about" className="p-6 mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">About {shop.name}</h3>
                  <p className="text-gray-600 mb-6">{shop.description}</p>
                  
                  <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <MapPin className="h-5 w-5 text-haluna-primary mr-3 mt-0.5" />
                      <span className="text-gray-600">{shop.location}</span>
                    </li>
                    <li className="flex items-start">
                      <Phone className="h-5 w-5 text-haluna-primary mr-3 mt-0.5" />
                      <span className="text-gray-600">+1 (555) 123-4567</span>
                    </li>
                    <li className="flex items-start">
                      <Mail className="h-5 w-5 text-haluna-primary mr-3 mt-0.5" />
                      <span className="text-gray-600">contact@{shop.name.toLowerCase().replace(/\s+/g, '')}.com</span>
                    </li>
                    <li className="flex items-start">
                      <Globe className="h-5 w-5 text-haluna-primary mr-3 mt-0.5" />
                      <span className="text-haluna-primary">www.{shop.name.toLowerCase().replace(/\s+/g, '')}.com</span>
                    </li>
                    <li className="flex items-start">
                      <Clock className="h-5 w-5 text-haluna-primary mr-3 mt-0.5" />
                      <div>
                        <p className="text-gray-600">Monday - Friday: 9AM - 8PM</p>
                        <p className="text-gray-600">Saturday - Sunday: 10AM - 6PM</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Location</h3>
                  <MapComponent 
                    center={{ 
                      lat: shop.latitude || 25.2854, 
                      lng: shop.longitude || 51.5310 
                    }} 
                    markers={[{ 
                      lat: shop.latitude || 25.2854, 
                      lng: shop.longitude || 51.5310,
                      title: shop.name 
                    }]}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="p-6 mt-0">
              {isLoggedIn ? (
                <AddReviewForm shopId={shop.id} onReviewAdded={(newReview) => {
                  setReviews(prevReviews => [newReview, ...prevReviews]);
                }} />
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <p className="text-center text-gray-600">
                    Please <Link to="/login" className="text-haluna-primary font-medium">login</Link> to leave a review
                  </p>
                </div>
              )}
              
              <ReviewList reviews={reviews} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ShopDetail;
