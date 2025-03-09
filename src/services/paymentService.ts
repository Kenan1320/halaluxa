
import { supabase } from '@/integrations/supabase/client';
import { Shop } from '@/models/shop';

export interface SellerAccount {
  id: string;
  user_id: string;
  shop_id: string;
  method_type: 'bank' | 'paypal' | 'stripe' | 'applepay';
  account_name?: string;
  account_number?: string;
  bank_name?: string;
  paypal_email?: string;
  stripe_account_id?: string;
  applepay_merchant_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Format payment method for display
export function formatPaymentMethod(account: SellerAccount): string {
  switch (account.method_type) {
    case 'bank':
      return `${account.bank_name}: ${account.account_name} (${account.account_number?.slice(-4)})`;
    case 'paypal':
      return `PayPal: ${account.paypal_email}`;
    case 'stripe':
      return `Stripe Account`;
    case 'applepay':
      return `Apple Pay`;
    default:
      return 'Unknown payment method';
  }
}

// Get all seller accounts for the current user
export async function getSellerAccounts(options: { shopId?: string }): Promise<SellerAccount[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return [];
    }
    
    let query = supabase
      .from('shop_payment_methods')
      .select('*');
    
    if (options.shopId) {
      query = query.eq('shop_id', options.shopId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching seller accounts:', error);
      return [];
    }
    
    // Convert to our application model
    return data.map(item => ({
      id: item.id,
      user_id: user.id,
      shop_id: item.shop_id,
      method_type: item.method_type,
      account_name: item.account_name,
      account_number: item.account_number,
      bank_name: item.bank_name,
      paypal_email: item.paypal_email,
      stripe_account_id: item.stripe_account_id,
      applepay_merchant_id: null, // Not in the original schema, add if needed
      is_active: item.is_active,
      created_at: item.created_at,
      updated_at: item.updated_at
    }));
  } catch (error) {
    console.error('Error in getSellerAccounts:', error);
    return [];
  }
}

// Get a specific seller account
export async function getSellerAccount(accountId: string): Promise<SellerAccount | null> {
  try {
    const { data, error } = await supabase
      .from('shop_payment_methods')
      .select('*')
      .eq('id', accountId)
      .single();
    
    if (error) {
      console.error(`Error fetching seller account ${accountId}:`, error);
      return null;
    }
    
    // Get user data
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }
    
    return {
      id: data.id,
      user_id: user.id,
      shop_id: data.shop_id,
      method_type: data.method_type,
      account_name: data.account_name,
      account_number: data.account_number,
      bank_name: data.bank_name,
      paypal_email: data.paypal_email,
      stripe_account_id: data.stripe_account_id,
      applepay_merchant_id: null, // Not in original schema
      is_active: data.is_active,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error) {
    console.error(`Error in getSellerAccount for ${accountId}:`, error);
    return null;
  }
}

// Create a new seller account
export async function createSellerAccount(
  accountData: Partial<SellerAccount>,
  options: { shopId?: string }
): Promise<SellerAccount | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Get the shop ID if not provided
    let shopId = options.shopId;
    
    if (!shopId) {
      // Get the user's shop
      const { data: shopData, error: shopError } = await supabase
        .from('shops')
        .select('id')
        .eq('owner_id', user.id)
        .single();
      
      if (shopError) {
        console.error('Error fetching user shop:', shopError);
        throw new Error('Could not find user shop');
      }
      
      shopId = shopData.id;
    }
    
    // Prepare data for insertion
    const insertData = {
      shop_id: shopId,
      method_type: accountData.method_type,
      account_name: accountData.account_name,
      account_number: accountData.account_number,
      bank_name: accountData.bank_name,
      paypal_email: accountData.paypal_email,
      stripe_account_id: accountData.stripe_account_id,
      is_active: true,
      is_default: false
    };
    
    const { data, error } = await supabase
      .from('shop_payment_methods')
      .insert(insertData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating seller account:', error);
      throw error;
    }
    
    return {
      id: data.id,
      user_id: user.id,
      shop_id: data.shop_id,
      method_type: data.method_type,
      account_name: data.account_name,
      account_number: data.account_number,
      bank_name: data.bank_name,
      paypal_email: data.paypal_email,
      stripe_account_id: data.stripe_account_id,
      applepay_merchant_id: null, // Not in original schema
      is_active: data.is_active,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error: any) {
    console.error('Error in createSellerAccount:', error);
    throw error;
  }
}

// Update an existing seller account
export async function updateSellerAccount(
  accountId: string,
  accountData: Partial<SellerAccount>
): Promise<SellerAccount | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Prepare update data
    const updateData: any = {};
    
    if (accountData.method_type) updateData.method_type = accountData.method_type;
    if (accountData.account_name) updateData.account_name = accountData.account_name;
    if (accountData.account_number) updateData.account_number = accountData.account_number;
    if (accountData.bank_name) updateData.bank_name = accountData.bank_name;
    if (accountData.paypal_email) updateData.paypal_email = accountData.paypal_email;
    if (accountData.stripe_account_id) updateData.stripe_account_id = accountData.stripe_account_id;
    if (accountData.is_active !== undefined) updateData.is_active = accountData.is_active;
    
    const { data, error } = await supabase
      .from('shop_payment_methods')
      .update(updateData)
      .eq('id', accountId)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating seller account ${accountId}:`, error);
      throw error;
    }
    
    return {
      id: data.id,
      user_id: user.id,
      shop_id: data.shop_id,
      method_type: data.method_type,
      account_name: data.account_name,
      account_number: data.account_number,
      bank_name: data.bank_name,
      paypal_email: data.paypal_email,
      stripe_account_id: data.stripe_account_id,
      applepay_merchant_id: null, // Not in original schema
      is_active: data.is_active,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error) {
    console.error(`Error in updateSellerAccount for ${accountId}:`, error);
    throw error;
  }
}

// Delete a seller account
export async function deleteSellerAccount(accountId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('shop_payment_methods')
      .delete()
      .eq('id', accountId);
    
    if (error) {
      console.error(`Error deleting seller account ${accountId}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error in deleteSellerAccount for ${accountId}:`, error);
    return false;
  }
}

// Set a seller account as default
export async function setDefaultSellerAccount(accountId: string, shopId: string): Promise<boolean> {
  try {
    // First, set all accounts for this shop to not default
    const { error: resetError } = await supabase
      .from('shop_payment_methods')
      .update({ is_default: false })
      .eq('shop_id', shopId);
    
    if (resetError) {
      console.error('Error resetting default accounts:', resetError);
      return false;
    }
    
    // Then set the specified account as default
    const { error } = await supabase
      .from('shop_payment_methods')
      .update({ is_default: true })
      .eq('id', accountId);
    
    if (error) {
      console.error(`Error setting default account ${accountId}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error in setDefaultSellerAccount for ${accountId}:`, error);
    return false;
  }
}
