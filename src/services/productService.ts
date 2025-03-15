
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
    delivery_mode: 'pickup',
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

// For dashboard functionality
export const createProduct = async (product: Partial<Product>): Promise<Product | null> => {
  try {
    const newProduct: Product = {
      id: `prod_${Date.now()}`,
      name: product.name || 'Untitled Product',
      description: product.description || '',
      price: product.price || 0,
      category: product.category || 'Uncategorized',
      shop_id: product.shop_id || '',
      seller_id: product.seller_id || '',
      seller_name: product.seller_name || '',
      images: product.images || [],
      is_halal_certified: product.is_halal_certified || false,
      in_stock: product.in_stock !== undefined ? product.in_stock : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      rating: product.rating || 0,
      details: product.details || {},
      stock: product.stock || 0,
      is_published: product.is_published !== undefined ? product.is_published : false,
      long_description: product.long_description || '',
      delivery_mode: product.delivery_mode || 'pickup',
      pickup_options: product.pickup_options || { store: true, curbside: false }
    };
    
    // In a real app, we would save to Supabase
    mockProducts.push(newProduct);
    
    return newProduct;
  } catch (error) {
    console.error('Error creating product:', error);
    return null;
  }
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product | null> => {
  try {
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    mockProducts[index] = {
      ...mockProducts[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    return mockProducts[index];
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    mockProducts.splice(index, 1);
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    // For now, just return the first few products
    return mockProducts.slice(0, 4);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
};
