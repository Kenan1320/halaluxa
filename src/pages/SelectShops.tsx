import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { fetchAllShops } from '@/services/shopService';
import { useAuth } from '@/context/AuthContext';
import { type Shop } from '@/types/supabase-types';

const SelectShops = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShops, setSelectedShops] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const loadShops = async () => {
      setIsLoading(true);
      try {
        const allShops = await fetchAllShops();
        setShops(allShops);
      } catch (error) {
        console.error('Error fetching shops:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadShops();
  }, []);

  const toggleShopSelection = (shopId: string) => {
    setSelectedShops((prevSelected) =>
      prevSelected.includes(shopId)
        ? prevSelected.filter((id) => id !== shopId)
        : [...prevSelected, shopId]
    );
  };

  const handleSubmit = () => {
    if (user) {
      // Save selectedShops to user preferences or local storage
      localStorage.setItem('selectedShops', JSON.stringify(selectedShops));
      navigate('/profile/user');
    } else {
      navigate('/login');
    }
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-12">Loading shops...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Select Your Favorite Shops</h1>
      <p className="text-gray-600 mb-4">Choose the shops you want to follow to personalize your experience.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shops.map((shop) => (
          <motion.div
            key={shop.id}
            className={`rounded-lg border p-4 cursor-pointer ${
              selectedShops.includes(shop.id) ? 'border-[#2A866A]' : 'border-gray-200'
            }`}
            onClick={() => toggleShopSelection(shop.id)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{shop.name}</h2>
              {selectedShops.includes(shop.id) && (
                <Check className="text-[#2A866A] h-5 w-5" />
              )}
            </div>
            <p className="text-gray-500">{shop.description}</p>
          </motion.div>
        ))}
      </div>

      <button
        className="mt-8 px-6 py-2 bg-[#2A866A] text-white rounded-lg hover:bg-[#237558] transition-colors"
        onClick={handleSubmit}
      >
        Save Preferences
      </button>
    </div>
  );
};

export default SelectShops;
