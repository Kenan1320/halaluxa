
import { db } from '@/integrations/supabase/client';

export interface Category {
  id: string;
  name: string;
  slug?: string;
  icon?: string;
  parent_id?: string | null;
  created_at: string;
  updated_at: string;
  group?: 'featured' | 'nearby' | 'online' | 'popular' | 'transitional';
}

export const getCategories = async (): Promise<Category[]> => {
  try {
    // For development, return mock categories
    return getMockCategories();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const getCategoriesByGroup = async (group: 'featured' | 'nearby' | 'online' | 'popular' | 'transitional'): Promise<Category[]> => {
  try {
    // For development, filter mock categories by group
    const allCategories = getMockCategories();
    return allCategories.filter(cat => cat.group === group);
  } catch (error) {
    console.error(`Error fetching ${group} categories:`, error);
    return [];
  }
};

// Mock categories for development with standardized category list
const getMockCategories = (): Category[] => {
  return [
    { id: 'groceries', name: 'Groceries', group: 'nearby', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'halal-meat', name: 'Halal Meat', group: 'nearby', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'restaurants', name: 'Restaurants', group: 'nearby', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'muslim-therapists', name: 'Muslim Therapists', group: 'nearby', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'furniture', name: 'Furniture', group: 'nearby', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'decorations', name: 'Decorations', group: 'nearby', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    
    { id: 'arabic-calligraphy', name: 'Arabic Calligraphy', group: 'transitional', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'arabic-language', name: 'Arabic Language', group: 'transitional', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'gifts', name: 'Gifts', group: 'transitional', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'hijabs', name: 'Hijabs', group: 'transitional', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'online-stores', name: 'Online Stores', group: 'transitional', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    
    { id: 'thobes', name: 'Thobes', group: 'online', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'abayas', name: 'Abayas', group: 'online', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'books', name: 'Books', group: 'online', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    
    { id: 'featured-products', name: 'Featured Products', group: 'featured', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'popular-items', name: 'Popular Items', group: 'popular', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  ];
};
