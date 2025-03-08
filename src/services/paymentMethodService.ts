
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

// Define types for payment methods
export interface PaymentMethod {
  id: string;
  user_id: string;
  payment_type: string;
  card_last_four?: string;
  card_brand?: string;
  billing_address?: any;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  metadata?: any;
}

export interface SellerAccount {
  id: string;
  user_id: string;
  shop_id?: string;
  account_type: string; 
  account_name?: string;
  account_number?: string;
  bank_name?: string;
  paypal_email?: string;
  stripe_account_id?: string;
  applepay_merchant_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

// Get a specific seller account by ID
export async function getSellerAccount(id: string): Promise<SellerAccount | null> {
  try {
    // Since shopper_payment_methods doesn't exist in the supabase types,
    // we need to use a more generic approach
    const { data, error } = await supabase
      .from('seller_accounts')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching seller account:', error);
      return null;
    }
    
    if (!data) return null;
    
    return {
      id: data.id,
      user_id: data.user_id,
      shop_id: data.shop_id,
      account_type: data.account_type || 'bank',
      account_name: data.account_name,
      account_number: data.account_number,
      bank_name: data.bank_name,
      paypal_email: data.paypal_email,
      stripe_account_id: data.stripe_account_id,
      applepay_merchant_id: data.applepay_merchant_id,
      is_active: data.is_active || true,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error) {
    console.error('Error in getSellerAccount:', error);
    return null;
  }
}

// Set a default payment method
export async function setDefaultPaymentMethod(methodId: string, userId: string): Promise<boolean> {
  try {
    // First, set all payment methods for this user to not default
    const { error: updateError } = await supabase
      .from('seller_accounts')
      .update({ is_active: false })
      .eq('user_id', userId);
      
    if (updateError) {
      console.error('Error updating payment methods:', updateError);
      return false;
    }
    
    // Then set the selected one as default
    const { error: setDefaultError } = await supabase
      .from('seller_accounts')
      .update({ is_active: true })
      .eq('id', methodId)
      .eq('user_id', userId);
      
    if (setDefaultError) {
      console.error('Error setting default payment method:', setDefaultError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in setDefaultPaymentMethod:', error);
    return false;
  }
}

// Create payment method for a user - used to add payment methods to seller accounts
export async function createSellerAccount(accountData: any): Promise<boolean> {
  try {
    // Ensure we have user_id (should come from auth context)
    if (!accountData.user_id) {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData || !userData.user) {
        console.error('No authenticated user found');
        return false;
      }
      accountData.user_id = userData.user.id;
    }
    
    // Insert the payment method
    const { data, error } = await supabase
      .from('seller_accounts')
      .insert({
        user_id: accountData.user_id,
        account_type: accountData.account_type,
        account_name: accountData.account_name,
        account_number: accountData.account_number,
        bank_name: accountData.bank_name,
        paypal_email: accountData.paypal_email,
        stripe_account_id: accountData.stripe_account_id,
        applepay_merchant_id: accountData.applepay_merchant_id,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();
      
    if (error) {
      console.error('Error creating payment method:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in createPaymentMethod:', error);
    return false;
  }
}

// Get all payment methods for a user
export async function getSellerAccounts(): Promise<SellerAccount[]> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData || !userData.user) {
      console.error('No authenticated user found');
      return [];
    }
    
    const { data, error } = await supabase
      .from('seller_accounts')
      .select('*')
      .eq('user_id', userData.user.id);
      
    if (error) {
      console.error('Error fetching payment methods:', error);
      return [];
    }
    
    if (!data || data.length === 0) return [];
    
    return data.map(item => ({
      id: item.id,
      user_id: item.user_id,
      shop_id: item.shop_id,
      account_type: item.account_type || 'bank',
      account_name: item.account_name,
      account_number: item.account_number,
      bank_name: item.bank_name,
      paypal_email: item.paypal_email,
      stripe_account_id: item.stripe_account_id,
      applepay_merchant_id: item.applepay_merchant_id,
      is_active: item.is_active || false,
      created_at: item.created_at,
      updated_at: item.updated_at
    }));
  } catch (error) {
    console.error('Error in getPaymentMethods:', error);
    return [];
  }
}

// Delete a payment method
export async function deleteSellerAccount(id: string): Promise<boolean> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData || !userData.user) {
      console.error('No authenticated user found');
      return false;
    }
    
    const { error } = await supabase
      .from('seller_accounts')
      .delete()
      .eq('id', id)
      .eq('user_id', userData.user.id);
      
    if (error) {
      console.error('Error deleting payment method:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deletePaymentMethod:', error);
    return false;
  }
}

// Update a payment method
export async function updateSellerAccount(id: string, accountData: Partial<SellerAccount>): Promise<boolean> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData || !userData.user) {
      console.error('No authenticated user found');
      return false;
    }
    
    const { error } = await supabase
      .from('seller_accounts')
      .update({
        ...accountData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', userData.user.id);
      
    if (error) {
      console.error('Error updating payment method:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updatePaymentMethod:', error);
    return false;
  }
}

// Format a payment method for display
export function formatPaymentMethod(account: SellerAccount): string {
  if (!account) return 'Unknown Account';
  
  switch (account.account_type) {
    case 'bank':
      return `${account.bank_name || ''} •••• ${account.account_number?.slice(-4) || ''}`;
    case 'paypal':
      return `PayPal: ${account.paypal_email || ''}`;
    case 'stripe':
      return `Stripe Account`;
    case 'applepay':
      return `Apple Pay`;
    default:
      return `Payment Account`;
  }
}
