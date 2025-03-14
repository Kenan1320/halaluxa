
import { supabase } from '@/lib/supabaseClient';
import { SellerAccount } from '@/types/database';

export const getSellerAccountById = async (
  sellerId: string
): Promise<SellerAccount | null> => {
  try {
    const { data, error } = await supabase
      .from('seller_accounts')
      .select('*')
      .eq('user_id', sellerId)
      .single();

    if (error) {
      console.error('Error fetching seller account:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching seller account:', error);
    return null;
  }
};

export const createSellerAccount = async (
  accountData: Partial<SellerAccount>
): Promise<SellerAccount | null> => {
  try {
    const newAccount = {
      ...accountData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_verified: false,
      balance: 0,
      currency: 'USD',
      is_active: true
    };

    const { data, error } = await supabase
      .from('seller_accounts')
      .insert([newAccount])
      .select()
      .single();

    if (error) {
      console.error('Error creating seller account:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error creating seller account:', error);
    return null;
  }
};

export const updateSellerAccount = async (
  accountId: string,
  updates: Partial<SellerAccount>
): Promise<SellerAccount | null> => {
  try {
    const { data, error } = await supabase
      .from('seller_accounts')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', accountId)
      .select()
      .single();

    if (error) {
      console.error('Error updating seller account:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error updating seller account:', error);
    return null;
  }
};

export const processPayment = async (
  orderId: string,
  amount: number,
  paymentMethod: string
): Promise<{ success: boolean; transactionId?: string; error?: string }> => {
  try {
    // This is a mock implementation that always succeeds
    // In a real app, you would integrate with a payment gateway API
    
    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Create a mock transaction record
    const transactionId = `txn_${Math.random().toString(36).substring(2, 15)}`;
    
    // Here you would normally save the transaction to your database
    
    return {
      success: true,
      transactionId
    };
  } catch (error: any) {
    console.error('Payment processing error:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred during payment processing'
    };
  }
};

export const getPaymentMethods = async (userId: string): Promise<any[]> => {
  // This is a mock implementation
  // In a real app, you would fetch saved payment methods from your database
  
  return [
    {
      id: 'pm_1',
      type: 'card',
      card: {
        brand: 'visa',
        last4: '4242',
        expMonth: 12,
        expYear: 2024
      },
      isDefault: true
    },
    {
      id: 'pm_2',
      type: 'card',
      card: {
        brand: 'mastercard',
        last4: '5678',
        expMonth: 10,
        expYear: 2023
      },
      isDefault: false
    }
  ];
};

export const formatPaymentMethod = (method: any): string => {
  if (method.type === 'card') {
    return `${method.card.brand.charAt(0).toUpperCase() + method.card.brand.slice(1)} ending in ${method.card.last4}`;
  }
  return 'Unknown payment method';
};
