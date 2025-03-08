
import { supabase } from '@/integrations/supabase/client';
import { PaymentMethod } from '@/models/shop';

// Get all payment methods for the current user
export const getUserPaymentMethods = async (): Promise<PaymentMethod[]> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      throw new Error('User not authenticated');
    }
    
    // We'll need to create this table in Supabase
    const { data, error } = await supabase
      .from('shopper_payment_methods')
      .select('*')
      .eq('user_id', userData.user.id);
    
    if (error) {
      throw error;
    }
    
    return data.map(item => ({
      id: item.id,
      userId: item.user_id,
      paymentType: item.payment_type,
      cardLastFour: item.card_last_four,
      cardBrand: item.card_brand,
      billingAddress: item.billing_address,
      isDefault: item.is_default,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      metadata: item.metadata
    })) || [];
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return [];
  }
};

// Set a payment method as default
export const setDefaultPaymentMethod = async (paymentMethodId: string): Promise<boolean> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      throw new Error('User not authenticated');
    }
    
    // First, reset all payment methods to non-default
    const { error: resetError } = await supabase
      .from('shopper_payment_methods')
      .update({ is_default: false })
      .eq('user_id', userData.user.id);
    
    if (resetError) {
      throw resetError;
    }
    
    // Then set the selected one as default
    const { error } = await supabase
      .from('shopper_payment_methods')
      .update({ is_default: true })
      .eq('id', paymentMethodId)
      .eq('user_id', userData.user.id);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error setting default payment method:', error);
    return false;
  }
};

// Add a new payment method
export const addPaymentMethod = async (paymentMethod: Omit<PaymentMethod, 'id' | 'createdAt' | 'updatedAt'>): Promise<PaymentMethod | null> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      throw new Error('User not authenticated');
    }
    
    const paymentData = {
      user_id: userData.user.id,
      payment_type: paymentMethod.paymentType,
      card_last_four: paymentMethod.cardLastFour,
      card_brand: paymentMethod.cardBrand,
      billing_address: paymentMethod.billingAddress,
      is_default: paymentMethod.isDefault,
      metadata: paymentMethod.metadata
    };
    
    const { data, error } = await supabase
      .from('shopper_payment_methods')
      .insert([paymentData])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      id: data.id,
      userId: data.user_id,
      paymentType: data.payment_type,
      cardLastFour: data.card_last_four,
      cardBrand: data.card_brand,
      billingAddress: data.billing_address,
      isDefault: data.is_default,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      metadata: data.metadata
    };
  } catch (error) {
    console.error('Error adding payment method:', error);
    return null;
  }
};

// Delete a payment method
export const deletePaymentMethod = async (paymentMethodId: string): Promise<boolean> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      throw new Error('User not authenticated');
    }
    
    const { error } = await supabase
      .from('shopper_payment_methods')
      .delete()
      .eq('id', paymentMethodId)
      .eq('user_id', userData.user.id);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting payment method:', error);
    return false;
  }
};

// Get a payment method by ID
export const getPaymentMethodById = async (paymentMethodId: string): Promise<PaymentMethod | null> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('shopper_payment_methods')
      .select('*')
      .eq('id', paymentMethodId)
      .eq('user_id', userData.user.id)
      .single();
    
    if (error) {
      throw error;
    }
    
    if (!data) {
      return null;
    }
    
    return {
      id: data.id,
      userId: data.user_id,
      paymentType: data.payment_type,
      cardLastFour: data.card_last_four,
      cardBrand: data.card_brand,
      billingAddress: data.billing_address,
      isDefault: data.is_default,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      metadata: data.metadata
    };
  } catch (error) {
    console.error('Error fetching payment method:', error);
    return null;
  }
};
