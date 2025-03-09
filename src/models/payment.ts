
// Payment models
export interface SellerAccount {
  id: string;
  user_id: string;
  shop_id: string;
  method_type: "bank" | "paypal" | "stripe" | "applepay";
  account_name?: string;
  account_number?: string;
  bank_name?: string;
  paypal_email?: string;
  stripe_account_id?: string;
  applepay_merchant_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaymentResult {
  success: boolean;
  orderId?: string;
  orderDate?: string;
  error?: string;
  redirectUrl?: string;
}
