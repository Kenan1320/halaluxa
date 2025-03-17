
import { Shop } from '@/types/shop';

export const normalizeShop = (shop: any): Shop => {
  return {
    id: shop.id || '',
    name: shop.name || '',
    description: shop.description || '',
    location: shop.location || '',
    category: shop.category || '',
    logo_url: shop.logo_url || null,
    cover_image: shop.cover_image || null,
    rating: shop.rating || 0,
    owner_id: shop.owner_id || null,
    is_verified: !!shop.is_verified,
    latitude: shop.latitude || null,
    longitude: shop.longitude || null,
    product_count: shop.product_count || 0,
    address: shop.address || '',
    // Handle any other properties needed
  };
};

export const normalizeShopArray = (shops: any[]): Shop[] => {
  if (!Array.isArray(shops)) return [];
  return shops.map(shop => normalizeShop(shop));
};

export const getSelectedShops = (): string[] => {
  try {
    const savedSelections = localStorage.getItem('halvi-selected-shops');
    if (savedSelections) {
      return JSON.parse(savedSelections);
    }
  } catch (error) {
    console.error('Error getting selected shops:', error);
  }
  return [];
};

export const getMainShopId = (): string | null => {
  return localStorage.getItem('mainShopId');
};

export const setMainShopId = (shopId: string): void => {
  localStorage.setItem('mainShopId', shopId);
};
