
import React from 'react';
import { PaymentMethodType } from '@/models/payment';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethodType;
  onMethodChange: (method: PaymentMethodType) => void;
  availableMethods?: PaymentMethodType[];
  disabled?: boolean;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onMethodChange,
  availableMethods = ['bank', 'paypal', 'stripe', 'applepay'],
  disabled = false
}) => {
  return (
    <RadioGroup
      value={selectedMethod}
      onValueChange={(value) => onMethodChange(value as PaymentMethodType)}
      className="space-y-3"
      disabled={disabled}
    >
      {availableMethods.includes('bank') && (
        <div className="flex items-center space-x-2 rounded-md border p-4 hover:bg-muted/50">
          <RadioGroupItem value="bank" id="bank" />
          <Label htmlFor="bank" className="flex flex-1 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-lg font-medium">Bank Transfer</div>
            </div>
          </Label>
        </div>
      )}
      
      {availableMethods.includes('paypal') && (
        <div className="flex items-center space-x-2 rounded-md border p-4 hover:bg-muted/50">
          <RadioGroupItem value="paypal" id="paypal" />
          <Label htmlFor="paypal" className="flex flex-1 items-center justify-between">
            <div className="flex items-center gap-2">
              <img 
                src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" 
                alt="PayPal" 
                className="h-8" 
              />
              <div className="text-lg font-medium">PayPal</div>
            </div>
          </Label>
        </div>
      )}
      
      {availableMethods.includes('stripe') && (
        <div className="flex items-center space-x-2 rounded-md border p-4 hover:bg-muted/50">
          <RadioGroupItem value="stripe" id="stripe" />
          <Label htmlFor="stripe" className="flex flex-1 items-center justify-between">
            <div className="flex items-center gap-2">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" 
                alt="Stripe" 
                className="h-8" 
              />
              <div className="text-lg font-medium">Credit/Debit Card</div>
            </div>
          </Label>
        </div>
      )}
      
      {availableMethods.includes('applepay') && (
        <div className="flex items-center space-x-2 rounded-md border p-4 hover:bg-muted/50">
          <RadioGroupItem value="applepay" id="applepay" />
          <Label htmlFor="applepay" className="flex flex-1 items-center justify-between">
            <div className="flex items-center gap-2">
              <img 
                src="https://developer.apple.com/assets/elements/icons/apple-pay/apple-pay.svg" 
                alt="Apple Pay" 
                className="h-8" 
              />
              <div className="text-lg font-medium">Apple Pay</div>
            </div>
          </Label>
        </div>
      )}
    </RadioGroup>
  );
};

export default PaymentMethodSelector;
