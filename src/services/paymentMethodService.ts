
import { supabase } from '@/integrations/supabase/client';
import { PaymentMethod } from '@/models/shop';

// Mock data for payment methods
const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm_1',
    userId: 'user_1',
    paymentType: 'card',
    cardLastFour: '4242',
    cardBrand: 'visa',
    billingAddress: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
      country: 'USA'
    },
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: {}
  },
  {
    id: 'pm_2',
    userId: 'user_1',
    paymentType: 'paypal',
    cardLastFour: '',
    cardBrand: '',
    billingAddress: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
      country: 'USA'
    },
    isDefault: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: {}
  }
];

// Get all payment methods for a user
export const getPaymentMethods = async (userId: string): Promise<PaymentMethod[]> => {
  try {
    // Mock implementation
    return mockPaymentMethods.filter(method => method.userId === userId);
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return [];
  }
};

// Get a specific payment method by ID
export const getPaymentMethod = async (methodId: string): Promise<PaymentMethod | null> => {
  try {
    // Mock implementation
    const method = mockPaymentMethods.find(m => m.id === methodId);
    return method || null;
  } catch (error) {
    console.error('Error fetching payment method:', error);
    return null;
  }
};

// Add a new payment method
export const addPaymentMethod = async (methodData: Omit<PaymentMethod, 'id' | 'createdAt' | 'updatedAt'>): Promise<PaymentMethod | null> => {
  try {
    // Mock implementation
    const newMethod: PaymentMethod = {
      id: `pm_${Date.now()}`,
      ...methodData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockPaymentMethods.push(newMethod);
    
    // If this is set as default, update other methods
    if (newMethod.isDefault) {
      for (const method of mockPaymentMethods) {
        if (method.id !== newMethod.id && method.userId === newMethod.userId) {
          method.isDefault = false;
        }
      }
    }
    
    return newMethod;
  } catch (error) {
    console.error('Error adding payment method:', error);
    return null;
  }
};

// Update an existing payment method
export const updatePaymentMethod = async (methodData: PaymentMethod): Promise<PaymentMethod | null> => {
  try {
    // Mock implementation
    const index = mockPaymentMethods.findIndex(m => m.id === methodData.id);
    
    if (index === -1) {
      throw new Error('Payment method not found');
    }
    
    const updatedMethod = {
      ...mockPaymentMethods[index],
      ...methodData,
      updatedAt: new Date().toISOString()
    };
    
    mockPaymentMethods[index] = updatedMethod;
    
    // If this is set as default, update other methods
    if (updatedMethod.isDefault) {
      for (const method of mockPaymentMethods) {
        if (method.id !== updatedMethod.id && method.userId === updatedMethod.userId) {
          method.isDefault = false;
        }
      }
    }
    
    return updatedMethod;
  } catch (error) {
    console.error('Error updating payment method:', error);
    return null;
  }
};

// Delete a payment method
export const deletePaymentMethod = async (methodId: string, userId: string): Promise<boolean> => {
  try {
    // Mock implementation
    const initialLength = mockPaymentMethods.length;
    
    const filteredMethods = mockPaymentMethods.filter(m => m.id !== methodId);
    
    // Check if a method was actually removed
    if (filteredMethods.length === initialLength) {
      return false;
    }
    
    // Replace the mock data
    while (mockPaymentMethods.length > 0) {
      mockPaymentMethods.pop();
    }
    
    filteredMethods.forEach(m => mockPaymentMethods.push(m));
    
    // If the deleted method was the default, set another one as default
    const wasDefault = initialLength > filteredMethods.length && !filteredMethods.some(m => m.isDefault && m.userId === userId);
    
    if (wasDefault && filteredMethods.some(m => m.userId === userId)) {
      const firstUserMethod = filteredMethods.find(m => m.userId === userId);
      if (firstUserMethod) {
        firstUserMethod.isDefault = true;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting payment method:', error);
    return false;
  }
};

// Set a payment method as the default
export const setDefaultPaymentMethod = async (methodId: string, userId: string): Promise<boolean> => {
  try {
    // Mock implementation
    const methodToUpdate = mockPaymentMethods.find(m => m.id === methodId);
    
    if (!methodToUpdate) {
      throw new Error('Payment method not found');
    }
    
    // Set all methods for this user to non-default
    for (const method of mockPaymentMethods) {
      if (method.userId === userId) {
        method.isDefault = method.id === methodId;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error setting default payment method:', error);
    return false;
  }
};

// Check if a user has any payment methods
export const hasPaymentMethods = async (userId: string): Promise<boolean> => {
  try {
    // Mock implementation
    return mockPaymentMethods.some(m => m.userId === userId);
  } catch (error) {
    console.error('Error checking payment methods:', error);
    return false;
  }
};
