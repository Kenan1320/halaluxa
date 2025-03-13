
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
    // Use the appropriate table depending on your database structure
    // This assumes you have a 'categories' table or view
    const { data, error } = await supabase
      .from('product_categories')
      .select('*');

    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }

    // Map the results to our Category interface
    return (data || []).map(item => ({
      id: item.id,
      name: item.name,
      group: item.group || 'general', // Provide a default if not available
      created_at: item.created_at,
      icon: item.icon,
      description: item.description,
      slug: item.slug
    }));
  } catch (error) {
    console.error('Error in getCategories:', error);
    // Return some default categories as fallback
    return [
      { id: '1', name: 'Groceries', group: 'nearby', created_at: new Date().toISOString() },
      { id: '2', name: 'Online Shops', group: 'online', created_at: new Date().toISOString() },
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
    const { data, error } = await supabase
      .from('product_categories')
      .select('*')
      .eq('group', group);

    if (error) {
      console.error(`Error fetching ${group} categories:`, error);
      throw error;
    }

    // Map the results to our Category interface
    return (data || []).map(item => ({
      id: item.id,
      name: item.name,
      group: item.group || 'general',
      created_at: item.created_at,
      icon: item.icon,
      description: item.description,
      slug: item.slug
    }));
  } catch (error) {
    console.error(`Error in getCategoriesByGroup(${group}):`, error);
    // Return empty array as fallback
    return [];
  }
};

// Create a category
export const createCategory = async (category: Omit<Category, 'id' | 'created_at'>): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from('product_categories')
      .insert([category])
      .select()
      .single();

    if (error) {
      console.error('Error creating category:', error);
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      group: data.group || 'general',
      created_at: data.created_at,
      icon: data.icon,
      description: data.description,
      slug: data.slug
    };
  } catch (error) {
    console.error('Error in createCategory:', error);
    return null;
  }
};

// Get a category by id
export const getCategoryById = async (id: string): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from('product_categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching category with id ${id}:`, error);
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      group: data.group || 'general',
      created_at: data.created_at,
      icon: data.icon,
      description: data.description,
      slug: data.slug
    };
  } catch (error) {
    console.error(`Error in getCategoryById(${id}):`, error);
    return null;
  }
};
