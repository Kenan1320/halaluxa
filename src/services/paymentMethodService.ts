
import { supabase } from '@/integrations/supabase/client';

export interface PaymentMethod {
  id: string;
  userId: string;
  paymentType: 'card' | 'paypal' | 'applepay' | 'googlepay';
  cardLastFour?: string;
  cardBrand?: string;
  billingAddress?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

// Get payment methods for the current user
export const getUserPaymentMethods = async (): Promise<PaymentMethod[]> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('shopper_payment_methods')
      .select('*')
      .eq('user_id', user.user.id)
      .order('is_default', { ascending: false });
    
    if (error) throw error;
    
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

// Save a new payment method
export const savePaymentMethod = async (method: Omit<PaymentMethod, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<PaymentMethod | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    // If this is the default method, unset any existing default
    if (method.isDefault) {
      await supabase
        .from('shopper_payment_methods')
        .update({ is_default: false })
        .eq('user_id', user.user.id)
        .eq('is_default', true);
    }
    
    const { data, error } = await supabase
      .from('shopper_payment_methods')
      .insert({
        user_id: user.user.id,
        payment_type: method.paymentType,
        card_last_four: method.cardLastFour,
        card_brand: method.cardBrand,
        billing_address: method.billingAddress,
        is_default: method.isDefault,
        metadata: method.metadata
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
    console.error('Error saving payment method:', error);
    return null;
  }
};

// Update an existing payment method
export const updatePaymentMethod = async (id: string, updates: Partial<PaymentMethod>): Promise<PaymentMethod | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    // If this is being set as default, unset any existing default
    if (updates.isDefault) {
      await supabase
        .from('shopper_payment_methods')
        .update({ is_default: false })
        .eq('user_id', user.user.id)
        .eq('is_default', true)
        .neq('id', id);
    }
    
    const { data, error } = await supabase
      .from('shopper_payment_methods')
      .update({
        payment_type: updates.paymentType,
        card_last_four: updates.cardLastFour,
        card_brand: updates.cardBrand,
        billing_address: updates.billingAddress,
        is_default: updates.isDefault,
        metadata: updates.metadata,
        updated_at: new Date().toISOString()
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

// Delete a payment method
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

// Set a payment method as default
export const setDefaultPaymentMethod = async (id: string): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    // First, unset any existing default
    await supabase
      .from('shopper_payment_methods')
      .update({ is_default: false })
      .eq('user_id', user.user.id)
      .eq('is_default', true);
    
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

// Get the default payment method for the current user
export const getDefaultPaymentMethod = async (): Promise<PaymentMethod | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('shopper_payment_methods')
      .select('*')
      .eq('user_id', user.user.id)
      .eq('is_default', true)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No default payment method found
        return null;
      }
      throw error;
    }
    
    if (!data) return null;
    
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
    console.error('Error fetching default payment method:', error);
    return null;
  }
};
