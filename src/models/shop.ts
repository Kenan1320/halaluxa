
import { UUID, Timestamp, Coordinates, Rating } from './types';

// Shop model interfaces
export interface Shop {
  id: UUID;
  name: string;
  description: string;
  location: string;
  category: string;
  rating: number;
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
export const adaptDbShopToModelShop = (dbShop: any): Shop => {
  return {
    id: dbShop.id,
    name: dbShop.name,
    description: dbShop.description,
    logo: dbShop.logo_url,
    category: dbShop.category,
    location: dbShop.location,
    rating: dbShop.rating || 0,
    productCount: dbShop.product_count || 0,
    isVerified: dbShop.is_verified || false,
    ownerId: dbShop.owner_id,
    latitude: dbShop.latitude,
    longitude: dbShop.longitude,
    coverImage: dbShop.cover_image,
    distance: dbShop.distance || 0,
    deliveryAvailable: dbShop.delivery_available,
    pickupAvailable: dbShop.pickup_available,
    isHalalCertified: dbShop.is_halal_certified,
    createdAt: dbShop.created_at,
    updatedAt: dbShop.updated_at,
    address: dbShop.address,
    displayMode: dbShop.display_mode || 'online'
  };
};

export const adaptModelShopToDBShop = (modelShop: Shop): any => {
  return {
    id: modelShop.id,
    name: modelShop.name,
    description: modelShop.description,
    logo_url: modelShop.logo,
    category: modelShop.category,
    location: modelShop.location,
    rating: modelShop.rating,
    product_count: modelShop.productCount,
    is_verified: modelShop.isVerified,
    owner_id: modelShop.ownerId,
    latitude: modelShop.latitude,
    longitude: modelShop.longitude,
    cover_image: modelShop.coverImage,
    delivery_available: modelShop.deliveryAvailable,
    pickup_available: modelShop.pickupAvailable,
    is_halal_certified: modelShop.isHalalCertified,
    created_at: modelShop.createdAt,
    updated_at: modelShop.updatedAt,
    address: modelShop.address,
    display_mode: modelShop.displayMode
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
