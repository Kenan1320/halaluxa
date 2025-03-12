
import { Product } from '@/models/product';

export interface ShopProductListProps {
  shopId: string;
  products?: Product[];
  demoProducts?: {
    id: string;
    name: string;
    price: number;
    images: string[];
    description: string;
  }[];
  isLoading?: boolean;
}
