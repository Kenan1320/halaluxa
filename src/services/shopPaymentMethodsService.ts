
import { supabase } from '@/integrations/supabase/client';
import { PaymentMethod, SellerAccount, mapDbPaymentMethodToModel } from '@/models/payment';

// Get all payment methods for a shop
export async function getShopPaymentMethods(shopId: string): Promise<PaymentMethod[]> {
  try {
    const { data, error } = await supabase
      .from('shop_payment_methods')
      .select('*')
      .eq('shop_id', shopId);
    
    if (error) {
      console.error('Error fetching shop payment methods:', error);
      return [];
    }
    
    return (data as SellerAccount[]).map(mapDbPaymentMethodToModel);
  } catch (error) {
    console.error('Error fetching shop payment methods:', error);
    return [];
  }
}

// Set a payment method as default
export async function setDefaultPaymentMethod(methodId: string, shopId: string): Promise<boolean> {
  try {
    // First, set all payment methods for this shop as not default
    const { error: resetError } = await supabase
      .from('shop_payment_methods')
      .update({ is_default: false })
      .eq('shop_id', shopId);
    
    if (resetError) {
      console.error('Error resetting default payment methods:', resetError);
      return false;
    }
    
    // Then set the selected method as default
    const { error } = await supabase
      .from('shop_payment_methods')
      .update({ is_default: true })
      .eq('id', methodId);
    
    if (error) {
      console.error('Error setting default payment method:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error setting default payment method:', error);
    return false;
  }
}
