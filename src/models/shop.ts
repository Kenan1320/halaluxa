
export interface Shop {
  id: string;
  name: string;
  description: string;
  category: string;
  location?: string;
  logo?: string;
  ownerId: string;
  rating?: number;
  reviewCount?: number;
  productCount?: number;
  featured?: boolean;
  distance?: number;
  createdAt?: string;
  updatedAt?: string;
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
