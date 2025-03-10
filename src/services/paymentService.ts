
import { supabase } from '@/integrations/supabase/client';
import { CartItem } from '@/models/cart';
import { PaymentMethod, PaymentIntent, mapDbPaymentMethodToModel } from '@/models/payment';
import { Json } from '@/integrations/supabase/types';

// Process payment for a customer order
export async function processPayment(
  cart: { items: CartItem[]; totalPrice: number },
  paymentMethodId: string,
  shippingDetails: any
): Promise<{ success: boolean; orderId: string; orderDate: string }> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    const serializedItems = cart.items.map(item => ({
      productId: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
      name: item.product.name,
      image: item.product.images[0]
    }));
    
    // Create order first
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        items: serializedItems as Json,
        total: cart.totalPrice,
        shipping_details: shippingDetails,
        status: 'processing',
        payment_method_id: paymentMethodId
      })
      .select()
      .single();
    
    if (orderError) throw orderError;
    
    return {
      success: true,
      orderId: orderData.id,
      orderDate: orderData.created_at
    };
  } catch (error) {
    console.error('Payment processing error:', error);
    throw new Error('Payment processing failed');
  }
}

// Get payment method by ID
export async function getPaymentMethodById(id: string): Promise<PaymentMethod | null> {
  try {
    const { data, error } = await supabase
      .from('shop_payment_methods')  // Using correct table name
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return null;
    
    return mapDbPaymentMethodToModel(data);
  } catch (error) {
    console.error('Error fetching payment method:', error);
    return null;
  }
}

// Get all payment methods for a user
export async function getPaymentMethodsByUser(userId: string): Promise<PaymentMethod[]> {
  try {
    const { data, error } = await supabase
      .from('shop_payment_methods')
      .select('*')
      .eq('user_id', userId);
    
    if (error || !data) return [];
    
    return data.map(mapDbPaymentMethodToModel);
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return [];
  }
}

// Create a new payment method
export async function createPaymentMethod(method: Partial<PaymentMethod>): Promise<PaymentMethod | null> {
  try {
    const { data, error } = await supabase
      .from('shop_payment_methods')
      .insert(method)
      .select()
      .single();
    
    if (error || !data) return null;
    
    return mapDbPaymentMethodToModel(data);
  } catch (error) {
    console.error('Error creating payment method:', error);
    return null;
  }
}
