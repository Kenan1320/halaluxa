
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { getShops } from '@/services/shopService';
import { useToast } from '@/hooks/use-toast';
import ProductGrid from '@/components/home/ProductGrid';
import { Button } from '@/components/ui/button';
import { Shop } from '@/types/database';
import { TrendingUp, ArrowRight } from 'lucide-react';

const TrendingPage: React.FC = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopShops = async () => {
      setLoading(true);
      try {
        // Get trending shops (in a real app, this would be sorted by popularity metrics)
        const trendingShops = await getShops();
        // Sort by rating for demo purposes
        const sortedShops = [...trendingShops].sort((a, b) => 
          (b.rating || 0) - (a.rating || 0)
        );
        setShops(sortedShops);
      } catch (error) {
        console.error('Error fetching trending shops:', error);
        toast({
          title: "Error",
          description: "Failed to load trending shops",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTopShops();
  }, [toast]);

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-2">Trending Online</h1>
        <p className="text-gray-600 mb-6">Discover the most popular online shops right now</p>
        
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-24 w-24 bg-gray-200 rounded-full mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : shops.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {shops.slice(0, 8).map((shop) => (
                <div
                  key={shop.id}
                  className="text-center cursor-pointer"
                  onClick={() => navigate(`/shops/${shop.id}`)}
                >
                  <div className="h-24 w-24 rounded-full mx-auto mb-2 overflow-hidden border border-gray-200 flex items-center justify-center bg-white">
                    {shop.logo_url ? (
                      <img
                        src={shop.logo_url}
                        alt={shop.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-2xl font-bold text-gray-300">
                        {shop.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 className="text-sm font-medium">{shop.name}</h3>
                  <div className="flex items-center justify-center text-xs text-gray-500">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    <span>{shop.rating ? `${shop.rating.toFixed(1)}★` : 'Trending'}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Trending Products</h2>
                <Button
                  variant="link"
                  className="text-green-600 hover:text-green-700 -mr-4"
                  onClick={() => navigate('/search')}
                >
                  See All <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              
              <ProductGrid />
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-50 p-8 rounded-xl max-w-lg mx-auto">
              <TrendingUp className="h-10 w-10 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No trending shops found</h3>
              <p className="text-gray-500 mb-4">
                We couldn't find any trending shops at the moment. Try exploring our categories or check back later.
              </p>
              <Button onClick={() => navigate('/shops')}>
                Browse All Shops
              </Button>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default TrendingPage;
