
import { supabase } from '@/integrations/supabase/client';
import { CartItem } from '@/models/cart';
import { Product } from '@/models/product';

// Update the interface to include the new fields added to the seller_accounts table
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

// Mock function to simulate payment processing
export const processPayment = async (
  cart: { items: CartItem[]; totalPrice: number },
  paymentMethodDetails: any,
  shippingDetails: any
): Promise<PaymentResult> => {
  // Simulate payment processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Create an order in the database
  try {
    // Serialize cart items for storage
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
        items: serializedItems,
        total: cart.totalPrice,
        user_id: supabase.auth.getUser().then(response => response.data.user?.id),
        shipping_details: shippingDetails,
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

// Create a seller account
export const createSellerAccount = async (
  accountData: Partial<SellerAccount>
): Promise<SellerAccount | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('seller_accounts')
      .insert({
        ...accountData,
        seller_id: user.user.id
      })
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

// Get seller account for current user
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

// Update seller account
export const updateSellerAccount = async (
  accountData: Partial<SellerAccount>
): Promise<SellerAccount | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('seller_accounts')
      .update(accountData)
      .eq('seller_id', user.user.id)
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

// Format payment method based on account type
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
