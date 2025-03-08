
import { supabase } from '@/integrations/supabase/client';

export interface PaymentMethod {
  id: string;
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
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

// Get all payment methods for a user
export async function getUserPaymentMethods(userId: string): Promise<PaymentMethod[]> {
  try {
    const { data, error } = await supabase
      .from('shopper_payment_methods')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching payment methods:', error);
      return [];
    }
    
    // Map database fields to model
    return data.map(item => ({
      id: item.id,
      userId: item.user_id,
      paymentType: item.payment_type as PaymentMethod['paymentType'],
      cardLastFour: item.card_last_four,
      cardBrand: item.card_brand,
      billingAddress: item.billing_address,
      isDefault: item.is_default,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      metadata: item.metadata
    }));
  } catch (error) {
    console.error('Error in getUserPaymentMethods:', error);
    return [];
  }
}

// Set a payment method as default
export async function setDefaultPaymentMethod(userId: string, paymentMethodId: string): Promise<boolean> {
  try {
    // First, unset all existing default payment methods
    await supabase
      .from('shopper_payment_methods')
      .update({ is_default: false })
      .eq('user_id', userId);
    
    // Then set the selected one as default
    const { error } = await supabase
      .from('shopper_payment_methods')
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
}

// Add a new payment method
export async function addPaymentMethod(paymentMethod: Omit<PaymentMethod, 'id' | 'createdAt' | 'updatedAt'>): Promise<PaymentMethod | null> {
  try {
    // If this is the first payment method for the user, set it as default
    const existingMethods = await getUserPaymentMethods(paymentMethod.userId);
    const isDefault = existingMethods.length === 0 ? true : paymentMethod.isDefault;
    
    // If this method is going to be default, unset any existing defaults
    if (isDefault) {
      await supabase
        .from('shopper_payment_methods')
        .update({ is_default: false })
        .eq('user_id', paymentMethod.userId);
    }
    
    // Insert the new payment method
    const { data, error } = await supabase
      .from('shopper_payment_methods')
      .insert({
        user_id: paymentMethod.userId,
        payment_type: paymentMethod.paymentType,
        card_last_four: paymentMethod.cardLastFour,
        card_brand: paymentMethod.cardBrand,
        billing_address: paymentMethod.billingAddress,
        is_default: isDefault,
        metadata: paymentMethod.metadata || {}
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error adding payment method:', error);
      return null;
    }
    
    // Return the created payment method
    return {
      id: data.id,
      userId: data.user_id,
      paymentType: data.payment_type as PaymentMethod['paymentType'],
      cardLastFour: data.card_last_four,
      cardBrand: data.card_brand,
      billingAddress: data.billing_address,
      isDefault: data.is_default,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      metadata: data.metadata
    };
  } catch (error) {
    console.error('Error in addPaymentMethod:', error);
    return null;
  }
}

// Delete a payment method
export async function deletePaymentMethod(paymentMethodId: string, userId: string): Promise<boolean> {
  try {
    // First check if this is the default payment method
    const { data, error: fetchError } = await supabase
      .from('shopper_payment_methods')
      .select('is_default')
      .eq('id', paymentMethodId)
      .eq('user_id', userId)
      .single();
    
    if (fetchError) {
      console.error('Error fetching payment method:', fetchError);
      return false;
    }
    
    // Delete the payment method
    const { error } = await supabase
      .from('shopper_payment_methods')
      .delete()
      .eq('id', paymentMethodId)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error deleting payment method:', error);
      return false;
    }
    
    // If this was the default payment method, set a new default if any exist
    if (data.is_default) {
      const { data: remainingMethods, error: listError } = await supabase
        .from('shopper_payment_methods')
        .select('id')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (!listError && remainingMethods.length > 0) {
        await supabase
          .from('shopper_payment_methods')
          .update({ is_default: true })
          .eq('id', remainingMethods[0].id);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in deletePaymentMethod:', error);
    return false;
  }
}

// Update a payment method
export async function updatePaymentMethod(
  paymentMethodId: string,
  updates: Partial<Omit<PaymentMethod, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
): Promise<PaymentMethod | null> {
  try {
    // Prepare the update data
    const updateData: any = {};
    
    if (updates.paymentType !== undefined) updateData.payment_type = updates.paymentType;
    if (updates.cardLastFour !== undefined) updateData.card_last_four = updates.cardLastFour;
    if (updates.cardBrand !== undefined) updateData.card_brand = updates.cardBrand;
    if (updates.billingAddress !== undefined) updateData.billing_address = updates.billingAddress;
    if (updates.metadata !== undefined) updateData.metadata = updates.metadata;
    
    // Handle isDefault separately since it requires additional logic
    if (updates.isDefault !== undefined) {
      // Get the payment method to find the user ID
      const { data: paymentMethod, error: fetchError } = await supabase
        .from('shopper_payment_methods')
        .select('user_id')
        .eq('id', paymentMethodId)
        .single();
      
      if (fetchError) {
        console.error('Error fetching payment method:', fetchError);
        return null;
      }
      
      // If setting as default, unset all other payment methods
      if (updates.isDefault) {
        await supabase
          .from('shopper_payment_methods')
          .update({ is_default: false })
          .eq('user_id', paymentMethod.user_id);
      }
      
      updateData.is_default = updates.isDefault;
    }
    
    // Update the payment method
    updateData.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('shopper_payment_methods')
      .update(updateData)
      .eq('id', paymentMethodId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating payment method:', error);
      return null;
    }
    
    // Return the updated payment method
    return {
      id: data.id,
      userId: data.user_id,
      paymentType: data.payment_type as PaymentMethod['paymentType'],
      cardLastFour: data.card_last_four,
      cardBrand: data.card_brand,
      billingAddress: data.billing_address,
      isDefault: data.is_default,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      metadata: data.metadata
    };
  } catch (error) {
    console.error('Error in updatePaymentMethod:', error);
    return null;
  }
}
