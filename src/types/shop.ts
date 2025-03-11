
import { Product } from './product';

export interface ShopCategory {
  id: string;
  name: string;
  products: Product[];
}

export interface DeliveryInfo {
  isDeliveryAvailable: boolean;
  isPickupAvailable: boolean;
  deliveryFee: number;
  estimatedTime: string;
  minOrder?: number;
}

export interface ShopDetails extends Shop {
  categories: ShopCategory[];
  deliveryInfo: DeliveryInfo;
  workingHours: {
    open: string;
    close: string;
  };
  isGroupOrderEnabled: boolean;
  rating: {
    average: number;
    count: number;
  };
}
