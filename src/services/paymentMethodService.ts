
import { supabase } from '@/lib/supabaseClient';

export interface SellerAccount {
  id: string;
  user_id: string;
  shop_id: string;
  account_type: string;
  account_name: string;
  account_number: string;
  bank_name: string;
  paypal_email: string | null;
  stripe_account_id: string | null;
  applepay_merchant_id: string | null;
  is_active: boolean;
  is_verified: boolean;
  balance: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export const getSellerAccounts = async (userId: string): Promise<SellerAccount[]> => {
  try {
    const { data, error } = await supabase
      .from('seller_accounts')
      .select('*')
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error getting seller accounts:', error);
      return [];
    }
    
    return data.map(account => ({
      ...account,
      is_verified: account.is_verified || false,
      balance: account.balance || 0,
      currency: account.currency || 'USD'
    }));
  } catch (error) {
    console.error('Failed to get seller accounts:', error);
    return [];
  }
};

export const createSellerAccount = async (
  userId: string,
  shopId: string,
  accountInfo: {
    accountType: string;
    accountName: string;
    accountNumber: string;
    bankName: string;
    paypalEmail?: string;
    stripeAccountId?: string;
    applePayMerchantId?: string;
  }
): Promise<SellerAccount | null> => {
  try {
    const { data, error } = await supabase
      .from('seller_accounts')
      .insert([
        {
          user_id: userId,
          shop_id: shopId,
          account_type: accountInfo.accountType,
          account_name: accountInfo.accountName,
          account_number: accountInfo.accountNumber,
          bank_name: accountInfo.bankName,
          paypal_email: accountInfo.paypalEmail || null,
          stripe_account_id: accountInfo.stripeAccountId || null,
          applepay_merchant_id: accountInfo.applePayMerchantId || null,
          is_active: true,
          is_verified: false,
          balance: 0,
          currency: 'USD',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select();
      
    if (error) {
      console.error('Error creating seller account:', error);
      return null;
    }
    
    return data[0] as SellerAccount;
  } catch (error) {
    console.error('Failed to create seller account:', error);
    return null;
  }
};

export const formatPaymentMethod = (type: string) => {
  const formattedTypes = {
    'bank_transfer': 'Bank Transfer',
    'paypal': 'PayPal',
    'stripe': 'Stripe',
    'applepay': 'Apple Pay'
  };
  
  return formattedTypes[type as keyof typeof formattedTypes] || type;
};
