
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  createdAt: string;
  isHalalCertified: boolean;
  sellerId: string;
}

// Mock products data
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Organic Halal Chicken',
    description: 'Fresh, organic, and halal-certified chicken',
    price: 12.99,
    stock: 50,
    category: 'Food',
    image: '/lovable-uploads/0c423741-0711-4e97-8c56-ca4fe31dc6ca.png',
    createdAt: '2023-06-15T08:00:00Z',
    isHalalCertified: true,
    sellerId: 'seller-1'
  },
  {
    id: '2',
    name: 'Modest Hijab - Navy Blue',
    description: 'Comfortable, breathable fabric with elegant design',
    price: 24.99,
    stock: 100,
    category: 'Clothing',
    image: '/lovable-uploads/26c50a86-ec95-4072-8f0c-ac930a65b34d.png',
    createdAt: '2023-05-20T10:30:00Z',
    isHalalCertified: true,
    sellerId: 'seller-1'
  },
  {
    id: '3',
    name: 'Natural Rose Water Face Toner',
    description: 'Alcohol-free facial toner made with pure rose water',
    price: 18.50,
    stock: 75,
    category: 'Beauty',
    image: '/lovable-uploads/9c75ca26-bc1a-4718-84bb-67d7f2337b30.png',
    createdAt: '2023-07-01T14:15:00Z',
    isHalalCertified: true,
    sellerId: 'seller-1'
  },
  {
    id: '4',
    name: 'Decorative Arabic Calligraphy Frame',
    description: 'Hand-crafted wooden frame with intricate Arabic calligraphy',
    price: 39.99,
    stock: 30,
    category: 'Home',
    image: '/lovable-uploads/d8db1529-74b3-4d86-b64a-f0c8b0f92c5c.png',
    createdAt: '2023-04-12T09:45:00Z',
    isHalalCertified: true,
    sellerId: 'seller-1'
  }
];
