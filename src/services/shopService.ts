import { supabase } from '@/integrations/supabase/client';
import { getRandomId } from '@/lib/utils';
import { Product as ModelProduct } from '@/models/product';

export interface Shop {
  id: string;
  name: string;
  description: string;
  logo?: string;
  coverImage?: string;
  category: string;
  location: string;
  rating: number;
  distance?: number;
  productCount: number;
  isVerified: boolean;
  ownerId: string;
  latitude?: number;
  longitude?: number;
}

// ShopProduct interface aligned with the model Product
export interface ShopProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  category: string;
  sellerId: string;
  sellerName?: string;
  rating?: number;
  stock: number;
  isHalalCertified?: boolean;
  createdAt?: string;
}

// Adapter function to convert ShopProduct to ModelProduct
export function convertToModelProduct(shopProduct: ShopProduct): ModelProduct {
  return {
    ...shopProduct,
    isHalalCertified: shopProduct.isHalalCertified || true,
    createdAt: shopProduct.createdAt || new Date().toISOString(),
    details: {}
  };
}

export const getAllShops = async (): Promise<Shop[]> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return Array(10).fill(null).map((_, i) => createMockShop(i));
  } catch (error) {
    console.error('Error fetching shops:', error);
    return [];
  }
};

export const getShops = getAllShops;

export const getShopById = async (id: string): Promise<Shop | null> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!id || typeof id !== 'string') return null;
    
    const index = parseInt(id.replace('shop-', ''));
    if (isNaN(index)) return null;
    
    return createMockShop(index);
  } catch (error) {
    console.error('Error fetching shop:', error);
    return null;
  }
};

export const getNearbyShops = async (latitude?: number, longitude?: number): Promise<Shop[]> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return Array(5).fill(null).map((_, i) => {
      const shop = createMockShop(i);
      shop.distance = Math.round((Math.random() * 10 + 0.5) * 10) / 10;
      return shop;
    });
  } catch (error) {
    console.error('Error fetching nearby shops:', error);
    return [];
  }
};

export const getShopProducts = async (shopId: string): Promise<ShopProduct[]> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const index = parseInt(shopId.replace('shop-', ''));
    if (isNaN(index)) return [];
    
    const count = Math.floor(Math.random() * 6) + 3;
    
    return Array(count).fill(null).map((_, i) => {
      const product = createMockProduct(shopId, i);
      product.isHalalCertified = true;
      product.createdAt = new Date().toISOString();
      return product;
    });
  } catch (error) {
    console.error('Error fetching shop products:', error);
    return [];
  }
};

export const setMainShop = (shopId: string): void => {
  localStorage.setItem('mainShopId', shopId);
};

export const getMainShop = async (): Promise<Shop | null> => {
  const mainShopId = localStorage.getItem('mainShopId');
  if (!mainShopId) return null;
  
  return getShopById(mainShopId);
};

function createMockShop(index: number): Shop {
  const categories = ["Grocery", "Clothing", "Restaurant", "Books", "Beauty"];
  const locations = ["Dallas, TX", "Houston, TX", "Austin, TX", "San Antonio, TX", "Plano, TX"];
  const shopNames = ["Al-Barakah", "Halal Delights", "Modesty", "Al-Noor", "Salam Market", "Makkah Imports", "Crescent Foods", "Hamza's", "Medina Market", "Falafel House"];
  
  return {
    id: `shop-${index}`,
    name: shopNames[index % shopNames.length] + (index >= shopNames.length ? ` ${Math.floor(index / shopNames.length) + 1}` : ''),
    description: "A great Muslim owned business offering quality products and excellent service to the community.",
    logo: index % 3 === 0 ? `/lovable-uploads/${['0780684a-9c7f-4f32-affc-6f9ea641b814', '9c75ca26-bc1a-4718-84bb-67d7f2337b30', 'd4ab324c-23f0-4fcc-9069-0afbc77d1c3e'][index % 3]}.png` : undefined,
    coverImage: index % 2 === 0 ? `/lovable-uploads/${['0c423741-0711-4e97-8c56-ca4fe31dc6ca', '26c50a86-ec95-4072-8f0c-ac930a65b34d'][index % 2]}.png` : undefined,
    category: categories[index % categories.length],
    location: locations[index % locations.length],
    rating: parseFloat((3 + Math.random() * 2).toFixed(1)),
    productCount: 5 + Math.floor(Math.random() * 20),
    isVerified: index % 3 === 0,
    ownerId: `owner-${index}`,
    latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
    longitude: -74.0060 + (Math.random() - 0.5) * 0.1
  };
}

function createMockProduct(shopId: string, index: number): ShopProduct {
  const categories = ["Food", "Clothing", "Books", "Accessories", "Beauty"];
  const productNames = ["Organic Dates", "Modest Dress", "Prayer Rug", "Halal Meat", "Islamic Book", "Miswak", "Honey", "Olive Oil", "Attar Perfume", "Hijab"];
  const shopIndex = parseInt(shopId.replace('shop-', ''));
  
  return {
    id: `product-${shopId}-${index}`,
    name: productNames[index % productNames.length] + (index >= productNames.length ? ` ${Math.floor(index / productNames.length) + 1}` : ''),
    price: 5 + Math.floor(Math.random() * 50),
    description: "High-quality product from a trusted Muslim business.",
    images: [
      `/lovable-uploads/${['8d386384-3944-48e3-922c-2edb81fa1631', 'd8db1529-74b3-4d86-b64a-f0c8b0f92c5c'][index % 2]}.png`
    ],
    category: categories[index % categories.length],
    sellerId: shopId,
    sellerName: createMockShop(shopIndex).name,
    rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
    stock: 5 + Math.floor(Math.random() * 30),
    isHalalCertified: true,
    createdAt: new Date().toISOString()
  };
}
