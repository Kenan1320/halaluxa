
import { supabase } from '@/lib/supabase';
import { Shop } from '@/models/shop';
import { Product, adaptDatabaseProductToProduct } from '@/models/product';
import { adaptDbShopToShop } from './modelAdapterService';
import { UUID } from '@/models/types';

// Helper function to filter shops
export const filterShops = (shops: Shop[], filters: any) => {
  let filteredShops = [...shops];
  
  if (filters?.category) {
    filteredShops = filteredShops.filter(shop => 
      shop.category === filters.category
    );
  }
  
  if (filters?.search) {
    const searchQuery = filters.search.toLowerCase();
    filteredShops = filteredShops.filter(shop => 
      shop.name.toLowerCase().includes(searchQuery) || 
      shop.description.toLowerCase().includes(searchQuery)
    );
  }
  
  if (filters?.deliveryOnly) {
    filteredShops = filteredShops.filter(shop => 
      shop.deliveryAvailable || shop.delivery_available
    );
  }
  
  if (filters?.pickupOnly) {
    filteredShops = filteredShops.filter(shop => 
      shop.pickupAvailable || shop.pickup_available
    );
  }
  
  if (filters?.isHalalCertified) {
    filteredShops = filteredShops.filter(shop => 
      shop.isHalalCertified || shop.is_halal_certified
    );
  }
  
  if (filters?.maxDistance && filters?.userLat && filters?.userLng) {
    // This would require a distance calculation function
    // For now we'll use the pre-calculated distance
    filteredShops = filteredShops.filter(shop => 
      shop.distance !== null && shop.distance <= filters.maxDistance
    );
  }
  
  if (filters?.sort === 'nearest') {
    filteredShops.sort((a, b) => {
      const distA = a.distance || Infinity;
      const distB = b.distance || Infinity;
      return distA - distB;
    });
  } else if (filters?.sort === 'rating') {
    filteredShops.sort((a, b) => {
      const ratingA = typeof a.rating === 'object' ? a.rating.average : a.rating || 0;
      const ratingB = typeof b.rating === 'object' ? b.rating.average : b.rating || 0;
      return ratingB - ratingA;
    });
  }
  
  return filteredShops;
};

// Function to get products for a specific shop
export const getShopProducts = async (shopId: UUID): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('shop_id', shopId);
    
    if (error) throw error;
    
    return (data || []).map(adaptDatabaseProductToProduct);
  } catch (error) {
    console.error(`Error fetching products for shop ${shopId}:`, error);
    return [];
  }
};

// Function to get a mock array of categories (temporary solution)
export const listCategories = async (): Promise<string[]> => {
  // This is a fallback in case the database call fails
  const defaultCategories = [
    "Food & Groceries",
    "Fashion",
    "Beauty & Wellness",
    "Home & Decor",
    "Books & Stationery",
    "Electronics",
    "Toys & Games",
    "Health & Fitness",
    "Islamic Goods",
    "Halal Meat",
    "Clothing",
    "Services",
    "Other"
  ];
  
  try {
    // Try to get categories from database
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .limit(100);
    
    if (error) return defaultCategories;
    
    // Extract unique categories
    const categories = [...new Set(data.map(item => item.category))];
    return categories.length > 0 ? categories : defaultCategories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return defaultCategories;
  }
};
