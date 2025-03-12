
import { supabase } from '@/integrations/supabase/client';
import { SellerAccount } from '@/types/database';

// Get payment methods for the current user
export const getPaymentMethods = async (): Promise<SellerAccount[]> => {
  try {
    return [{
      id: 'mock-id',
      user_id: 'mock-user-id',
      shop_id: 'mock-shop-id',
      account_type: 'bank',
      account_name: 'Default Account',
      account_number: '****1234',
      bank_name: 'Example Bank',
      paypal_email: null,
      stripe_account_id: null,
      applepay_merchant_id: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_verified: false,
      balance: 0,
      currency: 'USD'
    }];
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return [];
  }
};

// Create a new payment method
export const createPaymentMethod = async (
  methodType: string,
  accountName: string,
  accountNumber: string,
  bankName: string,
  shopId: string
): Promise<SellerAccount | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    console.log('Creating payment method...');
    
    // Return mock data
    return {
      id: 'mock-id',
      user_id: user.user.id,
      shop_id: shopId,
      account_type: methodType,
      account_name: accountName,
      account_number: accountNumber,
      bank_name: bankName,
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
    console.error('Error creating payment method:', error);
    return null;
  }
};

// Update a payment method
export const updatePaymentMethod = async (
  id: string,
  accountName: string,
  accountNumber: string,
  bankName: string
): Promise<SellerAccount | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    console.log('Updating payment method...');
    
    // Return mock data
    return {
      id,
      user_id: user.user.id,
      shop_id: 'mock-shop-id',
      account_type: 'bank',
      account_name: accountName,
      account_number: accountNumber,
      bank_name: bankName,
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
    console.error('Error updating payment method:', error);
    return null;
  }
};

// Delete a payment method
export const deletePaymentMethod = async (id: string): Promise<boolean> => {
  try {
    console.log('Deleting payment method:', id);
    return true;
  } catch (error) {
    console.error('Error deleting payment method:', error);
    return false;
  }
};
