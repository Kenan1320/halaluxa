import { supabase } from '@/integrations/supabase/client';
import { SellerAccount } from '@/types/database';

// Update the MOCK_SELLER_ACCOUNTS to include required fields
const MOCK_SELLER_ACCOUNTS: SellerAccount[] = [
  {
    id: '1',
    user_id: 'user-1',
    shop_id: 'shop-1',
    account_type: 'bank',
    account_name: 'Main Business Account',
    account_number: '1234567890',
    bank_name: 'Chase Bank',
    paypal_email: '',
    stripe_account_id: '',
    applepay_merchant_id: '',
    is_active: true,
    is_verified: true,
    balance: 5000.00,
    currency: 'USD',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const getSellerAccount = async (userId: string): Promise<SellerAccount | null> => {
  try {
    // Instead of querying Supabase directly, use the mock data
    const account = MOCK_SELLER_ACCOUNTS.find(acc => acc.user_id === userId);
    return account || null;
  } catch (error) {
    console.error('Error fetching seller account:', error);
    return null;
  }
};

export const getSellerAccountByShopId = async (shopId: string): Promise<SellerAccount | null> => {
  try {
    // Use mock data instead of Supabase query
    const account = MOCK_SELLER_ACCOUNTS.find(acc => acc.shop_id === shopId);
    return account || null;
  } catch (error) {
    console.error('Error fetching seller account by shop ID:', error);
    return null;
  }
};

// Update createSellerAccount to include required fields
export const createSellerAccount = async (data: {
  userId: string;
  shopId?: string;
  accountType: string;
  accountName?: string;
  accountNumber?: string;
  bankName?: string;
  paypalEmail?: string;
  stripeAccountId?: string;
  applePayMerchantId?: string;
}): Promise<SellerAccount | null> => {
  try {
    // Create a mock account instead of inserting into Supabase
    const newAccount: SellerAccount = {
      id: `mock-${Date.now()}`,
      user_id: data.userId,
      shop_id: data.shopId,
      account_type: data.accountType,
      account_name: data.accountName || '',
      account_number: data.accountNumber || '',
      bank_name: data.bankName || '',
      paypal_email: data.paypalEmail || '',
      stripe_account_id: data.stripeAccountId || '',
      applepay_merchant_id: data.applePayMerchantId || '',
      is_active: true,
      is_verified: false,
      balance: 0,
      currency: 'USD',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Add to our mock array
    MOCK_SELLER_ACCOUNTS.push(newAccount);
    return newAccount;
  } catch (error) {
    console.error('Error creating seller account:', error);
    return null;
  }
};

export const updateSellerAccount = async (
  accountId: string,
  data: Partial<Omit<SellerAccount, 'id' | 'user_id' | 'created_at'>>
): Promise<SellerAccount | null> => {
  try {
    // Update the mock account
    const accountIndex = MOCK_SELLER_ACCOUNTS.findIndex(acc => acc.id === accountId);
    if (accountIndex === -1) return null;
    
    const updatedAccount = {
      ...MOCK_SELLER_ACCOUNTS[accountIndex],
      ...data,
      updated_at: new Date().toISOString()
    };
    
    MOCK_SELLER_ACCOUNTS[accountIndex] = updatedAccount;
    return updatedAccount;
  } catch (error) {
    console.error('Error updating seller account:', error);
    return null;
  }
};

export const deleteSellerAccount = async (accountId: string): Promise<boolean> => {
  try {
    // Remove from mock array
    const initialLength = MOCK_SELLER_ACCOUNTS.length;
    const newAccounts = MOCK_SELLER_ACCOUNTS.filter(acc => acc.id !== accountId);
    MOCK_SELLER_ACCOUNTS.length = 0;
    MOCK_SELLER_ACCOUNTS.push(...newAccounts);
    
    return initialLength !== MOCK_SELLER_ACCOUNTS.length;
  } catch (error) {
    console.error('Error deleting seller account:', error);
    return false;
  }
};

export const getAllSellerAccounts = async (): Promise<SellerAccount[]> => {
  try {
    // Return the mock data
    return [...MOCK_SELLER_ACCOUNTS];
  } catch (error) {
    console.error('Error fetching all seller accounts:', error);
    return [];
  }
};
