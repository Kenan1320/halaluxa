
export type PaymentMethodType = 'bank' | 'paypal' | 'stripe' | 'applepay';

export interface SellerAccount {
  id: string;
  userId: string;
  shopId: string;
  methodType: PaymentMethodType;
  accountName?: string;
  accountNumber?: string;
  bankName?: string;
  paypalEmail?: string;
  stripeAccountId?: string;
  applePayMerchantId?: string | null;
  isActive: boolean;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentCard {
  id: string;
  userId: string;
  cardNumber: string;
  cardHolder: string;
  expiryMonth: number;
  expiryYear: number;
  cvc: string;
  isDefault: boolean;
}

export interface PaymentResult {
  success: boolean;
  orderId?: string;
  orderDate?: string;
  error?: string;
}

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  displayName: string;
  isDefault?: boolean;
  details?: Record<string, any>;
}
