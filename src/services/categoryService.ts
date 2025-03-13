
import { supabase } from '@/integrations/supabase/client';

export interface Category {
  id: string;
  name: string;
  group: string;
  created_at: string;
  icon?: string;
  slug?: string;
  description?: string;
}

// Get all categories
export const getCategories = async (): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
      
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    
    // Return mock data if there's an error or no data in the database
    return [
      { id: '1', name: 'Groceries', group: 'nearby', created_at: new Date().toISOString() },
      { id: '2', name: 'Online Stores', group: 'online', created_at: new Date().toISOString() },
      { id: '3', name: 'Restaurants', group: 'nearby', created_at: new Date().toISOString() },
      { id: '4', name: 'Coffee Shops', group: 'nearby', created_at: new Date().toISOString() },
      { id: '5', name: 'Hoodies', group: 'online', created_at: new Date().toISOString() },
      { id: '6', name: 'Halal Meat', group: 'nearby', created_at: new Date().toISOString() },
      { id: '7', name: 'Thobes', group: 'online', created_at: new Date().toISOString() },
      { id: '8', name: 'Abayas', group: 'online', created_at: new Date().toISOString() },
      { id: '9', name: 'Books', group: 'online', created_at: new Date().toISOString() },
      { id: '10', name: 'Kids', group: 'online', created_at: new Date().toISOString() },
      { id: '11', name: 'Gifts', group: 'online', created_at: new Date().toISOString() },
      { id: '12', name: 'Food Delivery', group: 'online', created_at: new Date().toISOString() }
    ];
  }
};

// Get categories by group
export const getCategoriesByGroup = async (group: string): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('group', group)
      .order('name');
      
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error(`Error fetching categories by group (${group}):`, error);
    
    // Filter mock data by group
    const allCategories = [
      { id: '1', name: 'Groceries', group: 'nearby', created_at: new Date().toISOString() },
      { id: '2', name: 'Online Stores', group: 'online', created_at: new Date().toISOString() },
      { id: '3', name: 'Restaurants', group: 'nearby', created_at: new Date().toISOString() },
      { id: '4', name: 'Coffee Shops', group: 'nearby', created_at: new Date().toISOString() },
      { id: '5', name: 'Hoodies', group: 'online', created_at: new Date().toISOString() },
      { id: '6', name: 'Halal Meat', group: 'nearby', created_at: new Date().toISOString() },
      { id: '7', name: 'Thobes', group: 'online', created_at: new Date().toISOString() },
      { id: '8', name: 'Abayas', group: 'online', created_at: new Date().toISOString() },
      { id: '9', name: 'Books', group: 'online', created_at: new Date().toISOString() },
      { id: '10', name: 'Kids', group: 'online', created_at: new Date().toISOString() },
      { id: '11', name: 'Gifts', group: 'online', created_at: new Date().toISOString() },
      { id: '12', name: 'Food Delivery', group: 'online', created_at: new Date().toISOString() }
    ];
    
    return allCategories.filter(category => category.group === group);
  }
};

// Create a new category
export const createCategory = async (category: Omit<Category, 'id' | 'created_at'>): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert([
        { 
          name: category.name,
          group: category.group,
          icon: category.icon,
          slug: category.slug || category.name.toLowerCase().replace(/\s+/g, '-'),
          description: category.description
        }
      ])
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error creating category:', error);
    return null;
  }
};

// Delete a category
export const deleteCategory = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
      
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    return false;
  }
};
