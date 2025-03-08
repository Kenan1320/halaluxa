
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditCard, DollarSign, Banknote } from 'lucide-react';
import { addPaymentMethod, updatePaymentMethod } from '@/services/paymentMethodService';
import { useToast } from '@/hooks/use-toast';
import { PaymentMethod } from '@/models/shop';

const formSchema = z.object({
  paymentType: z.enum(['card', 'paypal', 'applepay', 'googlepay']),
  cardNumber: z.string().optional().refine(val => !val || val.length === 16, {
    message: 'Card number must be 16 digits',
  }),
  cardExpiry: z.string().optional().refine(val => !val || /^(0[1-9]|1[0-2])\/\d{2}$/.test(val), {
    message: 'Expiry date must be in MM/YY format',
  }),
  cardCvc: z.string().optional().refine(val => !val || (val.length >= 3 && val.length <= 4), {
    message: 'CVC must be 3 or 4 digits',
  }),
  cardName: z.string().optional(),
  isDefault: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface PaymentMethodFormProps {
  existingMethod?: PaymentMethod;
  onSuccess?: () => void;
}

const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({ existingMethod, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentType: existingMethod?.paymentType || 'card',
      isDefault: existingMethod?.isDefault || false,
    }
  });
  
  const paymentType = watch('paymentType');
  
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const cardLastFour = data.cardNumber ? data.cardNumber.slice(-4) : undefined;
      const cardBrand = determineCardBrand(data.cardNumber);
      
      if (existingMethod) {
        // Update existing payment method
        const result = await updatePaymentMethod(existingMethod.id, {
          paymentType: data.paymentType,
          cardLastFour,
          cardBrand,
          isDefault: data.isDefault,
          // Additional fields would be handled here
        });
        
        if (result) {
          toast({
            title: 'Payment method updated',
            description: 'Your payment method has been updated successfully.',
          });
          if (onSuccess) onSuccess();
        }
      } else {
        // Add new payment method
        const result = await addPaymentMethod({
          userId: '', // This will be set by the API based on the authenticated user
          paymentType: data.paymentType,
          cardLastFour,
          cardBrand,
          isDefault: data.isDefault,
          // Additional fields would be handled here
        });
        
        if (result) {
          toast({
            title: 'Payment method added',
            description: 'Your new payment method has been added successfully.',
          });
          if (onSuccess) onSuccess();
        }
      }
    } catch (error) {
      console.error('Error saving payment method:', error);
      toast({
        title: 'Error',
        description: 'There was a problem saving your payment method.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Simple function to determine card brand from number
  const determineCardBrand = (cardNumber?: string): string => {
    if (!cardNumber) return '';
    
    // Very basic check - in a real app you'd want a more comprehensive check
    if (cardNumber.startsWith('4')) return 'Visa';
    if (cardNumber.startsWith('5')) return 'Mastercard';
    if (cardNumber.startsWith('3')) return 'Amex';
    if (cardNumber.startsWith('6')) return 'Discover';
    
    return 'Unknown';
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <Label>Payment Method</Label>
        <RadioGroup
          defaultValue={paymentType}
          {...register('paymentType')}
          className="grid grid-cols-2 gap-4"
        >
          <div>
            <RadioGroupItem 
              value="card" 
              id="card" 
              className="peer sr-only" 
              {...register('paymentType')}
            />
            <Label
              htmlFor="card"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <CreditCard className="mb-3 h-6 w-6" />
              <span className="text-sm font-medium">Credit Card</span>
            </Label>
          </div>
          
          <div>
            <RadioGroupItem 
              value="paypal" 
              id="paypal" 
              className="peer sr-only" 
              {...register('paymentType')} 
            />
            <Label
              htmlFor="paypal"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <DollarSign className="mb-3 h-6 w-6" />
              <span className="text-sm font-medium">PayPal</span>
            </Label>
          </div>
          
          <div>
            <RadioGroupItem 
              value="applepay" 
              id="applepay" 
              className="peer sr-only" 
              {...register('paymentType')} 
            />
            <Label
              htmlFor="applepay"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Banknote className="mb-3 h-6 w-6" />
              <span className="text-sm font-medium">Apple Pay</span>
            </Label>
          </div>
          
          <div>
            <RadioGroupItem 
              value="googlepay" 
              id="googlepay" 
              className="peer sr-only" 
              {...register('paymentType')} 
            />
            <Label
              htmlFor="googlepay"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Banknote className="mb-3 h-6 w-6" />
              <span className="text-sm font-medium">Google Pay</span>
            </Label>
          </div>
        </RadioGroup>
        {errors.paymentType && (
          <p className="text-sm text-destructive">{errors.paymentType.message}</p>
        )}
      </div>
      
      {paymentType === 'card' && (
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              {...register('cardNumber')}
            />
            {errors.cardNumber && (
              <p className="text-sm text-destructive">{errors.cardNumber.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="cardExpiry">Expiry Date</Label>
              <Input
                id="cardExpiry"
                placeholder="MM/YY"
                {...register('cardExpiry')}
              />
              {errors.cardExpiry && (
                <p className="text-sm text-destructive">{errors.cardExpiry.message}</p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="cardCvc">CVC</Label>
              <Input
                id="cardCvc"
                placeholder="123"
                {...register('cardCvc')}
              />
              {errors.cardCvc && (
                <p className="text-sm text-destructive">{errors.cardCvc.message}</p>
              )}
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="cardName">Name on Card</Label>
            <Input
              id="cardName"
              placeholder="J. Smith"
              {...register('cardName')}
            />
          </div>
        </div>
      )}
      
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isDefault"
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          {...register('isDefault')}
        />
        <Label htmlFor="isDefault" className="text-sm font-normal">
          Set as default payment method
        </Label>
      </div>
      
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : existingMethod ? 'Update Payment Method' : 'Add Payment Method'}
      </Button>
    </form>
  );
};

export default PaymentMethodForm;
