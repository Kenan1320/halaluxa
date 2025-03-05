
import { Cart } from '@/models/cart';

export interface PaymentMethod {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

export interface PaymentDetails {
  total: number;
  paymentMethod: PaymentMethod;
}

export interface SellerAccount {
  sellerId: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
}

// Simulated payment processing
export const processPayment = async (
  cart: Cart, 
  paymentDetails: PaymentMethod,
  shippingDetails: any
): Promise<{ success: boolean; orderId: string; orderDate: string }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In a real app, this would make an API call to a payment processor
  const success = true; // Simulate successful payment
  
  if (success) {
    // Create order in local storage
    const orderId = `ORD-${Math.floor(Math.random() * 1000000)}`;
    const orderDate = new Date().toISOString();
    
    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push({
      id: orderId,
      date: orderDate,
      items: cart.items,
      total: cart.totalPrice,
      shippingDetails,
      status: 'Processing'
    });
    localStorage.setItem('orders', JSON.stringify(orders));
    
    return {
      success: true,
      orderId,
      orderDate
    };
  } else {
    throw new Error('Payment processing failed');
  }
};

// Get seller payment accounts
export const getSellerAccounts = (): SellerAccount[] => {
  const accounts = localStorage.getItem('sellerAccounts');
  if (accounts) {
    return JSON.parse(accounts);
  }
  return [];
};

// Save seller payment account
export const saveSellerAccount = (account: SellerAccount): void => {
  const accounts = getSellerAccounts();
  const existingIndex = accounts.findIndex(a => a.sellerId === account.sellerId);
  
  if (existingIndex >= 0) {
    accounts[existingIndex] = account;
  } else {
    accounts.push(account);
  }
  
  localStorage.setItem('sellerAccounts', JSON.stringify(accounts));
};
