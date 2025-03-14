
import { supabase } from '@/lib/supabaseClient';
import { UUID } from '@/models/types';

export interface SellerAccount {
  id: UUID;
  userId: UUID;
  shopId: UUID;
  accountType: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  paypalEmail: string | null;
  stripeAccountId: string | null;
  applePayMerchantId: string | null;
  isActive: boolean;
  isVerified: boolean;
  balance: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

// Adapter functions
export const adaptDbSellerAccountToModel = (dbAccount: any): SellerAccount => {
  return {
    id: dbAccount.id,
    userId: dbAccount.user_id,
    shopId: dbAccount.shop_id,
    accountType: dbAccount.account_type,
    accountName: dbAccount.account_name,
    accountNumber: dbAccount.account_number,
    bankName: dbAccount.bank_name,
    paypalEmail: dbAccount.paypal_email,
    stripeAccountId: dbAccount.stripe_account_id,
    applePayMerchantId: dbAccount.applepay_merchant_id,
    isActive: dbAccount.is_active || false,
    isVerified: dbAccount.is_verified || false,
    balance: dbAccount.balance || 0,
    currency: dbAccount.currency || 'USD',
    createdAt: dbAccount.created_at,
    updatedAt: dbAccount.updated_at
  };
};

export const adaptModelSellerAccountToDb = (account: SellerAccount): any => {
  return {
    id: account.id,
    user_id: account.userId,
    shop_id: account.shopId,
    account_type: account.accountType,
    account_name: account.accountName,
    account_number: account.accountNumber,
    bank_name: account.bankName,
    paypal_email: account.paypalEmail,
    stripe_account_id: account.stripeAccountId,
    applepay_merchant_id: account.applePayMerchantId,
    is_active: account.isActive,
    is_verified: account.isVerified,
    balance: account.balance,
    currency: account.currency,
    created_at: account.createdAt,
    updated_at: account.updatedAt
  };
};

export const getSellerAccounts = async (userId: UUID): Promise<SellerAccount[]> => {
  try {
    const { data, error } = await supabase
      .from('seller_accounts')
      .select('*')
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error getting seller accounts:', error);
      return [];
    }
    
    return data.map(adaptDbSellerAccountToModel);
  } catch (error) {
    console.error('Failed to get seller accounts:', error);
    return [];
  }
};

export const createSellerAccount = async (
  userId: UUID,
  shopId: UUID,
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
    
    return adaptDbSellerAccountToModel(data[0]);
  } catch (error) {
    console.error('Failed to create seller account:', error);
    return null;
  }
};

export const updateSellerAccount = async (
  accountId: UUID, 
  updates: Partial<SellerAccount>
): Promise<SellerAccount | null> => {
  try {
    // Convert to database format
    const dbUpdates: any = {};
    
    if (updates.accountType) dbUpdates.account_type = updates.accountType;
    if (updates.accountName) dbUpdates.account_name = updates.accountName;
    if (updates.accountNumber) dbUpdates.account_number = updates.accountNumber;
    if (updates.bankName) dbUpdates.bank_name = updates.bankName;
    if (updates.paypalEmail !== undefined) dbUpdates.paypal_email = updates.paypalEmail;
    if (updates.stripeAccountId !== undefined) dbUpdates.stripe_account_id = updates.stripeAccountId;
    if (updates.applePayMerchantId !== undefined) dbUpdates.applepay_merchant_id = updates.applePayMerchantId;
    if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;
    
    dbUpdates.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('seller_accounts')
      .update(dbUpdates)
      .eq('id', accountId)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating seller account:', error);
      return null;
    }
    
    return adaptDbSellerAccountToModel(data);
  } catch (error) {
    console.error('Failed to update seller account:', error);
    return null;
  }
};

export const deleteSellerAccount = async (accountId: UUID): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('seller_accounts')
      .delete()
      .eq('id', accountId);
      
    if (error) {
      console.error('Error deleting seller account:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to delete seller account:', error);
    return false;
  }
};

export const formatPaymentMethod = (type: string) => {
  const formattedTypes: Record<string, string> = {
    'bank_transfer': 'Bank Transfer',
    'paypal': 'PayPal',
    'stripe': 'Stripe',
    'applepay': 'Apple Pay',
    'credit_card': 'Credit Card',
    'debit_card': 'Debit Card'
  };
  
  return formattedTypes[type] || type;
};
