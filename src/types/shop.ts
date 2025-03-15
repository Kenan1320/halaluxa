export interface ShopDetails {
  id: string;
  name: string;
  description: string;
  location: string;
  categories: ShopCategory[];
  cover_image?: string;
  logo?: string;
  deliveryInfo: {
    isDeliveryAvailable: boolean;
    isPickupAvailable: boolean;
    deliveryFee: number;
    estimatedTime: string;
    minOrder: number;
  };
  workingHours: {
    open: string;
    close: string;
  };
  isGroupOrderEnabled: boolean;
  rating: {
    average: number;
    count: number;
  };
  product_count: number;
  is_verified: boolean;
  category: string;
  owner_id: string;
  latitude?: number | null;
  longitude?: number | null;
  distance?: number | null;
}

export interface ShopCategory {
  id: string;
  name: string;
  products: any[];
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  slug?: string;
  parent_id?: string;
  created_at?: string;
  updated_at?: string;
}
