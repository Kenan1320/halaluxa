
import { 
  getSellerAccounts, 
  getSellerAccount, 
  createSellerAccount, 
  updateSellerAccount 
} from './paymentService';

export type { PaymentMethod, SellerAccount } from '@/models/payment';
export { formatPaymentMethod } from '@/models/payment';

// Export the functions from paymentService for backward compatibility
export { 
  getSellerAccounts, 
  getSellerAccount, 
  createSellerAccount, 
  updateSellerAccount 
};
