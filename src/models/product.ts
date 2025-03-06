
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number; // Add the missing property
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
