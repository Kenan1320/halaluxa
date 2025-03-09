
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { SellerAccount, PaymentResult } from '@/models/payment';

// Process a payment and create an order
export const processPayment = async (cart: any, paymentMethodDetails: any, shippingDetails: any): Promise<PaymentResult> => {
  try {
    // Generate an order ID
    const orderId = uuidv4();
    const orderDate = new Date().toISOString();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }
    
    // In a real app, we would process the payment with a payment provider
    // For demo purposes, we'll simulate a successful payment
    
    // Create an order in the database
    const { error } = await supabase.from('orders').insert({
      id: orderId,
      user_id: user.id,
      date: orderDate,
      total: cart.totalPrice,
      items: cart.items,
      status: 'paid',
      shipping_details: shippingDetails
    });

    if (error) {
      console.error('Error creating order:', error);
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      orderId,
      orderDate
    };
  } catch (error: any) {
    console.error('Payment processing error:', error);
    return {
      success: false,
      error: error.message || 'An error occurred during payment processing'
    };
  }
};

// Format payment method for display
export function formatPaymentMethod(account: SellerAccount): string {
  switch(account.methodType) {
    case 'bank':
      return `${account.bankName}: ${account.accountName} (${account.accountNumber?.slice(-4)})`;
    case 'paypal':
      return `PayPal: ${account.paypalEmail}`;
    case 'stripe':
      return `Stripe Account`;
    case 'applepay':
      return `Apple Pay`;
    default:
      return 'Unknown payment method';
  }
}

// Get all seller accounts for the current user
export async function getSellerAccounts(options: { shopId?: string } = {}): Promise<SellerAccount[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return [];
    }

    let query = supabase.from('shop_payment_methods').select('*');
    if (options.shopId) {
      query = query.eq('shop_id', options.shopId);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching seller accounts:', error);
      return [];
    }

    // Convert to our application model
    return data.map((item) => ({
      id: item.id,
      userId: user.id,
      shopId: item.shop_id,
      methodType: item.method_type as "bank" | "paypal" | "stripe" | "applepay",
      accountName: item.account_name,
      accountNumber: item.account_number,
      bankName: item.bank_name,
      paypalEmail: item.paypal_email,
      stripeAccountId: item.stripe_account_id,
      applePayMerchantId: null,
      isActive: item.is_active,
      isDefault: item.is_default || false,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
  } catch (error) {
    console.error('Error in getSellerAccounts:', error);
    return [];
  }
}

// Get a specific seller account
export async function getSellerAccount(accountId: string): Promise<SellerAccount | null> {
  try {
    const { data, error } = await supabase.from('shop_payment_methods').select('*').eq('id', accountId).single();
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
      userId: user.id,
      shopId: data.shop_id,
      methodType: data.method_type as "bank" | "paypal" | "stripe" | "applepay",
      accountName: data.account_name,
      accountNumber: data.account_number,
      bankName: data.bank_name,
      paypalEmail: data.paypal_email,
      stripeAccountId: data.stripe_account_id,
      applePayMerchantId: null,
      isActive: data.is_active,
      isDefault: !!data.is_default,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error(`Error in getSellerAccount for ${accountId}:`, error);
    return null;
  }
}

// Create a new seller account
export async function createSellerAccount(accountData: Partial<SellerAccount>, options: { shopId?: string } = {}): Promise<SellerAccount> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get the shop ID if not provided
    let shopId = options.shopId;
    if (!shopId) {
      // Get the user's shop
      const { data: shopData, error: shopError } = await supabase.from('shops').select('id').eq('owner_id', user.id).single();
      if (shopError) {
        console.error('Error fetching user shop:', shopError);
        throw new Error('Could not find user shop');
      }
      shopId = shopData.id;
    }

    // Prepare data for insertion
    const insertData = {
      shop_id: shopId,
      method_type: accountData.methodType,
      account_name: accountData.accountName,
      account_number: accountData.accountNumber,
      bank_name: accountData.bankName,
      paypal_email: accountData.paypalEmail,
      stripe_account_id: accountData.stripeAccountId,
      is_active: true,
      is_default: accountData.isDefault || false
    };

    const { data, error } = await supabase.from('shop_payment_methods').insert(insertData).select().single();
    if (error) {
      console.error('Error creating seller account:', error);
      throw error;
    }

    return {
      id: data.id,
      userId: user.id,
      shopId: data.shop_id,
      methodType: data.method_type as "bank" | "paypal" | "stripe" | "applepay",
      accountName: data.account_name,
      accountNumber: data.account_number,
      bankName: data.bank_name,
      paypalEmail: data.paypal_email,
      stripeAccountId: data.stripe_account_id,
      applePayMerchantId: null,
      isActive: data.is_active,
      isDefault: !!data.is_default,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error('Error in createSellerAccount:', error);
    throw error;
  }
}

// Update an existing seller account
export async function updateSellerAccount(accountId: string, accountData: Partial<SellerAccount>): Promise<SellerAccount> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Prepare update data
    const updateData: Record<string, any> = {};
    if (accountData.methodType) updateData.method_type = accountData.methodType;
    if (accountData.accountName) updateData.account_name = accountData.accountName;
    if (accountData.accountNumber) updateData.account_number = accountData.accountNumber;
    if (accountData.bankName) updateData.bank_name = accountData.bankName;
    if (accountData.paypalEmail) updateData.paypal_email = accountData.paypalEmail;
    if (accountData.stripeAccountId) updateData.stripe_account_id = accountData.stripeAccountId;
    if (accountData.isActive !== undefined) updateData.is_active = accountData.isActive;
    if (accountData.isDefault !== undefined) updateData.is_default = accountData.isDefault;

    const { data, error } = await supabase.from('shop_payment_methods').update(updateData).eq('id', accountId).select().single();
    if (error) {
      console.error(`Error updating seller account ${accountId}:`, error);
      throw error;
    }

    return {
      id: data.id,
      userId: user.id,
      shopId: data.shop_id,
      methodType: data.method_type as "bank" | "paypal" | "stripe" | "applepay",
      accountName: data.account_name,
      accountNumber: data.account_number,
      bankName: data.bank_name,
      paypalEmail: data.paypal_email,
      stripeAccountId: data.stripe_account_id,
      applePayMerchantId: null,
      isActive: data.is_active,
      isDefault: !!data.is_default,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error(`Error in updateSellerAccount for ${accountId}:`, error);
    throw error;
  }
}

// Delete a seller account
export async function deleteSellerAccount(accountId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('shop_payment_methods').delete().eq('id', accountId);
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
    const { error: resetError } = await supabase.from('shop_payment_methods').update({
      is_default: false
    }).eq('shop_id', shopId);

    if (resetError) {
      console.error('Error resetting default accounts:', resetError);
      return false;
    }

    // Then set the specified account as default
    const { error } = await supabase.from('shop_payment_methods').update({
      is_default: true
    }).eq('id', accountId);

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

// Export the SellerAccount and PaymentResult types
export type { SellerAccount, PaymentResult };
