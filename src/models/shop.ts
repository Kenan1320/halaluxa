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
  logo_url: string | null; // For compatibility with database schema
  coverImage: string | null;
  ownerId: string;
  latitude: number | null;
  longitude: number | null;
  distance: number | null;
  created_at: string;
  updated_at: string;
  pickup_available?: boolean;
  delivery_available?: boolean;
  // Compatibility with database types
  product_count?: number;
  owner_id?: string;
  is_verified?: boolean;
  cover_image?: string;
}

export interface ShopProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string; 
  images: string[];
  sellerId: string;
  sellerName: string;
  rating: number;
  shop_id?: string;
  shopId?: string;
  created_at?: string;
  updated_at?: string;
  is_halal_certified?: boolean;
  isHalalCertified?: boolean;
  in_stock?: boolean;
  inStock?: boolean;
  createdAt?: string;
}

export interface ShopLocation {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface ShopDisplaySettings {
  id: string;
  shopId: string;
  primaryColor: string | null;
  secondaryColor: string | null;
  fontFamily: string | null;
  showRatings: boolean;
  showProductCount: boolean;
  featuredProducts: string[] | null;
  bannerMessage: string | null;
  created_at: string;
}

// Converter functions
export function adaptToModelShop(dbShop: any): Shop {
  return {
    id: dbShop.id,
    name: dbShop.name,
    description: dbShop.description,
    location: dbShop.location,
    rating: dbShop.rating,
    productCount: dbShop.product_count || dbShop.productCount || 0,
    isVerified: dbShop.is_verified || dbShop.isVerified || false,
    category: dbShop.category,
    logo: dbShop.logo_url || dbShop.logo || null,
    logo_url: dbShop.logo_url || dbShop.logo || null,
    coverImage: dbShop.cover_image || dbShop.coverImage || null,
    ownerId: dbShop.owner_id || dbShop.ownerId,
    latitude: dbShop.latitude || null,
    longitude: dbShop.longitude || null,
    distance: dbShop.distance || null,
    created_at: dbShop.created_at || new Date().toISOString(),
    updated_at: dbShop.updated_at || new Date().toISOString(),
    pickup_available: dbShop.pickup_available || false,
    delivery_available: dbShop.delivery_available || false,
    product_count: dbShop.product_count || dbShop.productCount || 0,
    owner_id: dbShop.owner_id || dbShop.ownerId,
    is_verified: dbShop.is_verified || dbShop.isVerified || false,
    cover_image: dbShop.cover_image || dbShop.coverImage || null
  };
}

export function adaptToModelProduct(dbProduct: any): ShopProduct {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    price: dbProduct.price,
    description: dbProduct.description,
    category: dbProduct.category,
    images: dbProduct.images || [],
    sellerId: dbProduct.seller_id || dbProduct.sellerId,
    sellerName: dbProduct.shop_name || dbProduct.sellerName,
    rating: dbProduct.rating || 0,
    shop_id: dbProduct.shop_id,
    shopId: dbProduct.shop_id || dbProduct.shopId,
    created_at: dbProduct.created_at,
    createdAt: dbProduct.created_at,
    updated_at: dbProduct.updated_at,
    is_halal_certified: dbProduct.is_halal_certified || false,
    isHalalCertified: dbProduct.is_halal_certified || dbProduct.isHalalCertified || false,
    in_stock: dbProduct.in_stock || true,
    inStock: dbProduct.in_stock || dbProduct.inStock || true
  };
}
