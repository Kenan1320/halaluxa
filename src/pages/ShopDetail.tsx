
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getShopById } from '@/services/shopService';
import { getShopProducts } from '@/services/shopServiceHelpers';
import { useLocation } from '@/context/LocationContext';
import { ShopHeader } from '@/components/shop/ShopHeader';
import ShopProductList from '@/components/shop/ShopProductList';
import { Shop } from '@/types/database';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

const ShopDetail = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const { userLocation, getCurrentLocation } = useLocation();
  
  useEffect(() => {
    const fetchShopDetails = async () => {
      if (!shopId) return;
      
      try {
        setLoading(true);
        const shopData = await getShopById(shopId);
        setShop(shopData);
      } catch (error) {
        console.error('Error fetching shop details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchShopDetails();
  }, [shopId]);
  
  const handleGetDirections = () => {
    if (!shop) return;
    
    if (!userLocation) {
      getCurrentLocation();
      return;
    }
    
    const destination = `${shop.address || shop.location}`;
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      destination
    )}`;
    
    window.open(mapsUrl, '_blank');
  };
  
  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading shop details...</div>;
  }
  
  if (!shop) {
    return <div className="text-center py-16">Shop not found</div>;
  }
  
  return (
    <div>
      <ShopHeader shop={shop} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/3">
            <h2 className="text-2xl font-bold mb-4">Products</h2>
            {shopId && <ShopProductList shopId={shopId} />}
          </div>
          
          <div className="md:w-1/3">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-3">Shop Information</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                  <p>{shop.category}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                  <p>{shop.location}</p>
                </div>
                
                {shop.address && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                    <p>{shop.address}</p>
                  </div>
                )}
                
                <Button 
                  onClick={handleGetDirections}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <MapPin size={18} />
                  Get Directions
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetail;
