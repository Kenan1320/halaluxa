
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getShopProducts } from '@/services/shopServiceHelpers';
import { convertToModelProduct } from '@/services/shopServiceHelpers';
import { Product } from '@/types/database';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ShopProductListProps {
  shopId: string;
}

export const ShopProductList: React.FC<ShopProductListProps> = ({ shopId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const shopProducts = await getShopProducts(shopId);
        // Explicitly cast the products to the Product type
        setProducts(shopProducts as Product[]);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [shopId]);

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  if (products.length === 0) {
    return <div className="text-center py-8">No products found for this shop.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <Link to={`/product/${product.id}`} key={product.id}>
          <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
              <img
                src={product.images[0] || '/placeholder.svg'}
                alt={product.name}
                className="h-48 w-full object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold line-clamp-2">{product.name}</h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                {product.is_halal_certified && (
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    Halal
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default ShopProductList;
