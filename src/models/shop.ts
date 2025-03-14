
// Shop model interfaces
export interface Shop {
  id: string;
  name: string;
  description: string;
  location: string;
  rating: number;
  productCount: number;
  isVerified: boolean;
  category: string;
  logo: string | null;
  coverImage: string | null;
  ownerId: string;
  latitude: number | null;
  longitude: number | null;
  distance: number | null;
  
  // Database compatibility fields
  logo_url?: string | null;
  cover_image?: string | null;
  owner_id?: string;
  product_count?: number;
  is_verified?: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShopProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  shop_id?: string;
  shopId?: string;
  created_at?: string;
  updated_at?: string;
  is_halal_certified?: boolean;
  isHalalCertified?: boolean;
  in_stock?: boolean;
  inStock?: boolean;
  sellerId?: string;
  seller_id?: string;
  sellerName?: string;
  shop_name?: string;
  rating?: number;
}

export interface ShopReview {
  id: string;
  userId: string;
  shopId: string;
  rating: number;
  review: string;
  createdAt: string;
  userName?: string;
  userAvatar?: string;
}

export interface ShopFilterOptions {
  category?: string;
  rating?: number;
  distance?: number;
  isHalalCertified?: boolean;
  search?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

// Helper function to convert database product to model product format
export const adaptToModelProduct = (product: any): ShopProduct => {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    images: product.images || [],
    shop_id: product.shop_id,
    shopId: product.shop_id,
    created_at: product.created_at,
    updated_at: product.updated_at,
    is_halal_certified: product.is_halal_certified,
    isHalalCertified: product.is_halal_certified,
    in_stock: product.in_stock ?? true,
    inStock: product.in_stock ?? true,
    sellerId: product.seller_id,
    seller_id: product.seller_id,
    sellerName: product.seller_name || product.shop_name,
    shop_name: product.shop_name,
    rating: product.rating || 0
  };
};
