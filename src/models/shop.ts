export interface Shop {
  id: string;
  name: string;
  description: string;
  category: string;
  location?: string;
  logo_url?: string;
  owner_id: string;
  rating?: number;
  review_count?: number;
  product_count?: number;
  featured?: boolean;
  distance?: number;
  latitude?: number;
  longitude?: number;
  address?: string;
  is_verified?: boolean;
  cover_image?: string;
  created_at?: string;
  updated_at?: string;
}

export type ShopCategory = 
  'Bakery' | 
  'Butcher' | 
  'Grocery' | 
  'Restaurant' | 
  'Sweets & Desserts' |
  'Health & Wellness' |
  'Clothing' |
  'Beauty & Cosmetics' |
  'Books & Gifts' |
  'Other';

export const shopCategories: ShopCategory[] = [
  'Bakery',
  'Butcher',
  'Grocery',
  'Restaurant',
  'Sweets & Desserts',
  'Health & Wellness',
  'Clothing',
  'Beauty & Cosmetics',
  'Books & Gifts',
  'Other'
];

export const convertToModelShop = (data: any): Shop => {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    category: data.category,
    location: data.location,
    logo_url: data.logo_url,
    owner_id: data.owner_id,
    rating: data.rating,
    review_count: data.review_count,
    product_count: data.product_count,
    featured: data.featured,
    distance: data.distance,
    latitude: data.latitude,
    longitude: data.longitude,
    address: data.address,
    is_verified: data.is_verified,
    cover_image: data.cover_image,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
};

export const convertToDbShop = (shop: Shop): any => {
  return {
    id: shop.id,
    name: shop.name,
    description: shop.description,
    category: shop.category,
    location: shop.location,
    logo_url: shop.logo_url,
    owner_id: shop.owner_id,
    rating: shop.rating,
    review_count: shop.review_count,
    product_count: shop.product_count,
    featured: shop.featured,
    distance: shop.distance,
    latitude: shop.latitude,
    longitude: shop.longitude,
    address: shop.address,
    is_verified: shop.is_verified,
    cover_image: shop.cover_image,
    created_at: shop.created_at,
    updated_at: shop.updated_at
  };
};
