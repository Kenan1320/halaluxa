
import { supabase } from '@/integrations/supabase/client';

// Define and export the Category type
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

// Mock categories for development
const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Groceries',
    slug: 'groceries',
    icon: 'shopping-basket',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    group: 'featured'
  },
  {
    id: '2',
    name: 'Restaurants',
    slug: 'restaurants',
    icon: 'utensils',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    group: 'popular'
  },
  {
    id: '3',
    name: 'Pharmacy',
    slug: 'pharmacy',
    icon: 'first-aid',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    group: 'nearby'
  },
  {
    id: '4',
    name: 'Home Services',
    slug: 'home-services',
    icon: 'home',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    group: 'online'
  },
  {
    id: '5',
    name: 'Electronics',
    slug: 'electronics',
    icon: 'tv',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    group: 'transitional'
  }
];

// Get all categories
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    // For development, return mock data
    return mockCategories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Get categories by group
export const getCategoriesByGroup = async (group: 'featured' | 'nearby' | 'online' | 'popular' | 'transitional'): Promise<Category[]> => {
  try {
    return mockCategories.filter(category => category.group === group);
  } catch (error) {
    console.error(`Error fetching ${group} categories:`, error);
    return [];
  }
};

// Get a single category by ID
export const getCategoryById = async (id: string): Promise<Category | null> => {
  try {
    const category = mockCategories.find(cat => cat.id === id);
    return category || null;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
};

// Get a single category by slug
export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  try {
    const category = mockCategories.find(cat => cat.slug === slug);
    return category || null;
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    return null;
  }
};

// Search categories
export const searchCategories = async (query: string): Promise<Category[]> => {
  try {
    const normalizedQuery = query.toLowerCase();
    return mockCategories.filter(category => 
      category.name.toLowerCase().includes(normalizedQuery)
    );
  } catch (error) {
    console.error('Error searching categories:', error);
    return [];
  }
};
