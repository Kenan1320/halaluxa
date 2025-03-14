
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLocation } from '@/context/LocationContext';
import { getShopProducts } from '@/services/shopServiceHelpers';
import { getShopById } from '@/services/shopService';
import { Shop as ModelShop } from '@/models/shop';
import { Product, adaptDatabaseProductToProduct } from '@/models/product';
import { ProductCard } from '@/components/cards/ProductCard';
import { ShopHeader } from '@/components/shop/ShopHeader';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Phone, Mail, MapPin, Navigation, Star, Calendar, Clock, Info } from 'lucide-react';
import { ShopDetails, ShopCategory } from '@/types/shop';

const ShopDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLocationEnabled, enableLocation } = useLocation();
  const { toast } = useToast();
  
  const [shop, setShop] = useState<ModelShop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchShopDetails = async () => {
      if (!id) {
        setError('Shop ID is missing');
        setLoading(false);
        return;
      }
      
      try {
        const shopData = await getShopById(id);
        
        if (!shopData) {
          setError('Shop not found');
          setLoading(false);
          return;
        }
        
        setShop(shopData);
        
        // Fetch products for this shop
        const shopProducts = await getShopProducts(id);
        setProducts(shopProducts);
      } catch (err) {
        console.error('Error fetching shop details:', err);
        setError('Failed to load shop details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchShopDetails();
  }, [id]);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-40 bg-gray-200 rounded-xl mb-6"></div>
          <div className="flex flex-col gap-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !shop) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Info className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="text-gray-500 mb-6">{error || 'Failed to load shop details'}</p>
        <Button onClick={() => navigate('/shops')}>
          Browse Other Shops
        </Button>
      </div>
    );
  }
  
  const shopCategories: ShopCategory[] = [];
  const categoryMap = new Map<string, Product[]>();
  
  products.forEach(product => {
    const category = product.category;
    if (!categoryMap.has(category)) {
      categoryMap.set(category, []);
    }
    categoryMap.get(category)?.push(product);
  });
  
  categoryMap.forEach((products, name) => {
    shopCategories.push({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      products
    });
  });
  
  if (shopCategories.length === 0) {
    const defaultCategories = ['Popular Items', 'Featured', 'New Arrivals'];
    defaultCategories.forEach((name, index) => {
      shopCategories.push({
        id: `default-${index}`,
        name,
        products: []
      });
    });
  }
  
  // Convert shop rating to the expected format
  const ratingValue = typeof shop.rating === 'object' ? shop.rating.average : shop.rating || 0;
  
  const shopDetails: ShopDetails = {
    id: shop?.id || '',
    name: shop?.name || '',
    description: shop?.description || '',
    location: shop?.location || '',
    categories: shopCategories,
    cover_image: shop?.coverImage || shop?.cover_image,
    logo: shop?.logo || shop?.logo_url,
    deliveryInfo: {
      isDeliveryAvailable: !!shop?.deliveryAvailable || !!shop?.delivery_available,
      isPickupAvailable: !!shop?.pickupAvailable || !!shop?.pickup_available,
      deliveryFee: 2.99,
      estimatedTime: '30-45 min',
      minOrder: 10
    },
    workingHours: {
      open: '9:00 AM',
      close: '9:00 PM'
    },
    isGroupOrderEnabled: true,
    rating: {
      average: ratingValue,
      count: 25
    },
    product_count: shop?.productCount || shop?.product_count || 0,
    is_verified: shop?.isVerified || shop?.is_verified || false,
    category: shop?.category || '',
    owner_id: shop?.ownerId || shop?.owner_id || '',
    latitude: shop?.latitude,
    longitude: shop?.longitude,
    distance: shop?.distance
  };
  
  // Handler for directions button
  const handleGetDirections = () => {
    if (!isLocationEnabled) {
      enableLocation().then((success: boolean) => {
        if (success && shop.latitude && shop.longitude) {
          window.open(`https://maps.google.com/?q=${shop.latitude},${shop.longitude}`, '_blank');
        }
      });
    } else if (shop.latitude && shop.longitude) {
      window.open(`https://maps.google.com/?q=${shop.latitude},${shop.longitude}`, '_blank');
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <ShopHeader shop={shopDetails} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Products</h2>
          
          {products.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">No products available</h3>
              <p className="text-gray-500">This shop hasn't added any products yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Shop Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-haluna-primary mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-sm">Location</h4>
                  <p className="text-gray-600">{shop.location}</p>
                  
                  {shop.latitude && shop.longitude && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 text-xs"
                      onClick={handleGetDirections}
                    >
                      <Navigation className="h-3 w-3 mr-1" />
                      Get Directions
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="flex items-start">
                <Star className="h-5 w-5 text-haluna-primary mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-sm">Rating</h4>
                  <p className="text-gray-600">{ratingValue.toFixed(1)} out of 5</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-haluna-primary mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-sm">Category</h4>
                  <p className="text-gray-600">{shop.category}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-haluna-primary mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-sm">Availability</h4>
                  <p className="text-gray-600">Shop is currently open</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-haluna-primary mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-sm">Phone</h4>
                  <p className="text-gray-600">(123) 456-7890</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-haluna-primary mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-sm">Email</h4>
                  <p className="text-gray-600">contact@{shop.name.toLowerCase().replace(/\s+/g, '')}.com</p>
                </div>
              </div>
              
              <Button className="w-full mt-2">
                Contact Shop
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetail;
