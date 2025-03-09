
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

// Mock functions since these tables don't exist yet
export const fetchPaymentMethods = async (userId: string) => {
  console.log('Fetching payment methods for user:', userId);
  // Return mock data since this table doesn't exist yet
  return [];
};

export const addSellerPaymentMethod = async (userId: string, shopId: string, paymentMethod: Partial<SellerAccount>): Promise<SellerAccount> => {
  console.log('Adding seller payment method:', { userId, shopId, paymentMethod });
  
  // Return a mock SellerAccount
  return {
    id: `sa_${Date.now()}`,
    userId,
    shopId,
    methodType: paymentMethod.methodType,
    accountName: paymentMethod.accountName,
    accountNumber: paymentMethod.accountNumber,
    bankName: paymentMethod.bankName,
    paypalEmail: paymentMethod.paypalEmail,
    stripeAccountId: paymentMethod.stripeAccountId,
    isDefault: paymentMethod.isDefault || false,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const fetchSellerPaymentMethod = async (userId: string, shopId: string): Promise<SellerAccount | null> => {
  console.log('Fetching seller payment method:', { userId, shopId });
  
  // Return mock data
  return null;
};

export const updateSellerPaymentMethod = async (methodId: string, paymentMethod: Partial<SellerAccount>): Promise<SellerAccount> => {
  console.log('Updating seller payment method:', { methodId, paymentMethod });
  
  // Return mock data
  return {
    id: methodId,
    userId: 'mock-user-id',
    methodType: paymentMethod.methodType,
    accountName: paymentMethod.accountName,
    accountNumber: paymentMethod.accountNumber,
    bankName: paymentMethod.bankName,
    paypalEmail: paymentMethod.paypalEmail,
    stripeAccountId: paymentMethod.stripeAccountId,
    isDefault: paymentMethod.isDefault || false,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const removeSellerPaymentMethod = async (methodId: string): Promise<void> => {
  console.log('Removing seller payment method:', methodId);
};

// Add these functions to make existing code happy
export const getSellerAccounts = async (userId: string) => {
  console.log('Getting seller accounts for:', userId);
  return [];
};

export const createSellerAccount = async (data: any) => {
  console.log('Creating seller account:', data);
  return { id: `sa_${Date.now()}` };
};

export const updateSellerAccount = async (id: string, data: any) => {
  console.log('Updating seller account:', { id, data });
  return { id };
};

export const formatPaymentMethod = (method: any) => {
  return `Payment Method: ${method?.type || 'Unknown'}`;
};
