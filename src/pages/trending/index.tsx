
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getShops } from '@/services/shopService';
import { Shop } from '@/types/shop';
import { adaptShopType } from '@/utils/typeAdapters';
import ShopCard from '@/components/shop/ShopCard';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Filter, Star, TrendingUp } from 'lucide-react';

export default function TrendingPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadShops = async () => {
      try {
        const allShops = await getShops();
        // Convert shops to the expected type
        const adaptedShops = allShops.map(shop => adaptShopType(shop, 'types'));
        
        // Sort by rating (highest first)
        const sortedShops = [...adaptedShops].sort((a, b) => {
          const ratingA = typeof a.rating === 'object' ? a.rating.average : (a.rating ?? 0);
          const ratingB = typeof b.rating === 'object' ? b.rating.average : (b.rating ?? 0);
          return ratingB - ratingA;
        });
        setShops(sortedShops);
      } catch (error) {
        console.error('Error loading trending shops:', error);
      } finally {
        setLoading(false);
      }
    };

    loadShops();
  }, []);

  return (
    <Container className="py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <TrendingUp className="mr-2 h-6 w-6 text-primary" /> 
            Trending Shops
          </h1>
          <p className="text-muted-foreground mt-1">Discover the most popular shops right now</p>
        </div>
        <Button variant="outline" size="sm" className="flex items-center">
          <Filter className="mr-2 h-4 w-4" /> Filter
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4 h-64 animate-pulse">
              <div className="bg-gray-200 h-32 rounded-md mb-4"></div>
              <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
              <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
            </div>
          ))}
        </div>
      ) : shops.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop, index) => (
            <div key={shop.id || index} onClick={() => navigate(`/shops/${shop.id}`)} className="cursor-pointer">
              <ShopCard
                index={index}
                shop={{
                  name: shop.name,
                  category: shop.category,
                  rating: shop.rating !== null && shop.rating !== undefined ? 
                    (typeof shop.rating === 'object' ? shop.rating.average : shop.rating) 
                    : 0,
                  image: shop.cover_image || '',
                  location: shop.location,
                  isVerified: shop.is_verified
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Star className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-xl font-medium">No trending shops found</h3>
          <p className="text-muted-foreground mt-2">Check back later for new trending shops</p>
        </div>
      )}
    </Container>
  );
}
