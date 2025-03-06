
import { Cart, CartItem } from '@/models/cart';
import { supabase } from '@/integrations/supabase/client';

export interface PaymentMethod {
  type: 'card' | 'paypal' | 'applepay' | 'stripe';
  cardNumber?: string;
  cardName?: string;
  expiryDate?: string;
  cvv?: string;
  paypalEmail?: string;
  stripeToken?: string;
}

export interface PaymentDetails {
  total: number;
  paymentMethod: PaymentMethod;
}

export interface SellerAccount {
  id?: string;
  sellerId: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  accountType?: 'bank' | 'paypal' | 'stripe' | 'applepay';
  paypalEmail?: string;
  stripeAccountId?: string;
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
        
        try {
          // Convert cart items to a format Supabase can store as JSON
          const jsonItems = JSON.stringify(cart.items);
          const jsonShippingDetails = JSON.stringify(shippingDetails);
          
          // Insert into orders table
          const { error } = await supabase
            .from('orders')
            .insert({
              user_id: userId,
              date: orderDate,
              items: jsonItems,
              total: cart.totalPrice,
              shipping_details: jsonShippingDetails,
              status: 'Processing'
            });
            
          if (error) {
            console.error('Failed to save order to database:', error);
            // Fallback to localStorage
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            orders.push({
              id: orderId,
              user_id: userId,
              date: orderDate,
              items: cart.items,
              total: cart.totalPrice,
              shippingDetails,
              status: 'Processing'
            });
            localStorage.setItem('orders', JSON.stringify(orders));
          }
        } catch (dbError) {
          console.error('Failed to save order:', dbError);
          // Fallback to localStorage
          const orders = JSON.parse(localStorage.getItem('orders') || '[]');
          orders.push({
            id: orderId,
            user_id: userId,
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
export const getSellerAccounts = async (): Promise<SellerAccount[]> => {
  try {
    // Check if user is authenticated
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData.session?.user?.id) {
      const sellerId = sessionData.session.user.id;
      
      // Try to fetch from Supabase first
      const { data, error } = await supabase
        .from('seller_accounts')
        .select('*')
        .eq('seller_id', sellerId);
        
      if (error) {
        console.error('Error fetching seller accounts from database:', error);
        // Fallback to localStorage
        const localAccounts = localStorage.getItem('sellerAccounts');
        if (localAccounts) {
          return JSON.parse(localAccounts);
        }
        return [];
      }
      
      if (data && data.length > 0) {
        // Map from DB format to our interface
        return data.map(account => ({
          id: account.id,
          sellerId: account.seller_id,
          accountName: account.account_name,
          accountNumber: account.account_number,
          bankName: account.bank_name,
          accountType: account.account_type || 'bank',
          paypalEmail: account.paypal_email,
          stripeAccountId: account.stripe_account_id
        }));
      }
    }
    
    // If not authenticated or no data, try localStorage
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
export const saveSellerAccount = async (account: SellerAccount): Promise<void> => {
  try {
    // Check if user is authenticated
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData.session?.user?.id) {
      const sellerId = sessionData.session.user.id;
      
      // Try to save to Supabase
      const { error } = await supabase
        .from('seller_accounts')
        .insert({
          seller_id: sellerId,
          account_name: account.accountName,
          account_number: account.accountNumber,
          bank_name: account.bankName,
          account_type: account.accountType || 'bank',
          paypal_email: account.paypalEmail,
          stripe_account_id: account.stripeAccountId
        });
        
      if (error) {
        console.error('Error saving seller account to database:', error);
        // Fallback to localStorage
        const accounts = await getSellerAccounts();
        const existingIndex = accounts.findIndex(a => a.sellerId === account.sellerId);
        
        if (existingIndex >= 0) {
          accounts[existingIndex] = account;
        } else {
          accounts.push(account);
        }
        
        localStorage.setItem('sellerAccounts', JSON.stringify(accounts));
      }
    } else {
      // Save to localStorage if not authenticated
      const accounts = await getSellerAccounts();
      const existingIndex = accounts.findIndex(a => a.sellerId === account.sellerId);
      
      if (existingIndex >= 0) {
        accounts[existingIndex] = account;
      } else {
        accounts.push(account);
      }
      
      localStorage.setItem('sellerAccounts', JSON.stringify(accounts));
    }
  } catch (error) {
    console.error('Error saving seller account:', error);
    // Ensure we still save to localStorage as a fallback
    const accounts = await getSellerAccounts();
    const existingIndex = accounts.findIndex(a => a.sellerId === account.sellerId);
    
    if (existingIndex >= 0) {
      accounts[existingIndex] = account;
    } else {
      accounts.push(account);
    }
    
    localStorage.setItem('sellerAccounts', JSON.stringify(accounts));
  }
};
