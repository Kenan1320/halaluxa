
import { Product, mockProducts } from '@/models/product';
import { mockShops } from '@/services/shopService';

// Get products from localStorage or use the mock products
export const getProducts = (): Product[] => {
  const storedProducts = localStorage.getItem('products');
  let products = [];
  
  if (storedProducts) {
    products = JSON.parse(storedProducts);
  }
  
  // Ensure all products have seller information
  const allProducts = [...mockProducts, ...products];
  
  return allProducts.map(product => {
    const shopData = mockShops.find(shop => shop.id === product.sellerId);
    
    return {
      ...product,
      sellerName: product.sellerName || (shopData ? shopData.name : "Haluna Seller")
    };
  });
};

// Save a new product
export const saveProduct = (product: Omit<Product, 'id' | 'createdAt'>): Product => {
  const products = getProducts().filter(p => !mockProducts.some(mp => mp.id === p.id));
  
  const newProduct: Product = {
    ...product,
    id: `product-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  
  const updatedProducts = [...products, newProduct];
  localStorage.setItem('products', JSON.stringify(updatedProducts));
  
  return newProduct;
};

// Update an existing product
export const updateProduct = (product: Product): Product => {
  const products = getProducts().filter(p => !mockProducts.some(mp => mp.id === p.id));
  const updatedProducts = products.map(p => 
    p.id === product.id ? product : p
  );
  
  localStorage.setItem('products', JSON.stringify(updatedProducts));
  return product;
};

// Delete a product
export const deleteProduct = (productId: string): void => {
  const products = getProducts().filter(p => !mockProducts.some(mp => mp.id === p.id));
  const updatedProducts = products.filter(p => p.id !== productId);
  localStorage.setItem('products', JSON.stringify(updatedProducts));
};

// Get a product by ID
export const getProductById = (productId: string): Product | undefined => {
  // First try to find it in mock products
  const mockProduct = mockProducts.find(p => p.id === productId);
  if (mockProduct) return mockProduct;
  
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
};
