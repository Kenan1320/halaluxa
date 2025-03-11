
// Shop model interfaces
export interface Shop {
  id: string;
  name: string;
  description: string;
  location: string;
  rating: number;
  productCount: number;
  isVerified: boolean;
  category: string;
  logo: string | null;
  coverImage: string | null;
  ownerId: string;
  latitude: number | null;
  longitude: number | null;
  distance: number | null;
}

export interface ShopProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string; 
  images: string[];
  sellerId: string;
  sellerName: string;
  rating: number;
}

export interface ShopLocation {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface ShopDisplaySettings {
  id: string;
  shopId: string;
  primaryColor: string | null;
  secondaryColor: string | null;
  fontFamily: string | null;
  showRatings: boolean;
  showProductCount: boolean;
  featuredProducts: string[] | null;
  bannerMessage: string | null;
  created_at: string;
}

// Category mapping for consistent naming across the application
export const shopCategories = [
  'Local Halal Restaurants',
  'Halal Butcher Shops',
  'Local Halal Grocery Stores',
  'Halal Wellness & Therapy Centers',
  'Home & Furniture Stores',
  'Islamic Home Decor & Accessories',
  'Islamic Art & Calligraphy Services',
  'Islamic Gifts & Specialty Shops',
  'Halvi Marketplace',
  'Learn Arabic',
  'Modest Wear - Hijabs',
  'Modest Wear - Abayas & Dresses',
  'Men\'s Islamic Wear - Thobes & Jubbas',
  'Islamic Books & more',
];

// Category icon mapping
export const getCategoryIcon = (category: string): string => {
  switch (category) {
    case 'Local Halal Restaurants':
      return '/lovable-uploads/33473605-0fc6-42cb-b43f-611ca39e7974.png';
    case 'Halal Butcher Shops':
      return '/lovable-uploads/f6d6f4f3-7512-4062-a680-623cc1fedbeb.png';
    case 'Local Halal Grocery Stores':
      return '/lovable-uploads/945fdb0b-0a69-4959-8bbd-7e04b4d2c302.png';
    case 'Halal Wellness & Therapy Centers':
      return '/lovable-uploads/afa25d90-d483-4dc6-869f-7ae45dc603c1.png';
    case 'Home & Furniture Stores':
      return '/lovable-uploads/7dc19b16-ff98-421a-b0eb-0a361c1d2b71.png';
    case 'Islamic Home Decor & Accessories':
      return '/lovable-uploads/ce21c020-0b24-44ca-b4ae-d65aeb2c1521.png';
    case 'Islamic Art & Calligraphy Services':
      return '/lovable-uploads/1965192d-c719-48ca-bdc0-a04304367fa1.png';
    case 'Islamic Gifts & Specialty Shops':
      return '/lovable-uploads/4405a5c7-2649-47d1-b9c6-23aed24cbd78.png';
    case 'Halvi Marketplace':
      return '/lovable-uploads/90ba1157-a6f3-48db-a573-42025b1b9b8f.png';
    case 'Learn Arabic':
      return '/lovable-uploads/c37a7b51-ecf8-41f5-80b4-ce2b04638ccf.png';
    case 'Modest Wear - Hijabs':
      return '/lovable-uploads/8273b5a9-f0c1-42f0-9379-3066df673278.png';
    case 'Modest Wear - Abayas & Dresses':
      return '/lovable-uploads/b715b790-ea10-4ff3-8580-ebe7a7170ee4.png';
    case 'Men\'s Islamic Wear - Thobes & Jubbas':
      return '/lovable-uploads/42d710d1-d270-40bf-8c4a-7c152adaad99.png';
    case 'Islamic Books & more':
      return '/lovable-uploads/b7391005-ab3c-4698-85d5-1192b4fc4df6.png';
    default:
      return '/lovable-uploads/90ba1157-a6f3-48db-a573-42025b1b9b8f.png'; // Default to marketplace icon
  }
};
