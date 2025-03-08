
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
  sellerName?: string;
  rating?: number;
}

export interface PaymentMethod {
  id: string;
  userId: string;
  paymentType: 'card' | 'paypal' | 'applepay' | 'googlepay';
  cardLastFour?: string;
  cardBrand?: string;
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
