
export interface Profile {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  avatar_url: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  role: string;
  shop_name?: string;
  shop_description?: string;
  shop_category?: string;
  shop_location?: string;
  shop_logo?: string;
}

export interface SellerAccount {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  business_name: string;
  business_type: string;
  business_description: string;
  business_address: string;
  business_city: string;
  business_state: string;
  business_zip: string;
  business_phone: string;
  business_email: string;
  business_website: string;
  business_logo: string;
  status: string;
}
