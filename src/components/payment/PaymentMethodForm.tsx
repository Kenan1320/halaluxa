
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { addPaymentMethod } from '@/services/paymentMethodService';

const PaymentMethodForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  
  const [billingAddress, setBillingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'USA'
  });
  
  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim();
  };
  
  const formatExpiryDate = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .substring(0, 5);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add a payment method",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Extract card data for submission
      const cardLast4 = cardNumber.replace(/\s/g, '').slice(-4);
      
      // Add the payment method
      const success = await addPaymentMethod({
        userId: user.id,
        cardLastFour: cardLast4,
        cardBrand: detectCardType(cardNumber),
        billingAddress: `${billingAddress.street}, ${billingAddress.city}, ${billingAddress.state} ${billingAddress.zip}`,
        isDefault,
        metadata: { nameOnCard }
      });
      
      if (success) {
        toast({
          title: "Success",
          description: "Payment method added successfully"
        });
        
        // Reset form
        setCardNumber('');
        setExpiryDate('');
        setCvv('');
        setNameOnCard('');
        setIsDefault(false);
        setBillingAddress({
          street: '',
          city: '',
          state: '',
          zip: '',
          country: 'USA'
        });
        
        // Trigger success callback
        onSuccess();
      } else {
        toast({
          title: "Error",
          description: "Failed to add payment method",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error adding payment method:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const detectCardType = (cardNumber: string): string => {
    const cleanNumber = cardNumber.replace(/\D/g, '');
    
    if (/^4/.test(cleanNumber)) return 'Visa';
    if (/^5[1-5]/.test(cleanNumber)) return 'Mastercard';
    if (/^3[47]/.test(cleanNumber)) return 'American Express';
    if (/^6(?:011|5)/.test(cleanNumber)) return 'Discover';
    
    return 'Card';
  };
  
  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nameOnCard" className="block text-sm font-medium text-gray-700 mb-1">
            Name on Card
          </label>
          <input
            type="text"
            id="nameOnCard"
            value={nameOnCard}
            onChange={(e) => setNameOnCard(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-haluna-primary focus:border-haluna-primary"
            placeholder="Name as it appears on your card"
          />
        </div>
        
        <div>
          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Card Number
          </label>
          <input
            type="text"
            id="cardNumber"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            required
            maxLength={19}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-haluna-primary focus:border-haluna-primary"
            placeholder="1234 5678 9012 3456"
          />
          <p className="text-xs text-gray-500 mt-1">
            For testing, use any valid-format credit card number
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date
            </label>
            <input
              type="text"
              id="expiryDate"
              value={expiryDate}
              onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
              required
              maxLength={5}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-haluna-primary focus:border-haluna-primary"
              placeholder="MM/YY"
            />
          </div>
          <div>
            <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
              CVV
            </label>
            <input
              type="text"
              id="cvv"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
              required
              maxLength={4}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-haluna-primary focus:border-haluna-primary"
              placeholder="123"
            />
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Billing Address</h3>
          <div className="space-y-3">
            <div>
              <input
                type="text"
                value={billingAddress.street}
                onChange={(e) => setBillingAddress({ ...billingAddress, street: e.target.value })}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-haluna-primary focus:border-haluna-primary"
                placeholder="Street Address"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={billingAddress.city}
                onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-haluna-primary focus:border-haluna-primary"
                placeholder="City"
              />
              <input
                type="text"
                value={billingAddress.state}
                onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-haluna-primary focus:border-haluna-primary"
                placeholder="State"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={billingAddress.zip}
                onChange={(e) => setBillingAddress({ ...billingAddress, zip: e.target.value.replace(/\D/g, '') })}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-haluna-primary focus:border-haluna-primary"
                placeholder="ZIP Code"
              />
              <select
                value={billingAddress.country}
                onChange={(e) => setBillingAddress({ ...billingAddress, country: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-haluna-primary focus:border-haluna-primary"
              >
                <option value="USA">United States</option>
                <option value="CAN">Canada</option>
                <option value="GBR">United Kingdom</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isDefault"
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
            className="h-4 w-4 text-haluna-primary focus:ring-haluna-primary border-gray-300 rounded"
          />
          <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
            Set as default payment method
          </label>
        </div>
        
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-haluna-primary hover:bg-haluna-primary-dark text-white"
          >
            {isLoading ? 'Adding...' : 'Add Payment Method'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default PaymentMethodForm;
