
import { db } from '@/integrations/supabase/client';
import { Category } from '@/types/database';

export type { Category };

// Mock categories based on our new organization
const mockCategories: Category[] = [
  // Halvi Local Categories (Physical Stores)
  {
    id: 'groceries',
    name: 'Groceries',
    description: 'Local halal grocery stores',
    image: '/categories/groceries.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    group: 'nearby'
  },
  {
    id: 'restaurants',
    name: 'Restaurants',
    description: 'Local halal restaurants & eateries',
    image: '/categories/restaurants.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    group: 'nearby'
  },
  {
    id: 'halal-meat',
    name: 'Halal Meat',
    description: 'Local halal butcher shops',
    image: '/categories/meat.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    group: 'nearby'
  },
  {
    id: 'coffee-shops',
    name: 'Coffee Shops',
    description: 'Local halal cafés & coffee houses',
    image: '/categories/coffee.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    group: 'nearby'
  },
  {
    id: 'therapists',
    name: 'Therapists',
    description: 'Halal wellness & therapy centers',
    image: '/categories/therapy.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    group: 'nearby'
  },
  {
    id: 'furniture',
    name: 'Furniture',
    description: 'Physical stores with furniture showrooms',
    image: '/categories/furniture.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    group: 'nearby'
  },
  
  // Halvi Mall Categories (Online Stores)
  {
    id: 'hoodies',
    name: 'Hoodies',
    description: 'Islamic & modest fashion brands online',
    image: '/categories/hoodies.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    group: 'online'
  },
  {
    id: 'thobes',
    name: 'Thobes',
    description: 'Online Islamic clothing stores',
    image: '/categories/thobes.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    group: 'online'
  },
  {
    id: 'abaya',
    name: 'Abaya',
    description: 'Online modest wear stores',
    image: '/categories/abaya.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    group: 'online'
  },
  {
    id: 'books',
    name: 'Books',
    description: 'Online Islamic bookshops & digital bookstores',
    image: '/categories/books.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    group: 'online'
  },
  {
    id: 'fragrance',
    name: 'Fragrance',
    description: 'Perfumes & attars, often sold online',
    image: '/categories/fragrance.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    group: 'online'
  },
  {
    id: 'jewelry',
    name: 'Jewelry',
    description: 'Islamic jewelry, often found in online marketplaces',
    image: '/categories/jewelry.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    group: 'online'
  },
  
  // Both (Transitional Categories)
  {
    id: 'arabic-calligraphy',
    name: 'Arabic Calligraphy',
    description: 'Local artists & online art commissions',
    image: '/categories/calligraphy.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    group: 'transitional'
  },
  {
    id: 'decorations',
    name: 'Decorations',
    description: 'Islamic home decor can be both local & online',
    image: '/categories/decorations.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    group: 'transitional'
  },
  {
    id: 'gifts',
    name: 'Gifts',
    description: 'Local flower shops & online Islamic gift stores',
    image: '/categories/gifts.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    group: 'transitional'
  },
  {
    id: 'modest-wear',
    name: 'Modest Wear',
    description: 'Can be found in local boutiques or online stores',
    image: '/categories/modest-wear.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    group: 'transitional'
  },
  {
    id: 'online-stores',
    name: 'Online Stores',
    description: 'Some might be local businesses with an online presence',
    image: '/categories/online-stores.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    group: 'transitional'
  },
  {
    id: 'others',
    name: 'Others',
    description: 'Catch-all category for businesses that could be either local or online',
    image: '/categories/others.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    group: 'transitional'
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
