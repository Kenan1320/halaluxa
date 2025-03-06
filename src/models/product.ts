
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  images: string[];
  rating?: number;
  stock: number;
  sellerId: string;
  sellerName?: string;
  isHalalCertified?: boolean;
  details?: Record<string, any>;
  longDescription?: string;
  createdAt: string;
}

// Add product categories export
export const productCategories = [
  "Food & Groceries",
  "Clothing & Apparel",
  "Beauty & Personal Care",
  "Home & Kitchen",
  "Health & Wellness",
  "Religious Items",
  "Books & Education",
  "Electronics",
  "Toys & Games",
  "Accessories",
  "Other"
];

// Add mapping functions
export const mapDbProductToModel = (dbProduct: any): Product => {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    description: dbProduct.description,
    price: dbProduct.price,
    compareAtPrice: dbProduct.compare_at_price,
    category: dbProduct.category,
    images: dbProduct.images || [],
    rating: dbProduct.rating,
    stock: dbProduct.stock,
    sellerId: dbProduct.seller_id,
    sellerName: dbProduct.seller_name,
    isHalalCertified: dbProduct.is_halal_certified,
    details: dbProduct.details || {},
    longDescription: dbProduct.long_description,
    createdAt: dbProduct.created_at
  };
};

export const mapModelToDbProduct = (product: Partial<Product>): any => {
  return {
    ...(product.id && { id: product.id }),
    ...(product.name && { name: product.name }),
    ...(product.description && { description: product.description }),
    ...(product.price !== undefined && { price: product.price }),
    ...(product.compareAtPrice !== undefined && { compare_at_price: product.compareAtPrice }),
    ...(product.category && { category: product.category }),
    ...(product.images && { images: product.images }),
    ...(product.rating !== undefined && { rating: product.rating }),
    ...(product.stock !== undefined && { stock: product.stock }),
    ...(product.sellerId && { seller_id: product.sellerId }),
    ...(product.sellerName && { seller_name: product.sellerName }),
    ...(product.isHalalCertified !== undefined && { is_halal_certified: product.isHalalCertified }),
    ...(product.details && { details: product.details }),
    ...(product.longDescription && { long_description: product.longDescription }),
    ...(product.createdAt && { created_at: product.createdAt })
  };
};
