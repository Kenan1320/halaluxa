import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from '@/context/LocationContext';
import { Shop } from '@/models/shop';
import { getMainShop, setMainShop as setMainShopService, getShops } from '@/services/shopService';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const SelectShops = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShops, setSelectedShops] = useState<Shop[]>([]);
  const [mainShop, setMainShop] = useState<Shop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { location, isLocationEnabled } = useLocation();

  useEffect(() => {
    const loadShops = async () => {
      setIsLoading(true);
      try {
        const allShops = await getShops();
        setShops(allShops);
        
        // Load selected shops from local storage
        const storedShops = localStorage.getItem('selectedShops');
        if (storedShops) {
          setSelectedShops(JSON.parse(storedShops));
        }
        
        // Load main shop from local storage
        const storedMainShop = await getMainShop();
        setMainShop(storedMainShop);
      } catch (error) {
        console.error('Error loading shops:', error);
        toast({
          title: 'Error',
          description: 'Failed to load shops. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadShops();
  }, [toast]);

  useEffect(() => {
    // Save selected shops to local storage
    localStorage.setItem('selectedShops', JSON.stringify(selectedShops));
  }, [selectedShops]);

  const toggleShopSelection = (shop: Shop) => {
    const isSelected = selectedShops.some(s => s.id === shop.id);

    if (isSelected) {
      // Deselect shop
      setSelectedShops(prevShops => prevShops.filter(s => s.id !== shop.id));
      
      // If deselected shop was the main shop, clear main shop
      if (mainShop?.id === shop.id) {
        setMainShop(null);
        setMainShopService(null);
      }
    } else {
      // Select shop
      setSelectedShops(prevShops => [...prevShops, shop]);
    }
  };
  
  const removeShop = (shop: Shop) => {
    setSelectedShops(prevShops => prevShops.filter(s => s.id !== shop.id));
    
    if (mainShop?.id === shop.id) {
      setMainShop(null);
      setMainShopService(null);
    }
  };

  const setMainShopAndSave = (shop: Shop) => {
    setMainShop(shop);
    setMainShopService(shop);
  };

  const renderShopCard = (shop: Shop) => {
    const isSelected = selectedShops.some(s => s.id === shop.id);
    const isMain = mainShop?.id === shop.id;
    
    return (
      <div 
        key={shop.id}
        className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
          isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
        } ${isMain ? 'ring-2 ring-orange-400 ring-offset-2' : ''}`}
        onClick={() => toggleShopSelection(shop)}
      >
        {isSelected && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white border border-gray-200 overflow-hidden flex items-center justify-center">
            {shop.logo_url ? (
              <img 
                src={shop.logo_url} 
                alt={shop.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <span className="text-lg font-medium text-gray-500">
                  {shop.name.substring(0, 2).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900">{shop.name}</h3>
            <p className="text-sm text-gray-500 truncate max-w-[200px]">{shop.description}</p>
          </div>
        </div>
        
        {isSelected && (
          <div className="mt-3 flex justify-between">
            <button
              type="button"
              className={`text-xs ${isMain ? 'text-orange-500 font-bold' : 'text-blue-600'}`}
              onClick={(e) => {
                e.stopPropagation();
                setMainShopAndSave(shop);
              }}
            >
              {isMain ? 'Main Shop ★' : 'Set as Main'}
            </button>
            
            <button
              type="button"
              className="text-xs text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                removeShop(shop);
              }}
            >
              Remove
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderMainShopSelector = (shop: Shop) => (
    <div 
      key={shop.id}
      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer border ${
        mainShop?.id === shop.id ? 'border-orange-400 bg-orange-50' : 'border-gray-200'
      }`}
      onClick={() => setMainShopAndSave(shop)}
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden">
        {shop.logo_url ? (
          <img 
            src={shop.logo_url} 
            alt={shop.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-500">
              {shop.name.substring(0, 2).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{shop.name}</p>
        <p className="text-xs text-gray-500 truncate">{shop.location}</p>
      </div>
      {mainShop?.id === shop.id && (
        <div className="ml-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-serif font-bold text-center mb-8">Select Your Shops</h1>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="justify-center">
            <TabsTrigger value="all" onClick={() => setActiveTab('all')}>All Shops</TabsTrigger>
            <TabsTrigger value="selected" onClick={() => setActiveTab('selected')}>Selected Shops</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <div className="text-center">Loading shops...</div>
              ) : (
                shops.map(shop => renderShopCard(shop))
              )}
            </div>
          </TabsContent>
          <TabsContent value="selected" className="mt-6">
            {selectedShops.length > 0 ? (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-3">Selected Shops</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedShops.map(shop => renderShopCard(shop))}
                </div>
                
                {mainShop ? (
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-900">Main Shop</h3>
                    <p className="text-gray-500">Your main shop is the one you want to feature on your profile.</p>
                    <div className="mt-4">{renderMainShopSelector(mainShop)}</div>
                  </div>
                ) : (
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-900">Select a Main Shop</h3>
                    <p className="text-gray-500">Choose one shop to be your main shop.</p>
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {selectedShops.map(shop => renderMainShopSelector(shop))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No shops selected</h3>
                <p className="text-gray-500 mb-6">Select shops to see their products and get updates</p>
                <button
                  type="button"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  onClick={() => setActiveTab('all')}
                >
                  Browse All Shops
                </button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SelectShops;
