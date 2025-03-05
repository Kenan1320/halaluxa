
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string[]; // Changed from single image to array of images
  createdAt: string;
  isHalalCertified: boolean;
  sellerId: string;
  details?: {
    [key: string]: string;
  };
}

// Updated mock products data with multiple images
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Organic Halal Chicken',
    description: 'Fresh, organic, and halal-certified chicken from trusted farms. Perfect for family meals.',
    price: 12.99,
    stock: 50,
    category: 'Food',
    images: [
      '/lovable-uploads/0c423741-0711-4e97-8c56-ca4fe31dc6ca.png',
      '/lovable-uploads/8d386384-3944-48e3-922c-2edb81fa1631.png'
    ],
    createdAt: '2023-06-15T08:00:00Z',
    isHalalCertified: true,
    sellerId: 'seller-1',
    details: {
      'Weight': '1kg',
      'Origin': 'Local Farm',
      'Storage': 'Keep refrigerated'
    }
  },
  {
    id: '2',
    name: 'Modest Hijab - Navy Blue',
    description: 'Comfortable, breathable fabric with elegant design. Perfect for everyday wear.',
    price: 24.99,
    stock: 100,
    category: 'Clothing',
    images: [
      '/lovable-uploads/26c50a86-ec95-4072-8f0c-ac930a65b34d.png',
      '/lovable-uploads/d4ab324c-23f0-4fcc-9069-0afbc77d1c3e.png'
    ],
    createdAt: '2023-05-20T10:30:00Z',
    isHalalCertified: true,
    sellerId: 'seller-1',
    details: {
      'Material': '100% Cotton',
      'Size': 'One Size',
      'Care': 'Machine washable'
    }
  },
  {
    id: '3',
    name: 'Natural Rose Water Face Toner',
    description: 'Alcohol-free facial toner made with pure rose water. Refreshes and hydrates skin.',
    price: 18.50,
    stock: 75,
    category: 'Beauty',
    images: [
      '/lovable-uploads/9c75ca26-bc1a-4718-84bb-67d7f2337b30.png'
    ],
    createdAt: '2023-07-01T14:15:00Z',
    isHalalCertified: true,
    sellerId: 'seller-1',
    details: {
      'Volume': '200ml',
      'Ingredients': 'Rose water, Aloe Vera, Vitamin E',
      'Skin Type': 'All skin types'
    }
  },
  {
    id: '4',
    name: 'Decorative Arabic Calligraphy Frame',
    description: 'Hand-crafted wooden frame with intricate Arabic calligraphy. Perfect for home decor.',
    price: 39.99,
    stock: 30,
    category: 'Home',
    images: [
      '/lovable-uploads/d8db1529-74b3-4d86-b64a-f0c8b0f92c5c.png',
      '/lovable-uploads/0780684a-9c7f-4f32-affc-6f9ea641b814.png'
    ],
    createdAt: '2023-04-12T09:45:00Z',
    isHalalCertified: true,
    sellerId: 'seller-1',
    details: {
      'Dimensions': '30cm x 20cm',
      'Material': 'Walnut Wood',
      'Hanging': 'Wall mountable'
    }
  }
];

// All available product categories
export const productCategories = [
  'Food', 
  'Clothing', 
  'Beauty', 
  'Home', 
  'Books', 
  'Electronics', 
  'Toys', 
  'Health', 
  'Sports'
];
