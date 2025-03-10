import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getShopById, getShopProducts } from '@/services/shopService';
import { Shop } from '@/models/shop';
import { Product } from '@/models/product';
import ShopProductList from '@/components/shop/ShopProductList';
import { MapPin, Check, Star, Package } from 'lucide-react';

export default function ShopDetail() {
  const { shopId } = useParams<{ shopId: string }>();
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadShopDetails = async () => {
      setIsLoading(true);
      if (shopId) {
        const shopData = await getShopById(shopId);
        if (shopData) {
          setShop(shopData);
          
          // Load shop products
          const shopProducts = await getShopProducts(shopId);
          setProducts(shopProducts);
        }
      }
      setIsLoading(false);
    };

    loadShopDetails();
  }, [shopId]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse">
          <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-12 bg-gray-200 rounded-lg mb-4 w-1/3"></div>
          <div className="h-8 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Shop not found</h2>
          <p>The shop you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
        {/* Shop Header with Cover Image */}
        <div 
          className="h-48 bg-cover bg-center flex items-end" 
          style={{ 
            backgroundImage: shop?.cover_image 
              ? `url(${shop.cover_image})` 
              : 'linear-gradient(135deg, #2A866A, #1e5c4a)'
          }}
        >
          <div className="w-full bg-black bg-opacity-30 p-4 flex items-center text-white">
            <div className="flex-shrink-0 mr-4">
              <div className="w-20 h-20 rounded-lg bg-white p-1 shadow-lg">
                <img 
                  src={shop?.logo_url || '/placeholder.svg'} 
                  alt={shop?.name} 
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold animate-fade-in leading-tight">
                {shop?.name}
              </h1>
              <div className="flex items-center text-sm">
                {shop?.is_verified && (
                  <span className="flex items-center mr-3">
                    <Check className="h-4 w-4 mr-1 text-green-400" />
                    Verified
                  </span>
                )}
                <span className="flex items-center mr-3">
                  <Star className="h-4 w-4 mr-1 text-yellow-400" fill="currentColor" />
                  {shop?.rating?.toFixed(1)}
                </span>
                <span className="flex items-center">
                  <Package className="h-4 w-4 mr-1" />
                  {shop?.product_count} Products
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Shop Info */}
        <div className="p-4">
          <div className="flex items-start mb-4">
            <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-gray-700">{shop?.location}</p>
          </div>
          
          <div className="mb-4">
            <h2 className="text-lg font-medium mb-2">About {shop?.name}</h2>
            <p className="text-gray-700">{shop?.description}</p>
          </div>
          
          <div className="flex flex-wrap">
            <span className="px-3 py-1 bg-haluna-primary-light text-haluna-primary rounded-full text-sm mr-2 mb-2">
              {shop?.category}
            </span>
          </div>
        </div>
      </div>

      {/* Product Listing */}
      <h2 className="text-xl font-serif font-bold mb-6">Products from {shop?.name}</h2>
      
      {products.length > 0 ? (
        <ShopProductList shopId={shopId || ''} products={products} />
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="h-16 w-16 bg-haluna-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="h-8 w-8 text-haluna-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">No products available</h3>
          <p className="text-haluna-text-light mb-6">
            This shop hasn't added any products yet. Please check back later.
          </p>
        </div>
      )}
    </div>
  );
}
