
import { supabase } from '@/integrations/supabase/client';
import { PaymentMethodData, SellerAccount } from '@/models/payment';

/**
 * Get seller accounts for a user
 */
export const getSellerAccounts = async (userId: string): Promise<SellerAccount[]> => {
  if (!userId) return [];
  
  try {
    const { data, error } = await supabase
      .from('seller_accounts')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching seller accounts:', error);
      return [];
    }
    
    // Transform database records to SellerAccount objects
    return (data || []).map(account => ({
      id: account.id,
      userId: account.user_id,
      shopId: account.shop_id,
      isActive: account.is_active,
      createdAt: account.created_at,
      updatedAt: account.updated_at,
      methodType: account.method_type as PaymentMethodData,
      accountName: account.account_name,
      accountNumber: account.account_number,
      bankName: account.bank_name,
      paypalEmail: account.paypal_email,
      stripeAccountId: account.stripe_account_id,
      applePayMerchantId: account.apple_pay_merchant_id,
      isDefault: account.is_default
    }));
  } catch (error) {
    console.error('Error getting seller accounts:', error);
    return [];
  }
};

/**
 * Create a seller account
 */
export const createSellerAccount = async (accountData: Partial<SellerAccount>): Promise<SellerAccount | null> => {
  try {
    // Transform to database format
    const dbData = {
      user_id: accountData.userId,
      shop_id: accountData.shopId,
      is_active: accountData.isActive ?? true,
      method_type: accountData.methodType,
      account_name: accountData.accountName,
      account_number: accountData.accountNumber,
      bank_name: accountData.bankName,
      paypal_email: accountData.paypalEmail,
      stripe_account_id: accountData.stripeAccountId,
      apple_pay_merchant_id: accountData.applePayMerchantId,
      is_default: accountData.isDefault ?? false
    };
    
    const { data, error } = await supabase
      .from('seller_accounts')
      .insert(dbData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating seller account:', error);
      return null;
    }
    
    // Transform back to SellerAccount format
    return {
      id: data.id,
      userId: data.user_id,
      shopId: data.shop_id,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      methodType: data.method_type as PaymentMethodData,
      accountName: data.account_name,
      accountNumber: data.account_number,
      bankName: data.bank_name,
      paypalEmail: data.paypal_email,
      stripeAccountId: data.stripe_account_id,
      applePayMerchantId: data.apple_pay_merchant_id,
      isDefault: data.is_default
    };
  } catch (error) {
    console.error('Error creating seller account:', error);
    return null;
  }
};

/**
 * Update a seller account
 */
export const updateSellerAccount = async (accountId: string, accountData: Partial<SellerAccount>): Promise<SellerAccount | null> => {
  try {
    // Transform to database format
    const dbData: any = {};
    
    if (accountData.userId) dbData.user_id = accountData.userId;
    if (accountData.shopId) dbData.shop_id = accountData.shopId;
    if (accountData.isActive !== undefined) dbData.is_active = accountData.isActive;
    if (accountData.methodType) dbData.method_type = accountData.methodType;
    if (accountData.accountName) dbData.account_name = accountData.accountName;
    if (accountData.accountNumber) dbData.account_number = accountData.accountNumber;
    if (accountData.bankName) dbData.bank_name = accountData.bankName;
    if (accountData.paypalEmail) dbData.paypal_email = accountData.paypalEmail;
    if (accountData.stripeAccountId) dbData.stripe_account_id = accountData.stripeAccountId;
    if (accountData.applePayMerchantId) dbData.apple_pay_merchant_id = accountData.applePayMerchantId;
    if (accountData.isDefault !== undefined) dbData.is_default = accountData.isDefault;
    
    const { data, error } = await supabase
      .from('seller_accounts')
      .update(dbData)
      .eq('id', accountId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating seller account:', error);
      return null;
    }
    
    // Transform back to SellerAccount format
    return {
      id: data.id,
      userId: data.user_id,
      shopId: data.shop_id,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      methodType: data.method_type as PaymentMethodData,
      accountName: data.account_name,
      accountNumber: data.account_number,
      bankName: data.bank_name,
      paypalEmail: data.paypal_email,
      stripeAccountId: data.stripe_account_id,
      applePayMerchantId: data.apple_pay_merchant_id,
      isDefault: data.is_default
    };
  } catch (error) {
    console.error('Error updating seller account:', error);
    return null;
  }
};

/**
 * Format a seller account for display
 */
export const formatPaymentMethod = (account: SellerAccount): string => {
  switch (account.methodType) {
    case 'bank':
      return `${account.bankName || 'Bank'} - ${account.accountNumber ? '•••• ' + account.accountNumber.slice(-4) : 'Account'}`;
    case 'paypal':
      return `PayPal - ${account.paypalEmail || 'Email'}`;
    case 'stripe':
      return `Stripe - ${account.stripeAccountId ? 'Connected Account' : 'Account'}`;
    case 'applepay':
      return `Apple Pay - ${account.applePayMerchantId ? 'Merchant Connected' : 'Account'}`;
    default:
      return 'Payment Method';
  }
};

/**
 * Create a payment intent
 */
export const createPaymentIntent = async (amount: number): Promise<{ clientSecret: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke('create-payment-intent', {
      body: { amount }
    });
    
    if (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
    
    return { clientSecret: data.clientSecret };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};
