import { supabase } from '@/integrations/supabase/client';
import { CartItem } from '@/models/cart';
import { Product } from '@/models/product';
import { Json } from '@/integrations/supabase/types';
import { SellerAccount } from '@/types/database';

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
export const createSellerAccount = async (
  accountData: Partial<SellerAccount>
): Promise<SellerAccount | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    // For now, we'll mock this functionality since seller_accounts table is not available
    console.log('Would create seller account with data:', accountData);
    
    // Return mock data
    return {
      id: 'mock-id',
      user_id: user.user.id,
      shop_id: accountData.shop_id || 'mock-shop-id',
      account_type: accountData.account_type || 'bank',
      account_name: accountData.account_name || 'Default Account',
      account_number: accountData.account_number || 'N/A',
      bank_name: accountData.bank_name || 'N/A',
      paypal_email: accountData.paypal_email || '',
      stripe_account_id: accountData.stripe_account_id || '',
      applepay_merchant_id: accountData.applepay_merchant_id || '',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_verified: false,
      balance: 0,
      currency: 'USD'
    };
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
    
    // For now, we'll mock this functionality since seller_accounts table is not available
    console.log('Would get seller account for user:', user.user.id);
    
    // Return mock data
    return {
      id: 'mock-id',
      user_id: user.user.id,
      shop_id: 'mock-shop-id',
      account_type: 'bank',
      account_name: 'Default Account',
      account_number: '****1234',
      bank_name: 'Example Bank',
      paypal_email: '',
      stripe_account_id: '',
      applepay_merchant_id: '',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_verified: false,
      balance: 0,
      currency: 'USD'
    };
  } catch (error) {
    console.error('Error fetching seller account:', error);
    return null;
  }
};

// Get all seller accounts for current user
export const getAllSellerAccounts = async (): Promise<SellerAccount[]> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    // For now, we'll mock this functionality since seller_accounts table is not available
    console.log('Would get all seller accounts for user:', user.user.id);
    
    // Return mock data
    return [{
      id: 'mock-id-1',
      user_id: user.user.id,
      shop_id: 'mock-shop-id',
      account_type: 'bank',
      account_name: 'Default Account',
      account_number: '****1234',
      bank_name: 'Example Bank',
      paypal_email: '',
      stripe_account_id: '',
      applepay_merchant_id: '',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_verified: false,
      balance: 0,
      currency: 'USD'
    }];
  } catch (error) {
    console.error('Error fetching seller accounts:', error);
    return [];
  }
};

// Alias function to get multiple accounts (same as getAllSellerAccounts)
export const getSellerAccounts = getAllSellerAccounts;

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
    
    // For now, we'll mock this functionality since seller_accounts table is not available
    console.log('Would update seller account with data:', accountData);
    
    // Return mock data
    return {
      id: accountData.id,
      user_id: user.user.id,
      shop_id: accountData.shop_id || 'mock-shop-id',
      account_type: accountData.account_type || 'bank',
      account_name: accountData.account_name || 'Updated Account',
      account_number: accountData.account_number || '****5678',
      bank_name: accountData.bank_name || 'Updated Bank',
      paypal_email: accountData.paypal_email || '',
      stripe_account_id: accountData.stripe_account_id || '',
      applepay_merchant_id: accountData.applepay_merchant_id || '',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_verified: false,
      balance: 0,
      currency: 'USD'
    };
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

// Initialize seller account
export const initializeSellerAccount = async (
  sellerId: string,
  accountName: string,
  accountNumber: string,
  bankName: string,
  accountType: string,
  paypalEmail: string,
  stripeAccountId: string,
  applePayMerchantId: string
): Promise<SellerAccount | null> => {
  try {
    // Use the mocked service function instead of direct database access
    const sellerAccount = await createSellerAccount({
      user_id: sellerId,
      account_name: accountName,
      account_number: accountNumber,
      bank_name: bankName,
      account_type: accountType,
      paypal_email: paypalEmail,
      stripe_account_id: stripeAccountId,
      applepay_merchant_id: applePayMerchantId
    });

    return sellerAccount;
  } catch (error) {
    console.error('Error initializing seller account:', error);
    return null;
  }
};

// Get seller account details
export const getSellerAccountDetails = async (): Promise<SellerAccount | null> => {
  try {
    // Use the mocked service function
    const sellerAccount = await getSellerAccount();
    return sellerAccount;
  } catch (error) {
    console.error('Error getting seller account details:', error);
    return null;
  }
};

// Get all seller account details
export const getAllSellerAccountDetails = async (): Promise<SellerAccount[]> => {
  try {
    // Use the mocked service function
    const accounts = await getAllSellerAccounts();
    return accounts;
  } catch (error) {
    console.error('Error getting all seller accounts:', error);
    return [];
  }
};
