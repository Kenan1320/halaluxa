
import { supabase } from '@/integrations/supabase/client';
import type { Shop } from '@/models/shop';

// Mock data for shops
const mockShops = [
  {
    id: '1',
    name: 'Halal Grocers',
    description: 'Premium quality halal groceries and imported goods.',
    logo_url: '/lovable-uploads/0780684a-9c7f-4f32-affc-6f9ea641b814.png',
    cover_image: '/lovable-uploads/26c50a86-ec95-4072-8f0c-ac930a65b34d.png',
    category: 'Groceries',
    rating: 4.8,
    is_verified: true,
    product_count: 126,
    location: 'New York',
    distance: 1.2,
    owner_id: 'owner1'
  },
  {
    id: '2',
    name: 'Modest Fashion Hub',
    description: 'Stylish modest clothing for men and women.',
    logo_url: '/lovable-uploads/d4ab324c-23f0-4fcc-9069-0afbc77d1c3e.png',
    cover_image: '/lovable-uploads/9c75ca26-bc1a-4718-84bb-67d7f2337b30.png',
    category: 'Clothing',
    rating: 4.5,
    is_verified: true,
    product_count: 98,
    location: 'Chicago',
    distance: 3.4,
    owner_id: 'owner2'
  },
  {
    id: '3',
    name: 'Halal Meats Direct',
    description: 'Farm to table certified halal meats and poultry.',
    logo_url: '/lovable-uploads/3c7163e3-7825-410e-b6d1-2e91e6ec2442.png',
    cover_image: '/lovable-uploads/89740c6a-e07a-4ee4-a5a6-6eb842382e3c.png',
    category: 'Meat',
    rating: 4.9,
    is_verified: true,
    product_count: 45,
    location: 'Dallas',
    distance: 5.7,
    owner_id: 'owner3'
  },
  {
    id: '4',
    name: 'Islamic Bookstore',
    description: 'Wide collection of Islamic books, literature and gifts.',
    logo_url: '/lovable-uploads/8d386384-3944-48e3-922c-2edb81fa1631.png',
    cover_image: '/lovable-uploads/b7391005-ab3c-4698-85d5-1192b4fc4df6.png',
    category: 'Books',
    rating: 4.7,
    is_verified: true,
    product_count: 212,
    location: 'Boston',
    distance: 2.8,
    owner_id: 'owner4'
  },
  {
    id: '5',
    name: 'Halal Home Goods',
    description: 'Ethical home products and Islamic home decor.',
    logo_url: '/lovable-uploads/0c423741-0711-4e97-8c56-ca4fe31dc6ca.png',
    cover_image: '/lovable-uploads/30853bea-af12-4b7d-9bf5-14f37b607a62.png',
    category: 'Home',
    rating: 4.4,
    is_verified: false,
    product_count: 87,
    location: 'Los Angeles',
    distance: 6.1,
    owner_id: 'owner5'
  }
];

/**
 * Fetches all available shops
 */
export const fetchAllShops = async (): Promise<Shop[]> => {
  try {
    // In a real app, we'd fetch from Supabase
    // const { data, error } = await supabase.from('shops').select('*');
    // if (error) throw error;
    // return data;
    
    // For now, return mock data with a simulated delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockShops as Shop[];
  } catch (error) {
    console.error('Error fetching shops:', error);
    return [];
  }
};

/**
 * Fetches shops near a geographical location
 */
export const fetchNearbyShops = async (latitude?: number, longitude?: number): Promise<Shop[]> => {
  try {
    // In a real app, we'd use geolocation to find nearby shops
    // Here we're just returning all shops for demo purposes
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockShops as Shop[];
  } catch (error) {
    console.error('Error fetching nearby shops:', error);
    return [];
  }
};

/**
 * Gets a specific shop by ID
 */
export const getShopById = async (id: string): Promise<Shop | null> => {
  try {
    // In a real app, we'd fetch from Supabase
    // const { data, error } = await supabase.from('shops').select('*').eq('id', id).single();
    // if (error) throw error;
    // return data;
    
    // For now, return mock data
    const shop = mockShops.find(shop => shop.id === id);
    return shop as Shop || null;
  } catch (error) {
    console.error(`Error fetching shop with id ${id}:`, error);
    return null;
  }
};

/**
 * Gets the main (favorite) shop for a user
 */
export const getMainShop = async (): Promise<Shop | null> => {
  try {
    // In real app, we'd get from localStorage or user profile
    const mainShopId = localStorage.getItem('mainShopId');
    if (mainShopId) {
      return await getShopById(mainShopId);
    }
    return null;
  } catch (error) {
    console.error('Error getting main shop:', error);
    return null;
  }
};

/**
 * Sets a shop as the main (favorite) shop
 */
export const saveMainShop = async (shopId: string): Promise<boolean> => {
  try {
    localStorage.setItem('mainShopId', shopId);
    return true;
  } catch (error) {
    console.error('Error saving main shop:', error);
    return false;
  }
};

// Export aliases to match import statements used elsewhere in the app
export const getShops = fetchAllShops;
export const getAllShops = fetchAllShops;
export const setMainShop = saveMainShop;
