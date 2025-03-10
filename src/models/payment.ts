
export interface PaymentMethod {
  id: string;
  shopId: string;
  type: 'card' | 'bank' | 'paypal' | 'stripe' | 'applepay';
  provider: string;
  accountName?: string;
  accountNumber?: string;
  bankName?: string;
  paypalEmail?: string;
  stripeAccountId?: string;
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SellerAccount {
  id: string;
  shop_id: string;
  method_type: string;
  account_name?: string;
  account_number?: string;
  bank_name?: string;
  paypal_email?: string;
  stripe_account_id?: string;
  is_active: boolean;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export function mapDbPaymentMethodToModel(data: SellerAccount): PaymentMethod {
  return {
    id: data.id,
    shopId: data.shop_id,
    type: data.method_type as PaymentMethod['type'],
    provider: data.method_type,
    accountName: data.account_name,
    accountNumber: data.account_number,
    bankName: data.bank_name,
    paypalEmail: data.paypal_email,
    stripeAccountId: data.stripe_account_id,
    isActive: data.is_active,
    isDefault: data.is_default,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

export function mapModelToDb(method: Partial<PaymentMethod>): Partial<SellerAccount> {
  return {
    shop_id: method.shopId,
    method_type: method.type,
    account_name: method.accountName,
    account_number: method.accountNumber,
    bank_name: method.bankName,
    paypal_email: method.paypalEmail,
    stripe_account_id: method.stripeAccountId,
    is_active: true,
    is_default: method.isDefault
  };
}

export function formatPaymentMethod(account: SellerAccount): string {
  switch (account.method_type) {
    case 'bank':
      return `${account.bank_name} - ${account.account_number?.slice(-4)}`;
    case 'paypal':
      return `PayPal - ${account.paypal_email}`;
    case 'stripe':
      return `Stripe - ${account.stripe_account_id}`;
    case 'applepay':
      return 'Apple Pay';
    default:
      return 'Unknown payment method';
  }
}
