
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { getNearbyShops } from '@/services/shopService';
import { useLocation } from '@/context/LocationContext';
import { useToast } from '@/hooks/use-toast';
import ProductGrid from '@/components/home/ProductGrid';
import { Button } from '@/components/ui/button';
import { Shop } from '@/types/shop';
import { MapPin, ArrowRight } from 'lucide-react';
import { adaptShopArray } from '@/utils/typeAdapters';

const NearbyPage: React.FC = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentLocation, requestLocation } = useLocation();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNearbyShops = async () => {
      setLoading(true);
      try {
        let fetchedShops;
        // Get user's location 
        if (currentLocation && 'coords' in currentLocation) {
          fetchedShops = await getNearbyShops(
            currentLocation.coords.latitude,
            currentLocation.coords.longitude
          );
        } else {
          // Fallback if location not available
          fetchedShops = await getNearbyShops();
        }
        
        // Convert to the correct Shop type
        const adaptedShops = adaptShopArray(fetchedShops, 'types');
        setShops(adaptedShops);
      } catch (error) {
        console.error('Error fetching nearby shops:', error);
        toast({
          title: "Error",
          description: "Failed to load nearby shops",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyShops();
  }, [currentLocation, toast]);

  const handleEnableLocation = async () => {
    await requestLocation();
  };

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-2">Nearby Shops</h1>
        
        {!currentLocation && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-gray-500 mr-2" />
              <p className="text-sm text-gray-600">Enable location services to see shops near you</p>
            </div>
            <Button onClick={handleEnableLocation} size="sm">
              Enable Location
            </Button>
          </div>
        )}
        
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
                  {shop.distance && (
                    <p className="text-xs text-gray-500">{shop.distance.toFixed(1)} km</p>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Recommended for You</h2>
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
              <MapPin className="h-10 w-10 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No shops found nearby</h3>
              <p className="text-gray-500 mb-4">
                We couldn't find any shops in your area. Try exploring other categories or check back later.
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

export default NearbyPage;
