
import { mockProducts } from '@/models/product';

// Mock shop data
export const mockShops = [
  {
    id: 'seller-1',
    name: 'Baraka Groceries',
    description: 'Premium halal grocery store offering a wide range of organic and ethically-sourced food products.',
    category: 'Food & Groceries',
    location: 'Chicago, IL',
    coverImage: '/lovable-uploads/0c423741-0711-4e97-8c56-ca4fe31dc6ca.png',
    logo: null,
    isVerified: true,
    productCount: 42,
    rating: 4.8
  },
  {
    id: 'seller-2',
    name: 'Modest Elegance',
    description: 'Contemporary modest fashion for the modern Muslim woman. Ethically made clothing that combines style with tradition.',
    category: 'Fashion',
    location: 'New York, NY',
    coverImage: '/lovable-uploads/26c50a86-ec95-4072-8f0c-ac930a65b34d.png',
    logo: null,
    isVerified: true,
    productCount: 124,
    rating: 4.9
  },
  {
    id: 'seller-3',
    name: 'Natural Beauty',
    description: 'Halal-certified beauty products made with natural ingredients. Cruelty-free and ethically sourced.',
    category: 'Beauty & Wellness',
    location: 'Los Angeles, CA',
    coverImage: '/lovable-uploads/9c75ca26-bc1a-4718-84bb-67d7f2337b30.png',
    logo: null,
    isVerified: true,
    productCount: 67,
    rating: 4.7
  },
  {
    id: 'seller-4',
    name: 'Islamic Treasures',
    description: 'Authentic Islamic home decor, art, and gifts. Handcrafted by skilled artisans from around the Muslim world.',
    category: 'Home & Decor',
    location: 'Houston, TX',
    coverImage: '/lovable-uploads/d8db1529-74b3-4d86-b64a-f0c8b0f92c5c.png',
    logo: null,
    isVerified: true,
    productCount: 95,
    rating: 4.9
  },
  {
    id: 'seller-5',
    name: 'BurdaThobes',
    description: 'Premium quality thobes and Islamic menswear. Traditional designs with modern comfort.',
    category: 'Fashion',
    location: 'Dearborn, MI',
    coverImage: null,
    logo: null,
    isVerified: true,
    productCount: 78,
    rating: 4.6
  },
  {
    id: 'seller-6',
    name: 'HalalBrothers',
    description: 'Family-owned halal meat shop specializing in premium cuts and traditional preparations.',
    category: 'Food & Groceries',
    location: 'Philadelphia, PA',
    coverImage: null,
    logo: null,
    isVerified: true,
    productCount: 36,
    rating: 4.5
  }
];

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
  
  // Use mock shops if nothing in localStorage
  // Save mock shops to localStorage
  localStorage.setItem('shops', JSON.stringify(mockShops));
  
  // Calculate product count for each mock shop
  return mockShops.map(shop => {
    const productsForShop = mockProducts.filter(p => p.sellerId === shop.id);
    
    return {
      ...shop,
      productCount: productsForShop.length
    };
  });
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
