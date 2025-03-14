
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'shopper' | 'business' | 'admin';
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
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  role: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
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
