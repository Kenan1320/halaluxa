
export interface PaymentAccount {
  id: string;
  user_id: string;
  shop_id: string;
  account_type: 'individual' | 'business' | 'bank' | 'paypal' | 'stripe' | 'applepay';
  account_status: 'pending' | 'active' | 'suspended';
  payout_details: {
    bank_name?: string;
    account_holder?: string;
    account_number_last4?: string;
    routing_number_last4?: string;
    paypal_email?: string;
  };
  created_at: string;
  updated_at: string;
  // Additional fields needed for payment accounts
  account_name?: string;
  account_number?: string;
  bank_name?: string;
  paypal_email?: string;
  stripe_account_id?: string;
  applepay_merchant_id?: string;
  routing_number?: string;
  is_active?: boolean;
  is_verified?: boolean;
  balance?: number;
  currency?: string;
}
