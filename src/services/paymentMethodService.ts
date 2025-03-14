
import { supabase } from '@/integrations/supabase/client';

export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'card' | 'bank_account' | 'paypal';
  provider: string;
  last4?: string;
  expMonth?: number;
  expYear?: number;
  brand?: string;
  isDefault: boolean;
  createdAt: string;
}

export const getPaymentMethods = async (userId: string): Promise<PaymentMethod[]> => {
  try {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(method => ({
      id: method.id,
      userId: method.user_id,
      type: method.type,
      provider: method.provider,
      last4: method.last4,
      expMonth: method.exp_month,
      expYear: method.exp_year,
      brand: method.brand,
      isDefault: method.is_default,
      createdAt: method.created_at
    }));
  } catch (error) {
    console.error('Error getting payment methods:', error);
    return [];
  }
};

export const addPaymentMethod = async (
  userId: string,
  paymentDetails: Omit<PaymentMethod, 'id' | 'userId' | 'createdAt' | 'isDefault'>
): Promise<PaymentMethod | null> => {
  try {
    // First, check if this will be the first payment method
    const { data: existingMethods } = await supabase
      .from('payment_methods')
      .select('id')
      .eq('user_id', userId);
    
    const isDefault = !existingMethods || existingMethods.length === 0;
    
    const { data, error } = await supabase
      .from('payment_methods')
      .insert([{
        id: crypto.randomUUID(),
        user_id: userId,
        type: paymentDetails.type,
        provider: paymentDetails.provider,
        last4: paymentDetails.last4,
        exp_month: paymentDetails.expMonth,
        exp_year: paymentDetails.expYear,
        brand: paymentDetails.brand,
        is_default: isDefault,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    return data ? {
      id: data.id,
      userId: data.user_id,
      type: data.type,
      provider: data.provider,
      last4: data.last4,
      expMonth: data.exp_month,
      expYear: data.exp_year,
      brand: data.brand,
      isDefault: data.is_default,
      createdAt: data.created_at
    } : null;
  } catch (error) {
    console.error('Error adding payment method:', error);
    return null;
  }
};

export const setDefaultPaymentMethod = async (userId: string, paymentMethodId: string): Promise<boolean> => {
  try {
    // First, set all payment methods to non-default
    await supabase
      .from('payment_methods')
      .update({ is_default: false })
      .eq('user_id', userId);
    
    // Then set the selected one to default
    const { error } = await supabase
      .from('payment_methods')
      .update({ is_default: true })
      .eq('id', paymentMethodId)
      .eq('user_id', userId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error setting default payment method:', error);
    return false;
  }
};

export const deletePaymentMethod = async (userId: string, paymentMethodId: string): Promise<boolean> => {
  try {
    // First, check if this is the default payment method
    const { data: method, error: fetchError } = await supabase
      .from('payment_methods')
      .select('is_default')
      .eq('id', paymentMethodId)
      .eq('user_id', userId)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Delete the payment method
    const { error: deleteError } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', paymentMethodId)
      .eq('user_id', userId);
    
    if (deleteError) throw deleteError;
    
    // If it was the default, set a new default if available
    if (method && method.is_default) {
      const { data: otherMethods, error: otherError } = await supabase
        .from('payment_methods')
        .select('id')
        .eq('user_id', userId)
        .limit(1);
      
      if (otherError) throw otherError;
      
      if (otherMethods && otherMethods.length > 0) {
        await setDefaultPaymentMethod(userId, otherMethods[0].id);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting payment method:', error);
    return false;
  }
};

export const formatPaymentMethod = (method: PaymentMethod): string => {
  if (method.type === 'card') {
    return `${method.brand} •••• ${method.last4} (Expires ${method.expMonth}/${method.expYear})`;
  } else if (method.type === 'bank_account') {
    return `Bank Account •••• ${method.last4}`;
  } else if (method.type === 'paypal') {
    return 'PayPal';
  }
  return 'Unknown Payment Method';
};
