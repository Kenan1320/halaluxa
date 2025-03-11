import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getShopById, getShopProducts } from '@/services/shopService';
import { Shop, ShopProduct } from '@/models/shop';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/shop/ProductCard';
import { MapPin, Phone, Mail, Clock, CheckCircle, Star, ShoppingBag, Heart, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';

const ShopDetail = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const { addToCart } = useCart();
  
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');
  const [isFavorite, setIsFavorite] = useState(false);
  
  const mapRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const fetchShopDetails = async () => {
      if (!shopId) return;
      
      try {
        const shopData = await getShopById(shopId);
        if (shopData) {
          setShop(shopData);
          
          // Fetch products for this shop
          const shopProducts = await getShopProducts(shopId);
          setProducts(shopProducts);
        }
      } catch (error) {
        console.error('Error fetching shop details:', error);
        toast({
          title: "Error",
          description: "Failed to load shop details. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchShopDetails();
  }, [shopId, toast]);
  
  useEffect(() => {
    // Initialize map if shop has coordinates and map tab is active
    if (shop?.latitude && shop?.longitude && activeTab === 'location' && mapRef.current) {
      // This is a placeholder for map initialization
      // You would use a mapping library like Google Maps, Mapbox, or Leaflet here
      const mapElement = mapRef.current;
      mapElement.innerHTML = `
        <div style="background-color: #e9ecef; height: 100%; display: flex; align-items: center; justify-content: center; border-radius: 0.5rem;">
          <p>Map showing ${shop.name} at ${shop.location}</p>
          <p>Coordinates: ${shop.latitude}, ${shop.longitude}</p>
        </div>
      `;
    }
  }, [shop, activeTab]);
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite ? `${shop?.name} removed from your favorites` : `${shop?.name} added to your favorites`,
    });
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: shop?.name || 'Check out this shop',
        text: `Check out ${shop?.name} on Haluna`,
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Shop link copied to clipboard",
      });
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!shop) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Shop Not Found</h2>
        <p className="mb-6">The shop you're looking for doesn't exist or has been removed.</p>
        <Link to="/shops">
          <Button>Browse Other Shops</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Shop Header */}
      <div className="relative rounded-xl overflow-hidden mb-8">
        {/* Cover Image */}
        <div className="h-64 bg-gradient-to-r from-green-600 to-green-400 relative">
          {shop.coverImage && (
            <img 
              src={shop.coverImage} 
              alt={`${shop.name} cover`} 
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>
        
        {/* Shop Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-end">
            {/* Shop Logo */}
            <div className="mr-6">
              <div className="w-24 h-24 rounded-lg bg-white p-1 shadow-lg">
                {shop.logo ? (
                  <img 
                    src={shop.logo} 
                    alt={`${shop.name} logo`} 
                    className="w-full h-full object-contain rounded"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-green-100 rounded">
                    <ShoppingBag className="w-12 h-12 text-green-600" />
                  </div>
                )}
              </div>
            </div>
            
            {/* Shop Name and Basic Info */}
            <div className="flex-1">
              <div className="flex items-center">
                <h1 className="text-3xl font-bold mr-2">{shop.name}</h1>
                {shop.isVerified && (
                  <CheckCircle className="w-5 h-5 text-blue-400" />
                )}
              </div>
              <div className="flex items-center text-sm mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{shop.location}</span>
                {shop.distance !== null && (
                  <span className="ml-2">({shop.distance.toFixed(1)} miles away)</span>
                )}
              </div>
              <div className="flex items-center mt-2">
                <div className="flex items-center mr-4">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span>{shop.rating || 'New'}</span>
                </div>
                <div className="flex items-center">
                  <ShoppingBag className="w-4 h-4 mr-1" />
                  <span>{shop.productCount || 0} products</span>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button 
                variant="secondary" 
                size="sm" 
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
                onClick={toggleFavorite}
              >
                <Heart className={`w-4 h-4 mr-1 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                {isFavorite ? 'Saved' : 'Save'}
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Shop Category Badge */}
      {shop.category && (
        <div className="mb-6">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {shop.category}
          </Badge>
        </div>
      )}
      
      {/* Shop Description */}
      <div className="mb-8">
        <p className="text-gray-700">{shop.description}</p>
      </div>
      
      <Separator className="my-8" />
      
      {/* Tabs for Products, About, Location */}
      <Tabs defaultValue="products" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard 
                    product={product}
                    onAddToCart={() => {
                      addToCart(product, 1);
                      toast({
                        title: "Added to cart",
                        description: `${product.name} has been added to your cart`,
                      });
                    }}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingBag className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">No Products Available</h3>
              <p className="text-gray-500">This shop hasn't added any products yet.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="about">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">About {shop.name}</h3>
                  <p className="text-gray-700 mb-6">{shop.description}</p>
                  
                  <h4 className="font-medium mb-2">Business Hours</h4>
                  <div className="flex items-start mb-4">
                    <Clock className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-gray-700">Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p className="text-gray-700">Saturday: 10:00 AM - 4:00 PM</p>
                      <p className="text-gray-700">Sunday: Closed</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-gray-500 mr-3" />
                      <span className="text-gray-700">{shop.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-gray-500 mr-3" />
                      <span className="text-gray-700">(555) 123-4567</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-gray-500 mr-3" />
                      <span className="text-gray-700">contact@{shop.name.toLowerCase().replace(/\s+/g, '')}.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="location">
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">Find Us At</h3>
                <div className="flex items-center text-gray-700 mb-4">
                  <MapPin className="w-5 h-5 text-gray-500 mr-2" />
                  <span>{shop.location}</span>
                </div>
              </div>
              
              <div 
                ref={mapRef} 
                className="w-full h-80 bg-gray-100 rounded-lg"
              >
                <div className="text-center">
                  <p className="pt-32 text-gray-500">Map loading...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShopDetail;
