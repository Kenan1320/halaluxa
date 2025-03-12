
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

export interface ShopDetails {
  id: string;
  name: string;
  description: string;
  location: string;
  categories: ShopCategory[];
  coverImage?: string;
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
  // Additional properties needed for compatibility
  productCount?: number;
  isVerified?: boolean;
  category?: string;
  ownerId?: string;
  latitude?: number | null;
  longitude?: number | null;
  distance?: number | null;
  // Add missing properties used in ShopHeader
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  email?: string;
  website?: string;
}
