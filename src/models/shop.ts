
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

// Categories for shops and products
export const shopCategories = [
  "Clothing & Apparel",
  "Food & Beverages",
  "Home & Kitchen",
  "Beauty & Personal Care",
  "Health & Wellness",
  "Electronics",
  "Books & Media",
  "Arts & Crafts",
  "Toys & Games",
  "Sports & Outdoors",
  "Jewelry & Accessories",
  "Baby & Kids",
  "Pet Supplies",
  "Automotive",
  "Other"
];
