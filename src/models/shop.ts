
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
