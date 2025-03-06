
import { mockProducts } from '@/models/product';

// Get all shops from localStorage or use mock shops
export const getShops = async () => {
  const storedShops = localStorage.getItem('shops');
  
  if (storedShops) {
    const shops = JSON.parse(storedShops);
    
    // Calculate product count for each shop
    return shops.map(shop => {
      // Count products from localStorage
      const localProducts = JSON.parse(localStorage.getItem('products') || '[]');
      const mockProductsForShop = mockProducts.filter(p => p.sellerId === shop.id);
      const localProductsForShop = localProducts.filter(p => p.sellerId === shop.id);
      
      return {
        ...shop,
        productCount: mockProductsForShop.length + localProductsForShop.length
      };
    });
  }
  
  // No shops in localStorage, return empty array
  return [];
};

// Get a shop by ID
export const getShopById = async (shopId: string) => {
  const shops = await getShops();
  return shops.find(shop => shop.id === shopId) || null;
};

// Get products for a specific shop
export const getProductsForShop = (shopId: string) => {
  // First try to get from localStorage
  const localProducts = JSON.parse(localStorage.getItem('products') || '[]');
  const localShopProducts = localProducts.filter(p => p.sellerId === shopId);
  
  // Then get from mock products
  const mockShopProducts = mockProducts.filter(p => p.sellerId === shopId);
  
  // Combine both sets
  return [...mockShopProducts, ...localShopProducts];
};

// Update shop details
export const updateShop = async (shopId: string, shopData: any) => {
  const shops = await getShops();
  const updatedShops = shops.map(shop => 
    shop.id === shopId ? { ...shop, ...shopData } : shop
  );
  
  localStorage.setItem('shops', JSON.stringify(updatedShops));
  return updatedShops.find(shop => shop.id === shopId) || null;
};

// Create a new shop
export const createShop = async (shopData: any) => {
  const shops = await getShops();
  const newShop = {
    id: shopData.id || Math.random().toString(36).substr(2, 9),
    name: shopData.name,
    description: shopData.description || '',
    category: shopData.category || 'General',
    location: shopData.location || 'Online',
    coverImage: shopData.coverImage || null,
    logo: shopData.logo || null,
    isVerified: shopData.isVerified || false,
    productCount: 0,
    rating: shopData.rating || 5.0
  };
  
  const updatedShops = [...shops, newShop];
  localStorage.setItem('shops', JSON.stringify(updatedShops));
  return newShop;
};
