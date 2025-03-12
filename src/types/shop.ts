
import { Product } from '@/models/product';

export interface ShopCategory {
  id: string;
  name: string;
  products: Product[];
}

export interface DeliveryInfo {
  isDeliveryAvailable: boolean;
  isPickupAvailable: boolean;
  deliveryFee: number;
  estimatedTime: string;
  minOrder?: number;
}

export interface DatabaseProfile {
  address: string;
  avatar_url: string;
  city: string;
  created_at: string;
  email: string;
  id: string;
  name: string;
  phone: string;
  role: string;
  state: string;
  updated_at: string;
  zip: string;
  shop_name?: string;
  shop_description?: string;
  shop_category?: string;
  shop_location?: string;
  shop_logo?: string;
}

export interface ShopDetails {
  id: string;
  name: string;
  description: string;
  location: string;
  categories: ShopCategory[];
  cover_image?: string;
  logo_url?: string;
  logo?: string;
  deliveryInfo: DeliveryInfo;
  workingHours: {
    open: string;
    close: string;
  };
  isGroupOrderEnabled: boolean;
  rating: {
    average: number;
    count: number;
  };
  product_count?: number;
  is_verified?: boolean;
  category?: string;
  owner_id?: string;
  latitude?: number | null;
  longitude?: number | null;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  email?: string;
  website?: string;
}
