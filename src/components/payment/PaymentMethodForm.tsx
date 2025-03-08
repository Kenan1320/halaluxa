
// Update the PaymentMethodForm component to pass properties correctly
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/context/AuthContext';
import { addPaymentMethod, updatePaymentMethod } from '@/services/paymentMethodService';
import { PaymentMethod } from '@/models/shop';

interface PaymentMethodFormProps {
  existingMethod?: PaymentMethod;
  onSuccess: () => void;
}

export default function PaymentMethodForm({ existingMethod, onSuccess }: PaymentMethodFormProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: existingMethod ? {
      cardNumber: `•••• •••• •••• ${existingMethod.cardLastFour}`,
      cardName: '',
      expiryDate: '',
      cvv: '',
      isDefault: existingMethod.isDefault
    } : {
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: '',
      isDefault: false
    }
  });
  
  const isDefault = watch('isDefault');
  
  const onSubmit = async (data) => {
    if (!user) {
      toast.error('You must be logged in to add a payment method');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const cardDetails = {
        userId: user.id,
        paymentType: 'card',
        cardLastFour: data.cardNumber.slice(-4),
        cardBrand: detectCardBrand(data.cardNumber),
        billingAddress: {
          street: '',
          city: '',
          state: '',
          zip: '',
          country: ''
        },
        isDefault: data.isDefault,
        metadata: {}
      };
      
      if (existingMethod) {
        await updatePaymentMethod({
          ...existingMethod,
          ...cardDetails
        });
        toast.success('Payment method updated successfully');
      } else {
        await addPaymentMethod(cardDetails);
        toast.success('Payment method added successfully');
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving payment method:', error);
      toast.error('Failed to save payment method. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const detectCardBrand = (cardNumber) => {
    const cleanedNumber = cardNumber.replace(/\D/g, '');
    
    if (/^4/.test(cleanedNumber)) return 'visa';
    if (/^5[1-5]/.test(cleanedNumber)) return 'mastercard';
    if (/^3[47]/.test(cleanedNumber)) return 'amex';
    if (/^6(?:011|5)/.test(cleanedNumber)) return 'discover';
    
    return 'generic';
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cardNumber">Card Number</Label>
        <Input
          id="cardNumber"
          placeholder="1234 5678 9012 3456"
          {...register('cardNumber', { required: true })}
          className={errors.cardNumber ? 'border-red-500' : ''}
          disabled={existingMethod !== undefined}
        />
        {errors.cardNumber && (
          <p className="text-red-500 text-xs mt-1">Card number is required</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="cardName">Name on Card</Label>
        <Input
          id="cardName"
          placeholder="John Doe"
          {...register('cardName', { required: true })}
          className={errors.cardName ? 'border-red-500' : ''}
        />
        {errors.cardName && (
          <p className="text-red-500 text-xs mt-1">Name is required</p>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiryDate">Expiry Date</Label>
          <Input
            id="expiryDate"
            placeholder="MM/YY"
            {...register('expiryDate', { required: true })}
            className={errors.expiryDate ? 'border-red-500' : ''}
          />
          {errors.expiryDate && (
            <p className="text-red-500 text-xs mt-1">Expiry date is required</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cvv">CVV</Label>
          <Input
            id="cvv"
            placeholder="123"
            type="password"
            {...register('cvv', { required: true })}
            className={errors.cvv ? 'border-red-500' : ''}
          />
          {errors.cvv && (
            <p className="text-red-500 text-xs mt-1">CVV is required</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isDefault"
          checked={isDefault}
          onCheckedChange={(checked) => setValue('isDefault', checked)}
        />
        <Label htmlFor="isDefault" className="cursor-pointer">
          Set as default payment method
        </Label>
      </div>
      
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Processing...' : existingMethod ? 'Update Card' : 'Add Card'}
      </Button>
    </form>
  );
}
