
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  isFeatured?: boolean;
  isHalalCertified: boolean;
  createdAt: string;
  sellerId: string;
  sellerName?: string;
  rating?: number;
  reviews?: number;
  images: string[];
  variants?: ProductVariant[];
  tags?: string[];
}

export interface ProductVariant {
  id: string;
  name: string;
  price?: number;
  inStock: boolean;
  attributes: {
    [key: string]: string;
  };
}

export interface ShopProduct extends Product {
  // Ensure required properties are present
  isHalalCertified: boolean;
  createdAt: string;
}

export interface NewProduct {
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  isFeatured?: boolean;
  isHalalCertified: boolean;
  sellerId: string;
  sellerName?: string;
  images: string[];
  variants?: ProductVariant[];
  tags?: string[];
}
