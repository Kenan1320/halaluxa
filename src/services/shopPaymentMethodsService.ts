
import { supabase } from '@/integrations/supabase/client';
import { SellerAccount } from './paymentService';

/**
 * Get all payment methods for the current user's shop
 */
export const getShopPaymentMethods = async (): Promise<SellerAccount[]> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('shop_payment_methods')
      .select('*')
      .eq('user_id', userData.user.id);

    if (error) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }

    return data as SellerAccount[];
  } catch (error) {
    console.error('Error in getShopPaymentMethods:', error);
    return [];
  }
};

/**
 * Create a new payment method for the seller's shop
 */
export const createShopPaymentMethod = async (paymentMethod: Partial<SellerAccount>): Promise<SellerAccount | null> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      throw new Error('User not authenticated');
    }

    // First get the shop id
    const { data: shopData, error: shopError } = await supabase
      .from('shops')
      .select('id')
      .eq('owner_id', userData.user.id)
      .single();

    if (shopError || !shopData) {
      console.error('Error finding shop for user:', shopError);
      throw new Error('Shop not found for current user');
    }

    // Prepare the payment method data
    const newPaymentMethod = {
      user_id: userData.user.id,
      shop_id: shopData.id,
      method_type: paymentMethod.method_type || 'bank',
      account_name: paymentMethod.account_name || null,
      account_number: paymentMethod.account_number || null,
      bank_name: paymentMethod.bank_name || null,
      paypal_email: paymentMethod.paypal_email || null,
      stripe_account_id: paymentMethod.stripe_account_id || null,
      applepay_merchant_id: paymentMethod.applepay_merchant_id || null,
      is_default: paymentMethod.is_default || false,
      is_active: true
    };

    // If this is the default payment method, first unset any existing defaults
    if (newPaymentMethod.is_default) {
      await supabase
        .from('shop_payment_methods')
        .update({ is_default: false })
        .eq('user_id', userData.user.id)
        .eq('is_default', true);
    }

    // Insert the new payment method
    const { data, error } = await supabase
      .from('shop_payment_methods')
      .insert(newPaymentMethod)
      .select()
      .single();

    if (error) {
      console.error('Error creating payment method:', error);
      throw error;
    }

    return data as SellerAccount;
  } catch (error) {
    console.error('Error in createShopPaymentMethod:', error);
    return null;
  }
};

/**
 * Update an existing payment method
 */
export const updateShopPaymentMethod = async (id: string, updates: Partial<SellerAccount>): Promise<SellerAccount | null> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      throw new Error('User not authenticated');
    }

    // Check if the payment method belongs to the user
    const { data: existing, error: checkError } = await supabase
      .from('shop_payment_methods')
      .select('*')
      .eq('id', id)
      .eq('user_id', userData.user.id)
      .single();

    if (checkError || !existing) {
      console.error('Payment method not found or not authorized:', checkError);
      throw new Error('Payment method not found or not authorized');
    }

    // If setting as default, first unset any existing defaults
    if (updates.is_default) {
      await supabase
        .from('shop_payment_methods')
        .update({ is_default: false })
        .eq('user_id', userData.user.id)
        .eq('is_default', true);
    }

    // Update the payment method
    const { data, error } = await supabase
      .from('shop_payment_methods')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating payment method:', error);
      throw error;
    }

    return data as SellerAccount;
  } catch (error) {
    console.error('Error in updateShopPaymentMethod:', error);
    return null;
  }
};

/**
 * Delete a payment method
 */
export const deleteShopPaymentMethod = async (id: string): Promise<boolean> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      throw new Error('User not authenticated');
    }

    // Check if the payment method belongs to the user
    const { data: existing, error: checkError } = await supabase
      .from('shop_payment_methods')
      .select('*')
      .eq('id', id)
      .eq('user_id', userData.user.id)
      .single();

    if (checkError || !existing) {
      console.error('Payment method not found or not authorized:', checkError);
      throw new Error('Payment method not found or not authorized');
    }

    // Delete the payment method
    const { error } = await supabase
      .from('shop_payment_methods')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting payment method:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteShopPaymentMethod:', error);
    return false;
  }
};

/**
 * Get the default payment method for the current user's shop
 */
export const getDefaultPaymentMethod = async (): Promise<SellerAccount | null> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('shop_payment_methods')
      .select('*')
      .eq('user_id', userData.user.id)
      .eq('is_default', true)
      .single();

    if (error) {
      console.error('Error fetching default payment method:', error);
      return null; // Don't throw, as this might be a legitimate "not found" case
    }

    return data as SellerAccount;
  } catch (error) {
    console.error('Error in getDefaultPaymentMethod:', error);
    return null;
  }
};
