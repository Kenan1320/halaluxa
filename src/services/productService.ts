
import { Product } from '@/models/product';

// Get products from localStorage or use the mock products
export const getProducts = (): Product[] => {
  const storedProducts = localStorage.getItem('products');
  if (storedProducts) {
    return JSON.parse(storedProducts);
  }
  return [];
};

// Save a new product
export const saveProduct = (product: Omit<Product, 'id' | 'createdAt'>): Product => {
  const products = getProducts();
  
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
  const products = getProducts();
  const updatedProducts = products.map(p => 
    p.id === product.id ? product : p
  );
  
  localStorage.setItem('products', JSON.stringify(updatedProducts));
  return product;
};

// Delete a product
export const deleteProduct = (productId: string): void => {
  const products = getProducts();
  const updatedProducts = products.filter(p => p.id !== productId);
  localStorage.setItem('products', JSON.stringify(updatedProducts));
};

// Get a product by ID
export const getProductById = (productId: string): Product | undefined => {
  const products = getProducts();
  return products.find(p => p.id === productId);
};
