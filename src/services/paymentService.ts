
import { supabase } from '@/integrations/supabase/client';
import { PaymentMethod, SellerAccount, mapDbPaymentMethodToModel, mapModelToDb } from '@/models/payment';

// Get all payment methods for a shop
export async function getSellerAccounts(shopId: string): Promise<PaymentMethod[]> {
  try {
    const { data, error } = await supabase
      .from('shop_payment_methods')
      .select('*')
      .eq('shop_id', shopId)
      .eq('is_active', true);
    
    if (error) throw error;
    
    return (data as SellerAccount[]).map(mapDbPaymentMethodToModel);
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return [];
  }
}

// Get a specific payment method by ID
export async function getSellerAccount(id: string): Promise<PaymentMethod | null> {
  try {
    const { data, error } = await supabase
      .from('shop_payment_methods')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return null;
    
    return mapDbPaymentMethodToModel(data as SellerAccount);
  } catch (error) {
    console.error('Error fetching payment method:', error);
    return null;
  }
}

// Create a new payment method
export async function createSellerAccount(method: Partial<PaymentMethod>): Promise<PaymentMethod | null> {
  try {
    const dbMethod = mapModelToDb(method);
    const { data, error } = await supabase
      .from('shop_payment_methods')
      .insert(dbMethod)
      .select()
      .single();
    
    if (error || !data) return null;
    
    return mapDbPaymentMethodToModel(data as SellerAccount);
  } catch (error) {
    console.error('Error creating payment method:', error);
    return null;
  }
}

// Update a payment method
export async function updateSellerAccount(method: Partial<PaymentMethod>): Promise<PaymentMethod | null> {
  try {
    if (!method.id) return null;

    const dbMethod = mapModelToDb(method);
    const { data, error } = await supabase
      .from('shop_payment_methods')
      .update(dbMethod)
      .eq('id', method.id)
      .select()
      .single();
    
    if (error || !data) return null;
    
    return mapDbPaymentMethodToModel(data as SellerAccount);
  } catch (error) {
    console.error('Error updating payment method:', error);
    return null;
  }
}

// Add the missing processPayment function
export async function processPayment(cart: any, paymentMethodDetails: any, shippingDetails: any) {
  // This is a simplified version - in production, this would connect to a payment processor
  try {
    // Simulate successful payment
    const orderId = `ORD-${Math.floor(Math.random() * 1000000)}`;
    const orderDate = new Date().toISOString();
    
    // In a real implementation, you would:
    // 1. Connect to a payment processor (Stripe, PayPal, etc.)
    // 2. Create a payment intent/transaction
    // 3. Store the order in the database
    // 4. Return the order details
    
    return {
      success: true,
      orderId,
      orderDate,
      message: 'Payment processed successfully'
    };
  } catch (error) {
    console.error('Payment processing error:', error);
    throw new Error('Payment failed to process');
  }
}

export { formatPaymentMethod, PaymentMethod, SellerAccount };
