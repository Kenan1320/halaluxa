
import { supabase } from '../integrations/supabase/client';
import { Shop, ShopProduct } from '../models/shop';
import { Product } from '../models/product';

/**
 * Convert database shop object to front-end model
 */
export const dbShopToModel = (shop: any): Shop => {
  return {
    id: shop.id,
    name: shop.name,
    description: shop.description,
    location: shop.location,
    category: shop.category,
    logo_url: shop.logo_url,
    cover_image: shop.cover_image,
    owner_id: shop.owner_id || '',
    rating: shop.rating || 0,
    product_count: shop.product_count || 0,
    is_verified: shop.is_verified || false,
    latitude: shop.latitude,
    longitude: shop.longitude,
    created_at: shop.created_at,
    updated_at: shop.updated_at,
    distance: shop.distance
  };
};

/**
 * Convert front-end shop model to database format
 */
export const modelShopToDB = (shop: Shop): any => {
  return {
    id: shop.id,
    name: shop.name,
    description: shop.description,
    location: shop.location,
    category: shop.category,
    logo_url: shop.logo_url,
    cover_image: shop.cover_image,
    owner_id: shop.owner_id,
    rating: shop.rating,
    product_count: shop.product_count,
    is_verified: shop.is_verified,
    latitude: shop.latitude,
    longitude: shop.longitude,
    created_at: shop.created_at,
    updated_at: shop.updated_at
  };
};

/**
 * Convert database product to front-end model
 */
export const dbProductToModel = (product: any): Product => {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    images: product.images || [],
    category: product.category,
    shop_id: product.shop_id,
    is_halal_certified: product.is_halal_certified,
    in_stock: product.is_published !== undefined ? product.is_published : true,
    created_at: product.created_at,
    updated_at: product.updated_at,
    details: product.details,
    seller_id: product.seller_id || product.shop?.owner_id,
    seller_name: product.seller_name || product.shop?.name
  };
};

/**
 * Convert shop product to regular product model
 */
export const shopProductToProduct = (product: ShopProduct): Product => {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    images: product.images,
    category: product.category,
    shop_id: product.shop_id,
    is_halal_certified: product.is_halal_certified,
    in_stock: product.in_stock,
    created_at: product.created_at,
    updated_at: product.updated_at
  };
};

/**
 * Filter shops based on search criteria
 */
export const filterShops = (shops: Shop[], searchTerm: string, category?: string): Shop[] => {
  if (!searchTerm && !category) return shops;
  
  return shops.filter(shop => {
    const matchesSearch = !searchTerm || 
      shop.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      shop.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !category || shop.category.toLowerCase() === category.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });
};

/**
 * Sort shops by distance, rating, or name
 */
export const sortShops = (shops: Shop[], sortBy: 'distance' | 'rating' | 'name' = 'distance'): Shop[] => {
  return [...shops].sort((a, b) => {
    if (sortBy === 'distance') {
      // If distance is available, sort by it, otherwise, fall back to rating
      if (a.distance !== undefined && b.distance !== undefined) {
        return a.distance - b.distance;
      }
      return b.rating - a.rating;
    } else if (sortBy === 'rating') {
      return b.rating - a.rating;
    } else {
      return a.name.localeCompare(b.name);
    }
  });
};
