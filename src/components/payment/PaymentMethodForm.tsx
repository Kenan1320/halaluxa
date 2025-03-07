
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, PaypalIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { savePaymentMethod, PaymentMethod } from '@/services/paymentMethodService';

interface PaymentMethodFormProps {
  onSuccess?: (paymentMethod: PaymentMethod) => void;
  onCancel?: () => void;
}

const PaymentMethodForm = ({ onSuccess, onCancel }: PaymentMethodFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentType, setPaymentType] = useState<'card' | 'paypal' | 'applepay' | 'googlepay'>('card');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    nameOnCard: '',
    expiryDate: '',
    cvv: '',
    saveCard: true,
    makeDefault: true
  });
  const [paypalData, setPaypalData] = useState({
    email: '',
    makeDefault: true
  });
  const { toast } = useToast();

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardData(prev => ({ ...prev, [name]: value }));
  };

  const handlePaypalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaypalData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let paymentMethodData: Omit<PaymentMethod, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;

      if (paymentType === 'card') {
        // In a real app, you would tokenize the card details with Stripe or another provider
        // Here we're just using the last 4 digits of the card number for demonstration
        const last4 = cardData.cardNumber.slice(-4);
        
        paymentMethodData = {
          paymentType: 'card',
          cardLastFour: last4,
          cardBrand: determineCardBrand(cardData.cardNumber),
          isDefault: cardData.makeDefault,
          billingAddress: {}
        };
      } else if (paymentType === 'paypal') {
        paymentMethodData = {
          paymentType: 'paypal',
          isDefault: paypalData.makeDefault,
          metadata: {
            email: paypalData.email
          }
        };
      } else {
        paymentMethodData = {
          paymentType,
          isDefault: true,
          metadata: {}
        };
      }

      const result = await savePaymentMethod(paymentMethodData);
      
      if (result) {
        toast({
          title: "Payment method saved",
          description: "Your payment method has been saved successfully",
        });
        if (onSuccess) onSuccess(result);
      } else {
        throw new Error("Failed to save payment method");
      }
    } catch (error) {
      console.error("Error saving payment method:", error);
      toast({
        title: "Error",
        description: "Failed to save payment method. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const determineCardBrand = (cardNumber: string): string => {
    // Basic logic to determine card brand - would be more sophisticated in a real app
    if (cardNumber.startsWith('4')) return 'visa';
    if (cardNumber.startsWith('5')) return 'mastercard';
    if (cardNumber.startsWith('3')) return 'amex';
    if (cardNumber.startsWith('6')) return 'discover';
    return 'unknown';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Label>Select Payment Method</Label>
        <RadioGroup 
          value={paymentType} 
          onValueChange={(value) => setPaymentType(value as any)}
          className="grid grid-cols-2 gap-4"
        >
          <div className={`border rounded-lg p-4 flex flex-col items-center space-y-2 ${paymentType === 'card' ? 'border-haluna-primary bg-haluna-primary-light/10' : ''}`}>
            <RadioGroupItem value="card" id="card" className="sr-only" />
            <CreditCard className="h-8 w-8" />
            <Label htmlFor="card" className="cursor-pointer">Credit Card</Label>
          </div>
          
          <div className={`border rounded-lg p-4 flex flex-col items-center space-y-2 ${paymentType === 'paypal' ? 'border-haluna-primary bg-haluna-primary-light/10' : ''}`}>
            <RadioGroupItem value="paypal" id="paypal" className="sr-only" />
            <div className="h-8 w-8 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 11l3-9h6c1.7 0 3 1.3 3 3 0 3.7-3.3 5-7 5H9.4" />
                <path d="M7 11l-2.9 8.2c-.3.8.3 1.8 1.3 1.8H9l1.1-3h8c3.7 0 6-2 6-5 0-1.7-1.3-3-3-3h-2.3" />
              </svg>
            </div>
            <Label htmlFor="paypal" className="cursor-pointer">PayPal</Label>
          </div>
        </RadioGroup>
      </div>

      {paymentType === 'card' && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input 
              id="cardNumber" 
              name="cardNumber" 
              value={cardData.cardNumber}
              onChange={handleCardInputChange}
              placeholder="1234 5678 9012 3456"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="nameOnCard">Name on Card</Label>
            <Input 
              id="nameOnCard" 
              name="nameOnCard" 
              value={cardData.nameOnCard}
              onChange={handleCardInputChange}
              placeholder="John Doe"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input 
                id="expiryDate" 
                name="expiryDate" 
                value={cardData.expiryDate}
                onChange={handleCardInputChange}
                placeholder="MM/YY"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="cvv">CVV</Label>
              <Input 
                id="cvv" 
                name="cvv" 
                value={cardData.cvv}
                onChange={handleCardInputChange}
                placeholder="123"
                required
                type="password"
                maxLength={4}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="saveCard" 
              checked={cardData.saveCard}
              onCheckedChange={(checked) => 
                setCardData(prev => ({ ...prev, saveCard: checked as boolean }))
              }
            />
            <Label htmlFor="saveCard">Save this card for future purchases</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="makeDefault" 
              checked={cardData.makeDefault}
              onCheckedChange={(checked) => 
                setCardData(prev => ({ ...prev, makeDefault: checked as boolean }))
              }
            />
            <Label htmlFor="makeDefault">Make this my default payment method</Label>
          </div>
        </div>
      )}

      {paymentType === 'paypal' && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="paypalEmail">PayPal Email</Label>
            <Input 
              id="paypalEmail" 
              name="email" 
              value={paypalData.email}
              onChange={handlePaypalInputChange}
              placeholder="email@example.com"
              type="email"
              required
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="makePaypalDefault" 
              checked={paypalData.makeDefault}
              onCheckedChange={(checked) => 
                setPaypalData(prev => ({ ...prev, makeDefault: checked as boolean }))
              }
            />
            <Label htmlFor="makePaypalDefault">Make this my default payment method</Label>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Payment Method"}
        </Button>
      </div>
    </form>
  );
};

export default PaymentMethodForm;
