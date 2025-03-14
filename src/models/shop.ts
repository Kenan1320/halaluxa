
import { UUID, Timestamp, Coordinates, Rating, DBShop } from './types';

// Shop model interfaces
export interface Shop {
  id: UUID;
  name: string;
  description: string;
  location: string;
  category: string;
  rating: number | Rating;
  productCount: number;
  isVerified: boolean;
  logo: string | null;
  coverImage: string | null;
  ownerId: UUID;
  latitude: number | null;
  longitude: number | null;
  distance: number | null;
  deliveryAvailable?: boolean;
  pickupAvailable?: boolean;
  isHalalCertified?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  address?: string;
  displayMode?: 'online' | 'local_pickup' | 'local_delivery';
  // Legacy properties for compatibility
  logo_url?: string | null;
  product_count?: number;
  is_verified?: boolean;
  cover_image?: string | null;
  owner_id?: UUID;
  delivery_available?: boolean;
  pickup_available?: boolean;
  is_halal_certified?: boolean;
  created_at?: string;
  updated_at?: string;
  display_mode?: 'online' | 'local_pickup' | 'local_delivery';
}

export interface ShopProduct {
  id: UUID;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  shopId: UUID;
  shopName?: string;
  shopLogo?: string;
  distance?: number;
  stock?: number;
  isHalalCertified: boolean;
  inStock?: boolean;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  rating?: number;
  reviewCount?: number;
  featured?: boolean;
}

export interface ShopLocation extends Coordinates {
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface ShopDisplaySettings {
  id: UUID;
  shopId: UUID;
  primaryColor: string | null;
  secondaryColor: string | null;
  fontFamily: string | null;
  showRatings: boolean;
  showProductCount: boolean;
  featuredProducts: UUID[] | null;
  bannerMessage: string | null;
  created_at: string;
}

// Utility functions for type conversion
export const adaptDbShopToModelShop = (dbShop: DBShop): Shop => {
  return {
    id: dbShop.id,
    name: dbShop.name,
    description: dbShop.description,
    logo: dbShop.logo_url,
    category: dbShop.category,
    location: dbShop.location,
    rating: {
      average: dbShop.rating || 0,
      count: 0 // Default, can be updated if available
    },
    productCount: dbShop.product_count || 0,
    isVerified: dbShop.is_verified || false,
    ownerId: dbShop.owner_id,
    latitude: dbShop.latitude,
    longitude: dbShop.longitude,
    coverImage: dbShop.cover_image,
    distance: dbShop.distance || null,
    deliveryAvailable: dbShop.delivery_available,
    pickupAvailable: dbShop.pickup_available,
    isHalalCertified: dbShop.is_halal_certified,
    createdAt: dbShop.created_at,
    updatedAt: dbShop.updated_at,
    address: dbShop.address,
    displayMode: dbShop.display_mode || 'online',
    // Legacy properties
    logo_url: dbShop.logo_url,
    product_count: dbShop.product_count,
    is_verified: dbShop.is_verified,
    cover_image: dbShop.cover_image,
    owner_id: dbShop.owner_id,
    delivery_available: dbShop.delivery_available,
    pickup_available: dbShop.pickup_available,
    is_halal_certified: dbShop.is_halal_certified,
    created_at: dbShop.created_at,
    updated_at: dbShop.updated_at,
    display_mode: dbShop.display_mode
  };
};

export const adaptModelShopToDBShop = (modelShop: Shop): DBShop => {
  const rating = typeof modelShop.rating === 'object' 
    ? modelShop.rating.average 
    : modelShop.rating;
    
  return {
    id: modelShop.id,
    name: modelShop.name,
    description: modelShop.description,
    logo_url: modelShop.logo || modelShop.logo_url,
    category: modelShop.category,
    location: modelShop.location,
    rating: rating || 0,
    product_count: modelShop.productCount || modelShop.product_count || 0,
    is_verified: modelShop.isVerified || modelShop.is_verified || false,
    owner_id: modelShop.ownerId || modelShop.owner_id || '',
    latitude: modelShop.latitude,
    longitude: modelShop.longitude,
    cover_image: modelShop.coverImage || modelShop.cover_image,
    delivery_available: modelShop.deliveryAvailable || modelShop.delivery_available,
    pickup_available: modelShop.pickupAvailable || modelShop.pickup_available,
    is_halal_certified: modelShop.isHalalCertified || modelShop.is_halal_certified,
    created_at: modelShop.createdAt || modelShop.created_at,
    updated_at: modelShop.updatedAt || modelShop.updated_at,
    address: modelShop.address,
    display_mode: modelShop.displayMode || modelShop.display_mode,
    distance: modelShop.distance
  };
};

export const shopCategories = [
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
