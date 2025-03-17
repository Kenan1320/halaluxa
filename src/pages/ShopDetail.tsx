
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { getShopById } from '@/services/shopService';
import { ShopHeader } from '@/components/shop/ShopHeader';
import ShopProductList from '@/components/shop/ShopProductList';
import ReviewList from '@/components/shop/ReviewList';
import { Shop, ShopDetails } from '@/models/shop';
import { Product } from '@/models/product';
import { getProducts } from '@/services/productService';
import { getReviews } from '@/services/reviewService';
import { normalizeShop } from '@/utils/shopHelper';

const ShopDetail = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const { mode } = useTheme();
  const [shop, setShop] = useState<ShopDetails | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadShopDetails = async () => {
      if (!shopId) {
        setError('Shop ID is missing.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fetch shop details
        const shopData = await getShopById(shopId);
        if (!shopData) {
          setError('Shop not found.');
          setIsLoading(false);
          return;
        }

        // Convert normal Shop to ShopDetails
        const normalizedShop = normalizeShop(shopData);
        const shopDetails: ShopDetails = {
          ...normalizedShop,
          products: [],
          followers: 0,
          reviews: [],
          deliveryInfo: {},
          isGroupOrderEnabled: false,
          rating: normalizedShop.rating || 0, // Ensure rating is always set
          product_count: normalizedShop.product_count || 0 // Ensure product_count is set
        };
        
        setShop(shopDetails);

        // Fetch products for the shop
        const productsData = await getProducts({ shop_id: shopId });
        setProducts(productsData.data);

        // Fetch reviews for the shop - no need to pass an argument if it's not required
        const reviewsData = await getReviews();
        setReviews(reviewsData);
      } catch (err: any) {
        setError(err.message || 'Failed to load shop details.');
      } finally {
        setIsLoading(false);
      }
    };

    loadShopDetails();
  }, [shopId]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8">
          <p>Loading shop details...</p>
        </div>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8">
          <p>Error: {error || 'Shop not found.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${mode === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <ShopHeader shop={shop} />

      <div className="container mx-auto p-4">
        <ShopProductList products={products} shopId={shopId || ''} />

        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
          <ReviewList reviews={reviews} />
        </section>
      </div>
    </div>
  );
};

export default ShopDetail;
