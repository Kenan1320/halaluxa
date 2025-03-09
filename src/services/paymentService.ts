
import { supabase } from '@/integrations/supabase/client';
import { CartItem } from '@/models/cart';
import { Product } from '@/models/product';
import { Json } from '@/integrations/supabase/types';

// Update the interface to include the new fields added to the payment methods table
export interface SellerAccount {
  id: string;
  shop_id: string;
  method_type: 'bank' | 'paypal' | 'stripe' | 'applepay';
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

// Create a seller account with payment details
export const createSellerAccount = async (shopId: string, accountData: {
  account_type: 'bank' | 'paypal' | 'stripe' | 'applepay';
  account_name?: string;
  account_number?: string;
  bank_name?: string;
  paypal_email?: string;
  stripe_account_id?: string;
  applepay_merchant_id?: string;
}): Promise<SellerAccount | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    // Ensure required fields are present
    const methodData = {
      shop_id: shopId,
      method_type: accountData.account_type,
      account_name: accountData.account_name,
      account_number: accountData.account_number,
      bank_name: accountData.bank_name,
      paypal_email: accountData.paypal_email,
      stripe_account_id: accountData.stripe_account_id,
      applepay_merchant_id: accountData.applepay_merchant_id,
      is_default: true,
      is_active: true
    };
    
    const { data, error } = await supabase
      .from('shop_payment_methods')
      .insert(methodData)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data as unknown as SellerAccount;
  } catch (error) {
    console.error('Error creating seller account:', error);
    return null;
  }
};

// Get seller account for current user's shop
export const getSellerAccount = async (shopId: string): Promise<SellerAccount | null> => {
  try {
    const { data, error } = await supabase
      .from('shop_payment_methods')
      .select('*')
      .eq('shop_id', shopId)
      .eq('is_default', true)
      .maybeSingle();
    
    if (error) {
      throw error;
    }
    
    return data as unknown as SellerAccount;
  } catch (error) {
    console.error('Error fetching seller account:', error);
    return null;
  }
};

// Get all seller accounts for a shop
export const getSellerAccounts = async (shopId: string): Promise<SellerAccount[]> => {
  try {
    const { data, error } = await supabase
      .from('shop_payment_methods')
      .select('*')
      .eq('shop_id', shopId);
    
    if (error) {
      throw error;
    }
    
    return data as unknown as SellerAccount[];
  } catch (error) {
    console.error('Error fetching seller accounts:', error);
    return [];
  }
};

// Save seller account - for backward compatibility
export const saveSellerAccount = async (
  shopId: string,
  accountData: {
    id?: string;
    account_type: 'bank' | 'paypal' | 'stripe' | 'applepay';
    account_name?: string;
    account_number?: string;
    bank_name?: string;
    paypal_email?: string;
    stripe_account_id?: string;
    applepay_merchant_id?: string;
  }
): Promise<SellerAccount | null> => {
  // If id exists, update, otherwise create
  if (accountData.id) {
    return updateSellerAccount(accountData.id, shopId, accountData);
  } else {
    return createSellerAccount(shopId, accountData);
  }
};

// Update seller account
export const updateSellerAccount = async (
  accountId: string,
  shopId: string,
  accountData: {
    account_type?: 'bank' | 'paypal' | 'stripe' | 'applepay';
    account_name?: string;
    account_number?: string;
    bank_name?: string;
    paypal_email?: string;
    stripe_account_id?: string;
    applepay_merchant_id?: string;
    is_active?: boolean;
    is_default?: boolean;
  }
): Promise<SellerAccount | null> => {
  try {
    const { data, error } = await supabase
      .from('shop_payment_methods')
      .update({
        ...accountData,
        shop_id: shopId
      })
      .eq('id', accountId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data as unknown as SellerAccount;
  } catch (error) {
    console.error('Error updating seller account:', error);
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
