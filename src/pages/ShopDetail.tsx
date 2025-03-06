
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getShopById, getShopProducts } from '@/services/shopService';
import { Product } from '@/models/product';
import { motion } from 'framer-motion';
import ProductCard from '@/components/shop/ProductCard';
import RelatedProducts from '@/components/shop/RelatedProducts';
import { Button } from '@/components/ui/button';

const ShopDetail = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const [shop, setShop] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchShopAndProducts = async () => {
      setIsLoading(true);
      if (shopId) {
        const [shopData, productsData] = await Promise.all([
          getShopById(shopId),
          getShopProducts(shopId)
        ]);
        setShop(shopData);
        setProducts(productsData);
      }
      setIsLoading(false);
    };
    
    fetchShopAndProducts();
  }, [shopId]);
  
  if (isLoading || !shop) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="fixed top-0 left-0 right-0 bg-white z-50 border-b">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link 
            to="/shops"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="w-20 h-20 bg-white rounded-xl shadow-sm overflow-hidden">
            {shop.logo ? (
              <img 
                src={shop.logo} 
                alt={shop.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full bg-haluna-primary-light flex items-center justify-center">
                <span className="text-2xl font-bold text-haluna-primary">
                  {shop.name[0]}
                </span>
              </div>
            )}
          </div>
          
          <div>
            <h1 className="text-2xl font-bold">{shop.name}</h1>
            {shop.location && (
              <p className="text-gray-600">{shop.location}</p>
            )}
          </div>
        </motion.div>

        {shop.description && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600 mb-8"
          >
            {shop.description}
          </motion.p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
            />
          ))}
        </div>

        {products.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold mb-4">More from this shop</h2>
            <RelatedProducts products={products} />
          </section>
        )}
      </main>
    </div>
  );
};

export default ShopDetail;
