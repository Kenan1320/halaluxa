
import { productCategories } from '@/models/product';

// Simple Category interface
export interface Category {
  id: string;
  name: string;
  icon?: string;
  description?: string;
}

// This is a simple mock implementation to avoid the database errors
// We'll use the product categories from the model
export const getCategories = async (): Promise<Category[]> => {
  try {
    // Return categories based on productCategories array
    return productCategories.map(category => ({
      id: category.toLowerCase().replace(/\s+/g, '-'),
      name: category,
      description: `Products in the ${category} category`
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Get categories by group
export const getCategoriesByGroup = async (group: string): Promise<Category[]> => {
  // In this mock implementation, we'll return all categories
  // In a real implementation, you'd filter by group
  return getCategories();
};

// Get featured categories
export const getFeaturedCategories = async (): Promise<Category[]> => {
  // In this mock implementation, we'll return the first 6 categories
  const allCategories = await getCategories();
  return allCategories.slice(0, 6);
};

// A function to get a mapping between category names and icons
export const getCategoryIconMapping = () => {
  const iconMapping: Record<string, string> = {
    'Groceries': '/icons/grocery.png',
    'Restaurants': '/icons/restaurant.png',
    'Furniture': '/icons/home.png',
    'Halal Meat': '/icons/grocery.png',
    'Books': '/icons/home.png',
    'Thobes': '/icons/clothing.png',
    'Hijab': '/icons/clothing.png',
    'Decorations': '/icons/home.png',
    'Abaya': '/icons/clothing.png',
    'Online Shops': '/icons/grocery.png',
    'Gifts': '/icons/grocery.png',
    'Arabic Calligraphy': '/icons/home.png',
    'Muslim Therapists': '/icons/services.png',
    'Coffee Shops': '/icons/restaurant.png',
    'Hoodies': '/icons/clothing.png',
    'Pets': '/icons/pets.png',
    'Toys': '/icons/toys.png',
    'Electronics': '/icons/electronics.png',
  };

  return iconMapping;
};
