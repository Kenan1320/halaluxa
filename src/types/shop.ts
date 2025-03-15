
import { Category } from '@/types/database';

export interface Shop {
  id: string;
  name: string;
  description: string;
  location: string;
  address?: string;
  logo_url?: string;
  cover_image?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  category: string;
  is_verified?: boolean;
  rating?: number;
  product_count?: number;
  latitude?: number;
  longitude?: number;
  distance?: number;
}

export { Category };
