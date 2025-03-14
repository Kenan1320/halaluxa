
import { Shop } from '@/models/shop';

export interface ShopFilterOptions {
  minRating?: number;
  maxDistance?: number;
  categories?: string[];
  isHalalCertified?: boolean;
  deliveryAvailable?: boolean;
  pickupAvailable?: boolean;
  search?: string;
  sortBy?: 'distance' | 'rating' | 'name';
  sortDirection?: 'asc' | 'desc';
}

/**
 * Filter and sort shops based on provided options
 */
export const filterShops = (shops: Shop[], options: ShopFilterOptions): Shop[] => {
  let filteredShops = [...shops];
  
  // Filter by minimum rating
  if (options.minRating !== undefined) {
    filteredShops = filteredShops.filter(shop => shop.rating >= options.minRating!);
  }
  
  // Filter by maximum distance
  if (options.maxDistance !== undefined) {
    filteredShops = filteredShops.filter(shop => 
      shop.distance !== null && shop.distance <= options.maxDistance!
    );
  }
  
  // Filter by categories
  if (options.categories && options.categories.length > 0) {
    filteredShops = filteredShops.filter(shop => 
      options.categories!.includes(shop.category)
    );
  }
  
  // Filter by halal certification
  if (options.isHalalCertified !== undefined) {
    filteredShops = filteredShops.filter(shop => 
      shop.isHalalCertified === options.isHalalCertified ||
      shop.is_halal_certified === options.isHalalCertified
    );
  }
  
  // Filter by delivery availability
  if (options.deliveryAvailable !== undefined) {
    filteredShops = filteredShops.filter(shop => 
      shop.deliveryAvailable === options.deliveryAvailable ||
      shop.delivery_available === options.deliveryAvailable
    );
  }
  
  // Filter by pickup availability
  if (options.pickupAvailable !== undefined) {
    filteredShops = filteredShops.filter(shop => 
      shop.pickupAvailable === options.pickupAvailable ||
      shop.pickup_available === options.pickupAvailable
    );
  }
  
  // Filter by search term (name or description)
  if (options.search) {
    const searchLower = options.search.toLowerCase();
    filteredShops = filteredShops.filter(shop => 
      shop.name.toLowerCase().includes(searchLower) || 
      shop.description.toLowerCase().includes(searchLower)
    );
  }
  
  // Sort shops
  if (options.sortBy) {
    filteredShops.sort((a, b) => {
      const direction = options.sortDirection === 'desc' ? -1 : 1;
      
      switch (options.sortBy) {
        case 'distance':
          return direction * ((a.distance || Infinity) - (b.distance || Infinity));
        case 'rating':
          return direction * (a.rating - b.rating);
        case 'name':
          return direction * a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }
  
  return filteredShops;
};
