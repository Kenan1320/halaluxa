
import { mockProducts } from '@/models/product';

// Define mock shops data to be used as fallback
export const mockShops = [
  {
    id: 'shop-1',
    name: 'Halal Meats & Groceries',
    description: 'Your trusted source for premium halal meats and international groceries.',
    category: 'Grocery',
    location: 'New York',
    isVerified: true,
    productCount: 0,
    rating: 4.8,
    coverImage: '/public/lovable-uploads/0780684a-9c7f-4f32-affc-6f9ea641b814.png',
    logo: '/public/lovable-uploads/8d386384-3944-48e3-922c-2edb81fa1631.png'
  },
  {
    id: 'shop-2',
    name: 'Sabrina\'s Bakery',
    description: 'Authentic Middle Eastern pastries and bread made fresh daily.',
    category: 'Bakery',
    location: 'Chicago',
    isVerified: true,
    productCount: 0,
    rating: 4.9,
    coverImage: '/public/lovable-uploads/d4ab324c-23f0-4fcc-9069-0afbc77d1c3e.png',
    logo: '/public/lovable-uploads/9c75ca26-bc1a-4718-84bb-67d7f2337b30.png'
  }
];

// Get all shops from localStorage with improved caching
let cachedShops = null;
let lastFetchTime = 0;
const CACHE_DURATION = 1000; // 1 second cache duration

// Get all shops from localStorage or use mock shops
export const getShops = async () => {
  const currentTime = Date.now();
  
  // Use cache if it's recent enough
  if (cachedShops && currentTime - lastFetchTime < CACHE_DURATION) {
    return cachedShops;
  }
  
  const storedShops = localStorage.getItem('shops');
  
  if (storedShops) {
    try {
      const shops = JSON.parse(storedShops);
      
      // Calculate product count for each shop
      const updatedShops = shops.map(shop => {
        // Count products from localStorage
        const localProducts = JSON.parse(localStorage.getItem('products') || '[]');
        const mockProductsForShop = mockProducts.filter(p => p.sellerId === shop.id);
        const localProductsForShop = localProducts.filter(p => p.sellerId === shop.id);
        
        return {
          ...shop,
          productCount: mockProductsForShop.length + localProductsForShop.length
        };
      });
      
      // Update cache
      cachedShops = updatedShops;
      lastFetchTime = currentTime;
      
      return updatedShops;
    } catch (error) {
      console.error('Failed to parse shops data:', error);
      return mockShops;
    }
  }
  
  // No shops in localStorage, return mock shops
  cachedShops = mockShops;
  lastFetchTime = currentTime;
  return mockShops;
};

// Invalidate the shop cache to force fresh data
export const invalidateShopCache = () => {
  cachedShops = null;
  lastFetchTime = 0;
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
  
  // Invalidate cache to ensure fresh data
  invalidateShopCache();
  
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
  
  // Invalidate cache to ensure fresh data
  invalidateShopCache();
  
  return newShop;
};
