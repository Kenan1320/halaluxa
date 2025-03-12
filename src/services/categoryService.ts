
import { supabase } from '@/integrations/supabase/client';

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  created_at: string;
  group?: 'nearby' | 'online'; // Adding group to categorize for Halvi't Nearby or Halvi Mall
}

// Mock categories data since 'categories' table doesn't appear to exist
const mockCategories: Category[] = [
  { id: '1', name: 'Groceries', description: 'Fresh food and groceries', icon: 'grocery', created_at: new Date().toISOString(), group: 'nearby' },
  { id: '2', name: 'Restaurants', description: 'Restaurants and food delivery', icon: 'restaurant', created_at: new Date().toISOString(), group: 'nearby' },
  { id: '3', name: 'Halal Meat', description: 'Certified halal meat', icon: 'meat', created_at: new Date().toISOString(), group: 'nearby' },
  { id: '4', name: 'Coffee Shops', description: 'Coffee and tea shops', icon: 'coffee', created_at: new Date().toISOString(), group: 'nearby' },
  { id: '5', name: 'Furniture', description: 'Home furniture and decor', icon: 'furniture', created_at: new Date().toISOString(), group: 'nearby' },
  { id: '6', name: 'Fashion', description: 'Clothing and accessories', icon: 'fashion', created_at: new Date().toISOString(), group: 'online' },
  { id: '7', name: 'Electronics', description: 'Gadgets and electronics', icon: 'electronics', created_at: new Date().toISOString(), group: 'online' },
  { id: '8', name: 'Books', description: 'Books and stationery', icon: 'books', created_at: new Date().toISOString(), group: 'online' },
  { id: '9', name: 'Toys', description: 'Toys and games', icon: 'toys', created_at: new Date().toISOString(), group: 'online' },
  { id: '10', name: 'Health', description: 'Health and wellness products', icon: 'health', created_at: new Date().toISOString(), group: 'nearby' },
  { id: '11', name: 'Online Shops', description: 'Online stores', icon: 'shop', created_at: new Date().toISOString(), group: 'online' },
  { id: '12', name: 'Gifts', description: 'Gift items', icon: 'gift', created_at: new Date().toISOString(), group: 'online' },
  { id: '13', name: 'Hoodies', description: 'Hoodies and sweatshirts', icon: 'clothing', created_at: new Date().toISOString(), group: 'online' }
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

// Get categories by group (for Halvi't Nearby or Halvi Mall)
export const getCategoriesByGroup = async (group: 'nearby' | 'online'): Promise<Category[]> => {
  try {
    return mockCategories.filter(cat => cat.group === group);
  } catch (error) {
    console.error(`Error fetching ${group} categories:`, error);
    return [];
  }
};

// Alias for getCategories to support existing code
export const listCategories = getCategories;

export const getCategoryById = async (id: string): Promise<Category | null> => {
  try {
    const category = mockCategories.find(cat => cat.id === id);
    return category || null;
  } catch (error) {
    console.error('Error in getCategoryById:', error);
    return null;
  }
};

// Get category names only for dropdown lists
export const getCategoryNames = async (): Promise<string[]> => {
  try {
    return mockCategories.map(cat => cat.name);
  } catch (error) {
    console.error('Error fetching category names:', error);
    return [];
  }
};
