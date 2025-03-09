
import { supabase } from '@/integrations/supabase/client';
import { CartItem } from '@/models/cart';
import { Product } from '@/models/product';
import { Json } from '@/integrations/supabase/types';

// Update the interface to match the new shop_payment_methods table
export interface SellerAccount {
  id: string;
  shop_id: string;
  user_id: string;
  method_type: 'bank' | 'paypal' | 'stripe' | 'applepay' | 'other';
  account_name?: string;
  account_number?: string;
  bank_name?: string;
  paypal_email?: string;
  stripe_account_id?: string;
  applepay_merchant_id?: string;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface PaymentResult {
  success: boolean;
  orderId: string;
  orderDate: string;
}

export interface OrderDetails {
  orderId: string;
  orderDate: string;
  total: number;
}

// Process payment for a customer order
export const processPayment = async (
  cart: { items: CartItem[]; totalPrice: number },
  paymentMethodDetails: any,
  shippingDetails: any
): Promise<PaymentResult> => {
  // Simulate payment processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Create an order in the database
  try {
    // Get current user
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    // Serialize cart items for storage as JSON
    const serializedItems = cart.items.map(item => ({
      productId: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
      name: item.product.name,
      image: item.product.images[0]
    }));
    
    // Store order in database
    const { data, error } = await supabase
      .from('orders')
      .insert({
        items: serializedItems as unknown as Json,
        total: cart.totalPrice,
        user_id: userId,
        shipping_details: shippingDetails as unknown as Json,
        status: 'Processing'
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error creating order:", error);
      throw error;
    }
    
    // Return success with the order ID
    return {
      success: true,
      orderId: data.id,
      orderDate: data.created_at
    };
  } catch (error) {
    console.error('Payment processing error:', error);
    throw new Error('Payment processing failed');
  }
};

// Get all orders for the current user
export const getUserOrders = async (): Promise<OrderDetails[]> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data.map(order => ({
      orderId: order.id,
      orderDate: order.created_at,
      total: order.total
    }));
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
};

// Create a payment method for a seller
export const createSellerAccount = async (
  accountData: Partial<SellerAccount>
): Promise<SellerAccount | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    // First we need to get the user's shop id
    const { data: shopData } = await supabase
      .from('shops')
      .select('id')
      .eq('owner_id', user.user.id)
      .single();
    
    if (!shopData?.id) {
      throw new Error('Shop not found for current user');
    }
    
    // Convert account_type from accountData to method_type for the new table
    const shopPaymentMethod = {
      user_id: user.user.id,
      shop_id: shopData.id,
      method_type: accountData.method_type || 'bank', 
      account_name: accountData.account_name,
      account_number: accountData.account_number,
      bank_name: accountData.bank_name,
      paypal_email: accountData.paypal_email,
      stripe_account_id: accountData.stripe_account_id,
      applepay_merchant_id: accountData.applepay_merchant_id,
      is_default: accountData.is_default || false,
      is_active: true
    };
    
    const { data, error } = await supabase
      .from('shop_payment_methods')
      .insert(shopPaymentMethod)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error creating payment method:', error);
    return null;
  }
};

// Get payment methods for current user's shop
export const getSellerAccount = async (): Promise<SellerAccount | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('shop_payment_methods')
      .select('*')
      .eq('user_id', user.user.id)
      .is('is_default', true)
      .maybeSingle();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching payment method:', error);
    return null;
  }
};

// Get all payment methods for current user's shop
export const getSellerAccounts = async (): Promise<SellerAccount[]> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('shop_payment_methods')
      .select('*')
      .eq('user_id', user.user.id)
      .eq('is_active', true);
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return [];
  }
};

// Save seller account - for backward compatibility
export const saveSellerAccount = async (
  accountData: Partial<SellerAccount>
): Promise<SellerAccount | null> => {
  // If id exists, update, otherwise create
  if (accountData.id) {
    return updateSellerAccount(accountData);
  } else {
    return createSellerAccount(accountData);
  }
};

// Update seller account
export const updateSellerAccount = async (
  accountData: Partial<SellerAccount>
): Promise<SellerAccount | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    if (!accountData.id) {
      throw new Error('Account ID is required for update');
    }
    
    // First ensure this payment method belongs to the user
    const { data: existingMethod } = await supabase
      .from('shop_payment_methods')
      .select('id')
      .eq('id', accountData.id)
      .eq('user_id', user.user.id)
      .single();
      
    if (!existingMethod) {
      throw new Error('Payment method not found or not authorized');
    }
    
    const { data, error } = await supabase
      .from('shop_payment_methods')
      .update(accountData)
      .eq('id', accountData.id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error updating payment method:', error);
    return null;
  }
};

// Format payment method based on account type
export const formatPaymentMethod = (account: SellerAccount): string => {
  switch (account.method_type) {
    case 'bank':
      return `${account.bank_name} - ${account.account_number}`;
    case 'paypal':
      return `PayPal - ${account.paypal_email}`;
    case 'stripe':
      return `Stripe Account - ${account.stripe_account_id}`;
    case 'applepay':
      return 'Apple Pay';
    default:
      return `${account.bank_name} - ${account.account_number}`;
  }
};
