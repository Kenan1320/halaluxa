import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllShops, getNearbyShops } from '@/services/shopService';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from '@/context/LocationContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, MapPin, Star } from 'lucide-react';
import { Shop } from '@/types/database';

const SelectShops = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShops, setSelectedShops] = useState<string[]>([]);
  const [mainShop, setMainShop] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn, user } = useAuth();
  const { userLocation } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        let shopData: Shop[] = [];
        
        // If we have user location, get nearby shops
        if (userLocation?.latitude && userLocation?.longitude) {
          shopData = await getNearbyShops(userLocation.latitude, userLocation.longitude);
        } else {
          // Otherwise, just get all shops
          shopData = await getAllShops();
        }
        
        setShops(shopData);
      } catch (error) {
        console.error('Error fetching shops:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [userLocation]);

  const toggleShopSelection = (shopId: string) => {
    setSelectedShops(prev => {
      if (prev.includes(shopId)) {
        // If this is the main shop and we're removing it, reset main shop
        if (mainShop === shopId) {
          setMainShop(null);
        }
        return prev.filter(id => id !== shopId);
      } else {
        // If this is the first shop being selected, make it the main shop
        if (prev.length === 0) {
          setMainShop(shopId);
        }
        return [...prev, shopId];
      }
    });
  };

  const setAsMainShop = (shopId: string) => {
    // Make sure the shop is selected
    if (!selectedShops.includes(shopId)) {
      setSelectedShops(prev => [...prev, shopId]);
    }
    setMainShop(shopId);
  };

  const savePreferences = () => {
    // Save preferences logic here
    // For now, just storing in localStorage
    if (mainShop) {
      localStorage.setItem('mainShop', mainShop);
    }
    localStorage.setItem('selectedShops', JSON.stringify(selectedShops));
    
    // Navigate back to home
    navigate('/');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div>Loading shops...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Select Your Favorite Shops</h1>
      
      <p className="mb-6 text-gray-600">
        Choose the shops you want to see products from. You can select multiple shops and set one as your main shop.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {shops.map((shop) => (
          <Card 
            key={shop.id}
            className={`cursor-pointer ${
              selectedShops.includes(shop.id) ? 'border-2 border-green-500' : ''
            } ${mainShop === shop.id ? 'border-4 border-green-600' : ''}`}
          >
            <CardContent className="p-4 flex flex-col h-full">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  {shop.logo_url ? (
                    <img src={shop.logo_url} alt={shop.name} className="w-full h-full object-cover" />
                  ) : (
                    <ShoppingBag className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{shop.name}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin size={14} className="mr-1" />
                    <span>{shop.location}</span>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 flex-grow">{shop.description}</p>
              
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center">
                  <Star size={16} className="text-yellow-500 mr-1" />
                  <span className="text-sm">{shop.rating.toFixed(1)}</span>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant={selectedShops.includes(shop.id) ? "default" : "outline"} 
                    onClick={() => toggleShopSelection(shop.id)}
                  >
                    {selectedShops.includes(shop.id) ? 'Selected' : 'Select'}
                  </Button>
                  
                  {selectedShops.includes(shop.id) && (
                    <Button 
                      variant={mainShop === shop.id ? "default" : "outline"}
                      onClick={() => setAsMainShop(shop.id)}
                    >
                      {mainShop === shop.id ? 'Main Shop' : 'Set as Main'}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-end">
        <Button 
          disabled={selectedShops.length === 0} 
          onClick={savePreferences}
          size="lg"
        >
          Save Preferences
        </Button>
      </div>
    </div>
  );
};

export default SelectShops;
