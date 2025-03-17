import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, Phone, Globe, ArrowLeft, ShoppingBag, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useToast } from '@/hooks/use-toast';
import { getShopById } from '@/services/shopService';
import { getProductsByShopId } from '@/services/productService';
import { getShopReviews } from '@/services/reviewService';
import { Product } from '@/models/product';
import { Review } from '@/models/review';

const ShopDetail = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const [shop, setShop] = useState<any>(null);
  const [shopProducts, setShopProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [shopRating, setShopRating] = useState({ average: 0, count: 0 });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchShopDetails = async () => {
      setLoading(true);
      try {
        const shopData = await getShopById(shopId || '');
        setShop(shopData);
        
        // Fetch shop products
        const products = await getProductsByShopId(shopId || '');
        setShopProducts(products);
        
        // Fetch reviews
        const reviewsData = await getShopReviews(shopId || '');
        setReviews(reviewsData);
        
        // Calculate average rating
        if (reviewsData.length > 0) {
          const avgRating = reviewsData.reduce((sum, review) => sum + review.rating, 0) / reviewsData.length;
          setShopRating({
            average: avgRating,
            count: reviewsData.length
          });
        } else {
          setShopRating({
            average: 0,
            count: 0
          });
        }
      } catch (error) {
        console.error('Error fetching shop details:', error);
        toast({
          title: 'Error',
          description: 'Failed to load shop details',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (shopId) {
      fetchShopDetails();
    }
  }, [shopId, toast]);

  if (loading) {
    return <div className="container mx-auto p-4">Loading shop details...</div>;
  }

  if (!shop) {
    return <div className="container mx-auto p-4">Shop not found.</div>;
  }

  return (
    <motion.div
      className="container mx-auto max-w-4xl p-4 md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Button variant="ghost" className="mb-4 pl-0" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <Card className="overflow-hidden">
        <div className="relative">
          <img
            src={shop.cover_image}
            alt={shop.name}
            className="w-full h-64 object-cover object-center"
          />
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-gray-900/80 to-transparent p-4">
            <CardTitle className="text-2xl font-semibold text-white drop-shadow-md">{shop.name}</CardTitle>
            <CardDescription className="text-gray-300 drop-shadow-md">{shop.description}</CardDescription>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={shop.logo_url} alt={shop.name} />
              <AvatarFallback>{shop.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="font-medium">{shopRating.average.toFixed(1)}</span>
                <span className="text-gray-500">({shopRating.count} reviews)</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{shop.address}, {shop.location}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{shop.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Globe className="h-4 w-4" />
                <a href={shop.website} target="_blank" rel="noopener noreferrer" className="underline">
                  {shop.website}
                </a>
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Products</h2>
            <Badge className="bg-haluna-primary text-white">{shopProducts.length} Products</Badge>
          </div>
          
          <ScrollArea className="rounded-md border p-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {shopProducts.map(product => (
                <Card key={product.id} className="shadow-sm">
                  <CardHeader>
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-32 object-cover rounded-md mb-3"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">${product.price}</span>
                      <Button size="sm">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
          
          <Separator className="my-4" />
          
          <h2 className="text-xl font-semibold mb-4">Reviews</h2>
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map(review => (
                <Card key={review.id} className="border">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={review.user_avatar} alt={review.user_name} />
                        <AvatarFallback>{review.user_name?.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{review.user_name}</CardTitle>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          {Array.from({ length: review.rating }, (_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-500" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-gray-500">No reviews yet.</div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ShopDetail;
