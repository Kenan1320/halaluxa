
import { db } from '@/integrations/supabase/client';
import { Category } from '@/types/database';

export { Category };

export const getCategories = async (): Promise<Category[]> => {
  try {
    const { data, error } = await db
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const getCategoryById = async (id: string): Promise<Category | null> => {
  try {
    const { data, error } = await db
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error(`Error fetching category with ID ${id}:`, error);
    return null;
  }
};

export const getCategoriesByGroup = async (group: string): Promise<Category[]> => {
  try {
    const { data, error } = await db
      .from('categories')
      .select('*')
      .eq('group', group)
      .order('name');
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error(`Error fetching categories with group ${group}:`, error);
    return [];
  }
};

export const getTopCategories = async (limit = 10): Promise<Category[]> => {
  try {
    const { data, error } = await db
      .from('categories')
      .select('*')
      .order('name')
      .limit(limit);
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching top categories:', error);
    return [];
  }
};

export const createCategory = async (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category | null> => {
  try {
    const { data, error } = await db
      .from('categories')
      .insert(category)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error creating category:', error);
    return null;
  }
};

export const updateCategory = async (id: string, updates: Partial<Category>): Promise<Category | null> => {
  try {
    const { data, error } = await db
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error(`Error updating category with ID ${id}:`, error);
    return null;
  }
};

export const deleteCategory = async (id: string): Promise<boolean> => {
  try {
    const { error } = await db
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Error deleting category with ID ${id}:`, error);
    return false;
  }
};
