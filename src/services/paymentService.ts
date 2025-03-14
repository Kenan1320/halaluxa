import { SellerAccount } from '@/types/database';

// Mock function to simulate fetching seller account by ID
export const getSellerAccountById = async (accountId: string): Promise<SellerAccount | undefined> => {
  // In a real application, you would fetch this data from a database
  const account = mockSellerAccounts.find(acc => acc.id === accountId);
  return account ? { ...account } : undefined;
};

// Mock function to simulate fetching seller account by user ID
export const getSellerAccountByUserId = async (userId: string): Promise<SellerAccount | undefined> => {
  // In a real application, you would fetch this data from a database
  const account = mockSellerAccounts.find(acc => acc.user_id === userId);
  return account ? { ...account } : undefined;
};

// Mock function to simulate updating seller account details
export const updateSellerAccount = async (accountId: string, updates: Partial<SellerAccount>): Promise<SellerAccount | undefined> => {
  // In a real application, you would update this data in a database
  const accountIndex = mockSellerAccounts.findIndex(acc => acc.id === accountId);
  if (accountIndex === -1) {
    return undefined;
  }

  mockSellerAccounts[accountIndex] = { ...mockSellerAccounts[accountIndex], ...updates };
  return { ...mockSellerAccounts[accountIndex] };
};

// Mock function to simulate creating a seller account
export const createSellerAccount = async (accountDetails: Omit<SellerAccount, 'id' | 'created_at' | 'updated_at'>): Promise<SellerAccount> => {
  // In a real application, you would create this data in a database
  const newAccount: SellerAccount = {
    id: `acc_${Math.random().toString(36).substring(2, 15)}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...accountDetails
  };
  mockSellerAccounts.push(newAccount);
  return { ...newAccount };
};

// Mock function to simulate deleting a seller account
export const deleteSellerAccount = async (accountId: string): Promise<boolean> => {
  // In a real application, you would delete this data from a database
  const accountIndex = mockSellerAccounts.findIndex(acc => acc.id === accountId);
  if (accountIndex === -1) {
    return false;
  }

  mockSellerAccounts.splice(accountIndex, 1);
  return true;
};

// Mock function to simulate verifying a seller account
export const verifySellerAccount = async (accountId: string): Promise<boolean> => {
  // In a real application, you would verify this data against a third-party service
  const accountIndex = mockSellerAccounts.findIndex(acc => acc.id === accountId);
  if (accountIndex === -1) {
    return false;
  }

  mockSellerAccounts[accountIndex].is_verified = true;
  return true;
};

// Mock function to simulate processing a payment to a seller account
export const processPaymentToSeller = async (accountId: string, amount: number): Promise<boolean> => {
  // In a real application, you would process this payment through a payment gateway
  const accountIndex = mockSellerAccounts.findIndex(acc => acc.id === accountId);
  if (accountIndex === -1) {
    return false;
  }

  mockSellerAccounts[accountIndex].balance += amount;
  return true;
};

// Mock function to simulate initiating a payout from a seller account
export const initiatePayoutFromSeller = async (accountId: string, amount: number): Promise<boolean> => {
  // In a real application, you would initiate this payout through a payment gateway
  const accountIndex = mockSellerAccounts.findIndex(acc => acc.id === accountId);
  if (accountIndex === -1) {
    return false;
  }

  if (mockSellerAccounts[accountIndex].balance < amount) {
    return false; // Insufficient balance
  }

  mockSellerAccounts[accountIndex].balance -= amount;
  return true;
};

// Mock function to simulate setting up a Stripe Connect account for a seller
export const setupStripeConnectAccount = async (accountId: string): Promise<string | undefined> => {
  // In a real application, you would use the Stripe API to create a Connect account
  const accountIndex = mockSellerAccounts.findIndex(acc => acc.id === accountId);
  if (accountIndex === -1) {
    return undefined;
  }

  const stripeAccountId = `stripe_acct_${Math.random().toString(36).substring(2, 15)}`;
  mockSellerAccounts[accountIndex].stripe_account_id = stripeAccountId;
  return stripeAccountId;
};

// Mock function to simulate linking a PayPal account to a seller account
export const linkPayPalAccount = async (accountId: string, paypalEmail: string): Promise<boolean> => {
  // In a real application, you would verify this PayPal account through the PayPal API
  const accountIndex = mockSellerAccounts.findIndex(acc => acc.id === accountId);
  if (accountIndex === -1) {
    return false;
  }

  mockSellerAccounts[accountIndex].paypal_email = paypalEmail;
  return true;
};

// Mock function to simulate setting up Apple Pay for a seller
export const setupApplePay = async (accountId: string): Promise<string | undefined> => {
  // In a real application, you would use the Apple Pay API to set up Apple Pay
  const accountIndex = mockSellerAccounts.findIndex(acc => acc.id === accountId);
  if (accountIndex === -1) {
    return undefined;
  }

  const applePayMerchantId = `merchant.com.example.shop${Math.random().toString(36).substring(2, 8)}`;
  mockSellerAccounts[accountIndex].applepay_merchant_id = applePayMerchantId;
  return applePayMerchantId;
};

// Mock function to simulate setting account as active or inactive
export const setAccountActiveStatus = async (accountId: string, isActive: boolean): Promise<boolean> => {
  const accountIndex = mockSellerAccounts.findIndex(acc => acc.id === accountId);
  if (accountIndex === -1) {
    return false;
  }

  mockSellerAccounts[accountIndex].is_active = isActive;
  return true;
};

// Update the mock seller accounts to include the required fields
const mockSellerAccounts: SellerAccount[] = [
  {
    id: "acc_123456",
    user_id: "user_123",
    shop_id: "shop_123",
    account_type: "bank",
    account_name: "Main Business Account",
    account_number: "****4567",
    bank_name: "Qatar National Bank",
    paypal_email: "business@example.com",
    stripe_account_id: "acct_123456",
    applepay_merchant_id: "merchant.com.example",
    is_active: true,
    is_verified: true,
    balance: 5000,
    currency: "QAR",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "acc_234567",
    user_id: "user_234",
    shop_id: "shop_234",
    account_type: "bank",
    account_name: "Business Account",
    account_number: "****7890",
    bank_name: "Commercial Bank",
    paypal_email: "another@example.com",
    stripe_account_id: "acct_234567",
    applepay_merchant_id: "merchant.com.another",
    is_active: true,
    is_verified: true,
    balance: 3500,
    currency: "QAR",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];
