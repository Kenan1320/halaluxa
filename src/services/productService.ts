
import { Product } from '@/models/product';
import { updateShopProductCount, notifyShopUpdate } from '@/services/shopService';

// Custom event for product updates
const PRODUCT_UPDATE_EVENT = 'haluna-product-updated';

// Listen for product updates
window.addEventListener(PRODUCT_UPDATE_EVENT, () => {
  // Invalidate any product caches we might have
  console.log('Product update detected, refreshing data...');
});

// Notify product updates
export const notifyProductUpdate = () => {
  window.dispatchEvent(new Event(PRODUCT_UPDATE_EVENT));
};

// Get all products
export const getProducts = async (): Promise<Product[]> => {
  try {
    // Get products from localStorage
    const localProductsJson = localStorage.getItem('products');
    const localProducts = localProductsJson ? JSON.parse(localProductsJson) : [];
    
    // Get mock products from model
    const allProducts = [...localProducts];
    
    return allProducts;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Get a product by ID
export const getProductById = async (productId: string): Promise<Product | null> => {
  try {
    // First check local storage
    const localProductsJson = localStorage.getItem('products');
    const localProducts = localProductsJson ? JSON.parse(localProductsJson) : [];
    const localProduct = localProducts.find((p: Product) => p.id === productId);
    
    if (localProduct) {
      return localProduct;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

// Add a new product
export const addProduct = async (product: Partial<Product>): Promise<Product> => {
  try {
    // Generate a unique ID
    const productId = Math.random().toString(36).substr(2, 9);
    
    // Get existing products
    const localProductsJson = localStorage.getItem('products');
    const localProducts = localProductsJson ? JSON.parse(localProductsJson) : [];
    
    // Create new product object
    const newProduct: Product = {
      id: productId,
      name: product.name || 'Untitled Product',
      description: product.description || '',
      price: product.price || 0,
      salePrice: product.salePrice,
      imageUrl: product.imageUrl || '',
      category: product.category || 'Uncategorized',
      tags: product.tags || [],
      rating: product.rating || 0,
      reviewCount: product.reviewCount || 0,
      isAvailable: product.isAvailable !== undefined ? product.isAvailable : true,
      sellerId: product.sellerId || 'unknown',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      quantity: product.quantity || 1,
    };
    
    // Add to local products
    localProducts.push(newProduct);
    
    // Save back to localStorage
    localStorage.setItem('products', JSON.stringify(localProducts));
    
    // Update shop product count
    if (newProduct.sellerId) {
      await updateShopProductCount(newProduct.sellerId);
      notifyShopUpdate();
    }
    
    // Notify product update
    notifyProductUpdate();
    
    return newProduct;
  } catch (error) {
    console.error('Error adding product:', error);
    throw new Error('Failed to add product');
  }
};

// Update a product
export const updateProduct = async (productId: string, updates: Partial<Product>): Promise<Product | null> => {
  try {
    // Get existing products
    const localProductsJson = localStorage.getItem('products');
    const localProducts = localProductsJson ? JSON.parse(localProductsJson) : [];
    
    // Find product index
    const productIndex = localProducts.findIndex((p: Product) => p.id === productId);
    
    if (productIndex === -1) {
      return null;
    }
    
    // Update product
    const updatedProduct = {
      ...localProducts[productIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    // Save updated product
    localProducts[productIndex] = updatedProduct;
    localStorage.setItem('products', JSON.stringify(localProducts));
    
    // Update shop product count if sellerId changed
    if (updates.sellerId && updates.sellerId !== localProducts[productIndex].sellerId) {
      // Update old shop
      await updateShopProductCount(localProducts[productIndex].sellerId);
      // Update new shop
      await updateShopProductCount(updates.sellerId);
      notifyShopUpdate();
    }
    
    // Notify product update
    notifyProductUpdate();
    
    return updatedProduct;
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
};

// Delete a product
export const deleteProduct = async (productId: string): Promise<boolean> => {
  try {
    // Get existing products
    const localProductsJson = localStorage.getItem('products');
    const localProducts = localProductsJson ? JSON.parse(localProductsJson) : [];
    
    // Find product to get sellerId
    const product = localProducts.find((p: Product) => p.id === productId);
    
    if (!product) {
      return false;
    }
    
    // Filter out the product
    const updatedProducts = localProducts.filter((p: Product) => p.id !== productId);
    
    // Save back to localStorage
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    
    // Update shop product count
    if (product.sellerId) {
      await updateShopProductCount(product.sellerId);
      notifyShopUpdate();
    }
    
    // Notify product update
    notifyProductUpdate();
    
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};

// Get products by seller ID
export const getProductsBySellerId = async (sellerId: string): Promise<Product[]> => {
  try {
    const allProducts = await getProducts();
    return allProducts.filter(product => product.sellerId === sellerId);
  } catch (error) {
    console.error('Error fetching seller products:', error);
    return [];
  }
};

// Get products by category
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const allProducts = await getProducts();
    return allProducts.filter(product => product.category === category);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
};

// Search products
export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const allProducts = await getProducts();
    
    if (!query) return allProducts;
    
    const lowerQuery = query.toLowerCase();
    
    return allProducts.filter(product => 
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery) ||
      product.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
};
