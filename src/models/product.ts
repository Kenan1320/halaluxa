export interface Product {
  id: string;
  name: string;
  description: string;
  long_description?: string;
  price: number;
  stock: number;
  category: string;
  images: string[]; 
  created_at: string;
  is_halal_certified: boolean;
  seller_id: string;
  seller_name?: string;
  rating?: number;
  details?: {
    [key: string]: string;
  };
  
  get longDescription(): string | undefined {
    return this.long_description;
  }
  
  get isHalalCertified(): boolean {
    return this.is_halal_certified;
  }
  
  get sellerId(): string {
    return this.seller_id;
  }
  
  get sellerName(): string | undefined {
    return this.seller_name;
  }
  
  get createdAt(): string {
    return this.created_at;
  }
}

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Organic Halal Chicken',
    description: 'Fresh, organic, and halal-certified chicken from trusted farms. Perfect for family meals.',
    long_description: `<p>Our Organic Halal Chicken is sourced from free-range farms where chickens are raised in a natural environment without antibiotics or hormones. The chickens are fed a natural diet and are processed according to strict Halal guidelines.</p>
    <p>This premium quality chicken is perfect for a variety of dishes, from traditional curries to modern fusion cuisine. The meat is tender, juicy, and full of flavor.</p>
    <h4>Why Choose Our Organic Halal Chicken:</h4>
    <ul>
      <li>100% Halal certified</li>
      <li>Organic and free-range</li>
      <li>No antibiotics or hormones</li>
      <li>Ethically raised and processed</li>
      <li>Superior taste and quality</li>
    </ul>`,
    price: 12.99,
    stock: 50,
    category: 'Food',
    images: [
      '/lovable-uploads/0c423741-0711-4e97-8c56-ca4fe31dc6ca.png',
      '/lovable-uploads/8d386384-3944-48e3-922c-2edb81fa1631.png'
    ],
    created_at: '2023-06-15T08:00:00Z',
    is_halal_certified: true,
    seller_id: 'seller-1',
    seller_name: 'Baraka Groceries',
    rating: 4.8,
    details: {
      'Weight': '1kg',
      'Origin': 'Local Farm',
      'Storage': 'Keep refrigerated'
    },
    get longDescription() { return this.long_description; },
    get isHalalCertified() { return this.is_halal_certified; },
    get sellerId() { return this.seller_id; },
    get sellerName() { return this.seller_name; },
    get createdAt() { return this.created_at; }
  },
  {
    id: '2',
    name: 'Modest Hijab - Navy Blue',
    description: 'Comfortable, breathable fabric with elegant design. Perfect for everyday wear.',
    long_description: `<p>Our Navy Blue Modest Hijab is designed for comfort and style. Made from premium cotton blend fabric, it drapes beautifully and stays in place throughout the day.</p>
    <p>The elegant design makes it versatile for both everyday wear and special occasions. The breathable material ensures comfort in all seasons.</p>
    <h4>Features:</h4>
    <ul>
      <li>Premium cotton blend fabric</li>
      <li>Elegant finish and design</li>
      <li>Versatile for all occasions</li>
      <li>Easy to style</li>
      <li>Durable and long-lasting</li>
    </ul>`,
    price: 24.99,
    stock: 100,
    category: 'Clothing',
    images: [
      '/lovable-uploads/26c50a86-ec95-4072-8f0c-ac930a65b34d.png',
      '/lovable-uploads/d4ab324c-23f0-4fcc-9069-0afbc77d1c3e.png'
    ],
    created_at: '2023-05-20T10:30:00Z',
    is_halal_certified: true,
    seller_id: 'seller-2',
    seller_name: 'Modest Elegance',
    rating: 5.0,
    details: {
      'Material': '100% Cotton',
      'Size': 'One Size',
      'Care': 'Machine washable'
    },
    get longDescription() { return this.long_description; },
    get isHalalCertified() { return this.is_halal_certified; },
    get sellerId() { return this.seller_id; },
    get sellerName() { return this.seller_name; },
    get createdAt() { return this.created_at; }
  },
  {
    id: '3',
    name: 'Natural Rose Water Face Toner',
    description: 'Alcohol-free facial toner made with pure rose water. Refreshes and hydrates skin.',
    long_description: `<p>Our Natural Rose Water Face Toner is made from 100% pure rose water, distilled from fresh Damascus roses. This alcohol-free toner is perfect for all skin types, especially sensitive skin.</p>
    <p>Use daily to refresh, hydrate, and balance your skin's pH levels. The natural properties of rose water help to soothe irritation and reduce redness, giving you a healthy, natural glow.</p>
    <h4>Benefits:</h4>
    <ul>
      <li>Hydrates and refreshes skin</li>
      <li>Soothes irritation and reduces redness</li>
      <li>Balances skin's pH levels</li>
      <li>Alcohol-free and gentle</li>
      <li>Suitable for all skin types</li>
    </ul>`,
    price: 18.50,
    stock: 75,
    category: 'Beauty',
    images: [
      '/lovable-uploads/9c75ca26-bc1a-4718-84bb-67d7f2337b30.png'
    ],
    created_at: '2023-07-01T14:15:00Z',
    is_halal_certified: true,
    seller_id: 'seller-3',
    seller_name: 'Natural Beauty',
    rating: 4.7,
    details: {
      'Volume': '200ml',
      'Ingredients': 'Rose water, Aloe Vera, Vitamin E',
      'Skin Type': 'All skin types'
    },
    get longDescription() { return this.long_description; },
    get isHalalCertified() { return this.is_halal_certified; },
    get sellerId() { return this.seller_id; },
    get sellerName() { return this.seller_name; },
    get createdAt() { return this.created_at; }
  },
  {
    id: '4',
    name: 'Decorative Arabic Calligraphy Frame',
    description: 'Hand-crafted wooden frame with intricate Arabic calligraphy. Perfect for home decor.',
    long_description: `<p>Our Decorative Arabic Calligraphy Frame features intricate hand-crafted calligraphy in a beautiful walnut wood frame. Each piece is unique and made by skilled artisans who have perfected their craft over generations.</p>
    <p>The calligraphy features verses from the Quran, adding spiritual significance to this beautiful decorative piece. The frame comes ready to hang, making it perfect for your living room, study, or as a thoughtful gift.</p>
    <h4>Details:</h4>
    <ul>
      <li>Hand-crafted by skilled artisans</li>
      <li>Premium walnut wood frame</li>
      <li>Intricate Arabic calligraphy</li>
      <li>Ready to hang</li>
      <li>Unique piece - no two are exactly alike</li>
    </ul>`,
    price: 39.99,
    stock: 30,
    category: 'Home',
    images: [
      '/lovable-uploads/d8db1529-74b3-4d86-b64a-f0c8b0f92c5c.png',
      '/lovable-uploads/0780684a-9c7f-4f32-affc-6f9ea641b814.png'
    ],
    created_at: '2023-04-12T09:45:00Z',
    is_halal_certified: true,
    seller_id: 'seller-4',
    seller_name: 'Islamic Treasures',
    rating: 4.9,
    details: {
      'Dimensions': '30cm x 20cm',
      'Material': 'Walnut Wood',
      'Hanging': 'Wall mountable'
    },
    get longDescription() { return this.long_description; },
    get isHalalCertified() { return this.is_halal_certified; },
    get sellerId() { return this.seller_id; },
    get sellerName() { return this.seller_name; },
    get createdAt() { return this.created_at; }
  }
];

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
