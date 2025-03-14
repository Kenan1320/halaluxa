
import { supabase } from '@/lib/supabase';
import { Cart } from '@/models/cart';

export interface SellerAccount {
  id: string;
  user_id: string;
  shop_id: string;
  account_type: string;
  account_name: string;
  account_number: string;
  bank_name: string;
  paypal_email: string | null;
  stripe_account_id: string | null;
  applepay_merchant_id: string | null;
  is_active: boolean;
  is_verified: boolean;
  balance: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePaymentResult {
  success: boolean;
  transactionId?: string;
  orderId?: string;
  orderDate?: string;
  error?: string;
}

// Process a payment
export const processPayment = async (
  cart: Cart,
  paymentMethod: { type: string; cardNumber?: string; expiryDate?: string; cvv?: string },
  shippingDetails: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
  }
): Promise<CreatePaymentResult> => {
  try {
    // In a real app, this would connect to a payment gateway
    // For now, we're simulating a successful payment
    
    // Calculate total
    const total = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    // Create order record in database
    const orderId = `ORD-${Math.floor(Math.random() * 1000000)}`;
    const orderDate = new Date().toISOString();
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return success with transaction details
    return {
      success: true,
      transactionId: `TXN-${Math.floor(Math.random() * 1000000)}`,
      orderId,
      orderDate
    };
  } catch (error) {
    console.error('Error processing payment:', error);
    return {
      success: false,
      error: 'Failed to process payment. Please try again.'
    };
  }
};

// Get seller account by ID
export const getSellerAccountById = async (id: string): Promise<SellerAccount | null> => {
  try {
    const { data, error } = await supabase
      .from('seller_accounts')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching seller account:', error);
      return null;
    }
    
    return {
      ...data,
      is_verified: data.is_verified || false,
      balance: data.balance || 0,
      currency: data.currency || 'USD'
    };
  } catch (error) {
    console.error('Error fetching seller account:', error);
    return null;
  }
};

// Alias for getSellerAccountById
export const getSellerAccount = getSellerAccountById;

// Create a new seller account
export const createSellerAccount = async (accountData: Partial<SellerAccount>): Promise<SellerAccount | null> => {
  try {
    const { data, error } = await supabase
      .from('seller_accounts')
      .insert([{
        user_id: accountData.user_id,
        shop_id: accountData.shop_id,
        account_type: accountData.account_type,
        account_name: accountData.account_name,
        account_number: accountData.account_number,
        bank_name: accountData.bank_name,
        paypal_email: accountData.paypal_email,
        stripe_account_id: accountData.stripe_account_id,
        applepay_merchant_id: accountData.applepay_merchant_id,
        is_active: true,
        is_verified: false,
        balance: 0,
        currency: 'USD',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating seller account:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error creating seller account:', error);
    return null;
  }
};

// Alias for createSellerAccount
export const saveSellerAccount = createSellerAccount;

// Update a seller account
export const updateSellerAccount = async (id: string, accountData: Partial<SellerAccount>): Promise<SellerAccount | null> => {
  try {
    const updates: any = {
      updated_at: new Date().toISOString()
    };
    
    // Add fields that are being updated
    if (accountData.account_name) updates.account_name = accountData.account_name;
    if (accountData.account_number) updates.account_number = accountData.account_number;
    if (accountData.bank_name) updates.bank_name = accountData.bank_name;
    if (accountData.paypal_email) updates.paypal_email = accountData.paypal_email;
    if (accountData.stripe_account_id) updates.stripe_account_id = accountData.stripe_account_id;
    if (accountData.applepay_merchant_id) updates.applepay_merchant_id = accountData.applepay_merchant_id;
    if (accountData.is_active !== undefined) updates.is_active = accountData.is_active;
    
    const { data, error } = await supabase
      .from('seller_accounts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating seller account:', error);
      return null;
    }
    
    return {
      ...data,
      is_verified: data.is_verified || false,
      balance: data.balance || 0,
      currency: data.currency || 'USD'
    };
  } catch (error) {
    console.error('Error updating seller account:', error);
    return null;
  }
};

// Get seller account by user ID
export const getSellerAccountByUserId = async (userId: string): Promise<SellerAccount | null> => {
  try {
    const { data, error } = await supabase
      .from('seller_accounts')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching seller account by user ID:', error);
      return null;
    }
    
    return {
      ...data,
      is_verified: data.is_verified || false,
      balance: data.balance || 0,
      currency: data.currency || 'USD'
    };
  } catch (error) {
    console.error('Error fetching seller account by user ID:', error);
    return null;
  }
};

// Get seller account by shop ID
export const getSellerAccountByShopId = async (shopId: string): Promise<SellerAccount | null> => {
  try {
    const { data, error } = await supabase
      .from('seller_accounts')
      .select('*')
      .eq('shop_id', shopId)
      .single();
    
    if (error) {
      console.error('Error fetching seller account by shop ID:', error);
      return null;
    }
    
    return {
      ...data,
      is_verified: data.is_verified || false,
      balance: data.balance || 0,
      currency: data.currency || 'USD'
    };
  } catch (error) {
    console.error('Error fetching seller account by shop ID:', error);
    return null;
  }
};
