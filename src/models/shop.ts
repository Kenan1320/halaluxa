
// Shop related models
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
  latitude?: number | null;
  longitude?: number | null;
  distance?: number | null;
}

export interface ShopProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  sellerId: string;
  sellerName: string;
  rating?: number;
}

// Helper function to convert database shop record to Shop model
export function mapDatabaseShopToModel(shopData: any): Shop {
  return {
    id: shopData.id,
    name: shopData.name,
    description: shopData.description || '',
    location: shopData.location || '',
    rating: shopData.rating || 0,
    productCount: shopData.product_count || 0,
    isVerified: shopData.is_verified || false,
    category: shopData.category || '',
    logo: shopData.logo_url || null,
    coverImage: shopData.cover_image || null,
    ownerId: shopData.owner_id,
    latitude: shopData.latitude || null,
    longitude: shopData.longitude || null
  };
}

// Helper function to convert model to database shop record
export function mapModelToDatabase(shop: Partial<Shop>): any {
  return {
    name: shop.name,
    description: shop.description,
    location: shop.location,
    category: shop.category,
    logo_url: shop.logo,
    cover_image: shop.coverImage,
    is_verified: shop.isVerified,
    latitude: shop.latitude,
    longitude: shop.longitude
  };
}
