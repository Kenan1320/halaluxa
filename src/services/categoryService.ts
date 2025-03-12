
import { supabase } from '@/integrations/supabase/client';

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  created_at: string;
}

// Mock categories data since 'categories' table doesn't appear to exist
const mockCategories: Category[] = [
  { id: '1', name: 'Groceries', description: 'Fresh food and groceries', icon: 'grocery', created_at: new Date().toISOString() },
  { id: '2', name: 'Restaurants', description: 'Restaurants and food delivery', icon: 'restaurant', created_at: new Date().toISOString() },
  { id: '3', name: 'Halal Meat', description: 'Certified halal meat', icon: 'meat', created_at: new Date().toISOString() },
  { id: '4', name: 'Coffee Shops', description: 'Coffee and tea shops', icon: 'coffee', created_at: new Date().toISOString() },
  { id: '5', name: 'Furniture', description: 'Home furniture and decor', icon: 'furniture', created_at: new Date().toISOString() },
  { id: '6', name: 'Fashion', description: 'Clothing and accessories', icon: 'fashion', created_at: new Date().toISOString() },
  { id: '7', name: 'Electronics', description: 'Gadgets and electronics', icon: 'electronics', created_at: new Date().toISOString() },
  { id: '8', name: 'Books', description: 'Books and stationery', icon: 'books', created_at: new Date().toISOString() },
  { id: '9', name: 'Toys', description: 'Toys and games', icon: 'toys', created_at: new Date().toISOString() },
  { id: '10', name: 'Health', description: 'Health and wellness products', icon: 'health', created_at: new Date().toISOString() }
];

export const getCategories = async (): Promise<Category[]> => {
  try {
    // Return mock data since the categories table doesn't exist
    return mockCategories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const getCategoryById = async (id: string): Promise<Category | null> => {
  try {
    const category = mockCategories.find(cat => cat.id === id);
    return category || null;
  } catch (error) {
    console.error('Error in getCategoryById:', error);
    return null;
  }
};
