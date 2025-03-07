import { supabase } from '@/integrations/supabase/client';
import { CartItem } from '@/models/cart';
import { Product } from '@/models/product';
import { Json } from '@/integrations/supabase/types';

export interface SellerAccount {
  id: string;
  seller_id: string;
  account_name: string;
  account_number: string;
  bank_name: string;
  created_at: string;
  account_type: string;
  paypal_email?: string;
  stripe_account_id?: string;
  applepay_merchant_id?: string;
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

export const processPayment = async (
  cart: { items: CartItem[]; totalPrice: number },
  paymentMethodDetails: any,
  shippingDetails: any
): Promise<PaymentResult> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
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
    
    const { data, error } = await supabase
      .from('orders')
      .insert({
        items: serializedItems as unknown as Json,
        total: cart.totalPrice,
        user_id: userId,
        shipping_details: shippingDetails as unknown as Json,
        status: 'Processing',
        payment_method: paymentMethodDetails.type,
        payment_details: paymentMethodDetails as unknown as Json
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error creating order:", error);
      throw error;
    }
    
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

export const createSellerAccount = async (
  accountData: Partial<SellerAccount>
): Promise<SellerAccount | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    const completeAccountData = {
      seller_id: user.user.id,
      account_name: accountData.account_name || 'Default Account',
      account_number: accountData.account_number || 'N/A',
      bank_name: accountData.bank_name || 'N/A',
      account_type: accountData.account_type || 'bank',
      paypal_email: accountData.paypal_email,
      stripe_account_id: accountData.stripe_account_id,
      applepay_merchant_id: accountData.applepay_merchant_id
    };
    
    const { data, error } = await supabase
      .from('seller_accounts')
      .insert(completeAccountData)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error creating seller account:', error);
    return null;
  }
};

export const getSellerAccount = async (): Promise<SellerAccount | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('seller_accounts')
      .select('*')
      .eq('seller_id', user.user.id)
      .maybeSingle();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching seller account:', error);
    return null;
  }
};

export const getSellerAccounts = async (): Promise<SellerAccount[]> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('seller_accounts')
      .select('*')
      .eq('seller_id', user.user.id);
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching seller accounts:', error);
    return [];
  }
};

export const saveSellerAccount = async (
  accountData: Partial<SellerAccount>
): Promise<SellerAccount | null> => {
  if (accountData.id) {
    return updateSellerAccount(accountData);
  } else {
    return createSellerAccount(accountData);
  }
};

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
    
    const { data, error } = await supabase
      .from('seller_accounts')
      .update(accountData)
      .eq('id', accountData.id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error updating seller account:', error);
    return null;
  }
};

export const formatPaymentMethod = (account: SellerAccount): string => {
  switch (account.account_type) {
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
