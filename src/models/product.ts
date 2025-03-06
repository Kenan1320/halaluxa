
export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  category: string;
  images: string[];
  sellerId: string;
  sellerName?: string;
  rating?: number;
  isHalalCertified: boolean;
  createdAt?: string;
  details?: Record<string, any>;
}

// Product categories for filtering
export const productCategories = [
  'Food & Groceries',
  'Beauty & Personal Care',
  'Clothing & Accessories',
  'Home & Kitchen',
  'Health & Wellness',
  'Baby & Kids',
  'Religious Items'
];

// Helper function to convert from database format to Product interface
export function mapDbProductToModel(dbProduct: any): Product {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    description: dbProduct.description,
    longDescription: dbProduct.long_description,
    price: dbProduct.price,
    stock: dbProduct.stock,
    category: dbProduct.category,
    images: dbProduct.images || [],
    sellerId: dbProduct.seller_id,
    sellerName: dbProduct.seller_name,
    rating: dbProduct.rating,
    isHalalCertified: dbProduct.is_halal_certified,
    createdAt: dbProduct.created_at,
    details: dbProduct.details
  };
}

// Helper function to convert from Product interface to database format
export function mapModelToDbProduct(product: Partial<Product>): any {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    long_description: product.longDescription,
    price: product.price,
    stock: product.stock,
    category: product.category,
    images: product.images,
    seller_id: product.sellerId,
    seller_name: product.sellerName,
    rating: product.rating,
    is_halal_certified: product.isHalalCertified,
    details: product.details
  };
}
