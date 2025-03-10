
import { supabase } from '@/integrations/supabase/client';

// Define the PaymentMethod interface
export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'card' | 'bank_account';
  provider: string;
  last4: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  createdAt: string;
}

// Map database payment method to model
const mapDbPaymentMethodToModel = (data: any): PaymentMethod => {
  return {
    id: data.id,
    userId: data.user_id,
    type: data.type,
    provider: data.provider,
    last4: data.last4,
    expiryMonth: data.expiry_month,
    expiryYear: data.expiry_year,
    isDefault: data.is_default,
    createdAt: data.created_at
  };
};

// Get all payment methods for a user
export async function getPaymentMethodsByUser(userId: string): Promise<PaymentMethod[]> {
  try {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false });
    
    if (error) {
      console.error('Error fetching payment methods:', error);
      return [];
    }
    
    return data.map(mapDbPaymentMethodToModel);
  } catch (err) {
    console.error('Error in getPaymentMethodsByUser:', err);
    return [];
  }
}

// Get a payment method by ID
export async function getPaymentMethodById(id: string): Promise<PaymentMethod | null> {
  try {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      console.error('Error fetching payment method:', error);
      return null;
    }
    
    return mapDbPaymentMethodToModel(data);
  } catch (err) {
    console.error('Error in getPaymentMethodById:', err);
    return null;
  }
}

// Add a new payment method
export async function addPaymentMethod(paymentMethod: Omit<PaymentMethod, 'id' | 'createdAt'>): Promise<PaymentMethod | null> {
  try {
    // Convert from model to database field names
    const dbPaymentMethod = {
      user_id: paymentMethod.userId,
      type: paymentMethod.type,
      provider: paymentMethod.provider,
      last4: paymentMethod.last4,
      expiry_month: paymentMethod.expiryMonth,
      expiry_year: paymentMethod.expiryYear,
      is_default: paymentMethod.isDefault
    };
    
    // If this is the default method, unset any existing default
    if (paymentMethod.isDefault) {
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', paymentMethod.userId)
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
    
    return mapDbPaymentMethodToModel(data);
  } catch (err) {
    console.error('Error in addPaymentMethod:', err);
    return null;
  }
}

// Update a payment method
export async function updatePaymentMethod(id: string, updates: Partial<PaymentMethod>): Promise<PaymentMethod | null> {
  try {
    // Convert from model to database field names
    const dbUpdates: any = {};
    if (updates.type !== undefined) dbUpdates.type = updates.type;
    if (updates.provider !== undefined) dbUpdates.provider = updates.provider;
    if (updates.last4 !== undefined) dbUpdates.last4 = updates.last4;
    if (updates.expiryMonth !== undefined) dbUpdates.expiry_month = updates.expiryMonth;
    if (updates.expiryYear !== undefined) dbUpdates.expiry_year = updates.expiryYear;
    
    // Handle the isDefault flag specially
    if (updates.isDefault === true) {
      // Get the payment method to get the user ID
      const { data: existingMethod } = await supabase
        .from('payment_methods')
        .select('user_id')
        .eq('id', id)
        .single();
      
      if (existingMethod) {
        // Unset any existing default payment methods for this user
        await supabase
          .from('payment_methods')
          .update({ is_default: false })
          .eq('user_id', existingMethod.user_id)
          .eq('is_default', true);
      }
      
      dbUpdates.is_default = true;
    } else if (updates.isDefault === false) {
      dbUpdates.is_default = false;
    }
    
    const { data, error } = await supabase
      .from('payment_methods')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating payment method:', error);
      return null;
    }
    
    return mapDbPaymentMethodToModel(data);
  } catch (err) {
    console.error('Error in updatePaymentMethod:', err);
    return null;
  }
}

// Delete a payment method
export async function deletePaymentMethod(id: string): Promise<boolean> {
  try {
    // Check if this is the default method
    const { data: existingMethod } = await supabase
      .from('payment_methods')
      .select('is_default, user_id')
      .eq('id', id)
      .single();
    
    const { error } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting payment method:', error);
      return false;
    }
    
    // If this was the default method, set a new default if available
    if (existingMethod && existingMethod.is_default) {
      const { data: remainingMethods } = await supabase
        .from('payment_methods')
        .select('id')
        .eq('user_id', existingMethod.user_id)
        .limit(1);
      
      if (remainingMethods && remainingMethods.length > 0) {
        await supabase
          .from('payment_methods')
          .update({ is_default: true })
          .eq('id', remainingMethods[0].id);
      }
    }
    
    return true;
  } catch (err) {
    console.error('Error in deletePaymentMethod:', err);
    return false;
  }
}

// Get the default payment method for a user
export async function getDefaultPaymentMethod(userId: string): Promise<PaymentMethod | null> {
  try {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId)
      .eq('is_default', true)
      .single();
    
    if (error || !data) {
      if (error && error.code !== 'PGRST116') { // Not found error
        console.error('Error fetching default payment method:', error);
      }
      return null;
    }
    
    return mapDbPaymentMethodToModel(data);
  } catch (err) {
    console.error('Error in getDefaultPaymentMethod:', err);
    return null;
  }
}

// Set a payment method as default
export async function setDefaultPaymentMethod(id: string): Promise<boolean> {
  try {
    // Get the payment method to get the user ID
    const { data: existingMethod } = await supabase
      .from('payment_methods')
      .select('user_id')
      .eq('id', id)
      .single();
    
    if (!existingMethod) {
      console.error('Payment method not found');
      return false;
    }
    
    // Unset any existing default payment methods for this user
    await supabase
      .from('payment_methods')
      .update({ is_default: false })
      .eq('user_id', existingMethod.user_id)
      .eq('is_default', true);
    
    // Set the new default
    const { error } = await supabase
      .from('payment_methods')
      .update({ is_default: true })
      .eq('id', id);
    
    if (error) {
      console.error('Error setting default payment method:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error in setDefaultPaymentMethod:', err);
    return false;
  }
}

// Mock function for testing
export function getMockPaymentMethods(): PaymentMethod[] {
  return [
    {
      id: "pm1",
      userId: "user1",
      type: "card",
      provider: "visa",
      last4: "4242",
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true,
      createdAt: new Date().toISOString()
    },
    {
      id: "pm2",
      userId: "user1",
      type: "card",
      provider: "mastercard",
      last4: "5555",
      expiryMonth: 10,
      expiryYear: 2024,
      isDefault: false,
      createdAt: new Date().toISOString()
    }
  ];
}
