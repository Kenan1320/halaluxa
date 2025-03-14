
import supabase from '@/integrations/supabase/client';
import { UUID } from '@/models/types';

// Payment method types
export interface PaymentMethod {
  id: UUID;
  user_id: UUID;
  type: string;
  provider: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  brand: string;
  is_default: boolean;
  created_at: string; 
}

// Formats a payment method for display
export const formatPaymentMethod = (method: PaymentMethod): string => {
  if (!method) return 'No payment method';
  
  return `${method.brand} •••• ${method.last4} - Expires ${method.exp_month}/${method.exp_year}`;
};

// Get all payment methods for a user
export const getUserPaymentMethods = async (userId: UUID): Promise<PaymentMethod[]> => {
  try {
    // This should be replaced with the actual table name for payment methods
    const { data, error } = await supabase
      .from('shop_payment_methods')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching payment methods:', error);
      return [];
    }

    return (data || []) as PaymentMethod[];
  } catch (error) {
    console.error('Error in getUserPaymentMethods:', error);
    return [];
  }
};

// Get default payment method for a user
export const getDefaultPaymentMethod = async (userId: UUID): Promise<PaymentMethod | null> => {
  try {
    const { data, error } = await supabase
      .from('shop_payment_methods')
      .select('*')
      .eq('user_id', userId)
      .eq('is_default', true)
      .single();

    if (error) {
      console.error('Error fetching default payment method:', error);
      return null;
    }

    return data as PaymentMethod;
  } catch (error) {
    console.error('Error in getDefaultPaymentMethod:', error);
    return null;
  }
};

// Add a new payment method
export const addPaymentMethod = async (
  userId: UUID,
  paymentDetails: Omit<PaymentMethod, 'id' | 'user_id' | 'created_at'>
): Promise<PaymentMethod | null> => {
  try {
    const { data, error } = await supabase
      .from('shop_payment_methods')
      .insert({
        user_id: userId,
        ...paymentDetails
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding payment method:', error);
      return null;
    }

    return data as PaymentMethod;
  } catch (error) {
    console.error('Error in addPaymentMethod:', error);
    return null;
  }
};

// Set a payment method as default
export const setDefaultPaymentMethod = async (
  userId: UUID,
  paymentMethodId: UUID
): Promise<boolean> => {
  try {
    // First, unset all default payment methods for this user
    const { error: updateError } = await supabase
      .from('shop_payment_methods')
      .update({ is_default: false })
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error updating payment methods:', updateError);
      return false;
    }

    // Then set the selected payment method as default
    const { error } = await supabase
      .from('shop_payment_methods')
      .update({ is_default: true })
      .eq('id', paymentMethodId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error setting default payment method:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in setDefaultPaymentMethod:', error);
    return false;
  }
};

// Delete a payment method
export const deletePaymentMethod = async (
  userId: UUID,
  paymentMethodId: UUID
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('shop_payment_methods')
      .delete()
      .eq('id', paymentMethodId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting payment method:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deletePaymentMethod:', error);
    return false;
  }
};
