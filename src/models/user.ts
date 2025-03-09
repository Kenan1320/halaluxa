
export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar?: string | null;
  role: 'shopper' | 'business';
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  createdAt?: string;
}

export interface BusinessProfile {
  id: string;
  shopName: string | null;
  shopDescription: string | null;
  shopLogo: string | null;
  shopCategory: string | null;
  shopLocation: string | null;
  businessVerified: boolean;
  businessDocuments: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ShopPreference {
  id: string;
  userId: string;
  shopId: string;
  isFollowing: boolean;
  isFavorite: boolean;
  isMainShop: boolean;
}

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
