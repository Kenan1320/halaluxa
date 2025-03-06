
export interface ProductDetails {
  weight?: string;
  dimensions?: string;
  servings?: string;
  ingredients?: string;
  nutrition?: string;
  [key: string]: any;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  sellerId: string;
  sellerName?: string;
  rating?: number;
  isHalalCertified: boolean;
  details?: ProductDetails;
  createdAt: string;
}

// Product categories
export const productCategories = [
  "Food & Groceries",
  "Fashion",
  "Beauty & Personal Care",
  "Health & Wellness",
  "Home & Kitchen",
  "Books & Media",
  "Kids & Baby",
  "Electronics",
  "Gifts & Souvenirs"
];

// Interface for DB Product to handle field name differences
export interface DbProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  seller_id: string;
  seller_name?: string;
  rating?: number;
  is_halal_certified: boolean;
  details?: ProductDetails | string;
  created_at: string;
}

// Map DB product to model
export function mapDbProductToModel(dbProduct: DbProduct): Product {
  let details = dbProduct.details;
  
  // Handle string details (from JSON)
  if (typeof details === 'string') {
    try {
      details = JSON.parse(details);
    } catch (e) {
      details = {};
    }
  }
  
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    description: dbProduct.description,
    price: dbProduct.price,
    stock: dbProduct.stock,
    category: dbProduct.category,
    images: dbProduct.images,
    sellerId: dbProduct.seller_id,
    sellerName: dbProduct.seller_name,
    rating: dbProduct.rating,
    isHalalCertified: dbProduct.is_halal_certified,
    details: details as ProductDetails,
    createdAt: dbProduct.created_at
  };
}

// Map model to DB product
export function mapModelToDbProduct(product: Partial<Product>): Partial<DbProduct> {
  const dbProduct: Partial<DbProduct> = {
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    category: product.category,
    images: product.images,
    seller_id: product.sellerId,
    seller_name: product.sellerName,
    rating: product.rating,
    is_halal_certified: product.isHalalCertified
  };
  
  // Handle details conversion to string
  if (product.details) {
    dbProduct.details = JSON.stringify(product.details);
  }
  
  if (product.id) {
    dbProduct.id = product.id;
  }
  
  if (product.createdAt) {
    dbProduct.created_at = product.createdAt;
  }
  
  return dbProduct;
}
