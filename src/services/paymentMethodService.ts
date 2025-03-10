
// This is now a wrapper around paymentService.ts to maintain backward compatibility
import { 
  PaymentMethod,
  SellerAccount, 
  formatPaymentMethod 
} from '@/models/payment';

import {
  createSellerAccount,
  getSellerAccount,
  getSellerAccounts,
  updateSellerAccount
} from './paymentService';

export { 
  PaymentMethod,
  SellerAccount,
  createSellerAccount,
  getSellerAccount,
  getSellerAccounts,
  updateSellerAccount,
  formatPaymentMethod
};
