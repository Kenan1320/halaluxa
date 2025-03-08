
import { supabase } from '@/integrations/supabase/client';
import { PaymentMethod } from '@/models/shop';

// Get all payment methods for the current user
export const getUserPaymentMethods = async (): Promise<PaymentMethod[]> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('shopper_payment_methods')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data.map(transformPaymentMethod);
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return [];
  }
};

// Get a specific payment method by ID
export const getPaymentMethod = async (id: string): Promise<PaymentMethod | null> => {
  try {
    const { data, error } = await supabase
      .from('shopper_payment_methods')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      throw error;
    }
    
    return transformPaymentMethod(data);
  } catch (error) {
    console.error(`Error fetching payment method ${id}:`, error);
    return null;
  }
};

// Add a new payment method
export const addPaymentMethod = async (paymentMethod: Partial<PaymentMethod>): Promise<PaymentMethod | null> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      throw new Error('User not authenticated');
    }
    
    // Check if this is the first payment method, make it default if so
    const { count, error: countError } = await supabase
      .from('shopper_payment_methods')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userData.user.id);
    
    if (countError) {
      throw countError;
    }
    
    const isDefault = count === 0 ? true : paymentMethod.isDefault || false;
    
    // If this is set as default, unset other defaults
    if (isDefault) {
      await supabase
        .from('shopper_payment_methods')
        .update({ is_default: false })
        .eq('user_id', userData.user.id);
    }
    
    // Format the data for insertion
    const dbPaymentMethod = {
      user_id: userData.user.id,
      payment_type: paymentMethod.paymentType,
      card_last_four: paymentMethod.cardLastFour,
      card_brand: paymentMethod.cardBrand,
      billing_address: paymentMethod.billingAddress ? JSON.stringify(paymentMethod.billingAddress) : null,
      is_default: isDefault,
      metadata: paymentMethod.metadata ? JSON.stringify(paymentMethod.metadata) : null
    };
    
    const { data, error } = await supabase
      .from('shopper_payment_methods')
      .insert(dbPaymentMethod)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return transformPaymentMethod(data);
  } catch (error) {
    console.error('Error adding payment method:', error);
    return null;
  }
};

// Update a payment method
export const updatePaymentMethod = async (id: string, updates: Partial<PaymentMethod>): Promise<PaymentMethod | null> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      throw new Error('User not authenticated');
    }
    
    // If setting as default, unset other defaults
    if (updates.isDefault) {
      await supabase
        .from('shopper_payment_methods')
        .update({ is_default: false })
        .eq('user_id', userData.user.id)
        .neq('id', id);
    }
    
    // Format the data for update
    const dbUpdates: any = {};
    
    if (updates.paymentType !== undefined) dbUpdates.payment_type = updates.paymentType;
    if (updates.cardLastFour !== undefined) dbUpdates.card_last_four = updates.cardLastFour;
    if (updates.cardBrand !== undefined) dbUpdates.card_brand = updates.cardBrand;
    if (updates.billingAddress !== undefined) dbUpdates.billing_address = JSON.stringify(updates.billingAddress);
    if (updates.isDefault !== undefined) dbUpdates.is_default = updates.isDefault;
    if (updates.metadata !== undefined) dbUpdates.metadata = JSON.stringify(updates.metadata);
    
    const { data, error } = await supabase
      .from('shopper_payment_methods')
      .update(dbUpdates)
      .eq('id', id)
      .eq('user_id', userData.user.id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return transformPaymentMethod(data);
  } catch (error) {
    console.error(`Error updating payment method ${id}:`, error);
    return null;
  }
};

// Delete a payment method
export const deletePaymentMethod = async (id: string): Promise<boolean> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      throw new Error('User not authenticated');
    }
    
    // Check if this is the default payment method
    const { data: method, error: fetchError } = await supabase
      .from('shopper_payment_methods')
      .select('is_default')
      .eq('id', id)
      .eq('user_id', userData.user.id)
      .single();
    
    if (fetchError) {
      throw fetchError;
    }
    
    // Delete the payment method
    const { error } = await supabase
      .from('shopper_payment_methods')
      .delete()
      .eq('id', id)
      .eq('user_id', userData.user.id);
    
    if (error) {
      throw error;
    }
    
    // If this was the default payment method, set a new default
    if (method && method.is_default) {
      const { data: availableMethods, error: listError } = await supabase
        .from('shopper_payment_methods')
        .select('id')
        .eq('user_id', userData.user.id)
        .limit(1);
      
      if (listError) {
        throw listError;
      }
      
      if (availableMethods && availableMethods.length > 0) {
        await supabase
          .from('shopper_payment_methods')
          .update({ is_default: true })
          .eq('id', availableMethods[0].id);
      }
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting payment method ${id}:`, error);
    return false;
  }
};

// Set a payment method as default
export const setDefaultPaymentMethod = async (id: string): Promise<boolean> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      throw new Error('User not authenticated');
    }
    
    // First unset all defaults
    await supabase
      .from('shopper_payment_methods')
      .update({ is_default: false })
      .eq('user_id', userData.user.id);
    
    // Then set the new default
    const { error } = await supabase
      .from('shopper_payment_methods')
      .update({ is_default: true })
      .eq('id', id)
      .eq('user_id', userData.user.id);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error(`Error setting default payment method ${id}:`, error);
    return false;
  }
};

// Helper function to transform database record to PaymentMethod model
const transformPaymentMethod = (data: any): PaymentMethod => {
  let billingAddress;
  
  try {
    billingAddress = data.billing_address ? JSON.parse(data.billing_address) : undefined;
  } catch (e) {
    billingAddress = undefined;
  }
  
  let metadata;
  
  try {
    metadata = data.metadata ? JSON.parse(data.metadata) : undefined;
  } catch (e) {
    metadata = undefined;
  }
  
  return {
    id: data.id,
    userId: data.user_id,
    paymentType: data.payment_type,
    cardLastFour: data.card_last_four,
    cardBrand: data.card_brand,
    billingAddress,
    isDefault: data.is_default,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    metadata
  };
};
