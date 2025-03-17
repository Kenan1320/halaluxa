
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Shop } from '@/types/shop';
import { getShopById } from '@/services/shopService';

interface ShopContextType {
  mainShop: Shop | null;
  setMainShop: (shop: Shop | null) => void;
  selectedShops: Shop[];
  setSelectedShops: (shops: Shop[]) => void;
  loading: boolean;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mainShop, setMainShop] = useState<Shop | null>(null);
  const [selectedShops, setSelectedShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeShops = async () => {
      try {
        // Load main shop from localStorage
        const mainShopId = localStorage.getItem('mainShopId');
        if (mainShopId) {
          const shop = await getShopById(mainShopId);
          if (shop) {
            setMainShop(shop);
          }
        }

        // Load selected shops from localStorage
        const selectedShopIds = localStorage.getItem('selectedShops');
        if (selectedShopIds) {
          const shopIds = JSON.parse(selectedShopIds) as string[];
          const shopPromises = shopIds.map(id => getShopById(id));
          const shops = await Promise.all(shopPromises);
          setSelectedShops(shops.filter(Boolean) as Shop[]);
        }
      } catch (error) {
        console.error('Error initializing shops:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeShops();
  }, []);

  // Save main shop to localStorage when it changes
  useEffect(() => {
    if (mainShop) {
      localStorage.setItem('mainShopId', mainShop.id);
    }
  }, [mainShop]);

  // Save selected shops to localStorage when they change
  useEffect(() => {
    if (selectedShops.length > 0) {
      const shopIds = selectedShops.map(shop => shop.id);
      localStorage.setItem('selectedShops', JSON.stringify(shopIds));
    }
  }, [selectedShops]);

  const value = {
    mainShop,
    setMainShop,
    selectedShops,
    setSelectedShops,
    loading
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
