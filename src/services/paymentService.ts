import { supabase } from '@/integrations/supabase/client';
import { PaymentIntent, PaymentResult, SellerAccount } from '@/models/payment';

export const processPayment = async (
  amount: number,
  paymentMethodId: string,
  shopId: string
): Promise<PaymentResult> => {
  // Simulate a payment processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  try {
    // Here would be integration with an actual payment gateway like Stripe
    // For this demo we'll just simulate success

    // Create a payment record
    const { data, error } = await supabase
      .from('shop_sales')
      .insert({
        shop_id: shopId,
        amount: amount,
        status: 'completed',
        order_id: `ORD-${Date.now()}`
      })
      .select()
      .single();

    if (error) {
      console.error('Error recording payment:', error);
      return { 
        success: false, 
        message: 'Payment failed to record in the system', 
        error: error.message 
      };
    }

    // Generate a receipt or confirmation
    return {
      success: true,
      message: 'Payment successful',
      transactionId: `TX-${Date.now()}`,
      orderId: data.order_id,
      orderDate: new Date().toISOString()
    };
  } catch (error) {
    console.error('Payment processing error:', error);
    return {
      success: false,
      message: 'Payment failed to process',
      error
    };
  }
};

export const generatePaymentReceipt = (sellerAccount: SellerAccount, amount: number): string => {
  // Format the payment information based on the payment method
  const methodType = sellerAccount.methodType || 'bank';
  let receiptText = '';
  
  if (methodType === 'bank') {
    receiptText = `Bank Transfer to ${sellerAccount.bankName || 'Bank'}, Account: ${sellerAccount.accountName || ''} (${sellerAccount.accountNumber || ''})`;
  } else if (methodType === 'paypal') {
    receiptText = `PayPal Payment to ${sellerAccount.paypalEmail || 'seller@example.com'}`;
  } else {
    receiptText = `Payment via ${methodType.charAt(0).toUpperCase() + methodType.slice(1)}`;
  }
  
  // Add the amount and date
  const today = new Date();
  const formattedDate = today.toLocaleDateString();
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
  
  return `${receiptText}\nAmount: ${formattedAmount}\nDate: ${formattedDate}`;
};

export const createPaymentIntent = async (
  amount: number,
  currency: string = 'usd',
  shopId: string
): Promise<PaymentIntent> => {
  // In a real application, you would call your backend, which would use
  // the Stripe API to create a PaymentIntent. This is a placeholder.
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    id: `pi_${Date.now()}`,
    amount: amount,
    currency: currency,
    status: 'created',
    clientSecret: `sk_test_${Date.now()}_secret`
  };
};

export const fetchPaymentMethods = async (userId: string) => {
  const { data, error } = await supabase
    .from('shopper_payment_methods')
    .select('*')
    .eq('user_id', userId);
    
  if (error) {
    console.error('Error fetching payment methods:', error);
    throw error;
  }
  
  return data || [];
};

export const addSellerPaymentMethod = async (userId: string, shopId: string, paymentMethod: Partial<SellerAccount>): Promise<SellerAccount> => {
  // Check if there's already a payment method for this shop
  const { data: existingMethods, error: fetchError } = await supabase
    .from('seller_accounts')
    .select('*')
    .eq('shop_id', shopId)
    .eq('user_id', userId);
    
  if (fetchError) {
    console.error('Error checking existing payment methods:', fetchError);
    throw fetchError;
  }
  
  // If there's an existing method, update it
  if (existingMethods && existingMethods.length > 0) {
    const { data, error } = await supabase
      .from('seller_accounts')
      .update({
        methodType: paymentMethod.methodType,
        accountName: paymentMethod.accountName,
        accountNumber: paymentMethod.accountNumber,
        bankName: paymentMethod.bankName,
        paypalEmail: paymentMethod.paypalEmail,
        stripeAccountId: paymentMethod.stripeAccountId,
        isActive: true,
        isDefault: paymentMethod.isDefault || false
      })
      .eq('id', existingMethods[0].id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating seller payment method:', error);
      throw error;
    }
    
    return data;
  }
  
  // Otherwise create a new one
  const { data, error } = await supabase
    .from('seller_accounts')
    .insert({
      user_id: userId,
      shop_id: shopId,
      methodType: paymentMethod.methodType,
      accountName: paymentMethod.accountName,
      accountNumber: paymentMethod.accountNumber,
      bankName: paymentMethod.bankName,
      paypalEmail: paymentMethod.paypalEmail,
      stripeAccountId: paymentMethod.stripeAccountId,
      isActive: true
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error adding seller payment method:', error);
    throw error;
  }
  
  return data;
};

export const fetchSellerPaymentMethod = async (userId: string, shopId: string): Promise<SellerAccount | null> => {
  const { data, error } = await supabase
    .from('seller_accounts')
    .select('*')
    .eq('user_id', userId)
    .eq('shop_id', shopId)
    .single();
    
  if (error) {
    if (error.code === 'PGRST116') {
      // No rows found
      return null;
    }
    console.error('Error fetching seller payment method:', error);
    throw error;
  }
  
  return data;
};

export const updateSellerPaymentMethod = async (methodId: string, paymentMethod: Partial<SellerAccount>): Promise<SellerAccount> => {
  const { data, error } = await supabase
    .from('seller_accounts')
    .update({
      methodType: paymentMethod.methodType || paymentMethod.methodType,
      accountName: paymentMethod.accountName || paymentMethod.accountName,
      accountNumber: paymentMethod.accountNumber || paymentMethod.accountNumber,
      bankName: paymentMethod.bankName || paymentMethod.bankName,
      paypalEmail: paymentMethod.paypalEmail || paymentMethod.paypalEmail,
      stripeAccountId: paymentMethod.stripeAccountId || paymentMethod.stripeAccountId,
      isActive: true,
      isDefault: paymentMethod.isDefault || paymentMethod.isDefault
    })
    .eq('id', methodId)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating seller payment method:', error);
    throw error;
  }
  
  return data;
};

export const removeSellerPaymentMethod = async (methodId: string): Promise<void> => {
  const { error } = await supabase
    .from('seller_accounts')
    .update({
      isActive: false,
      methodType: 'bank'
    })
    .eq('id', methodId);
    
  if (error) {
    console.error('Error removing seller payment method:', error);
    throw error;
  }
};
