
import React, { useEffect, useState } from 'react';
import { ShopProduct } from '@/models/shop';
import SnoonuProductCard from '@/components/shop/SnoonuProductCard';
import { getShopProducts } from '@/services/shopService';

interface ShopProductListProps {
  products?: ShopProduct[];
  shopId?: string;
  shopName?: string; // Optional prop for displaying the shop name
}

const ShopProductList: React.FC<ShopProductListProps> = ({ products: propProducts, shopId, shopName }) => {
  const [products, setProducts] = useState<ShopProduct[]>(propProducts || []);
  const [loading, setLoading] = useState<boolean>(!propProducts && !!shopId);
  const [error, setError] = useState<string | null>(null);

  // Fetch products if shopId is provided but not products
  useEffect(() => {
    if (shopId && !propProducts) {
      const fetchProducts = async () => {
        try {
          setLoading(true);
          const fetchedProducts = await getShopProducts(shopId);
          setProducts(fetchedProducts);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching shop products:', err);
          setError('Failed to load products');
          setLoading(false);
        }
      };

      fetchProducts();
    }
  }, [shopId, propProducts]);

  if (loading) {
    return (
      <div className="w-full py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin h-10 w-10 border-t-2 border-haluna-primary rounded-full mx-auto"></div>
            <p className="mt-2 text-haluna-text-light">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-500">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="w-full py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-haluna-text-light">No products found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-4">
      <div className="container mx-auto px-4">
        {shopName && (
          <h2 className="text-2xl font-semibold mb-4">{shopName}</h2>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <SnoonuProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopProductList;
