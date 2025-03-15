
import { Product, ProductFilter, ProductResponse } from '@/models/product';
import { supabase } from '@/integrations/supabase/client';
import { normalizeProduct } from '@/lib/normalizeData';

// Mock product data for development until database is fully set up
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Organic Halal Chicken',
    description: 'Locally sourced organic halal chicken',
    price: 12.99,
    category: 'Meat',
    shop_id: 'shop1',
    seller_id: 'seller1',
    seller_name: 'Halal Farms',
    images: ['/lovable-uploads/8d386384-3944-48e3-922c-2edb81fa1631.png'],
    is_halal_certified: true,
    in_stock: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    rating: 4.5,
    details: { weight: '1kg', origin: 'Local' },
    stock: 25,
    is_published: true,
    long_description: 'Premium quality organic halal chicken raised without antibiotics and with care for animal welfare.',
    delivery_mode: 'pickup',
    pickup_options: { store: true, curbside: false }
  },
  {
    id: '2',
    name: 'Halal Beef Cuts',
    description: 'Premium halal beef cuts',
    price: 18.99,
    category: 'Meat',
    shop_id: 'shop1',
    seller_id: 'seller1',
    seller_name: 'Halal Farms',
    images: ['/lovable-uploads/756f142d-1390-4a6b-8968-d373b1969765.png'],
    is_halal_certified: true,
    in_stock: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    rating: 4.8,
    details: { weight: '1.5kg', origin: 'Australia' },
    stock: 15,
    is_published: true,
    long_description: 'Premium quality halal beef from grass-fed cows, processed according to Islamic standards.',
    delivery_mode: 'both',
    pickup_options: { store: true, curbside: true }
  }
];

// Function to search products with filtering
export const searchProducts = async (searchTerm: string, filter?: ProductFilter): Promise<ProductResponse> => {
  try {
    // In a real app, we would query Supabase here
    // For now, use mock data filtered by search term
    const filteredProducts = mockProducts.filter(product => {
      const searchLower = searchTerm.toLowerCase();
      return (
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
      );
    });

    // Fix the deep type instantiation by simplifying the return type:
    const response: ProductResponse = {
      data: filteredProducts,
      error: null,
      filter: (predicate) => (filteredProducts || []).filter(predicate)
    };
    return response;
  } catch (error) {
    console.error('Error searching products:', error);
    return {
      data: [],
      error: 'Failed to search products',
      filter: (predicate) => [].filter(predicate)
    };
  }
};

// Get product by ID
export const getProductById = async (id: string): Promise<Product | undefined> => {
  try {
    // For development, return a mock product
    return mockProducts.find(product => product.id === id);
  } catch (error) {
    console.error('Error fetching product:', error);
    return undefined;
  }
};

// Get multiple products with optional filtering
export const getProducts = async (filter?: ProductFilter): Promise<ProductResponse> => {
  try {
    let filteredProducts = [...mockProducts];
    
    if (filter) {
      if (filter.shop_id) {
        filteredProducts = filteredProducts.filter(p => p.shop_id === filter.shop_id);
      }
      if (filter.category) {
        filteredProducts = filteredProducts.filter(p => p.category === filter.category);
      }
      if (filter.seller_id) {
        filteredProducts = filteredProducts.filter(p => p.seller_id === filter.seller_id);
      }
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
        );
      }
    }
    
    return {
      data: filteredProducts,
      error: null,
      filter: (predicate) => (filteredProducts || []).filter(predicate)
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      data: [],
      error: 'Failed to fetch products',
      filter: (predicate) => [].filter(predicate)
    };
  }
};
