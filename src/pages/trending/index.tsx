
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shop } from '@/types/shop';
import { getAllShops } from '@/services/adminService';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, MapPin, Store } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';

const TrendingPage = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrendingShops = async () => {
      try {
        setLoading(true);
        // Use getAllShops and then sort by rating
        const allShops = await getAllShops();
        const trendingShops = allShops
          .filter(shop => shop.is_verified)
          .sort((a, b) => {
            const ratingA = a.rating !== undefined && a.rating !== null ? a.rating : 0;
            const ratingB = b.rating !== undefined && b.rating !== null ? b.rating : 0;
            return ratingB - ratingA;
          })
          .slice(0, 9);
        setShops(trendingShops);
      } catch (error) {
        console.error('Error fetching trending shops:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingShops();
  }, []);

  const handleShopClick = (shopId: string) => {
    navigate(`/shop/${shopId}`);
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Trending Shops</h1>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="h-40 bg-gray-200">
                  <Skeleton className="h-full w-full" />
                </div>
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : shops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop) => (
              <Card 
                key={shop.id} 
                className="cursor-pointer overflow-hidden hover:shadow-lg transition-shadow"
                onClick={() => handleShopClick(shop.id)}
              >
                <div className="h-40 bg-cover bg-center relative" 
                  style={{ backgroundImage: `url(${shop.cover_image || '/placeholder.svg'})` }}>
                  <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30"></div>
                  <div className="absolute top-4 left-4 p-1 bg-white rounded-full">
                    <img 
                      src={shop.logo_url || '/placeholder.svg'} 
                      alt={shop.name} 
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-1">{shop.name}</h3>
                  <p className="text-sm text-gray-500 mb-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {shop.location}
                  </p>
                  <div className="flex items-center">
                    <span className="flex items-center text-sm mr-3">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      {shop.rating !== null && shop.rating !== undefined ? shop.rating.toFixed(1) : 'New'}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center">
                      <Store className="h-4 w-4 mr-1" />
                      {shop.product_count || 0} products
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <Store className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium mb-2">No trending shops found</h3>
            <p className="text-gray-500">Check back later for trending shops in your area.</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default TrendingPage;
