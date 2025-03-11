
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
    iconSrc: '/lovable-uploads/1cacc804-a9e3-4e24-b114-6930d4963108.png',
    description: 'Find halal restaurants near you'
  },
  {
    id: 2,
    name: 'halal-meat',
    displayName: 'Halal Butcher Shops',
    type: 'local',
    iconSrc: '/lovable-uploads/23693524-531d-460f-80d6-4d7de692e370.png',
    description: 'Quality halal meat from verified butchers'
  },
  {
    id: 3,
    name: 'groceries',
    displayName: 'Local Halal Grocery Stores',
    type: 'local',
    iconSrc: '/lovable-uploads/33c78847-ecc3-4104-94db-d11f6dc381ba.png',
    description: 'Halal grocery stores in your area'
  },
  {
    id: 4,
    name: 'muslim-therapists',
    displayName: 'Muslim Therapists',
    type: 'local',
    iconSrc: '/lovable-uploads/110fd78a-d0e3-439f-bf36-08c57789f6bc.png',
    description: 'Muslim therapists, teachers and professionals coming soon'
  },
  
  // Transitioning Categories (Could be local or online)
  {
    id: 5,
    name: 'furniture',
    displayName: 'Home & Furniture Stores',
    type: 'transitioning',
    iconSrc: '/lovable-uploads/120cad29-44ae-4e22-993b-a0daff7febfc.png',
    description: 'Islamic-friendly home and furniture stores'
  },
  {
    id: 6,
    name: 'decorations',
    displayName: 'Islamic Home Decor & Accessories',
    type: 'transitioning',
    iconSrc: '/lovable-uploads/23693524-531d-460f-80d6-4d7de692e370.png',
    description: 'Beautiful Islamic home decor and accessories'
  },
  {
    id: 7,
    name: 'arabic-calligraphy',
    displayName: 'Islamic Art & Calligraphy Services',
    type: 'transitioning',
    iconSrc: '/lovable-uploads/7a395f81-98c5-43f0-9d9a-e34f43f4b8e2.png',
    description: 'Islamic art and Arabic calligraphy services'
  },
  {
    id: 8,
    name: 'gifts',
    displayName: 'Islamic Gifts & Specialty Shops',
    type: 'transitioning',
    iconSrc: '/lovable-uploads/fe0ca085-0369-4993-b487-558642d13fab.png',
    description: 'Unique Islamic gifts for all occasions'
  },
  
  // Online Categories
  {
    id: 9,
    name: 'online-shops',
    displayName: 'Halvi Marketplace',
    type: 'online',
    iconSrc: '/lovable-uploads/c397d648-1149-461e-bc2e-6b91d6c4df2e.png',
    description: 'Shop from our online marketplace'
  },
  {
    id: 10,
    name: 'arabic-language',
    displayName: 'Learn Arabic',
    type: 'online',
    iconSrc: '/lovable-uploads/564e654a-06d8-4254-b96b-61e59c789090.png',
    description: 'Resources to learn Arabic language'
  },
  {
    id: 11,
    name: 'hijab',
    displayName: 'Modest Wear - Hijabs',
    type: 'online',
    iconSrc: '/lovable-uploads/563c4e3d-44f6-4fe3-8d2d-e635e59a42ee.png',
    description: 'Beautiful hijabs and modest wear'
  },
  {
    id: 12,
    name: 'abaya',
    displayName: 'Modest Wear - Abayas & Dresses',
    type: 'online',
    iconSrc: '/lovable-uploads/b51a5653-fc5d-40c3-b440-f4857e0d941a.png',
    description: 'Elegant abayas and modest dresses'
  },
  {
    id: 13,
    name: 'thobes',
    displayName: 'Men\'s Islamic Wear - Thobes & Jubbas',
    type: 'online',
    iconSrc: '/lovable-uploads/92014177-37c2-49a1-b293-a6b6a00bb42c.png',
    description: 'Quality thobes and jubbas for men'
  },
  {
    id: 14,
    name: 'books',
    displayName: 'Islamic Books & more',
    type: 'online',
    iconSrc: '/lovable-uploads/b4faff98-b80c-4dda-896d-194d042d2c94.png',
    description: 'Islamic literature, educational books and more'
  }
];

export const getCategoryById = (id: number): Category | undefined => {
  return categories.find(category => category.id === id);
};

export const getCategoryByName = (name: string): Category | undefined => {
  return categories.find(category => category.name === name);
};
