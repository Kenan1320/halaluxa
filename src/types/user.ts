
export interface User {
  id: string;
  email: string;
  name: string;
  role: string; // 'shopper' | 'business' | 'admin'
  avatar: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  shopName: string;
  shopDescription: string;
  shopCategory: string;
  shopLocation: string;
  shopLogo: string;
}
