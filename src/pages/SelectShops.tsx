
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Shop } from '@/types/shop';
import { getShops } from '@/services/shopService';
import { normalizeShopArray } from '@/utils/shopHelper';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const STORAGE_KEY = 'halvi-selected-shops';

const SelectShops = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [shops, setShops] = useState<Shop[]>([]);
  const [filteredShops, setFilteredShops] = useState<Shop[]>([]);
  const [selectedShops, setSelectedShops] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved selections or previously saved shops
  useEffect(() => {
    const savedSelections = localStorage.getItem(STORAGE_KEY);
    if (savedSelections) {
      try {
        setSelectedShops(JSON.parse(savedSelections));
      } catch (error) {
        console.error('Failed to parse saved selections:', error);
      }
    }
  }, []);

  useEffect(() => {
    const loadShops = async () => {
      setIsLoading(true);
      try {
        const shopsData = await getShops();
        const normalizedShops = normalizeShopArray(shopsData);
        setShops(normalizedShops);
        setFilteredShops(normalizedShops);
      } catch (error) {
        console.error('Failed to load shops:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadShops();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      const filtered = shops.filter(
        shop => 
          shop.name.toLowerCase().includes(searchTermLower) || 
          shop.category.toLowerCase().includes(searchTermLower) ||
          shop.location.toLowerCase().includes(searchTermLower)
      );
      setFilteredShops(filtered);
    } else {
      setFilteredShops(shops);
    }
  }, [searchTerm, shops]);

  const toggleShopSelection = (shopId: string) => {
    const newSelection = selectedShops.includes(shopId)
      ? selectedShops.filter(id => id !== shopId)
      : [...selectedShops, shopId];
    
    setSelectedShops(newSelection);
    
    // Save to localStorage for non-authenticated users or temporary storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSelection));
  };

  const handleContinue = () => {
    // Save selections (already done on toggle)
    // In a real app, this would also save to a backend for logged-in users
    
    toast.success('Your shop selections have been saved!', {
      description: 'These shops will now appear in your home feed.'
    });
    
    // Navigate to the home page
    navigate('/');
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Select Your Favorite Shops</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Choose the shops you want to follow to see their products in your feed
        </p>
      </div>

      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search shops by name, category, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {filteredShops.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">No shops found matching your search criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredShops.map((shop) => (
                <div
                  key={shop.id}
                  className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 cursor-pointer transition-colors border-2 
                    ${selectedShops.includes(shop.id) 
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                      : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
                  onClick={() => toggleShopSelection(shop.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        {shop.logo_url ? (
                          <img src={shop.logo_url} alt={shop.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-600">
                            <span className="text-xl font-bold text-gray-400 dark:text-gray-300">
                              {shop.name.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      {selectedShops.includes(shop.id) && (
                        <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                          <CheckIcon className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">{shop.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{shop.category}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{shop.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <div className="mt-8 flex justify-between items-center">
        <Button variant="outline" onClick={() => navigate('/')}>Skip</Button>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {selectedShops.length} shops selected
        </div>
        <Button 
          onClick={handleContinue}
          disabled={selectedShops.length === 0}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default SelectShops;
