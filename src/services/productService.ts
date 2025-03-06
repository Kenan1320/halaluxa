
import { Product, mockProducts } from '@/models/product';
import { mockShops } from '@/services/shopService';

// Cache mechanism for products
let cachedProducts = null;
let lastFetchTime = 0;
const CACHE_DURATION = 1000; // 1 second cache duration

// Get products from localStorage or use the mock products
export const getProducts = (): Product[] => {
  const currentTime = Date.now();
  
  // Use cache if it's recent enough
  if (cachedProducts && currentTime - lastFetchTime < CACHE_DURATION) {
    return cachedProducts;
  }
  
  try {
    const storedProducts = localStorage.getItem('products');
    let customProducts = [];
    
    if (storedProducts) {
      customProducts = JSON.parse(storedProducts);
    }
    
    // Ensure all products have seller information
    const allProducts = [...mockProducts, ...customProducts].map(product => {
      const shopData = mockShops.find(shop => shop.id === product.sellerId);
      
      return {
        ...product,
        sellerName: product.sellerName || (shopData ? shopData.name : "Haluna Seller")
      };
    });
    
    // Update cache
    cachedProducts = allProducts;
    lastFetchTime = currentTime;
    
    return allProducts;
  } catch (error) {
    console.error('Failed to load products:', error);
    return mockProducts;
  }
};

// Invalidate the product cache to force fresh data
export const invalidateProductCache = () => {
  cachedProducts = null;
  lastFetchTime = 0;
};

// Save a new product
export const saveProduct = (product: Omit<Product, 'id' | 'createdAt'>): Product => {
  try {
    const products = getProducts().filter(p => !mockProducts.some(mp => mp.id === p.id));
    
    const newProduct: Product = {
      ...product,
      id: `product-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    const updatedProducts = [...products, newProduct];
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    
    // Invalidate cache to ensure fresh data
    invalidateProductCache();
    
    return newProduct;
  } catch (error) {
    console.error('Failed to save product:', error);
    throw new Error('Failed to save product');
  }
};

// Update an existing product
export const updateProduct = (product: Product): Product => {
  try {
    const products = getProducts().filter(p => !mockProducts.some(mp => mp.id === p.id));
    const updatedProducts = products.map(p => 
      p.id === product.id ? product : p
    );
    
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    
    // Invalidate cache to ensure fresh data
    invalidateProductCache();
    
    return product;
  } catch (error) {
    console.error('Failed to update product:', error);
    throw new Error('Failed to update product');
  }
};

// Delete a product
export const deleteProduct = (productId: string): void => {
  try {
    const products = getProducts().filter(p => !mockProducts.some(mp => mp.id === p.id));
    const updatedProducts = products.filter(p => p.id !== productId);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    
    // Invalidate cache to ensure fresh data
    invalidateProductCache();
  } catch (error) {
    console.error('Failed to delete product:', error);
    throw new Error('Failed to delete product');
  }
};

// Get a product by ID
export const getProductById = (productId: string): Product | undefined => {
  try {
    // First try to find it in mock products
    const mockProduct = mockProducts.find(p => p.id === productId);
    if (mockProduct) {
      const shopData = mockShops.find(shop => shop.id === mockProduct.sellerId);
      return {
        ...mockProduct,
        sellerName: mockProduct.sellerName || (shopData ? shopData.name : "Haluna Seller")
      };
    }
    
    // Then look in localStorage
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      const products = JSON.parse(storedProducts);
      const product = products.find(p => p.id === productId);
      
      if (product) {
        // Add seller name if available
        const shopData = mockShops.find(shop => shop.id === product.sellerId);
        return {
          ...product,
          sellerName: product.sellerName || (shopData ? shopData.name : "Haluna Seller")
        };
      }
    }
    
    return undefined;
  } catch (error) {
    console.error('Failed to get product by ID:', error);
    return undefined;
  }
};
