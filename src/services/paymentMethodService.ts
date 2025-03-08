
import { supabase } from '@/integrations/supabase/client';
import { PaymentMethod } from '@/models/shop';

// Get payment method by ID
export const getPaymentMethod = async (methodId: string): Promise<PaymentMethod | null> => {
  try {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('id', methodId)
      .single();
    
    if (error) {
      console.error('Error fetching payment method:', error);
      return null;
    }
    
    if (!data) return null;
    
    return {
      id: data.id,
      userId: data.user_id,
      paymentType: data.payment_type,
      cardLastFour: data.card_last_four,
      cardBrand: data.card_brand,
      billingAddress: data.billing_address ? JSON.parse(data.billing_address) : undefined,
      isDefault: !!data.is_default,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      metadata: data.metadata ? JSON.parse(data.metadata) : {},
    };
  } catch (error) {
    console.error('Error in getPaymentMethod:', error);
    return null;
  }
};

// Get all payment methods for a user
export const getUserPaymentMethods = async (userId: string): Promise<PaymentMethod[]> => {
  try {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching user payment methods:', error);
      return [];
    }
    
    return data.map(method => ({
      id: method.id,
      userId: method.user_id,
      paymentType: method.payment_type,
      cardLastFour: method.card_last_four,
      cardBrand: method.card_brand,
      billingAddress: method.billing_address ? JSON.parse(method.billing_address) : undefined,
      isDefault: !!method.is_default,
      createdAt: method.created_at,
      updatedAt: method.updated_at,
      metadata: method.metadata ? JSON.parse(method.metadata) : {},
    }));
  } catch (error) {
    console.error('Error in getUserPaymentMethods:', error);
    return [];
  }
};

// Add a new payment method
export const addPaymentMethod = async (paymentMethodData: {
  userId: string;
  paymentType: 'card' | 'paypal' | 'applepay' | 'googlepay';
  cardLastFour?: string;
  cardBrand?: string;
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  isDefault?: boolean;
  metadata?: any;
}): Promise<PaymentMethod | null> => {
  try {
    const dbPaymentMethod = {
      user_id: paymentMethodData.userId,
      payment_type: paymentMethodData.paymentType,
      card_last_four: paymentMethodData.cardLastFour || null,
      card_brand: paymentMethodData.cardBrand || null,
      billing_address: paymentMethodData.billingAddress ? JSON.stringify(paymentMethodData.billingAddress) : null,
      is_default: !!paymentMethodData.isDefault,
      metadata: paymentMethodData.metadata ? JSON.stringify(paymentMethodData.metadata) : null
    };
    
    // If setting this payment method as default, unset any previous default
    if (paymentMethodData.isDefault) {
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', paymentMethodData.userId)
        .eq('is_default', true);
    }
    
    const { data, error } = await supabase
      .from('payment_methods')
      .insert(dbPaymentMethod)
      .select()
      .single();
    
    if (error) {
      console.error('Error adding payment method:', error);
      return null;
    }
    
    return {
      id: data.id,
      userId: data.user_id,
      paymentType: data.payment_type,
      cardLastFour: data.card_last_four,
      cardBrand: data.card_brand,
      billingAddress: data.billing_address ? JSON.parse(data.billing_address) : undefined,
      isDefault: !!data.is_default,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      metadata: data.metadata ? JSON.parse(data.metadata) : {},
    };
  } catch (error) {
    console.error('Error in addPaymentMethod:', error);
    return null;
  }
};

// Update an existing payment method
export const updatePaymentMethod = async (
  methodId: string,
  updates: {
    cardLastFour?: string;
    cardBrand?: string;
    billingAddress?: {
      street: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
    isDefault?: boolean;
    metadata?: any;
  }
): Promise<PaymentMethod | null> => {
  try {
    const dbUpdates: any = {};
    
    if (updates.cardLastFour !== undefined) {
      dbUpdates.card_last_four = updates.cardLastFour;
    }
    
    if (updates.cardBrand !== undefined) {
      dbUpdates.card_brand = updates.cardBrand;
    }
    
    if (updates.billingAddress !== undefined) {
      dbUpdates.billing_address = JSON.stringify(updates.billingAddress);
    }
    
    if (updates.metadata !== undefined) {
      dbUpdates.metadata = JSON.stringify(updates.metadata);
    }
    
    if (updates.isDefault) {
      // Get the payment method to find its user_id
      const { data: methodData } = await supabase
        .from('payment_methods')
        .select('user_id')
        .eq('id', methodId)
        .single();
      
      if (methodData) {
        const userId = methodData.user_id;
        
        // Unset any previous default
        await supabase
          .from('payment_methods')
          .update({ is_default: false })
          .eq('user_id', userId)
          .eq('is_default', true);
      }
      
      dbUpdates.is_default = true;
    }
    
    const { data, error } = await supabase
      .from('payment_methods')
      .update(dbUpdates)
      .eq('id', methodId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating payment method:', error);
      return null;
    }
    
    return {
      id: data.id,
      userId: data.user_id,
      paymentType: data.payment_type,
      cardLastFour: data.card_last_four,
      cardBrand: data.card_brand,
      billingAddress: data.billing_address ? JSON.parse(data.billing_address) : undefined,
      isDefault: !!data.is_default,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      metadata: data.metadata ? JSON.parse(data.metadata) : {},
    };
  } catch (error) {
    console.error('Error in updatePaymentMethod:', error);
    return null;
  }
};

// Delete a payment method
export const deletePaymentMethod = async (methodId: string): Promise<boolean> => {
  try {
    // If this is a default payment method, find another to make default
    const { data: currentMethod } = await supabase
      .from('payment_methods')
      .select('user_id, is_default')
      .eq('id', methodId)
      .single();
    
    if (currentMethod && currentMethod.is_default) {
      // Find another payment method for this user
      const { data: otherMethods } = await supabase
        .from('payment_methods')
        .select('id')
        .eq('user_id', currentMethod.user_id)
        .neq('id', methodId)
        .limit(1);
      
      if (otherMethods && otherMethods.length > 0) {
        // Make another method the default
        await supabase
          .from('payment_methods')
          .update({ is_default: true })
          .eq('id', otherMethods[0].id);
      }
    }
    
    const { error } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', methodId);
    
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

// Set a payment method as default
export const setDefaultPaymentMethod = async (methodId: string): Promise<boolean> => {
  try {
    // Get the user ID for this payment method
    const { data: methodData, error: methodError } = await supabase
      .from('payment_methods')
      .select('user_id')
      .eq('id', methodId)
      .single();
    
    if (methodError || !methodData) {
      console.error('Error finding payment method:', methodError);
      return false;
    }
    
    // Unset any previous default for this user
    const { error: updateError } = await supabase
      .from('payment_methods')
      .update({ is_default: false })
      .eq('user_id', methodData.user_id)
      .eq('is_default', true);
    
    if (updateError) {
      console.error('Error unsetting previous default payment method:', updateError);
    }
    
    // Set this method as default
    const { error } = await supabase
      .from('payment_methods')
      .update({ is_default: true })
      .eq('id', methodId);
    
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
