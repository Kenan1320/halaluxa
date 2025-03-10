
import { supabase } from '@/integrations/supabase/client';
import type { Product } from '@/models/product';

// Mock data for products by shop
const mockProducts: Record<string, Product[]> = {
  '1': [
    {
      id: 'p1',
      name: 'Organic Halal Chicken',
      description: 'Fresh organic halal chicken, free-range and hormone-free.',
      price: 12.99,
      images: ['/lovable-uploads/d8db1529-74b3-4d86-b64a-f0c8b0f92c5c.png'],
      category: 'Meat',
      isHalalCertified: true,
      inStock: true,
      sellerId: '1',
      sellerName: 'Halal Grocers',
      rating: 4.7,
      reviewCount: 34,
      createdAt: '2023-01-15T12:00:00Z'
    }
  ],
  '2': [], // Empty for testing
  '3': [], // Empty for testing
  '4': [
    {
      id: 'p2',
      name: 'Quran with Tajweed Rules',
      description: 'Beautiful hardcover Quran with color-coded tajweed rules.',
      price: 29.99,
      images: ['/lovable-uploads/23c8a527-4c88-45b8-96c7-2e04ebee04eb.png'],
      category: 'Books',
      isHalalCertified: true,
      inStock: true,
      sellerId: '4',
      sellerName: 'Islamic Bookstore',
      rating: 4.9,
      reviewCount: 87,
      createdAt: '2023-02-10T09:30:00Z'
    }
  ],
  '5': [
    {
      id: 'p3',
      name: 'Islamic Wall Art',
      description: 'Beautiful Islamic calligraphy wall art with elegant frame.',
      price: 49.99,
      images: ['/lovable-uploads/89740c6a-e07a-4ee4-a5a6-6eb842382e3c.png'],
      category: 'Home Decor',
      isHalalCertified: true,
      inStock: true,
      sellerId: '5',
      sellerName: 'Halal Home Goods',
      rating: 4.8,
      reviewCount: 42,
      createdAt: '2023-03-20T14:15:00Z'
    }
  ]
};

/**
 * Gets products for a specific shop
 */
export const getShopProducts = async (shopId: string): Promise<Product[]> => {
  try {
    // In a real app, we'd fetch from Supabase
    // const { data, error } = await supabase
    //   .from('products')
    //   .select('*')
    //   .eq('seller_id', shopId);
    // if (error) throw error;
    
    // For now, return mock data
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockProducts[shopId] || [];
  } catch (error) {
    console.error(`Error fetching products for shop ${shopId}:`, error);
    return [];
  }
};
