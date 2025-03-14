
import { UUID, Timestamp } from './types';

export type UserRole = 'shopper' | 'business' | 'admin';

export interface User {
  id: UUID;
  email: string;
  name: string;
  role: UserRole;
  avatar: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  shopName?: string;
  shopDescription?: string;
  shopCategory?: string;
  shopLocation?: string;
  shopLogo?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface UserProfile {
  id: UUID;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  role: UserRole;
  avatar_url: string;
  created_at: Timestamp;
  updated_at: Timestamp;
  shop_name?: string;
  shop_description?: string;
  shop_category?: string;
  shop_location?: string;
  shop_logo?: string;
}

export interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  updateUser: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  updateUserProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>;
}

// Adapter functions
export const adaptDbUserProfileToUser = (dbProfile: any): User => {
  return {
    id: dbProfile.id,
    email: dbProfile.email || '',
    name: dbProfile.name || '',
    role: dbProfile.role || 'shopper',
    avatar: dbProfile.avatar_url || '',
    phone: dbProfile.phone || '',
    address: dbProfile.address || '',
    city: dbProfile.city || '',
    state: dbProfile.state || '',
    zip: dbProfile.zip || '',
    shopName: dbProfile.shop_name,
    shopDescription: dbProfile.shop_description,
    shopCategory: dbProfile.shop_category,
    shopLocation: dbProfile.shop_location,
    shopLogo: dbProfile.shop_logo,
    createdAt: dbProfile.created_at,
    updatedAt: dbProfile.updated_at
  };
};

export const adaptUserToDbProfile = (user: Partial<User>): any => {
  const dbUser: any = {};
  
  if (user.name !== undefined) dbUser.name = user.name;
  if (user.email !== undefined) dbUser.email = user.email;
  if (user.role !== undefined) dbUser.role = user.role;
  if (user.avatar !== undefined) dbUser.avatar_url = user.avatar;
  if (user.phone !== undefined) dbUser.phone = user.phone;
  if (user.address !== undefined) dbUser.address = user.address;
  if (user.city !== undefined) dbUser.city = user.city;
  if (user.state !== undefined) dbUser.state = user.state;
  if (user.zip !== undefined) dbUser.zip = user.zip;
  if (user.shopName !== undefined) dbUser.shop_name = user.shopName;
  if (user.shopDescription !== undefined) dbUser.shop_description = user.shopDescription;
  if (user.shopCategory !== undefined) dbUser.shop_category = user.shopCategory;
  if (user.shopLocation !== undefined) dbUser.shop_location = user.shopLocation;
  if (user.shopLogo !== undefined) dbUser.shop_logo = user.shopLogo;
  
  dbUser.updated_at = new Date().toISOString();
  
  return dbUser;
};
