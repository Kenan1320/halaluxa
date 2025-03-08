
import { supabase } from '@/integrations/supabase/client';

export interface PaymentMethod {
  id: string;
  userId: string;
  paymentType: 'card' | 'paypal' | 'applepay' | 'googlepay';
  cardLastFour: string;
  cardBrand: string;
  billingAddress: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  metadata: any;
}

// Get all payment methods for a user
export const getPaymentMethods = async (userId: string): Promise<PaymentMethod[]> => {
  try {
    // Mock implementation since the actual table doesn't exist
    // In a real app, this would query the database
    return [
      {
        id: '1',
        userId,
        paymentType: 'card',
        cardLastFour: '4242',
        cardBrand: 'Visa',
        billingAddress: '123 Main St, New York, NY 10001',
        isDefault: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: { nameOnCard: 'John Doe' }
      },
      {
        id: '2',
        userId,
        paymentType: 'paypal',
        cardLastFour: '',
        cardBrand: '',
        billingAddress: '456 Oak Ave, San Francisco, CA 94102',
        isDefault: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: { email: 'john.doe@example.com' }
      }
    ];
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return [];
  }
};

// Get a specific payment method
export const getPaymentMethod = async (methodId: string): Promise<PaymentMethod | null> => {
  try {
    // Mock implementation
    const methods = await getPaymentMethods('any-user');
    return methods.find(method => method.id === methodId) || null;
  } catch (error) {
    console.error('Error fetching payment method:', error);
    return null;
  }
};

// Add a new payment method
export const addPaymentMethod = async (paymentData: {
  userId: string;
  cardLastFour: string;
  cardBrand: string;
  billingAddress: string;
  isDefault: boolean;
  metadata: any;
}): Promise<boolean> => {
  try {
    // Mock implementation
    console.log('Adding payment method:', paymentData);
    return true;
  } catch (error) {
    console.error('Error adding payment method:', error);
    return false;
  }
};

// Update an existing payment method
export const updatePaymentMethod = async (
  methodId: string,
  updates: Partial<PaymentMethod>
): Promise<boolean> => {
  try {
    // Mock implementation
    console.log('Updating payment method:', methodId, updates);
    return true;
  } catch (error) {
    console.error('Error updating payment method:', error);
    return false;
  }
};

// Delete a payment method
export const deletePaymentMethod = async (methodId: string, userId: string): Promise<boolean> => {
  try {
    // Mock implementation
    console.log('Deleting payment method:', methodId, 'for user:', userId);
    return true;
  } catch (error) {
    console.error('Error deleting payment method:', error);
    return false;
  }
};

// Set a payment method as default
export const setDefaultPaymentMethod = async (methodId: string, userId: string): Promise<boolean> => {
  try {
    // Mock implementation
    console.log('Setting payment method as default:', methodId, 'for user:', userId);
    return true;
  } catch (error) {
    console.error('Error setting default payment method:', error);
    return false;
  }
};

// Format payment method for display
export const formatPaymentMethod = (method: PaymentMethod): string => {
  switch (method.paymentType) {
    case 'card':
      return `${method.cardBrand} •••• ${method.cardLastFour}`;
    case 'paypal':
      return 'PayPal Account';
    case 'applepay':
      return 'Apple Pay';
    case 'googlepay':
      return 'Google Pay';
    default:
      return 'Payment Method';
  }
};
