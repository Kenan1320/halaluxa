
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, Clock, Star, MapIcon, ShoppingBag, UserCircle } from 'lucide-react';
import { Container } from '@/components/ui/container';
import ShopProductList from '@/components/shop/ShopProductList';
import { getShopById, getShopProducts, ShopProduct } from '@/services/shopService';
import { Shop } from '@/models/shop';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

export default function ShopDetail() {
  const { id } = useParams<{ id: string }>();
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchShopData = async () => {
      if (!id) return;
      
      try {
        const shopData = await getShopById(id);
        
        if (shopData) {
          // Fix the typing issue by creating a proper Shop type object
          setShop({
            id: shopData.id,
            name: shopData.name,
            description: shopData.description,
            owner_id: shopData.owner_id,
            category: shopData.category,
            logo_url: shopData.logo_url || '',
            cover_image: shopData.cover_image || '',
            location: shopData.location || '',
            address: shopData.address || '',
            is_verified: shopData.is_verified || false,
            rating: shopData.rating || 0,
            product_count: shopData.product_count || 0,
            latitude: shopData.latitude || 0,
            longitude: shopData.longitude || 0,
            created_at: shopData.created_at || '',
            updated_at: shopData.updated_at || '',
          });
          
          const shopProducts = await getShopProducts(id);
          // Map shop products to ensure sellerId and sellerName are set
          const mappedProducts = shopProducts.map(product => ({
            ...product,
            sellerId: shopData.owner_id,
            sellerName: shopData.name
          }));
          
          setProducts(mappedProducts);
        } else {
          toast({
            title: 'Shop not found',
            description: 'The shop you were looking for does not exist.',
            variant: 'destructive',
          });
        }
      } catch (err) {
        console.error('Error fetching shop details:', err);
        toast({
          title: 'Error',
          description: 'Failed to load shop details. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchShopData();
  }, [id, toast]);
  
  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-haluna-primary rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  if (!shop) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Shop Not Found</h2>
        <p className="mb-8">The shop you're looking for doesn't exist or may have been removed.</p>
        <Link to="/shops">
          <Button>Browse Other Shops</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      {/* Shop Cover Image */}
      <div className="w-full h-56 md:h-72 bg-gray-200 relative">
        {shop.cover_image ? (
          <img 
            src={shop.cover_image} 
            alt={`${shop.name} cover`} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-emerald-500 to-teal-500" />
        )}
      </div>
      
      <Container className="relative -mt-16 z-10">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Shop Header */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-lg bg-white shadow-md border border-gray-100 p-1">
                {shop.logo_url ? (
                  <AspectRatio ratio={1/1}>
                    <img 
                      src={shop.logo_url} 
                      alt={shop.name} 
                      className="w-full h-full object-cover rounded"
                    />
                  </AspectRatio>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
                    <ShoppingBag className="h-10 w-10 text-gray-400" />
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{shop.name}</h1>
                  <div className="flex items-center text-sm text-haluna-text-light mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{shop.location}</span>
                  </div>
                </div>
                
                <div className="flex items-center mt-4 md:mt-0 space-x-2">
                  {shop.is_verified && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                        <circle cx="4" cy="4" r="3" />
                      </svg>
                      Verified
                    </span>
                  )}
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{shop.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              
              <p className="mt-4 text-haluna-text">{shop.description}</p>
              
              <div className="flex flex-wrap gap-4 mt-4">
                {shop.address && (
                  <div className="flex items-center text-sm">
                    <MapIcon className="h-4 w-4 text-haluna-text-light mr-2" />
                    <span>{shop.address}</span>
                  </div>
                )}
                <div className="flex items-center text-sm">
                  <ShoppingBag className="h-4 w-4 text-haluna-text-light mr-2" />
                  <span>{shop.product_count} Products</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs for Products, Reviews, etc. */}
          <div className="mt-8">
            <Tabs defaultValue="products">
              <TabsList>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="products" className="pt-6">
                <ShopProductList 
                  shopId={shop.id}
                  products={products as any} 
                  isLoading={isLoading}
                  emptyMessage="This shop has no products yet."
                />
              </TabsContent>
              
              <TabsContent value="about" className="pt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">About {shop.name}</h3>
                  <p>{shop.description}</p>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Location</h4>
                    <p className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-haluna-text-light" />
                      {shop.address || shop.location}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Category</h4>
                    <p>{shop.category}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="pt-6">
                <div className="text-center py-8">
                  <UserCircle className="h-12 w-12 mx-auto text-gray-300" />
                  <h3 className="text-lg font-medium mt-4">No Reviews Yet</h3>
                  <p className="text-haluna-text-light mt-2">Be the first to review this shop</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Container>
    </div>
  );
}
