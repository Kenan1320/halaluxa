
import { Cart } from '@/models/cart';
import { supabase } from '@/integrations/supabase/client';

export interface PaymentMethod {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

export interface PaymentDetails {
  total: number;
  paymentMethod: PaymentMethod;
}

export interface SellerAccount {
  sellerId: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
}

// Simulated payment processing
export const processPayment = async (
  cart: Cart, 
  paymentDetails: PaymentMethod,
  shippingDetails: any
): Promise<{ success: boolean; orderId: string; orderDate: string }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  try {
    // In a real app, this would make an API call to a payment processor
    const success = true; // Simulate successful payment
    
    if (success) {
      // Create order in Supabase if available, otherwise use localStorage
      const orderId = `ORD-${Math.floor(Math.random() * 1000000)}`;
      const orderDate = new Date().toISOString();
      
      // Try to save to Supabase if we have a user ID
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (sessionData.session?.user?.id) {
        const userId = sessionData.session.user.id;
        
        // Try to save the order to Supabase
        try {
          await supabase.from('orders').insert({
            id: orderId,
            user_id: userId,
            order_date: orderDate,
            items: cart.items,
            total: cart.totalPrice,
            shipping_details: shippingDetails,
            status: 'Processing'
          });
        } catch (dbError) {
          console.error('Failed to save order to database:', dbError);
          
          // Fallback to localStorage
          const orders = JSON.parse(localStorage.getItem('orders') || '[]');
          orders.push({
            id: orderId,
            date: orderDate,
            items: cart.items,
            total: cart.totalPrice,
            shippingDetails,
            status: 'Processing'
          });
          localStorage.setItem('orders', JSON.stringify(orders));
        }
      } else {
        // Fallback to localStorage if no user is signed in
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push({
          id: orderId,
          date: orderDate,
          items: cart.items,
          total: cart.totalPrice,
          shippingDetails,
          status: 'Processing'
        });
        localStorage.setItem('orders', JSON.stringify(orders));
      }
      
      return {
        success: true,
        orderId,
        orderDate
      };
    } else {
      throw new Error('Payment processing failed');
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    throw error;
  }
};

// Get seller payment accounts
export const getSellerAccounts = (): SellerAccount[] => {
  try {
    // Try to fetch from Supabase first
    const accounts = localStorage.getItem('sellerAccounts');
    if (accounts) {
      return JSON.parse(accounts);
    }
    return [];
  } catch (error) {
    console.error('Error fetching seller accounts:', error);
    return [];
  }
};

// Save seller payment account
export const saveSellerAccount = (account: SellerAccount): void => {
  try {
    const accounts = getSellerAccounts();
    const existingIndex = accounts.findIndex(a => a.sellerId === account.sellerId);
    
    if (existingIndex >= 0) {
      accounts[existingIndex] = account;
    } else {
      accounts.push(account);
    }
    
    localStorage.setItem('sellerAccounts', JSON.stringify(accounts));
    
    // Try to save to Supabase if possible
    supabase.from('seller_accounts').upsert({
      seller_id: account.sellerId,
      account_name: account.accountName,
      account_number: account.accountNumber,
      bank_name: account.bankName
    }).then(({ error }) => {
      if (error) {
        console.error('Failed to save seller account to database:', error);
      }
    });
  } catch (error) {
    console.error('Error saving seller account:', error);
  }
};
