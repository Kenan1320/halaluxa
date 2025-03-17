
export interface Shop {
  id: string;
  name: string;
  description: string;
  location: string;
  address?: string;
  logo_url: string;
  cover_image?: string;
  owner_id: string;
  is_verified?: boolean;
  category: string;
  rating?: number;
  product_count?: number;
  created_at: string;
  updated_at: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
  logo?: string;
  // Additional fields
  phone?: string;
  email?: string;
  website?: string;
  is_featured?: boolean;
  status?: 'pending' | 'approved' | 'rejected' | 'suspended';
}

export interface ShopDetails extends Omit<Shop, 'rating'> {
  products: number;
  followers: number;
  reviews: number;
  rating: { average: number; count: number };
  categories?: string[];
  deliveryInfo: {
    fee: number;
    minOrder: number;
    estimatedTime: string;
  };
  isGroupOrderEnabled: boolean;
}

export type ShopCategory = {
  id: string;
  name: string;
  icon?: string;
  count?: number;
};

export type Category = {
  id: string;
  name: string;
  slug?: string;
  icon?: string;
  parent_id?: string | null;
  created_at: string;
  updated_at: string;
  group?: 'featured' | 'nearby' | 'online' | 'popular' | 'transitional';
};

export type FeaturedShop = {
  id: string;
  name: string;
  logo_url?: string;
  cover_image?: string;
  category: string;
  rating?: number;
  distance?: string;
  is_favorite?: boolean;
};

export type UserShopPreference = {
  user_id: string;
  shop_id: string;
  is_favorite: boolean;
  last_visited?: string;
  created_at: string;
  updated_at: string;
};

// Admin specific types
export type AdminRole = 'admin' | 'support' | 'moderator' | 'viewer';

export interface AdminPermission {
  id: string;
  role: AdminRole;
  can_create: boolean;
  can_read: boolean;
  can_update: boolean;
  can_delete: boolean;
  resource: 'shops' | 'products' | 'users' | 'orders' | 'settings';
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  user_id: string;
  role: AdminRole;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface AuditLog {
  id: string;
  admin_id: string;
  action: string;
  resource: string;
  resource_id: string;
  details: any;
  ip_address?: string;
  created_at: string;
}
