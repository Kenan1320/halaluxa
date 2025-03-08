
import { supabase } from '@/integrations/supabase/client';
import { PaymentMethod } from '@/models/shop';

// Function to get all payment methods for the current user
export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    // To make this work, first make sure you've run the SQL script to create the table
    const { data, error } = await supabase
      .from('shopper_payment_methods')
      .select('*')
      .eq('user_id', user.user.id)
      .order('is_default', { ascending: false });
    
    if (error) throw error;
    
    // Map the data to our model
    return data.map(method => ({
      id: method.id,
      userId: method.user_id,
      paymentType: method.payment_type,
      cardLastFour: method.card_last_four,
      cardBrand: method.card_brand,
      billingAddress: method.billing_address,
      isDefault: method.is_default,
      createdAt: method.created_at,
      updatedAt: method.updated_at,
      metadata: method.metadata
    }));
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return [];
  }
};

// Function to add a new payment method
export const addPaymentMethod = async (paymentMethod: Omit<PaymentMethod, 'id' | 'createdAt' | 'updatedAt'>): Promise<PaymentMethod | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    // If this is the default method, unset other default methods
    if (paymentMethod.isDefault) {
      await supabase
        .from('shopper_payment_methods')
        .update({ is_default: false })
        .eq('user_id', user.user.id);
    }
    
    // Insert the new payment method
    const { data, error } = await supabase
      .from('shopper_payment_methods')
      .insert({
        user_id: user.user.id,
        payment_type: paymentMethod.paymentType,
        card_last_four: paymentMethod.cardLastFour,
        card_brand: paymentMethod.cardBrand,
        billing_address: paymentMethod.billingAddress,
        is_default: paymentMethod.isDefault,
        metadata: paymentMethod.metadata,
      })
      .select()
      .single();
    
    if (error) throw error;
    
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

// Function to update a payment method
export const updatePaymentMethod = async (id: string, updates: Partial<PaymentMethod>): Promise<PaymentMethod | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    // If making this the default, unset other defaults
    if (updates.isDefault) {
      await supabase
        .from('shopper_payment_methods')
        .update({ is_default: false })
        .eq('user_id', user.user.id)
        .neq('id', id);
    }
    
    // Update the payment method
    const { data, error } = await supabase
      .from('shopper_payment_methods')
      .update({
        payment_type: updates.paymentType,
        card_last_four: updates.cardLastFour,
        card_brand: updates.cardBrand,
        billing_address: updates.billingAddress,
        is_default: updates.isDefault,
        metadata: updates.metadata,
      })
      .eq('id', id)
      .eq('user_id', user.user.id)
      .select()
      .single();
    
    if (error) throw error;
    
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
    console.error('Error updating payment method:', error);
    return null;
  }
};

// Function to delete a payment method
export const deletePaymentMethod = async (id: string): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    const { error } = await supabase
      .from('shopper_payment_methods')
      .delete()
      .eq('id', id)
      .eq('user_id', user.user.id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting payment method:', error);
    return false;
  }
};

// Function to set a payment method as default
export const setDefaultPaymentMethod = async (id: string): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    // First, unset all defaults
    await supabase
      .from('shopper_payment_methods')
      .update({ is_default: false })
      .eq('user_id', user.user.id);
    
    // Then set the new default
    const { error } = await supabase
      .from('shopper_payment_methods')
      .update({ is_default: true })
      .eq('id', id)
      .eq('user_id', user.user.id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error setting default payment method:', error);
    return false;
  }
};
