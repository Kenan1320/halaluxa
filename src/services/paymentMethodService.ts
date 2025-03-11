import { supabase } from '@/integrations/supabase/client';
import { SellerAccount } from '@/types/supabase-types';

export const getPaymentMethods = async (shopId: string) => {
  try {
    const { data, error } = await supabase
      .from('shop_payment_methods')
      .select('*')
      .eq('shop_id', shopId);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting payment methods:', error);
    throw error;
  }
};

// For functions that work with seller_accounts, we'll provide a type cast
export const getSellerAccount = async (userId: string): Promise<SellerAccount | null> => {
  try {
    const { data, error } = await supabase
      .from('seller_accounts' as any)
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No seller account found
      }
      throw error;
    }

    return data as unknown as SellerAccount;
  } catch (error) {
    console.error('Error getting seller account:', error);
    throw error;
  }
};
