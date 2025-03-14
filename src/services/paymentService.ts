
import { supabase } from '@/integrations/supabase/client';
import { UUID } from '@/models/types';
import { PaymentMethod } from '@/services/paymentMethodService';
import { SellerAccount } from '@/models/types';

// Function to get a seller account by user ID
export const getSellerAccount = async (userId: UUID): Promise<SellerAccount | null> => {
  try {
    const { data, error } = await supabase
      .from('seller_accounts')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error getting seller account:', error);
    return null;
  }
};

// Function to save or update a seller account
export const saveSellerAccount = async (
  account: Omit<SellerAccount, 'id' | 'created_at' | 'updated_at'>
): Promise<SellerAccount | null> => {
  try {
    // Check if account already exists
    const { data: existingAccount } = await supabase
      .from('seller_accounts')
      .select('id')
      .eq('user_id', account.user_id)
      .single();
    
    if (existingAccount) {
      // Update existing account
      const { data, error } = await supabase
        .from('seller_accounts')
        .update({
          ...account,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingAccount.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      // Create new account
      const { data, error } = await supabase
        .from('seller_accounts')
        .insert([{
          ...account,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error('Error saving seller account:', error);
    return null;
  }
};

// Function to process a payment (stub)
export const processPayment = async (
  amount: number, 
  currency: string, 
  paymentMethodId: string,
  orderId: string
): Promise<{ success: boolean, transactionId?: string, error?: string }> => {
  // This would connect to a payment gateway in a real application
  // For now, we'll simulate a successful payment
  return {
    success: true,
    transactionId: `tx_${Math.random().toString(36).substring(2, 10)}`
  };
};

// Function to convert SellerAccount to PaymentMethod for compatibility
export const convertSellerAccountToPaymentMethod = (account: SellerAccount): PaymentMethod => {
  return {
    id: account.id,
    userId: account.user_id,
    type: account.account_type as any,
    provider: account.bank_name,
    last4: account.account_number.slice(-4),
    isDefault: true,
    createdAt: account.created_at
  };
};
