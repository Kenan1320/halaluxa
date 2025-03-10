
export interface PaymentMethod {
  id: string;
  userId: string;
  shopId: string;
  type: 'card' | 'bank_account';
  provider: string;
  last4: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentIntent {
  id: string;
  userId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed';
  paymentMethodId: string;
  createdAt: string;
}

export function mapDbPaymentMethodToModel(data: any): PaymentMethod {
  return {
    id: data.id,
    userId: data.user_id,
    shopId: data.shop_id,
    type: data.type,
    provider: data.provider,
    last4: data.last4,
    expiryMonth: data.expiry_month,
    expiryYear: data.expiry_year,
    isDefault: data.is_default,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

export function mapPaymentMethodToDb(method: Partial<PaymentMethod>): any {
  return {
    user_id: method.userId,
    shop_id: method.shopId,
    type: method.type,
    provider: method.provider,
    last4: method.last4,
    expiry_month: method.expiryMonth,
    expiry_year: method.expiryYear,
    is_default: method.isDefault
  };
}
