
import { supabase } from '@/integrations/supabase/client';
import { SellerAccount } from '@/types/database';
import { PaymentAccount } from '@/types/payment';

// Sample mock data for development
const mockPaymentAccounts: PaymentAccount[] = [
  {
    id: '1',
    user_id: 'user1',
    shop_id: 'shop1',
    // Fix by ensuring all properties match PaymentAccount interface 
    // and account_type matches expected values
    account_type: 'bank' as 'bank' | 'paypal' | 'stripe' | 'applepay' | 'individual' | 'business',
    account_status: 'active',
    payout_details: {
      bank_name: 'Example Bank',
      account_holder: 'John Doe',
      account_number_last4: '1234',
      routing_number_last4: '5678',
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    account_name: 'Business Account',
    account_number: '*****1234',
    bank_name: 'Example Bank',
    is_active: true,
    is_verified: false,
    balance: 1250.75,
    currency: 'USD'
  }
];

// Function to get payment accounts by user ID
export const getPaymentAccountsByUserId = async (userId: string): Promise<PaymentAccount[]> => {
  try {
    // Return mock data for development
    return mockPaymentAccounts.filter(account => account.user_id === userId);
  } catch (error) {
    console.error('Error fetching payment accounts:', error);
    return [];
  }
};

// Function to create a new payment account
export const createPaymentAccount = async (data: Partial<PaymentAccount>): Promise<PaymentAccount | null> => {
  try {
    // For development, just return a new mock account
    const newAccount: PaymentAccount = {
      id: `acc_${Date.now()}`,
      user_id: data.user_id || '',
      shop_id: data.shop_id || '',
      // Replace all other instances of string with properly typed account_type
      account_type: data.account_type as 'bank' | 'paypal' | 'stripe' | 'applepay' | 'individual' | 'business',
      account_status: data.account_status || 'pending',
      payout_details: data.payout_details || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      account_name: data.account_name,
      account_number: data.account_number,
      bank_name: data.bank_name,
      paypal_email: data.paypal_email,
      stripe_account_id: data.stripe_account_id,
      applepay_merchant_id: data.applepay_merchant_id,
      is_active: data.is_active || false,
      is_verified: data.is_verified || false,
      balance: data.balance || 0,
      currency: data.currency || 'USD'
    };
    
    return newAccount;
  } catch (error) {
    console.error('Error creating payment account:', error);
    return null;
  }
};
