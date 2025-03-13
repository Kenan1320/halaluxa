
import { supabase } from '@/integrations/supabase/client';

export interface Category {
  id: string;
  name: string;
  group: string;
  created_at: string;
  icon?: string;
  description?: string;
  slug?: string;
}

// Get all categories
export const getCategories = async (): Promise<Category[]> => {
  try {
    // Since 'product_categories' is not in the Supabase schema,
    // we'll return mock data for now
    return [
      { id: '1', name: 'Groceries', group: 'nearby', created_at: new Date().toISOString() },
      { id: '2', name: 'Online Stores', group: 'online', created_at: new Date().toISOString() },
      { id: '3', name: 'Restaurants', group: 'nearby', created_at: new Date().toISOString() },
      { id: '4', name: 'Coffee Shops', group: 'nearby', created_at: new Date().toISOString() },
      { id: '5', name: 'Clothing', group: 'online', created_at: new Date().toISOString() },
      { id: '6', name: 'Halal Meat', group: 'nearby', created_at: new Date().toISOString() }
    ];
  } catch (error) {
    console.error('Error in getCategories:', error);
    // Return some default categories as fallback
    return [
      { id: '1', name: 'Groceries', group: 'nearby', created_at: new Date().toISOString() },
      { id: '2', name: 'Online Stores', group: 'online', created_at: new Date().toISOString() },
      { id: '3', name: 'Restaurants', group: 'nearby', created_at: new Date().toISOString() },
      { id: '4', name: 'Coffee Shops', group: 'nearby', created_at: new Date().toISOString() },
      { id: '5', name: 'Clothing', group: 'online', created_at: new Date().toISOString() },
      { id: '6', name: 'Halal Meat', group: 'nearby', created_at: new Date().toISOString() }
    ];
  }
};

// Get categories by group (e.g., 'nearby', 'online')
export const getCategoriesByGroup = async (group: string): Promise<Category[]> => {
  try {
    const allCategories = await getCategories();
    return allCategories.filter(category => category.group === group);
  } catch (error) {
    console.error(`Error in getCategoriesByGroup(${group}):`, error);
    // Return empty array as fallback
    return [];
  }
};

// Create a category
export const createCategory = async (category: Omit<Category, 'id' | 'created_at'>): Promise<Category | null> => {
  try {
    // Since we can't add to product_categories, return a mock response
    return {
      id: Math.random().toString(36).substring(2, 15),
      name: category.name,
      group: category.group,
      created_at: new Date().toISOString(),
      icon: category.icon,
      description: category.description,
      slug: category.slug
    };
  } catch (error) {
    console.error('Error in createCategory:', error);
    return null;
  }
};

// Get a category by id
export const getCategoryById = async (id: string): Promise<Category | null> => {
  try {
    const allCategories = await getCategories();
    const category = allCategories.find(c => c.id === id);
    if (!category) {
      throw new Error(`Category with id ${id} not found`);
    }
    return category;
  } catch (error) {
    console.error(`Error in getCategoryById(${id}):`, error);
    return null;
  }
};

// For compatibility with any existing code that might use this
// Just alias getCategories to maintain API compatibility
export const listCategories = getCategories;
