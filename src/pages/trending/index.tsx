
import { useState, useEffect } from 'react';
import { getTopShops } from '@/services/shopService';
import { Shop } from '@/types/database';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';
import ProductGrid from '@/components/home/ProductGrid';
import { Skeleton } from '@/components/ui/skeleton';

const TrendingPage = () => {
  const [trendingShops, setTrendingShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingShops = async () => {
      try {
        setLoading(true);
        const shops = await getTopShops();
        setTrendingShops(shops.slice(0, 8)); // Limit to 8 shops
      } catch (error) {
        console.error('Error fetching trending shops:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrendingShops();
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold mb-2">Trending Online</h1>
        <p className="text-gray-600">
          Discover the most popular Muslim-owned businesses and products
        </p>
      </div>
      
      {/* Shop circle grid */}
      <div className="mb-10">
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-medium">Trending Shops</h2>
          <Badge className="ml-2 bg-red-500">
            <TrendingUp className="h-3 w-3 mr-1" />
            Hot
          </Badge>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <Skeleton className="w-16 h-16 rounded-full" />
                <Skeleton className="w-20 h-4 mt-2" />
              </div>
            ))}
          </div>
        ) : trendingShops.length > 0 ? (
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {trendingShops.map((shop) => (
              <a 
                key={shop.id} 
                href={`/shop/${shop.id}`}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                  {shop.logo_url ? (
                    <img 
                      src={shop.logo_url} 
                      alt={shop.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-800 font-bold text-xl">
                      {shop.name.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="mt-2 text-sm text-center font-medium">{shop.name}</span>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No trending shops found</p>
          </div>
        )}
      </div>
      
      {/* Products section */}
      <div>
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-medium">Trending Products</h2>
          <Badge className="ml-2 bg-red-500">
            <TrendingUp className="h-3 w-3 mr-1" />
            Popular
          </Badge>
        </div>
        <ProductGrid category="all" limit={12} sortBy="popularity" />
      </div>
    </div>
  );
};

export default TrendingPage;
