
import { Shop } from '@/models/shop';
import { DBShop, Category } from '@/models/types';
import { calculateDistance } from '@/utils/locationUtils';

// Convert a database shop to frontend shop model
export const convertDBShopToShop = (shop: DBShop): Shop => {
  return {
    id: shop.id,
    name: shop.name,
    description: shop.description || '',
    logo: shop.logo_url || '',
    logoUrl: shop.logo_url || '',
    category: shop.category || '',
    location: shop.location || '',
    rating: shop.rating || 0,
    latitude: shop.latitude || 0,
    longitude: shop.longitude || 0,
    distance: shop.distance || 0,
    productCount: shop.product_count || 0,
    isVerified: shop.is_verified || false,
    ownerId: shop.owner_id || '',
    createdAt: shop.created_at,
    updatedAt: shop.updated_at || '',
    owner_id: shop.owner_id || '',
    product_count: shop.product_count || 0,
    is_verified: shop.is_verified || false,
    delivery_available: shop.delivery_available || false,
    pickup_available: shop.pickup_available || false,
    is_halal_certified: shop.is_halal_certified || false
  };
};

// Filter shops based on location and search criteria
export const filterShops = (
  shops: Shop[],
  userLocation: { latitude: number; longitude: number } | null,
  searchTerm: string = '',
  categoryFilter: string = '',
  maxDistance: number = 50 // in km
): Shop[] => {
  return shops
    .filter(shop => {
      // Apply search term filter
      if (searchTerm && !shop.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Apply category filter
      if (categoryFilter && shop.category !== categoryFilter) {
        return false;
      }
      
      // Calculate distance if user location is available
      if (userLocation && shop.latitude && shop.longitude) {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          shop.latitude,
          shop.longitude
        );
        
        // Only include shops within maxDistance
        if (distance > maxDistance) {
          return false;
        }
        
        // Update shop with calculated distance
        shop.distance = distance;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort by distance if available
      if (a.distance !== undefined && b.distance !== undefined) {
        return a.distance - b.distance;
      }
      
      // Fallback to sort by rating
      return b.rating - a.rating;
    });
};

// Map category name to icon
export const getCategoryIcon = (categoryName: string): string => {
  const icons: Record<string, string> = {
    'Groceries': '🛒',
    'Restaurants': '🍽️',
    'Clothing': '👕',
    'Electronics': '📱',
    'Books': '📚',
    'Furniture': '🛋️',
    'Health': '💊',
    'Beauty': '💄',
    'Sports': '⚽',
    'Toys': '🧸',
    'Jewelry': '💍',
    'Coffee Shops': '☕',
    'Bakeries': '🥐',
    'Halal Meat': '🥩',
    'Online Shops': '🛍️',
    'Gifts': '🎁',
    'Thobes': '👘',
    'Hijab': '🧕'
  };
  
  return icons[categoryName] || '🏪';
};

// Get shop products from the same service file
export const getShopProducts = async (shopId: string, limit = 20) => {
  try {
    // This is a placeholder implementation until we have a proper product service
    const { supabase } = await import('@/lib/supabase');
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('shop_id', shopId)
      .limit(limit);
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching shop products:', error);
    return [];
  }
};
