
import { ReactNode } from 'react';

export interface Category {
  id: number;
  name: string;
  displayName: string;
  type: 'local' | 'transitioning' | 'online';
  iconSrc: string;
  description: string;
}

export const categories: Category[] = [
  // Local Categories
  {
    id: 1,
    name: 'restaurant',
    displayName: 'Local Halal Restaurants',
    type: 'local',
    iconSrc: '/lovable-uploads/030fad52-a3a1-41aa-ad2f-bef06cca8b68.png',
    description: 'Find halal restaurants near you'
  },
  {
    id: 2,
    name: 'halal-meat',
    displayName: 'Halal Butcher Shops',
    type: 'local',
    iconSrc: '/lovable-uploads/f4af6440-e335-4b84-a616-d6076b00b7a5.png',
    description: 'Quality halal meat from verified butchers'
  },
  {
    id: 3,
    name: 'groceries',
    displayName: 'Local Halal Grocery Stores',
    type: 'local',
    iconSrc: '/lovable-uploads/13439860-51af-441a-a5bf-bec747927146.png',
    description: 'Halal grocery stores in your area'
  },
  {
    id: 4,
    name: 'muslim-therapists',
    displayName: 'Muslim Therapists',
    type: 'local',
    iconSrc: '/lovable-uploads/bf6c8a77-55e8-4047-846f-a891c184f740.png',
    description: 'Muslim therapists, teachers and professionals coming soon'
  },
  
  // Transitioning Categories (Could be local or online)
  {
    id: 5,
    name: 'furniture',
    displayName: 'Home & Furniture Stores',
    type: 'transitioning',
    iconSrc: '/lovable-uploads/77c7f922-bc4a-4ceb-955a-52106829f38b.png',
    description: 'Islamic-friendly home and furniture stores'
  },
  {
    id: 6,
    name: 'decorations',
    displayName: 'Islamic Home Decor & Accessories',
    type: 'transitioning',
    iconSrc: '/lovable-uploads/2d27dc3c-5fab-43d0-bf50-b52095a1f8b8.png',
    description: 'Beautiful Islamic home decor and accessories'
  },
  {
    id: 7,
    name: 'arabic-calligraphy',
    displayName: 'Islamic Art & Calligraphy Services',
    type: 'transitioning',
    iconSrc: '/lovable-uploads/d8a11f52-cfe0-454a-98fa-6125e46054c4.png',
    description: 'Islamic art and Arabic calligraphy services'
  },
  {
    id: 8,
    name: 'gifts',
    displayName: 'Islamic Gifts & Specialty Shops',
    type: 'transitioning',
    iconSrc: '/lovable-uploads/cb245189-19e4-46c1-906f-e0e4eb7cfc06.png',
    description: 'Unique Islamic gifts for all occasions'
  },
  
  // Online Categories
  {
    id: 9,
    name: 'online-shops',
    displayName: 'Halvi Marketplace',
    type: 'online',
    iconSrc: '/lovable-uploads/06d6d3d3-6ab3-4bb4-95fc-749de937edb6.png',
    description: 'Shop from our online marketplace'
  },
  {
    id: 10,
    name: 'arabic-language',
    displayName: 'Learn Arabic',
    type: 'online',
    iconSrc: '/lovable-uploads/29db70bb-32e7-4611-b8b1-938ad8336665.png',
    description: 'Resources to learn Arabic language'
  },
  {
    id: 11,
    name: 'hijab',
    displayName: 'Modest Wear - Hijabs',
    type: 'online',
    iconSrc: '/lovable-uploads/ba3d2108-c51f-4276-b3a8-db34422c4c58.png',
    description: 'Beautiful hijabs and modest wear'
  },
  {
    id: 12,
    name: 'abaya',
    displayName: 'Modest Wear - Abayas & Dresses',
    type: 'online',
    iconSrc: '/lovable-uploads/b22c451d-63cb-4f96-854a-ffe5bd42587c.png',
    description: 'Elegant abayas and modest dresses'
  },
  {
    id: 13,
    name: 'thobes',
    displayName: 'Men\'s Islamic Wear - Thobes & Jubbas',
    type: 'online',
    iconSrc: '/lovable-uploads/5f9fc0dd-c3e7-4777-9ed2-a394922b7cc7.png',
    description: 'Quality thobes and jubbas for men'
  },
  {
    id: 14,
    name: 'books',
    displayName: 'Islamic Books & more',
    type: 'online',
    iconSrc: '/lovable-uploads/ry8',
    description: 'Islamic literature, educational books and more'
  }
];

export const getCategoryById = (id: number): Category | undefined => {
  return categories.find(category => category.id === id);
};

export const getCategoryByName = (name: string): Category | undefined => {
  return categories.find(category => category.name === name);
};
