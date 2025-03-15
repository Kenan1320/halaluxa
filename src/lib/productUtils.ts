
import { Product } from '@/models/product';
import { Json } from '@/integrations/supabase/types';

export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};

export const formatStock = (stock: number): string => {
  if (stock <= 0) return 'Out of stock';
  if (stock < 5) return `Only ${stock} left!`;
  if (stock < 10) return `${stock} in stock`;
  return 'In stock';
};

export const normalizeProduct = (product: any): Product => {
  return {
    id: product.id,
    name: product.name,
    description: product.description || '',
    long_description: product.long_description || '',
    price: parseFloat(product.price) || 0,
    shop_id: product.shop_id,
    images: product.images || [],
    category: product.category || '',
    stock: product.stock || 0,
    created_at: product.created_at,
    updated_at: product.updated_at,
    is_published: product.is_published ?? true,
    is_halal_certified: product.is_halal_certified ?? false,
    details: product.details as Json || {},
    in_stock: product.in_stock ?? (product.stock > 0),
    delivery_mode: product.delivery_mode || 'pickup',
    pickup_options: product.pickup_options || {
      store: true,
      curbside: false
    },
    seller_id: product.seller_id,
    seller_name: product.seller_name,
    rating: product.rating || 0
  };
};

export const generateProductSlug = (product: Product): string => {
  return `${product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${product.id.substring(0, 8)}`;
};

export const getCategoryIcon = (category: string): string => {
  const categoryIcons: Record<string, string> = {
    'Electronics': '📱',
    'Clothing': '👕',
    'Food': '🍔',
    'Home': '🏠',
    'Beauty': '💄',
    'Books': '📚',
    'Sports': '⚽',
    'Toys': '🧸',
    'Health': '💊',
    'Grocery': '🛒',
    'Jewelry': '💍',
    'Automotive': '🚗',
    'Garden': '🌱',
  };
  
  return categoryIcons[category] || '🛍️';
};

export const ensurePickupOptions = (pickupOptions: any): { store: boolean; curbside: boolean } => {
  if (!pickupOptions) {
    return { store: true, curbside: false };
  }
  
  return {
    store: typeof pickupOptions.store === 'boolean' ? pickupOptions.store : true,
    curbside: typeof pickupOptions.curbside === 'boolean' ? pickupOptions.curbside : false
  };
};

export const prepareProductForUpdate = (product: Partial<Product>): any => {
  const updatedProduct: any = { ...product };
  
  // Convert camelCase to snake_case for database
  if (product.is_halal_certified !== undefined) {
    updatedProduct.is_halal_certified = product.is_halal_certified;
  }
  
  if (product.in_stock !== undefined) {
    updatedProduct.in_stock = product.in_stock;
  }
  
  return updatedProduct;
};
