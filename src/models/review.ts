
export interface Review {
  id: string;
  user_id: string;
  product_id?: string;
  shop_id?: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  user_name: string;
  user_avatar?: string;
}

export interface ShopReview extends Review {
  shop_id: string;
}

export interface ProductReview extends Review {
  product_id: string;
}
