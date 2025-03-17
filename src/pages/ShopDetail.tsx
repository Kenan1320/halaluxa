
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getShopById } from '@/services/shopService';
import { getProductsByShopId } from '@/services/productService';
import { getShopReviews } from '@/services/reviewService';
import { Shop } from '@/types/shop';
import { ShopReview } from '@/models/review';
import { Product } from '@/models/product';
import { ShopDetails } from '@/types/shop';
import { adaptProductType } from '@/utils/typeAdapters';

const ShopDetailPage = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const [shop, setShop] = useState<Shop | null>(null);
  const [shopDetails, setShopDetails] = useState<ShopDetails | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<ShopReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadShopData = async () => {
      if (!shopId) return;

      try {
        // Load shop data
        const shopData = await getShopById(shopId);
        if (shopData) {
          setShop(shopData);
          
          // Fetch additional data in parallel
          const [shopProducts, shopReviews] = await Promise.all([
            getProductsByShopId(shopId),
            getShopReviews(shopId)
          ]);
          
          // Process products to ensure they have image_url
          const processedProducts = shopProducts.map(product => 
            adaptProductType(product)
          );
          
          setProducts(processedProducts);
          // Explicitly cast to ShopReview[] since we know these are shop reviews
          setReviews(shopReviews as ShopReview[]);
          
          // Create shop details object
          setShopDetails({
            ...shopData,
            products: shopProducts.length,
            followers: 0, // This would come from a real API
            reviews: shopReviews.length,
            rating: { 
              average: shopData.rating || 0, 
              count: shopReviews.length 
            },
            deliveryInfo: {
              fee: 2.99,
              minOrder: 15,
              estimatedTime: '30-45 min'
            },
            isGroupOrderEnabled: false
          });
        }
      } catch (error) {
        console.error('Error loading shop data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadShopData();
  }, [shopId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!shop || !shopDetails) {
    return <div>Shop not found</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h1 className="text-2xl font-bold mb-4">{shop.name}</h1>
          <p className="text-gray-600">{shop.description}</p>
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map(product => (
                <div key={product.id} className="border rounded-md p-4">
                  <Link to={`/products/${product.id}`}>
                    <img
                      src={product.image_url || (product.images?.[0] || '')}
                      alt={product.name}
                      className="w-full h-48 object-cover mb-2 rounded-md"
                    />
                    <h3 className="text-lg font-medium">{product.name}</h3>
                    <p className="text-gray-500">${product.price.toFixed(2)}</p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div className="border rounded-md p-4">
            <h2 className="text-lg font-semibold mb-2">Shop Details</h2>
            <p>
              <strong>Location:</strong> {shop.location}
            </p>
            <p>
              <strong>Rating:</strong> {shop.rating}
            </p>
            <p>
              <strong>Products:</strong> {shopDetails.products}
            </p>
            <p>
              <strong>Followers:</strong> {shopDetails.followers}
            </p>
            <p>
              <strong>Reviews:</strong> {shopDetails.reviews}
            </p>
          </div>
          <div className="mt-4 border rounded-md p-4">
            <h2 className="text-lg font-semibold mb-2">Reviews</h2>
            {reviews.length > 0 ? (
              reviews.map(review => (
                <div key={review.id} className="mb-4">
                  <p className="font-medium">{review.user_name}</p>
                  <p className="text-gray-600">{review.comment}</p>
                  <div className="flex items-center mt-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-500">
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p>No reviews yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetailPage;
