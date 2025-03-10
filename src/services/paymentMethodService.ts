
// This is now a wrapper around paymentService.ts to maintain backward compatibility
import { 
  SellerAccount, 
  createSellerAccount, 
  getSellerAccount, 
  getSellerAccounts, 
  saveSellerAccount, 
  updateSellerAccount, 
  formatPaymentMethod
} from './paymentService';

export type { SellerAccount };

export { 
  createSellerAccount, 
  getSellerAccount, 
  getSellerAccounts, 
  saveSellerAccount, 
  updateSellerAccount, 
  formatPaymentMethod
};
