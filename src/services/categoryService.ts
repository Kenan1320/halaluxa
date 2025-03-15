
import { db } from '@/integrations/supabase/client';
import { Category } from '@/types/database';

export type { Category };

// Mock categories until the categories table is created
const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    description: 'Electronic devices and accessories',
    image: '/categories/electronics.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    group: 'featured'
  },
  {
    id: '2',
    name: 'Clothing',
    description: 'Fashion and apparel',
    image: '/categories/clothing.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    group: 'popular'
  },
  {
    id: '3',
    name: 'Food',
    description: 'Groceries and prepared meals',
    image: '/categories/food.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    group: 'nearby'
  }
];

export const getCategories = async (): Promise<Category[]> => {
  try {
    // For now, return mock categories
    // When the categories table is created, uncomment the following code:
    /*
    const { data, error } = await db
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    return data || [];
    */
    
    return mockCategories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return mockCategories;
  }
};

export const getCategoryById = async (id: string): Promise<Category | null> => {
  try {
    // For now, use mock categories
    const category = mockCategories.find(cat => cat.id === id);
    return category || null;
    
    // When the categories table is created, uncomment the following code:
    /*
    const { data, error } = await db
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data;
    */
  } catch (error) {
    console.error(`Error fetching category with ID ${id}:`, error);
    return null;
  }
};

export const getCategoriesByGroup = async (group: string): Promise<Category[]> => {
  try {
    // For now, use mock categories
    const filteredCategories = mockCategories.filter(cat => cat.group === group);
    return filteredCategories;
    
    // When the categories table is created, uncomment the following code:
    /*
    const { data, error } = await db
      .from('categories')
      .select('*')
      .eq('group', group)
      .order('name');
    
    if (error) throw error;
    
    return data || [];
    */
  } catch (error) {
    console.error(`Error fetching categories with group ${group}:`, error);
    return [];
  }
};

export const getTopCategories = async (limit = 10): Promise<Category[]> => {
  try {
    // For now, return mock categories limited by the parameter
    return mockCategories.slice(0, limit);
    
    // When the categories table is created, uncomment the following code:
    /*
    const { data, error } = await db
      .from('categories')
      .select('*')
      .order('name')
      .limit(limit);
    
    if (error) throw error;
    
    return data || [];
    */
  } catch (error) {
    console.error('Error fetching top categories:', error);
    return [];
  }
};

export const createCategory = async (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category | null> => {
  try {
    // For now, create a mock category
    const newCategory: Category = {
      id: Math.random().toString(36).substring(2, 11),
      ...category,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // When the categories table is created, uncomment the following code:
    /*
    const { data, error } = await db
      .from('categories')
      .insert(category)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
    */
    
    return newCategory;
  } catch (error) {
    console.error('Error creating category:', error);
    return null;
  }
};

export const updateCategory = async (id: string, updates: Partial<Category>): Promise<Category | null> => {
  try {
    // For now, update a mock category
    const categoryIndex = mockCategories.findIndex(cat => cat.id === id);
    if (categoryIndex === -1) return null;
    
    const updatedCategory: Category = {
      ...mockCategories[categoryIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    // When the categories table is created, uncomment the following code:
    /*
    const { data, error } = await db
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
    */
    
    return updatedCategory;
  } catch (error) {
    console.error(`Error updating category with ID ${id}:`, error);
    return null;
  }
};

export const deleteCategory = async (id: string): Promise<boolean> => {
  try {
    // For now, pretend to delete a mock category
    // When the categories table is created, uncomment the following code:
    /*
    const { error } = await db
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    */
    
    return true;
  } catch (error) {
    console.error(`Error deleting category with ID ${id}:`, error);
    return false;
  }
};
