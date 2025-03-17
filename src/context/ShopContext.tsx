
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
  const [mainShop, setMainShopState] = useState<Shop | null>(null);
  const [selectedShops, setSelectedShopsState] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  // Set main shop and persist to localStorage
  const setMainShop = (shop: Shop | null) => {
    setMainShopState(shop);
    if (shop) {
      localStorage.setItem('mainShopId', shop.id);
    } else {
      localStorage.removeItem('mainShopId');
    }
  };

  // Set selected shops and persist to localStorage
  const setSelectedShops = (shops: Shop[]) => {
    setSelectedShopsState(shops);
    const shopIds = shops.map(shop => shop.id);
    localStorage.setItem('selectedShops', JSON.stringify(shopIds));
  };

  useEffect(() => {
    const initializeShops = async () => {
      try {
        // Load main shop from localStorage
        const mainShopId = localStorage.getItem('mainShopId');
        if (mainShopId) {
          try {
            const shop = await getShopById(mainShopId);
            if (shop) {
              setMainShopState(shop);
            }
          } catch (error) {
            console.error('Error loading main shop:', error);
          }
        }

        // Load selected shops from localStorage
        const selectedShopIds = localStorage.getItem('selectedShops');
        if (selectedShopIds) {
          try {
            const shopIds = JSON.parse(selectedShopIds) as string[];
            const shopPromises = shopIds.map(id => getShopById(id));
            const shops = await Promise.all(shopPromises);
            setSelectedShopsState(shops.filter(Boolean) as Shop[]);
          } catch (error) {
            console.error('Error loading selected shops:', error);
          }
        }
      } catch (error) {
        console.error('Error initializing shops:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeShops();
  }, []);

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
