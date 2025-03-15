
import { Product } from '@/models/product';

// This utility function ensures that any product object has all the required fields
export const normalizeProduct = (product: any): Product => {
  return {
    id: product.id || '',
    name: product.name || '',
    description: product.description || '',
    price: product.price || 0,
    shop_id: product.shop_id || '',
    category: product.category || '',
    images: product.images || [],
    created_at: product.created_at || new Date().toISOString(),
    updated_at: product.updated_at || new Date().toISOString(),
    is_halal_certified: product.is_halal_certified || false,
    in_stock: product.in_stock !== undefined ? product.in_stock : true,
    details: product.details || {},
    long_description: product.long_description || '',
    is_published: product.is_published || true,
    stock: product.stock || 0,
    seller_id: product.seller_id || '',
    rating: product.rating || 0,
    seller_name: product.seller_name || '',
    delivery_mode: product.delivery_mode || 'online',
    pickup_options: product.pickup_options || { store: true, curbside: false },
    
    // Set aliased properties
    shopId: product.shop_id || product.shopId || '',
    isHalalCertified: product.is_halal_certified || product.isHalalCertified || false,
    inStock: product.in_stock !== undefined ? product.in_stock : (product.inStock !== undefined ? product.inStock : true),
    createdAt: product.created_at || product.createdAt || new Date().toISOString(),
    updatedAt: product.updated_at || product.updatedAt || new Date().toISOString(),
    sellerId: product.seller_id || product.sellerId || '',
    sellerName: product.seller_name || product.sellerName || '',
  };
};

// Use this function when updating products to ensure all required fields are set
export const prepareProductForUpdate = (product: Partial<Product>): any => {
  const updatedProduct: any = { ...product };
  
  // Ensure in_stock is always set
  if (updatedProduct.in_stock === undefined && updatedProduct.inStock !== undefined) {
    updatedProduct.in_stock = updatedProduct.inStock;
  }
  
  // Ensure pickup_options has required fields if present
  if (updatedProduct.pickup_options) {
    updatedProduct.pickup_options = {
      store: updatedProduct.pickup_options.store !== undefined ? updatedProduct.pickup_options.store : true,
      curbside: updatedProduct.pickup_options.curbside !== undefined ? updatedProduct.pickup_options.curbside : false
    };
  }
  
  return updatedProduct;
};
