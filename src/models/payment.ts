
export interface PaymentMethod {
  id: string;
  userId?: string;
  type: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvc?: string;
  cardholderName?: string;
  isDefault: boolean;
}

export type PaymentMethodData = "bank" | "paypal" | "stripe" | "applepay";
// Add this alias for backward compatibility
export type PaymentMethodType = PaymentMethodData;

export interface PaymentMethodFormData {
  type: PaymentMethodData;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvc?: string;
  cardholderName?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankName?: string;
  paypalEmail?: string;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'created' | 'processing' | 'succeeded' | 'failed';
  clientSecret?: string;
}

export interface PaymentResult {
  success: boolean;
  message: string;
  transactionId?: string;
  error?: any;
  orderId?: string;
  orderDate?: string;
}

export interface SellerAccount {
  id: string;
  userId: string;
  shopId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

