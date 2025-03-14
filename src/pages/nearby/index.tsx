
import { useState, useEffect } from 'react';
import { useLocation as useLocationHook } from '@/context/LocationContext';
import { getShopsByDistance } from '@/services/shopService';
import { Shop } from '@/types/database';
import { MapPin } from 'lucide-react';
import ProductGrid from '@/components/home/ProductGrid';
import { Skeleton } from '@/components/ui/skeleton';

const NearbyPage = () => {
  const [nearbyShops, setNearbyShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const { location, isLocationEnabled, requestLocation } = useLocationHook();

  useEffect(() => {
    const fetchNearbyShops = async () => {
      try {
        setLoading(true);
        
        // If location is not enabled, try to get it
        if (!isLocationEnabled && !location) {
          requestLocation();
          return;
        }
        
        if (location?.latitude && location?.longitude) {
          const shops = await getShopsByDistance(location.latitude, location.longitude, 50);
          setNearbyShops(shops.slice(0, 8)); // Limit to 8 shops
        }
      } catch (error) {
        console.error('Error fetching nearby shops:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNearbyShops();
  }, [isLocationEnabled, location]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold mb-2">Nearby Shops</h1>
        <p className="text-gray-600">
          Discover Muslim-owned businesses in your area
        </p>
      </div>
      
      {/* Location indicator */}
      {location?.city && (
        <div className="flex items-center mb-6 text-gray-700">
          <MapPin className="h-5 w-5 mr-2 text-blue-600" />
          <span>Showing results near {location.city}, {location.state}</span>
        </div>
      )}
      
      {/* Shop circle grid */}
      <div className="mb-10">
        <h2 className="text-xl font-medium mb-4">Nearby Shops</h2>
        
        {loading ? (
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <Skeleton className="w-16 h-16 rounded-full" />
                <Skeleton className="w-20 h-4 mt-2" />
              </div>
            ))}
          </div>
        ) : nearbyShops.length > 0 ? (
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {nearbyShops.map((shop) => (
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
            <p className="text-gray-500">No nearby shops found</p>
            {!isLocationEnabled && (
              <button 
                onClick={() => requestLocation()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Enable Location
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Products section */}
      <div>
        <h2 className="text-xl font-medium mb-4">Products Near You</h2>
        <ProductGrid category="all" limit={12} />
      </div>
    </div>
  );
};

export default NearbyPage;
