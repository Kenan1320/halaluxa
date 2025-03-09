
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import Hero from '@/components/home/Hero';
import SearchBar from '@/components/home/SearchBar';
import ProductGrid from '@/components/home/ProductGrid';
import CategoryScroll from '@/components/home/CategoryScroll';
import LocationBar from '@/components/home/LocationBar';
import Features from '@/components/home/Features';
import NearbyShops from '@/components/home/NearbyShops';
import { getShops, getAllShops, Shop } from '@/services/shopService';
import { getFeaturedProducts } from '@/services/productService';
import { useToast } from '@/hooks/use-toast';

export default function Index() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoadingShops, setIsLoadingShops] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const allShops = await getAllShops();
        setShops(allShops);
      } catch (err) {
        console.error('Error fetching shops:', err);
        toast({
          title: 'Error',
          description: 'Failed to load shops. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingShops(false);
      }
    };

    const fetchProducts = async () => {
      try {
        const featuredProducts = await getFeaturedProducts();
        setProducts(featuredProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        toast({
          title: 'Error',
          description: 'Failed to load products. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchShops();
    fetchProducts();
  }, [toast]);

  const popularShops = shops
    .filter(shop => shop.product_count > 0 && shop.is_verified)
    .sort((a, b) => b.product_count - a.product_count)
    .slice(0, 4);

  // Subscribe to shop updates (this is a replacement for the real-time subscription)
  useEffect(() => {
    const setupSubscription = async () => {
      try {
        const unsubscribe = await getAllShops().then(updatedShops => {
          setShops(updatedShops);
          return () => {}; // Return a no-op cleanup function
        });
        
        return unsubscribe;
      } catch (error) {
        console.error('Error setting up shop subscription:', error);
        return () => {};
      }
    };
    
    const unsubscribeFunction = setupSubscription();
    
    return () => {
      unsubscribeFunction.then(unsub => {
        if (typeof unsub === 'function') {
          unsub();
        }
      });
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Hero />
      <LocationBar />
      
      <section className="py-12 bg-white">
        <Container>
          <SearchBar />
          <CategoryScroll />
        </Container>
      </section>
      
      <section className="py-12 bg-gradient-to-r from-emerald-50 to-teal-50">
        <Container>
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Featured Products</h2>
            <p className="text-haluna-text-light">Discover our collection of high-quality halal products</p>
          </div>
          
          <ProductGrid 
            products={products} 
            isLoading={isLoadingProducts} 
            emptyMessage="No featured products available at the moment."
          />
          
          <div className="mt-8 text-center">
            <Link
              to="/browse"
              className="inline-flex items-center justify-center rounded-md bg-haluna-primary px-6 py-2.5 text-center text-white hover:bg-haluna-primary-dark transition-all"
            >
              Browse All Products
            </Link>
          </div>
        </Container>
      </section>
      
      <Features />
      
      <section className="py-12 bg-white">
        <Container>
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Popular Shops</h2>
            <p className="text-haluna-text-light">Shop from our trusted marketplace sellers</p>
          </div>
          
          <NearbyShops />
          
          <div className="mt-8 text-center">
            <Link
              to="/shops"
              className="inline-flex items-center justify-center rounded-md border border-haluna-primary px-6 py-2.5 text-center text-haluna-primary hover:bg-haluna-primary hover:text-white transition-all"
            >
              View All Shops
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
